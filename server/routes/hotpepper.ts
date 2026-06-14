import type { ServerResponse } from 'node:http'
import type { Shop } from '../../src/types'
import { requestJson, sendJson } from '../http.ts'

// Hot Pepper APIの店舗レスポンスから画面で使う項目だけを型にしている
type HotPepperShop = {
  id?: string
  name?: string
  access?: string
  address?: string
  genre?: {
    name?: string
  }
  budget?: {
    name?: string
  }
  catch?: string
  photo?: {
    pc?: {
      l?: string
      m?: string
    }
    mobile?: {
      l?: string
      s?: string
    }
  }
  open?: string
  close?: string
  private_room?: string
  non_smoking?: string
  card?: string
  parking?: string
  wifi?: string
  urls?: {
    pc?: string
  }
}

// Hot Pepper APIの検索レスポンスから使う項目だけを型にしている
type HotPepperResponse = {
  results?: {
    results_available?: string | number
    results_returned?: string | number
    results_start?: string | number
    shop?: HotPepperShop[]
  }
}

const hotPepperEndpoint = 'https://webservice.recruit.co.jp/hotpepper/gourmet/v1/'

// フロントから渡された検索条件がある場合だけ、Hot Pepper APIへ引き継ぐ
const appendIfPresent = (
  targetParams: URLSearchParams,
  sourceParams: URLSearchParams,
  sourceName: string,
  targetName = sourceName,
) => {
  const value = sourceParams.get(sourceName)

  if (value) {
    targetParams.set(targetName, value)
  }
}

// チェックボックス系の検索条件をHot Pepper APIの 1 指定へ変換する
const mapBooleanFilter = (
  targetParams: URLSearchParams,
  sourceParams: URLSearchParams,
  sourceName: string,
  targetName: string,
) => {
  const value = sourceParams.get(sourceName)

  if (value === '1' || value === 'true') {
    targetParams.set(targetName, '1')
  }
}

// Hot Pepper APIの店舗情報を、アプリ内のShop型へ変換する
const mapHotPepperShop = (shop: HotPepperShop, categoryId: string): Shop => ({
  id: shop.id ?? '',
  name: shop.name ?? '',
  categoryId,
  access: shop.access ?? '',
  address: shop.address ?? '',
  genre: shop.genre?.name ?? '',
  budget: shop.budget?.name ?? '',
  catchCopy: shop.catch ?? '',
  imageUrl:
    shop.photo?.pc?.l ??
    shop.photo?.pc?.m ??
    shop.photo?.mobile?.l ??
    shop.photo?.mobile?.s ??
    '',
  open: shop.open ?? '',
  close: shop.close ?? '',
  privateRoom: shop.private_room ?? '',
  nonSmoking: shop.non_smoking ?? '',
  card: shop.card ?? '',
  parking: shop.parking ?? '',
  wifi: shop.wifi ?? '',
  hotPepperUrl: shop.urls?.pc ?? '',
})

export const handleHotPepperSearch = async (
  requestUrl: URL,
  response: ServerResponse,
) => {
  // APIキーはブラウザに出さず、サーバー側の.envから読む
  const apiKey = process.env.HOTPEPPER_API_KEY

  if (!apiKey) {
    throw new Error('Hot Pepper APIキーが設定されていません。')
  }

  const searchParams = new URLSearchParams({
    key: apiKey,
    format: 'json',
  })

  // 位置、検索語、ページングなど基本の検索条件を引き継ぐ
  for (const name of [
    'lat',
    'lng',
    'range',
    'keyword',
    'order',
    'start',
    'count',
    'id',
    'genre',
    'budget',
  ]) {
    appendIfPresent(searchParams, requestUrl.searchParams, name)
  }

  // 通常検索で使う条件。未指定ならHot Pepper APIへ送らない
  mapBooleanFilter(searchParams, requestUrl.searchParams, 'privateRoom', 'private_room')
  mapBooleanFilter(searchParams, requestUrl.searchParams, 'nonSmoking', 'non_smoking')
  mapBooleanFilter(searchParams, requestUrl.searchParams, 'english', 'english')
  mapBooleanFilter(searchParams, requestUrl.searchParams, 'card', 'card')
  mapBooleanFilter(searchParams, requestUrl.searchParams, 'lunch', 'lunch')

  // Hot Pepper APIに問い合わせ、画面で使いやすい形にして返す
  const data = await requestJson<HotPepperResponse>(
    `${hotPepperEndpoint}?${searchParams}`,
  )
  const results = data.results ?? {}
  const shops = Array.isArray(results.shop) ? results.shop : []
  const categoryId = requestUrl.searchParams.get('categoryId') ?? ''

  sendJson(response, 200, {
    resultsAvailable: Number(results.results_available ?? 0),
    resultsReturned: Number(results.results_returned ?? 0),
    resultsStart: Number(results.results_start ?? 1),
    shops: shops.map((shop) => mapHotPepperShop(shop, categoryId)),
  })
}
