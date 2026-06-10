import type { Coordinates, ResolvedLocation } from '../types'

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

// 都道府県名を取り出す
const getPrefecture = (address?: LocationIqAddress) => {
  if (!address) {
    return null
  }

  // LocationIQの住所項目は地域によって揺れるため、設計メモの優先順で見る
  return address.state ?? address.province ?? address.region ?? null
}

// 市区町村名を取り出す
const getCity = (address?: LocationIqAddress) => {
  if (!address) {
    return undefined
  }

  return address.city ?? address.town ?? address.village
}

export const reverseGeocodeLocation = async (
  coordinates: Coordinates,
): Promise<ResolvedLocation> => {
  const accessToken = import.meta.env.VITE_LOCATIONIQ_ACCESS_TOKEN

  if (!accessToken) {
    throw new Error('LocationIQのAccess Tokenが設定されていません。')
  }

  // APIに渡すクエリ文字列を作る
  const searchParams = new URLSearchParams({
    key: accessToken,
    lat: String(coordinates.latitude),
    lon: String(coordinates.longitude),
    format: 'json',
    'accept-language': 'ja',
  })

  // LocationIQに緯度・経度を送り、住所情報を取得する
  const response = await fetch(`${locationIqEndpoint}?${searchParams}`)

  if (!response.ok) {
    throw new Error('LocationIQへの問い合わせに失敗しました。')
  }

  const data = (await response.json()) as LocationIqReverseResponse
  const prefecture = getPrefecture(data.address)

  // 都道府県が取れないとカテゴリを選べないため、ここで失敗扱いにする
  if (!prefecture) {
    throw new Error('都道府県を判定できませんでした。')
  }

  // アプリ内で使いやすい形に変換して返す
  return {
    ...coordinates,
    prefecture,
    city: getCity(data.address),
    displayName: data.display_name ?? prefecture,
  }
}
