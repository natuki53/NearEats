import { useCallback, useMemo, useRef, useState } from 'react'
import './App.css'
import { localFoodCategories } from './data/localFoods'
import { mockShops } from './data/mockShops'
import { searchHotPepperShops } from './services/hotpepper'
import { reverseGeocodeLocation } from './services/location'
import type { Coordinates, LocalFoodCategory, RangeOption, Shop } from './types'

// 検索半径の選択肢
const rangeOptions: RangeOption[] = [
  { value: '1', label: '300m' },
  { value: '2', label: '500m' },
  { value: '3', label: '1km' },
  { value: '4', label: '2km' },
  { value: '5', label: '3km' },
]

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
  const [range, setRange] = useState('3')
  const [visibleShopCount, setVisibleShopCount] = useState(detailPageSize)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  )

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

  // カテゴリ詳細の店舗検索状態
  const [shopSearchStatus, setShopSearchStatus] = useState<
    'idle' | 'loading' | 'ready' | 'error'
  >('idle')
  const [shopSearchMessage, setShopSearchMessage] = useState('')

  // カテゴリ切り替えや現在地取得失敗時に、前回の店舗検索結果を消す
  const resetShopSearch = () => {
    setHotPepperShops([])
    setShopResultsAvailable(0)
    setShopSearchStatus('idle')
    setShopSearchMessage('')
  }

  // カテゴリ一覧で使う2件表示用のAPI検索結果を消す
  const resetFeaturedSearch = () => {
    setFeaturedApiShops({})
    setFeaturedSearchStatus('idle')
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
      const searchRange = options?.range ?? range

      if (!searchCoordinates) {
        return
      }

      setShopSearchStatus('loading')
      setShopSearchMessage('店舗情報を取得しています...')

      try {
        const result = await searchHotPepperShops({
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
        setShopSearchStatus('ready')
        setShopSearchMessage(
          // 0件の場合はエラーではなく、検索条件を変える案内として扱う
          result.resultsAvailable === 0
            ? 'このカテゴリの店舗が見つかりませんでした。検索半径を広げてください。'
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
    [currentCoordinates, range],
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

  // 現在地から探すボタンの処理（Geolocation APIが使用できるか確認）
  const handleLocate = () => {
    // 他県の表示確認用。VITE_DEMO_PREFECTURE があれば現在地取得を使わない
    if (demoPrefecture) {
      const normalizedPrefecture = findSupportedPrefecture(demoPrefecture)
      const categories = localFoodCategories.filter(
        (category) => category.prefecture === normalizedPrefecture,
      )

      setCurrentPrefecture(normalizedPrefecture)
      setCurrentCoordinates(null)
      setSelectedCategoryId(null)
      resetShopSearch()
      resetFeaturedSearch()
      setLocationStatus('ready')

      if (categories[0]) {
        handleSelectCategory(categories[0].id)
      }

      setLocationMessage(
        `開発用設定で${normalizedPrefecture}を表示しています。\n実際の現在地取得は行っていません。`,
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
        <form className="search-panel">
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

          <button className="secondary-button" type="button">
            通常検索に切り替える
          </button>

          {/* 現在地の状態 */}
          <p className={`location-message ${locationStatus}`}>
            {locationMessage}
          </p>
        </form>
      </section>

      {/* 現在位置を取得できたときのみカテゴリを表示 */}
      {locationStatus === 'ready' ? (
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
      {selectedCategory ? (
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
