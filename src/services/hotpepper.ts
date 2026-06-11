import type { Coordinates, Shop } from '../types'

// フロントからAPIプロキシへ渡す店舗検索条件
export type HotPepperSearchParams = {
  coordinates: Coordinates
  range: string
  keyword: string
  categoryId: string
  start: number
  count: number
  order?: string
}

// APIプロキシから返ってくる検索結果
export type HotPepperSearchResult = {
  resultsAvailable: number
  resultsReturned: number
  resultsStart: number
  shops: Shop[]
}

// APIプロキシから返るエラーレスポンス
type ApiErrorResponse = {
  error?: string
}

export const searchHotPepperShops = async ({
  coordinates,
  range,
  keyword,
  categoryId,
  start,
  count,
  order = '4',
}: HotPepperSearchParams): Promise<HotPepperSearchResult> => {
  // ブラウザからはHot Pepper APIを直接呼ばず、自前のAPIプロキシに条件だけ渡す
  const searchParams = new URLSearchParams({
    lat: String(coordinates.latitude),
    lng: String(coordinates.longitude),
    range,
    keyword,
    categoryId,
    start: String(start),
    count: String(count),
    order,
  })

  const response = await fetch(`/api/hotpepper/search?${searchParams}`)

  // APIキー未設定や外部API失敗などは、サーバー側のメッセージをそのまま表示する
  if (!response.ok) {
    const errorData = (await response.json().catch(() => ({}))) as ApiErrorResponse

    throw new Error(errorData.error ?? '店舗検索に失敗しました。')
  }

  // 画面で使いやすいShop型に変換済みの結果を受け取る
  return (await response.json()) as HotPepperSearchResult
}
