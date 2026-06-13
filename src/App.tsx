import { useCallback, useMemo, useRef, useState } from 'react'
import './App.css'
import { localFoodCategories } from './data/localFoods'
import { demoLocationsByPrefecture } from './data/demoLocations'
import { mockShops } from './data/mockShops'
import {
  searchHotPepperShops,
  type HotPepperSearchParams,
  type HotPepperSearchResult,
} from './services/hotpepper'
import { reverseGeocodeLocation } from './services/location'
import type {
  Coordinates,
  LocalFoodCategory,
  NormalSearchFilters,
  RangeOption,
  Shop,
} from './types'

// Hot Pepper APIのrange検索で使える半径。現APIでは3kmが上限なので、
// それ以上の距離はこのフォールバック検索では扱わない。
const rangeOptions: RangeOption[] = [
  { value: '1', label: '300m' },
  { value: '2', label: '500m' },
  { value: '3', label: '1km' },
  { value: '4', label: '2km' },
  { value: '5', label: '3km' },
]

const getRangeLabel = (value: string) =>
  rangeOptions.find((option) => option.value === value)?.label ?? value

// 指定された半径より広い検索半径だけを、近い順に返す。
// 例: 1km(value: 3)指定なら、2km(value: 4) -> 3km(value: 5)の順で再検索する。
const getWiderRangeValues = (currentRange: string) => {
  const currentIndex = rangeOptions.findIndex(
    (option) => option.value === currentRange,
  )

  if (currentIndex === -1) {
    return []
  }

  return rangeOptions.slice(currentIndex + 1).map((option) => option.value)
}

const getExpandedRangeMessage = (
  requestedRange: string,
  effectiveRange: string,
) =>
  `${getRangeLabel(requestedRange)}圏内では見つかりませんでしたが、少し範囲を広げると${getRangeLabel(effectiveRange)}圏内に条件に合う候補がありました。`

type SearchWithFallbackResult = {
  result: HotPepperSearchResult
  range: string
  isFallback: boolean
}

const searchWithRangeFallback = async (
  params: HotPepperSearchParams,
): Promise<SearchWithFallbackResult> => {
  const result = await searchHotPepperShops(params)

  // 1ページ目で0件だったときだけ、指定半径より広い範囲を近い順に試す。
  // 2ページ目以降は、採用済みの検索半径の続きを取得するだけにして重複を防ぐ。
  if (result.resultsAvailable > 0 || params.start !== 1) {
    return {
      result,
      range: params.range,
      isFallback: false,
    }
  }

  for (const widerRange of getWiderRangeValues(params.range)) {
    const widerResult = await searchHotPepperShops({
      ...params,
      range: widerRange,
      start: 1,
    })

    if (widerResult.resultsAvailable > 0) {
      return {
        result: widerResult,
        range: widerRange,
        isFallback: true,
      }
    }
  }

  return {
    result,
    range: params.range,
    isFallback: false,
  }
}

// 通常検索で選びやすいよう、よく使うジャンルだけを用意する
const genreOptions = [
  { value: '', label: '指定なし' },
  { value: 'G001', label: '居酒屋' },
  { value: 'G004', label: '和食' },
  { value: 'G005', label: '洋食' },
  { value: 'G006', label: 'イタリアン・フレンチ' },
  { value: 'G007', label: '中華' },
  { value: 'G008', label: '焼肉・ホルモン' },
  { value: 'G013', label: 'ラーメン' },
  { value: 'G014', label: 'カフェ・スイーツ' },
]

// まず使いやすい代表的な予算だけを選択肢にする
const budgetOptions = [
  { value: '', label: '指定なし' },
  { value: 'B001', label: '〜2000円' },
  { value: 'B002', label: '2001〜3000円' },
  { value: 'B003', label: '3001〜4000円' },
]

const normalCheckboxOptions: {
  key: 'privateRoom' | 'nonSmoking' | 'english' | 'card' | 'lunch'
  label: string
}[] = [
  { key: 'privateRoom', label: '個室あり' },
  { key: 'nonSmoking', label: '禁煙席あり' },
  { key: 'english', label: '英語メニューあり' },
  { key: 'card', label: 'カード可' },
  { key: 'lunch', label: 'ランチあり' },
]

const initialNormalFilters: NormalSearchFilters = {
  keyword: '',
  genre: '',
  budget: '',
  privateRoom: false,
  nonSmoking: false,
  english: false,
  card: false,
  lunch: false,
}

