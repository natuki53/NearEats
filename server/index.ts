import { existsSync, readFileSync } from 'node:fs'
import { createServer } from 'node:http'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { resolve } from 'node:path'
import type { ResolvedLocation } from '../src/types'

type JsonPayload = Record<string, unknown>

// LocationIQのaddressに入ってくる可能性がある住所項目
type LocationIqAddress = {
  state?: string
  province?: string
  region?: string
  city?: string
  town?: string
  village?: string
}

// LocationIQのreverse APIから使う項目だけを型にしている
type LocationIqReverseResponse = {
  display_name?: string
  address?: LocationIqAddress
}

const defaultPort = 3001
const locationIqEndpoint = 'https://us1.locationiq.com/v1/reverse'
const prefectureNames = [
  '北海道',
  '青森県',
  '岩手県',
  '宮城県',
  '秋田県',
  '山形県',
  '福島県',
  '茨城県',
  '栃木県',
  '群馬県',
  '埼玉県',
  '千葉県',
  '東京都',
  '神奈川県',
  '新潟県',
  '富山県',
  '石川県',
  '福井県',
  '山梨県',
  '長野県',
  '岐阜県',
  '静岡県',
  '愛知県',
  '三重県',
  '滋賀県',
  '京都府',
  '大阪府',
  '兵庫県',
  '奈良県',
  '和歌山県',
  '鳥取県',
  '島根県',
  '岡山県',
  '広島県',
  '山口県',
  '徳島県',
  '香川県',
  '愛媛県',
  '高知県',
  '福岡県',
  '佐賀県',
  '長崎県',
  '熊本県',
  '大分県',
  '宮崎県',
  '鹿児島県',
  '沖縄県',
]

// Node側でも.envを読めるようにする
const loadEnvFile = () => {
  const envPath = resolve(process.cwd(), '.env')

  if (!existsSync(envPath)) {
    return
  }

  const content = readFileSync(envPath, 'utf8')

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim()

    if (!trimmed || trimmed.startsWith('#')) {
      continue
    }

    const separatorIndex = trimmed.indexOf('=')

    if (separatorIndex === -1) {
      continue
    }

    const key = trimmed.slice(0, separatorIndex).trim()
    let value = trimmed.slice(separatorIndex + 1).trim()

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }

    if (!process.env[key]) {
      process.env[key] = value
    }
  }
}

loadEnvFile()

const port = Number(process.env.PORT ?? process.env.API_PORT ?? defaultPort)

const sendJson = (
  response: ServerResponse,
  statusCode: number,
  payload: JsonPayload,
) => {
  response.writeHead(statusCode, {
    'access-control-allow-origin': 'http://localhost:5173',
    'access-control-allow-methods': 'GET, OPTIONS',
    'access-control-allow-headers': 'Content-Type',
    'content-type': 'application/json; charset=utf-8',
  })
  response.end(JSON.stringify(payload))
}

const sendError = (
  response: ServerResponse,
  statusCode: number,
  message: string,
) => {
  sendJson(response, statusCode, { error: message })
}

// 必須のクエリパラメータを取り出す
const getRequiredParam = (searchParams: URLSearchParams, name: string) => {
  const value = searchParams.get(name)

  if (!value) {
    throw new Error(`${name} は必須です。`)
  }

  return value
}

// 数値として必要なクエリパラメータを取り出す
const getRequiredNumberParam = (searchParams: URLSearchParams, name: string) => {
  const value = Number(getRequiredParam(searchParams, name))

  if (!Number.isFinite(value)) {
    throw new Error(`${name} は数値で指定してください。`)
  }

  return value
}

// 都道府県名を取り出す
const getPrefecture = (address?: LocationIqAddress) => {
  if (!address) {
    return null
  }

  // LocationIQの住所項目は地域によって揺れるため、設計メモの優先順で見る
  const prefecture = address.state ?? address.province ?? address.region ?? null

  if (!prefecture) {
    return null
  }

  // LocationIQが「福岡」のように都道府県 suffix なしで返す場合がある
  return (
    prefectureNames.find(
      (name) => name === prefecture || name.replace(/[都道府県]$/, '') === prefecture,
    ) ?? prefecture
  )
}

// 市区町村名を取り出す
const getCity = (address?: LocationIqAddress) => {
  if (!address) {
    return undefined
  }

  return address.city ?? address.town ?? address.village
}

const requestJson = async <ResponseBody>(url: string): Promise<ResponseBody> => {
  const response = await fetch(url)
  const text = await response.text()

  if (!response.ok) {
    throw new Error(`外部APIへの問い合わせに失敗しました。status=${response.status}`)
  }

  try {
    return JSON.parse(text) as ResponseBody
  } catch {
    throw new Error('外部APIのレスポンスをJSONとして読み取れませんでした。')
  }
}

const handleReverseLocation = async (
  requestUrl: URL,
  response: ServerResponse,
) => {
  // フロントエンドから受け取った緯度・経度を確認する
  const latitude = getRequiredNumberParam(requestUrl.searchParams, 'lat')
  const longitude = Number(
    requestUrl.searchParams.get('lng') ?? requestUrl.searchParams.get('lon'),
  )

  if (!Number.isFinite(longitude)) {
    throw new Error('lng は数値で指定してください。')
  }

  const accessToken =
    process.env.LOCATIONIQ_ACCESS_TOKEN ?? process.env.VITE_LOCATIONIQ_ACCESS_TOKEN

  if (!accessToken) {
    sendError(response, 500, 'LocationIQのAccess Tokenが設定されていません。')
    return
  }

  // APIに渡すクエリ文字列を作る
  const searchParams = new URLSearchParams({
    key: accessToken,
    lat: String(latitude),
    lon: String(longitude),
    format: 'json',
    'accept-language': 'ja',
  })

  // LocationIQに緯度・経度を送り、住所情報を取得する
  const data = await requestJson<LocationIqReverseResponse>(
    `${locationIqEndpoint}?${searchParams}`,
  )
  const prefecture = getPrefecture(data.address)

  // 都道府県が取れないとカテゴリを選べないため、ここで失敗扱いにする
  if (!prefecture) {
    sendError(response, 422, '都道府県を判定できませんでした。')
    return
  }

  // アプリ内で使いやすい形に変換して返す
  const resolvedLocation: ResolvedLocation = {
    latitude,
    longitude,
    prefecture,
    city: getCity(data.address),
    displayName: data.display_name ?? prefecture,
  }

  sendJson(response, 200, { ...resolvedLocation })
}

const handleRequest = async (
  request: IncomingMessage,
  response: ServerResponse,
) => {
  if (!request.url) {
    sendError(response, 400, 'URLが不正です。')
    return
  }

  if (request.method === 'OPTIONS') {
    sendJson(response, 204, {})
    return
  }

  if (request.method !== 'GET') {
    sendError(response, 405, 'GETメソッドのみ対応しています。')
    return
  }

  const requestUrl = new URL(request.url, `http://${request.headers.host}`)

  try {
    if (requestUrl.pathname === '/api/location/reverse') {
      await handleReverseLocation(requestUrl, response)
      return
    }

    sendError(response, 404, 'APIエンドポイントが見つかりません。')
  } catch (error) {
    sendError(
      response,
      error instanceof Error && error.message.includes('必須') ? 400 : 500,
      error instanceof Error ? error.message : 'APIプロキシでエラーが発生しました。',
    )
  }
}

const server = createServer(handleRequest)

server.listen(port, () => {
  console.log(`API proxy is running on http://localhost:${port}`)
})
