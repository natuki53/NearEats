import type { Coordinates, ResolvedLocation } from '../types'

// APIプロキシから返るエラーレスポンス
type ApiErrorResponse = {
  error?: string
}

export const reverseGeocodeLocation = async (
  coordinates: Coordinates,
): Promise<ResolvedLocation> => {
  // APIプロキシに渡すクエリ文字列を作る
  const searchParams = new URLSearchParams({
    lat: String(coordinates.latitude),
    lng: String(coordinates.longitude),
  })

  // APIキーをブラウザへ出さないため、自前のAPIプロキシを経由する
  const response = await fetch(`/api/location/reverse?${searchParams}`)

  if (!response.ok) {
    const errorData = (await response.json().catch(() => ({}))) as ApiErrorResponse

    throw new Error(
      errorData.error ?? '都道府県を判定できませんでした。通常検索を使用してください。',
    )
  }

  // アプリ内で使いやすい形に変換された位置情報を受け取る
  return (await response.json()) as ResolvedLocation
}
