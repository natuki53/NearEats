import type { ServerResponse } from 'node:http'
import type { ResolvedLocation } from '../../src/types'
import { requestJson, sendError, sendJson } from '../http.ts'

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

export const handleReverseLocation = async (
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