const demoPrefecture = import.meta.env.VITE_DEMO_PREFECTURE
const useMockShops = import.meta.env.VITE_USE_MOCK_SHOPS === 'true'
const detailPageSize = 7

const findSupportedPrefecture = (prefecture: string) =>
  localFoodCategories.find(
    (category) =>
      category.prefecture === prefecture ||
      category.prefecture.replace(/[都道府県]$/, '') === prefecture,
  )?.prefecture ?? prefecture

function App() {
  const detailSectionRef = useRef<HTMLElement | null>(null)
  const normalSectionRef = useRef<HTMLElement | null>(null)
  const [searchMode, setSearchMode] = useState<'local' | 'normal'>('local')
  const [range, setRange] = useState('3')
  const [visibleShopCount, setVisibleShopCount] = useState(detailPageSize)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  )
  const [normalFilters, setNormalFilters] =
    useState<NormalSearchFilters>(initialNormalFilters)

  // 現在位置の取得状態
  const [locationStatus, setLocationStatus] = useState<
    'idle' | 'loading' | 'ready' | 'error'
  >('idle')
  const [locationMessage, setLocationMessage] = useState(
    '現在地を取得すると、ご当地カテゴリを表示します。',
  )

  // 現在地から判定した都道府県名
  const [currentPrefecture, setCurrentPrefecture] = useState<string | null>(null)

  // Hot Pepper検索に使う現在地の緯度・経度
  const [currentCoordinates, setCurrentCoordinates] =
    useState<Coordinates | null>(null)

  // Hot Pepper APIで取得したカテゴリ詳細用の店舗一覧
  const [hotPepperShops, setHotPepperShops] = useState<Shop[]>([])

  // Hot Pepper APIで取得したカテゴリカード用の店舗一覧
  const [featuredApiShops, setFeaturedApiShops] = useState<
    Record<string, Shop[]>
  >({})
  const [featuredSearchStatus, setFeaturedSearchStatus] = useState<
    'idle' | 'loading' | 'ready' | 'error'
  >('idle')

  // Hot Pepper API上で条件に一致した全件数
  const [shopResultsAvailable, setShopResultsAvailable] = useState(0)
  // 0件時に広い範囲へフォールバックした場合、続きを同じ半径で取得するために保持する
  const [shopSearchRange, setShopSearchRange] = useState<string | null>(null)

  // カテゴリ詳細の店舗検索状態
  const [shopSearchStatus, setShopSearchStatus] = useState<
    'idle' | 'loading' | 'ready' | 'error'
  >('idle')
  const [shopSearchMessage, setShopSearchMessage] = useState('')

  // 通常検索の結果と通信状態。ご当地カテゴリ検索とは別に持つ
  const [normalShops, setNormalShops] = useState<Shop[]>([])
  const [normalResultsAvailable, setNormalResultsAvailable] = useState(0)
  // 通常検索でも、フォールバック後の「もっと表示」が同じ半径を使えるように保持する
  const [normalSearchRange, setNormalSearchRange] = useState<string | null>(null)
  const [normalSearchStatus, setNormalSearchStatus] = useState<
    'idle' | 'loading' | 'ready' | 'error'
  >('idle')
  const [normalSearchMessage, setNormalSearchMessage] = useState('')

  // カテゴリ切り替えや現在地取得失敗時に、前回の店舗検索結果を消す
  const resetShopSearch = () => {
    setHotPepperShops([])
    setShopResultsAvailable(0)
    setShopSearchRange(null)
    setShopSearchStatus('idle')
    setShopSearchMessage('')
  }

  // カテゴリ一覧で使う2件表示用のAPI検索結果を消す
  const resetFeaturedSearch = () => {
    setFeaturedApiShops({})
    setFeaturedSearchStatus('idle')
  }

  // 通常検索の条件を変えて再検索するとき、前回の結果を残さない
  const resetNormalSearch = () => {
    setNormalShops([])
    setNormalResultsAvailable(0)
    setNormalSearchRange(null)
    setNormalSearchStatus('idle')
    setNormalSearchMessage('')
  }

  const displayedCategories = useMemo(
    () =>
      currentPrefecture
        ? localFoodCategories.filter(
            (category) => category.prefecture === currentPrefecture,
          )
        : [],
    [currentPrefecture],
  )

  // 選択中のカテゴリ検索
  const selectedCategory = localFoodCategories.find(
    (category) => category.id === selectedCategoryId,
  )

  // カテゴリごとのおすすめ店舗をまとめる
  const featuredShops = useMemo(
    () =>
      displayedCategories.map((category) => ({
        category,
        shops: currentCoordinates || !useMockShops
          ? (featuredApiShops[category.id] ?? [])
          : mockShops
              .filter((shop) => shop.categoryId === category.id)
              .slice(0, 2),
      })),
    [currentCoordinates, displayedCategories, featuredApiShops],
  )

  // カテゴリに一致する店舗の表示（モックデータ）
  const selectedMockShops = selectedCategoryId
    ? mockShops.filter((shop) => shop.categoryId === selectedCategoryId)
    : []

  // 緯度・経度がある場合だけHot Pepper APIの検索結果を使う
  const isHotPepperSearchEnabled = Boolean(currentCoordinates && selectedCategory)

  // 現在地があるときはHot Pepper、開発用フラグがあるときだけ従来のモックを表示する
  const selectedShops = isHotPepperSearchEnabled
    ? hotPepperShops
    : useMockShops
      ? selectedMockShops
      : []

  // モック表示では画面側で件数を増やし、API表示では取得済み一覧をそのまま出す
  const visibleSelectedShops = isHotPepperSearchEnabled
    ? selectedShops
    : selectedShops.slice(0, visibleShopCount)

  // API表示では全件数、モック表示では配列長を見て「もっと表示」を出す
  const hasMoreSelectedShops = isHotPepperSearchEnabled
    ? selectedShops.length < shopResultsAvailable
    : visibleShopCount < selectedShops.length

  const hasMoreNormalShops = normalShops.length < normalResultsAvailable

  // 選択中カテゴリのキーワードで、現在地周辺の店舗をHot Pepper APIから取得する
  const loadCategoryShops = useCallback(
    async (
      category: LocalFoodCategory,
      start = 1,
      options?: {
        coordinates?: Coordinates | null
        range?: string
      },
    ) => {
      // 現在地取得直後はstate反映前なので、引数の座標を優先して使う
      const searchCoordinates = options?.coordinates ?? currentCoordinates
      const requestedRange = options?.range ?? range
      const searchRange =
        start === 1 ? requestedRange : (shopSearchRange ?? requestedRange)

      if (!searchCoordinates) {
        return
      }

      setShopSearchStatus('loading')
      setShopSearchMessage('店舗情報を取得しています...')

      try {
        const { result, range: effectiveRange, isFallback } =
          await searchWithRangeFallback({
            coordinates: searchCoordinates,
            range: searchRange,
            // 複数キーワードをAND検索にすると絞り込みすぎるため、まず先頭だけ使う
            keyword: category.keywords[0],
            categoryId: category.id,
            start,
            count: detailPageSize,
          })

        setHotPepperShops((current) =>
          start === 1 ? result.shops : [...current, ...result.shops],
        )
        setShopResultsAvailable(result.resultsAvailable)
        setShopSearchRange(effectiveRange)
        setShopSearchStatus('ready')
        setShopSearchMessage(
          // 0件の場合はエラーではなく、検索条件を変える案内として扱う
          result.resultsAvailable === 0
            ? 'このカテゴリの店舗が見つかりませんでした。検索半径を広げてください。'
            : isFallback || effectiveRange !== requestedRange
              ? getExpandedRangeMessage(requestedRange, effectiveRange)
              : `${result.resultsAvailable}件の候補が見つかりました。`,
        )
      } catch (error) {
        setHotPepperShops([])
        setShopResultsAvailable(0)
        setShopSearchStatus('error')
        setShopSearchMessage(
          error instanceof Error
            ? error.message
            : '店舗情報を取得できませんでした。',
        )
      }
    },
    [currentCoordinates, range, shopSearchRange],
  )

  // ユーザーが入力した条件で、現在地周辺の店舗を検索する
  const loadNormalSearchShops = useCallback(
    async (start = 1) => {
      if (!currentCoordinates) {
        setNormalSearchStatus('error')
        setNormalSearchMessage(
          '通常検索には現在地が必要です。先に現在地を取得してください。',
        )
        return
      }

      const searchRange = start === 1 ? range : (normalSearchRange ?? range)

      setNormalSearchStatus('loading')
      setNormalSearchMessage('通常検索の店舗情報を取得しています...')

      try {
        const { result, range: effectiveRange, isFallback } =
          await searchWithRangeFallback({
            coordinates: currentCoordinates,
            range: searchRange,
            keyword: normalFilters.keyword,
            genre: normalFilters.genre,
            budget: normalFilters.budget,
            privateRoom: normalFilters.privateRoom,
            nonSmoking: normalFilters.nonSmoking,
            english: normalFilters.english,
            card: normalFilters.card,
            lunch: normalFilters.lunch,
            start,
            count: detailPageSize,
          })

        setNormalShops((current) =>
          start === 1 ? result.shops : [...current, ...result.shops],
        )
        setNormalResultsAvailable(result.resultsAvailable)
        setNormalSearchRange(effectiveRange)
        setNormalSearchStatus('ready')
        setNormalSearchMessage(
          result.resultsAvailable === 0
            ? '条件に合う店舗が見つかりませんでした。検索半径を広げるか、条件を減らしてください。'
            : isFallback || effectiveRange !== range
              ? getExpandedRangeMessage(range, effectiveRange)
              : `${result.resultsAvailable}件の候補が見つかりました。`,
        )
      } catch (error) {
        setNormalShops([])
        setNormalResultsAvailable(0)
        setNormalSearchStatus('error')
        setNormalSearchMessage(
          error instanceof Error
            ? error.message
            : '通常検索の店舗情報を取得できませんでした。',
        )
      }
    },
    [currentCoordinates, normalFilters, normalSearchRange, range],
  )

  // ご当地カテゴリカード内に表示する店舗候補を、カテゴリごとに2件ずつ取得する
  const loadFeaturedCategoryShops = useCallback(
    async (
      categories: LocalFoodCategory[],
      options?: {
        coordinates?: Coordinates | null
        range?: string
      },
    ) => {
      const searchCoordinates = options?.coordinates ?? currentCoordinates
      const searchRange = options?.range ?? range

      if (!searchCoordinates || categories.length === 0) {
        resetFeaturedSearch()
        return
      }

      setFeaturedSearchStatus('loading')

      try {
        const results = await Promise.all(
          categories.map(async (category) => {
            const result = await searchHotPepperShops({
              coordinates: searchCoordinates,
              range: searchRange,
              // カテゴリカードも絞り込みすぎないよう、まず先頭キーワードで探す
              keyword: category.keywords[0],
              categoryId: category.id,
              start: 1,
              count: 2,
            })

            return [category.id, result.shops] as const
          }),
        )

        setFeaturedApiShops(Object.fromEntries(results))
        setFeaturedSearchStatus('ready')
      } catch {
        resetFeaturedSearch()
        setFeaturedSearchStatus('error')
      }
    },
    [currentCoordinates, range],
  )

  const handleSelectCategory = (
    categoryId: string,
    shouldScroll = false,
    coordinatesOverride?: Coordinates | null,
  ) => {
    const category = localFoodCategories.find((item) => item.id === categoryId)

    // 現在地取得成功直後はstate反映前なので、渡された座標を優先する
    const searchCoordinates = coordinatesOverride ?? currentCoordinates

    resetShopSearch()
    setSelectedCategoryId(categoryId)
    setVisibleShopCount(detailPageSize)

    if (category && searchCoordinates) {
      void loadCategoryShops(category, 1, { coordinates: searchCoordinates })
    }

    // カテゴリ詳細まで自動スクロール
    if (shouldScroll) {
      window.requestAnimationFrame(() => {
        detailSectionRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      })
    }
  }

  const handleRangeChange = (nextRange: string) => {
    setRange(nextRange)
    resetNormalSearch()

    // 検索半径を変えたら、選択中カテゴリの店舗を取り直す
    if (selectedCategory && currentCoordinates) {
      resetShopSearch()
      void loadCategoryShops(selectedCategory, 1, { range: nextRange })
    }

    if (displayedCategories.length > 0 && currentCoordinates) {
      resetFeaturedSearch()
      void loadFeaturedCategoryShops(displayedCategories, { range: nextRange })
    }
  }

  const handleNormalFilterChange = <Key extends keyof NormalSearchFilters>(
    key: Key,
    value: NormalSearchFilters[Key],
  ) => {
    setNormalFilters((current) => ({
      ...current,
      [key]: value,
    }))
    resetNormalSearch()
  }

  const handleNormalSearch = () => {
    // 検索条件を変えたあとの初回検索なので、必ず1件目から取得する
    void loadNormalSearchShops(1)

    window.requestAnimationFrame(() => {
      normalSectionRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    })
  }

  // 現在地から探すボタンの処理（Geolocation APIが使用できるか確認）
  const handleLocate = () => {
    // 他県の表示確認用。VITE_DEMO_PREFECTURE があれば現在地取得を使わない
    if (demoPrefecture) {
      const normalizedPrefecture = findSupportedPrefecture(demoPrefecture)

      // 現在地取得なしでもAPI検索を試せるよう、都道府県ごとの代表地点を使う
      const demoLocation = demoLocationsByPrefecture[normalizedPrefecture]
      const categories = localFoodCategories.filter(
        (category) => category.prefecture === normalizedPrefecture,
      )

      setCurrentPrefecture(normalizedPrefecture)
      setCurrentCoordinates(demoLocation ?? null)
      setSelectedCategoryId(null)
      resetShopSearch()
      resetFeaturedSearch()
      resetNormalSearch()
      setLocationStatus('ready')

      // 代表地点がある場合は、その座標でカテゴリカード用の店舗候補を取得する
      if (demoLocation) {
        void loadFeaturedCategoryShops(categories, { coordinates: demoLocation })
      }

      if (categories[0]) {
        // 代表地点がある場合は、最初のカテゴリ詳細もHot Pepper APIで取得する
        handleSelectCategory(categories[0].id, false, demoLocation)
      }

      setLocationMessage(
        demoLocation
          ? `開発用設定で${normalizedPrefecture}を表示しています。\n代表地点: ${demoLocation.label}\n実際の現在地取得は行っていません。`
          : `開発用設定で${normalizedPrefecture}を表示しています。\n代表地点が未設定のため、店舗検索は行いません。`,
      )
      return
    }

    if (!navigator.geolocation) {
      setLocationStatus('error')
      setCurrentPrefecture(null)
      setCurrentCoordinates(null)
      setSelectedCategoryId(null)
      resetShopSearch()
      resetFeaturedSearch()
      resetNormalSearch()
      setLocationMessage(
        '現在地取得を利用できません。通常検索を使用してください。',
      )
      return
    }

    setLocationStatus('loading')
    setLocationMessage('現在地を取得しています...')

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coordinates = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }

        try {
          // 緯度・経度を住所情報に変換し、都道府県を取り出す
          const resolvedLocation = await reverseGeocodeLocation(coordinates)
          const normalizedPrefecture = findSupportedPrefecture(
            resolvedLocation.prefecture,
          )
          const categories = localFoodCategories.filter(
            (category) => category.prefecture === normalizedPrefecture,
          )

          setCurrentPrefecture(normalizedPrefecture)
          setCurrentCoordinates(coordinates)
          setSelectedCategoryId(null)
          resetShopSearch()
          resetFeaturedSearch()
          resetNormalSearch()
          setLocationStatus('ready')

          void loadFeaturedCategoryShops(categories, { coordinates })

          if (categories[0]) {
            handleSelectCategory(categories[0].id, false, coordinates)
          }

          setLocationMessage(
            `現在地を取得しました。\n緯度: ${coordinates.latitude.toFixed(4)} / 経度: ${coordinates.longitude.toFixed(4)}\n判定地域: ${normalizedPrefecture}`,
          )
        } catch (error) {
          // 位置は取れても、APIキー未設定や通信失敗で県判定できない場合がある
          setLocationStatus('error')
          setCurrentPrefecture(null)
          setCurrentCoordinates(null)
          setSelectedCategoryId(null)
          resetShopSearch()
          resetFeaturedSearch()
          resetNormalSearch()
          setLocationMessage(
            error instanceof Error
              ? error.message
              : '都道府県を判定できませんでした。通常検索を使用してください。',
          )
        }
      },
      () => {
        setLocationStatus('error')
        setCurrentPrefecture(null)
        setCurrentCoordinates(null)
        setSelectedCategoryId(null)
        resetShopSearch()
        resetFeaturedSearch()
        resetNormalSearch()
        setLocationMessage(
          '現在地を取得できませんでした。通常検索を使用してください。',
        )
      },
      {
        enableHighAccuracy: false, // 高精度GPSを必須にしない
        timeout: 10000,
        maximumAge: 300000,
      },
    )
  }

  return (
    <main className="app-shell">
      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">NearEats</p>
          <h1>旅行先の食事を迷わずに</h1>
          <p className="lead">
            現在地周辺のご当地グルメを、料理カテゴリごとにわかりやすく探せます。
          </p>
        </div>

        {/* 検索半径を指定するプルダウン */}
        <form className="search-panel" onSubmit={(event) => event.preventDefault()}>
          <label className="field">
            <span>検索半径</span>
            <select
              value={range}
              onChange={(event) => handleRangeChange(event.target.value)}
            >
              {rangeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          
          {/* 現在地から探すボタン */}
          <button
            className="primary-button"
            type="button"
            onClick={handleLocate}
            disabled={locationStatus === 'loading'}
          >
            {locationStatus === 'loading' ? '取得中...' : '現在地から探す'}
          </button>

          <button
            className="secondary-button"
            type="button"
            onClick={() =>
              setSearchMode((current) =>
                current === 'normal' ? 'local' : 'normal',
              )
            }
          >
            {searchMode === 'normal'
              ? 'ご当地カテゴリに戻る'
              : '通常検索に切り替える'}
          </button>

          {/* 現在地の状態 */}
          <p className={`location-message ${locationStatus}`}>
            {locationMessage}
          </p>
        </form>
      </section>

      {searchMode === 'normal' ? (
        <section
          className="category-section"
          aria-labelledby="normal-search-heading"
          ref={normalSectionRef}
        >
          <div className="section-heading">
            <p className="eyebrow">通常検索</p>
            <h2 id="normal-search-heading">条件を指定して探す</h2>
          </div>

          {/* 通常検索の条件入力。ご当地カテゴリ一覧と同じ位置に表示する */}
          <div className="normal-search-form">
            <label className="field">
              <span>キーワード</span>
              <input
                type="search"
                value={normalFilters.keyword}
                placeholder="ラーメン、海鮮、店名など"
                onChange={(event) =>
                  handleNormalFilterChange('keyword', event.target.value)
                }
              />
            </label>

            <label className="field">
              <span>ジャンル</span>
              <select
                value={normalFilters.genre}
                onChange={(event) =>
                  handleNormalFilterChange('genre', event.target.value)
                }
              >
                {genreOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>予算</span>
              <select
                value={normalFilters.budget}
                onChange={(event) =>
                  handleNormalFilterChange('budget', event.target.value)
                }
              >
                {budgetOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <div className="checkbox-grid">
              {normalCheckboxOptions.map((option) => (
                <label className="checkbox-field" key={option.key}>
                  <input
                    type="checkbox"
                    checked={normalFilters[option.key]}
                    onChange={(event) =>
                      handleNormalFilterChange(
                        option.key,
                        event.target.checked,
                      )
                    }
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>

            <div className="normal-search-actions">
              <button
                className="primary-button"
                type="button"
                onClick={handleNormalSearch}
                disabled={normalSearchStatus === 'loading'}
              >
                {normalSearchStatus === 'loading' ? '検索中...' : '検索する'}
              </button>
            </div>
          </div>

          {normalSearchStatus !== 'idle' ? (
            <div className="section-heading normal-result-heading">
              <p className="eyebrow">検索結果</p>
              <h2>検索結果</h2>
              {normalSearchMessage ? (
                <p className={`section-note ${normalSearchStatus}`}>
                  {normalSearchMessage}
                </p>
              ) : null}
            </div>
          ) : null}

          <div className="shop-list">
            {normalShops.map((shop) => (
              <article className="shop-card" key={shop.id}>
                <img src={shop.imageUrl} alt={`${shop.name}の料理写真`} />
                <div className="shop-card-body">
                  <div>
                    <p className="shop-meta">
                      {shop.genre} / {shop.budget}
                    </p>
                    <h3>{shop.name}</h3>
                    <p>{shop.catchCopy}</p>
                  </div>

                  <dl className="shop-facts">
                    <div>
                      <dt>アクセス</dt>
                      <dd>{shop.access}</dd>
                    </div>
                    <div>
                      <dt>営業時間</dt>
                      <dd>{shop.open}</dd>
                    </div>
                  </dl>

                  <div className="shop-actions">
                    <a href={shop.hotPepperUrl} target="_blank" rel="noreferrer">
                      ホットペッパーで見る
                    </a>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        shop.address,
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      地図で開く
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {hasMoreNormalShops ? (
            <div className="more-actions">
              <button
                className="secondary-button"
                type="button"
                disabled={normalSearchStatus === 'loading'}
                onClick={() => {
                  // Hot Pepper APIはstartが1始まりなので、取得済み件数+1から次を読む
                  void loadNormalSearchShops(normalShops.length + 1)
                }}
              >
                {normalSearchStatus === 'loading' ? '取得中...' : 'もっと表示'}
              </button>
            </div>
          ) : null}
        </section>
      ) : null}

      {/* 現在位置を取得できたときのみカテゴリを表示 */}
      {searchMode === 'local' && locationStatus === 'ready' ? (
        <section className="category-section" aria-labelledby="local-food-heading">
        <div className="section-heading">
          <p className="eyebrow">{currentPrefecture}の候補</p>
          <h2 id="local-food-heading">ご当地料理カテゴリ</h2>
          {displayedCategories.length === 0 ? (
            <p className="section-note">
              この地域のご当地カテゴリは準備中です。通常検索を使用してください。
            </p>
          ) : null}
          {featuredSearchStatus === 'loading' ? (
            <p className="section-note">カテゴリ別の店舗候補を取得しています...</p>
          ) : null}
        </div>

        {/* カテゴリ一覧 */}
        <div className="category-grid">
          {featuredShops.map(({ category, shops }) => (
            <button
              className="category-card"
              type="button"
              key={category.id}
              aria-current={category.id === selectedCategoryId}
              aria-pressed={category.id === selectedCategoryId}
              onClick={() => handleSelectCategory(category.id, true)}
            >
              <div>
                <p className="category-prefecture">{category.prefecture}</p>
                <h3>{category.name}</h3>
                <p>{category.description}</p>
              </div>

              {/* カテゴリに一致する店舗の表示（2件） */}
              <div className="mini-shop-list">
                {shops.map((shop) => (
                  <div className="mini-shop" key={shop.id}>
                    <img src={shop.imageUrl} alt={`${shop.name}の料理写真`} />
                    <div>
                      <strong>{shop.name}</strong>
                      <span>{shop.access}</span>
                    </div>
                  </div>
                ))}
              </div>
            </button>
          ))}
        </div>
      </section>
      ) : null}

      {/* カテゴリが選択されている場合のみ表示 */}
      {searchMode === 'local' && selectedCategory ? (
        <section
          className="detail-section"
          aria-labelledby="detail-heading"
          ref={detailSectionRef}
        >
        <div className="section-heading">
          <p className="eyebrow">カテゴリ詳細</p>
          <h2 id="detail-heading">{selectedCategory?.name}</h2>
          {shopSearchMessage ? (
            <p className={`section-note ${shopSearchStatus}`}>
              {shopSearchMessage}
            </p>
          ) : null}
        </div>

        {/* カテゴリに一致する店舗の表示（7件） */}
        <div className="shop-list">
          {visibleSelectedShops.map((shop) => (
            <article className="shop-card" key={shop.id}>
              <img src={shop.imageUrl} alt={`${shop.name}の料理写真`} />
              <div className="shop-card-body">
                <div>
                  <p className="shop-meta">
                    {shop.genre} / {shop.budget}
                  </p>
                  <h3>{shop.name}</h3>
                  <p>{shop.catchCopy}</p>
                </div>

                <dl className="shop-facts">
                  <div>
                    <dt>アクセス</dt>
                    <dd>{shop.access}</dd>
                  </div>
                  <div>
                    <dt>営業時間</dt>
                    <dd>{shop.open}</dd>
                  </div>
                </dl>

                <div className="shop-actions">
                  <a href={shop.hotPepperUrl} target="_blank" rel="noreferrer">
                    ホットペッパーで見る
                  </a>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      shop.address,
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    地図で開く
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        {hasMoreSelectedShops ? (
          <div className="more-actions">
            <button
              className="secondary-button"
              type="button"
              disabled={shopSearchStatus === 'loading'}
              onClick={() => {
                if (isHotPepperSearchEnabled && selectedCategory) {
                  // Hot Pepper APIはstartが1始まりなので、取得済み件数+1から次を読む
                  void loadCategoryShops(
                    selectedCategory,
                    selectedShops.length + 1,
                  )
                  return
                }

                setVisibleShopCount((current) => current + detailPageSize)
              }}
            >
              {shopSearchStatus === 'loading' ? '取得中...' : 'もっと表示'}
            </button>
          </div>
        ) : null}
      </section>
      ) : null}
    </main>
  )
}

export default App
