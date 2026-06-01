// 検索半径の選択肢
export type RangeOption = {
  value: string
  label: string
}

// ご当地グルメのカテゴリ情報
export type LocalFoodCategory = {
  id: string
  prefecture: string
  name: string
  description: string
  keywords: string[]
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
  hotPepperUrl: string
}
