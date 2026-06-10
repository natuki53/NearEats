import type { LocalFoodCategory } from '../types'

export const localFoodCategories: LocalFoodCategory[] = [
  // 福岡県のご当地グルメカテゴリ
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

  // 大阪府のご当地グルメカテゴリ
  {
    id: 'osaka-okonomiyaki',
    prefecture: '大阪府',
    name: 'お好み焼き',
    description: '鉄板で焼く香ばしさを楽しめる、大阪らしい定番料理です。',
    keywords: ['お好み焼き'],
  },
  {
    id: 'osaka-takoyaki',
    prefecture: '大阪府',
    name: 'たこ焼き',
    description: '食べ歩きでも楽しみやすい、大阪観光と相性のよい料理です。',
    keywords: ['たこ焼き'],
  },
  {
    id: 'osaka-kushikatsu',
    prefecture: '大阪府',
    name: '串カツ',
    description: '気軽な夜ごはんに選びやすい、大阪らしい揚げ物料理です。',
    keywords: ['串カツ', '串揚げ'],
  },
  {
    id: 'osaka-udon',
    prefecture: '大阪府',
    name: 'うどん',
    description: 'だしの味を楽しめる、昼食にも夜食にも選びやすい候補です。',
    keywords: ['うどん', 'かすうどん'],
  },
]
