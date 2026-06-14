// 検索半径の選択肢
export type RangeOption = {
  value: string
  label: string
}

// 緯度・経度
export type Coordinates = {
  latitude: number
  longitude: number
}

// 逆ジオコーディング後にアプリ内で使う位置情報
export type ResolvedLocation = Coordinates & {
  prefecture: string
  city?: string
  displayName: string
}

// ご当地グルメのカテゴリ情報
export type LocalFoodCategory = {
  id: string
  prefecture: string
  name: string
  description: string
  keywords: string[]
}

// 通常検索でユーザーが指定する条件
export type NormalSearchFilters = {
  keyword: string
  genre: string
  budget: string
  privateRoom: boolean
  nonSmoking: boolean
  english: boolean
  card: boolean
  lunch: boolean
}

// 店舗情報
export type Shop = {
  id: string
  name: string
  categoryId: string
  access: string
  address: string
  genre: string
  budget: string
  catchCopy: string
  imageUrl: string
  open: string
  // 詳細モーダルで使う追加情報。Hot Pepper APIに値がない店舗もあるため任意項目にする
  close?: string
  privateRoom?: string
  nonSmoking?: string
  card?: string
  parking?: string
  wifi?: string
  hotPepperUrl: string
}
