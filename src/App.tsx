import { useMemo, useRef, useState } from 'react'
import './App.css'
import { localFoodCategories } from './data/localFoods'
import { mockShops } from './data/mockShops'
import { reverseGeocodeLocation } from './services/location'
import type { RangeOption } from './types'

// 検索半径の選択肢
const rangeOptions: RangeOption[] = [
  { value: '1', label: '300m' },
  { value: '2', label: '500m' },
  { value: '3', label: '1km' },
  { value: '4', label: '2km' },
  { value: '5', label: '3km' },
]

const detailPageSize = 7

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
  const [currentPrefecture, setCurrentPrefecture] = useState<string | null>(null)

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

  // カテゴリごとのおすすめ店舗をまとめる（現在はモックを使用）
  const featuredShops = useMemo(
    () =>
      displayedCategories.map((category) => ({
        category,
        shops: mockShops
          .filter((shop) => shop.categoryId === category.id)
          .slice(0, 2),
      })),
    [displayedCategories],
  )

  const selectedShops = selectedCategoryId
    ? mockShops.filter((shop) => shop.categoryId === selectedCategoryId)
    : []
  const visibleSelectedShops = selectedShops.slice(0, visibleShopCount)
  const hasMoreSelectedShops = visibleShopCount < selectedShops.length

  const handleSelectCategory = (categoryId: string, shouldScroll = false) => {
    setSelectedCategoryId(categoryId)
    setVisibleShopCount(detailPageSize)

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

  // 現在地から探すボタンの処理（Geolocation APIが使用できるか確認）
  const handleLocate = () => {
    if (!navigator.geolocation) {
      setLocationStatus('error')
      setCurrentPrefecture(null)
      setSelectedCategoryId(null)
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
          const categories = localFoodCategories.filter(
            (category) => category.prefecture === resolvedLocation.prefecture,
          )

          setCurrentPrefecture(resolvedLocation.prefecture)
          setSelectedCategoryId(null)
          setLocationStatus('ready')

          if (categories[0]) {
            handleSelectCategory(categories[0].id)
          }

          setLocationMessage(
            `現在地を取得しました。\n緯度: ${coordinates.latitude.toFixed(4)} / 経度: ${coordinates.longitude.toFixed(4)}\n判定地域: ${resolvedLocation.prefecture}`,
          )
        } catch (error) {
          // 位置は取れても、APIキー未設定や通信失敗で県判定できない場合がある
          setLocationStatus('error')
          setCurrentPrefecture(null)
          setSelectedCategoryId(null)
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
        setSelectedCategoryId(null)
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
            <select value={range} onChange={(event) => setRange(event.target.value)}>
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
              onClick={() =>
                setVisibleShopCount((current) => current + detailPageSize)
              }
            >
              もっと表示
            </button>
          </div>
        ) : null}
      </section>
      ) : null}
    </main>
  )
}

export default App
