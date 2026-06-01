import type { LocalFoodCategory } from '../types'

export const localFoodCategories: LocalFoodCategory[] = [
  {
    id: 'hakata-ramen',
    prefecture: '福岡県',
    name: '博多ラーメン',
    description: '細麺と豚骨スープで、福岡らしさをすぐ味わえる定番です。',
    keywords: ['博多ラーメン', '豚骨ラーメン'],
  },
  {
    id: 'motsunabe',
    prefecture: '福岡県',
    name: 'もつ鍋',
    description: '夜ごはんでゆっくり楽しみたい、福岡を代表する鍋料理です。',
    keywords: ['もつ鍋'],
  },
  {
    id: 'seafood',
    prefecture: '福岡県',
    name: '海鮮',
    description: '市場や港町の雰囲気も楽しめる、旅行向きのカテゴリです。',
    keywords: ['海鮮', '刺身'],
  },
  {
    id: 'unagi',
    prefecture: '福岡県',
    name: 'うなぎ',
    description: '少し特別な食事に選びやすい、満足感のあるご当地候補です。',
    keywords: ['うなぎ', 'せいろ蒸し'],
  },
]
