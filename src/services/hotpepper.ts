import type { Coordinates, Shop } from '../types'

// フロントからAPIプロキシへ渡す店舗検索条件
export type HotPepperSearchParams = {
  coordinates: Coordinates
  range: string
  keyword?: string
  categoryId?: string
  start: number
  count: number
  order?: string
  genre?: string
  budget?: string
  privateRoom?: boolean
  nonSmoking?: boolean
  english?: boolean
  card?: boolean
  lunch?: boolean
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
  genre,
  budget,
  privateRoom,
  nonSmoking,
  english,
  card,
  lunch,
}: HotPepperSearchParams): Promise<HotPepperSearchResult> => {
  // ブラウザからはHot Pepper APIを直接呼ばず、自前のAPIプロキシに条件だけ渡す
  const searchParams = new URLSearchParams({
    lat: String(coordinates.latitude),
    lng: String(coordinates.longitude),
    range,
    start: String(start),
    count: String(count),
    order,
  })

  // 通常検索では未入力の条件もあるため、値があるものだけ送る
  const trimmedKeyword = keyword?.trim()

  if (trimmedKeyword) {
    searchParams.set('keyword', trimmedKeyword)
  }

  if (categoryId) {
    searchParams.set('categoryId', categoryId)
  }

  if (genre) {
    searchParams.set('genre', genre)
  }

  if (budget) {
    searchParams.set('budget', budget)
  }

  // チェックされた条件だけ送ることで、余計な絞り込みを避ける
  if (privateRoom) {
    searchParams.set('privateRoom', '1')
  }

  if (nonSmoking) {
    searchParams.set('nonSmoking', '1')
  }

  if (english) {
    searchParams.set('english', '1')
  }

  if (card) {
    searchParams.set('card', '1')
  }

  if (lunch) {
    searchParams.set('lunch', '1')
  }

  const response = await fetch(`/api/hotpepper/search?${searchParams}`)

  // APIキー未設定や外部API失敗などは、サーバー側のメッセージをそのまま表示する
  if (!response.ok) {
    const errorData = (await response.json().catch(() => ({}))) as ApiErrorResponse

    throw new Error(errorData.error ?? '店舗検索に失敗しました。')
  }

  // 画面で使いやすいShop型に変換済みの結果を受け取る
  return (await response.json()) as HotPepperSearchResult
}

export const fetchHotPepperShopDetail = async (id: string): Promise<Shop> => {
  // 詳細モーダルでは、一覧より多い項目を表示するため店舗IDで1件だけ取り直す
  const searchParams = new URLSearchParams({
    id,
    start: '1',
    count: '1',
  })

  const response = await fetch(`/api/hotpepper/search?${searchParams}`)

  if (!response.ok) {
    const errorData = (await response.json().catch(() => ({}))) as ApiErrorResponse

    throw new Error(errorData.error ?? '店舗詳細を取得できませんでした。')
  }

  const result = (await response.json()) as HotPepperSearchResult
  const shop = result.shops[0]

  if (!shop) {
    throw new Error('店舗詳細が見つかりませんでした。')
  }

  return shop
}
