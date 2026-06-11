# ホットペッパーAPI設計
## 目的
現在地周辺の飲食店を、検索半径とご当地料理カテゴリのキーワードをもとに取得する。

## 基本方針
フロントエンドから Hot Pepper API を直接呼ばない。
`server/routes/hotpepper.ts` の API プロキシで `HOTPEPPER_API_KEY` を付与し、Hot Pepper API に問い合わせる。

## APIキー管理
Hot Pepper API の API キーは、サーバー側の `.env` に `HOTPEPPER_API_KEY` として定義する。
ブラウザに公開される `VITE_` 付きの環境変数にはしない。

## 処理フロー
1. Geolocation API で現在地の `latitude` / `longitude` を取得する。
2. LocationIQ で都道府県を判定する。
3. 都道府県に一致するご当地料理カテゴリを表示する。
4. カテゴリの `keywords[0]` を Hot Pepper API の `keyword` に使う。
5. フロントエンドから `/api/hotpepper/search` に検索条件を送る。
6. サーバー側で `HOTPEPPER_API_KEY` を付けて Hot Pepper API に問い合わせる。
7. Hot Pepper API のレスポンスをアプリ内の `Shop` 型に変換して返す。
8. カテゴリカードとカテゴリ詳細に店舗情報を表示する。

## フロントエンドからAPIプロキシへ送る検索条件
`src/services/hotpepper.ts` では、以下の条件を `/api/hotpepper/search` に渡す。

| パラメータ | 内容 |
| --- | --- |
| `lat` | 現在地の緯度 |
| `lng` | 現在地の経度 |
| `range` | 検索半径。`1` から `5` |
| `keyword` | ご当地料理カテゴリの検索キーワード |
| `categoryId` | アプリ内のカテゴリID。API検索後に店舗とカテゴリを紐づけるために使う |
| `start` | 検索開始位置。Hot Pepper API は `1` 始まり |
| `count` | 取得件数 |
| `order` | 並び順。初期値は `4` |

## Hot Pepper APIへ送る主な検索条件
`server/routes/hotpepper.ts` では、フロントエンドから受け取った条件に加えて、サーバー側で以下を付与する。

| パラメータ | 内容 |
| --- | --- |
| `key` | `.env` の `HOTPEPPER_API_KEY` |
| `format` | `json` |

必要に応じて、通常検索用の絞り込み条件も Hot Pepper API に引き継ぐ。

| フロント側 | Hot Pepper API側 |
| --- | --- |
| `privateRoom` | `private_room` |
| `nonSmoking` | `non_smoking` |
| `english` | `english` |
| `card` | `card` |
| `lunch` | `lunch` |

## アプリ内で使う店舗型
Hot Pepper API のレスポンスはそのまま画面で使わず、`src/types.ts` の `Shop` 型に変換する。

```ts
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
```

## Hot PepperレスポンスからShop型への変換
`server/routes/hotpepper.ts` の `mapHotPepperShop` で変換する。
画面側では Hot Pepper API の階層構造を意識せず、常に `Shop` 型を使う。

| `Shop` の項目 | Hot Pepper API の項目 | 補足 |
| --- | --- | --- |
| `id` | `shop.id` | 店舗ID |
| `name` | `shop.name` | 店舗名 |
| `categoryId` | APIプロキシに渡した `categoryId` | Hot Pepper APIには存在しないアプリ内の紐づけ情報 |
| `access` | `shop.access` | 店舗へのアクセス文 |
| `address` | `shop.address` | 地図リンクの検索語にも使う |
| `genre` | `shop.genre.name` | ジャンル名 |
| `budget` | `shop.budget.name` | 予算表示 |
| `catchCopy` | `shop.catch` | 店舗説明として使う |
| `imageUrl` | `shop.photo.pc.l` など | 大きい画像から優先して使う |
| `open` | `shop.open` | 営業時間 |
| `hotPepperUrl` | `shop.urls.pc` | Hot Pepper公式ページへのリンク |

画像は以下の優先順で使う。

1. `shop.photo.pc.l`
2. `shop.photo.pc.m`
3. `shop.photo.mobile.l`
4. `shop.photo.mobile.s`
5. 取得できない場合は空文字

## 表示件数
カテゴリごとに取得件数を変える。

| 表示場所 | `count` | 用途 |
| --- | --- | --- |
| ご当地カテゴリカード | `2` | 迷わないように候補を少なく見せる |
| カテゴリ詳細 | `7` | 比較できる件数を一覧表示する |

## ページング
Hot Pepper API の `start` は `1` 始まり。
カテゴリ詳細で「もっと表示」を押した場合は、取得済み件数に `1` を足した値を次の `start` にする。

例:
- すでに7件取得済みの場合: `start=8`
- すでに14件取得済みの場合: `start=15`

## 失敗時の扱い
- `HOTPEPPER_API_KEY` が未設定の場合: エラーメッセージを表示する。
- 検索結果が0件の場合: 検索半径を広げる案内を表示する。
- 通信に失敗した場合: 店舗情報を取得できなかった旨を表示する。
- API検索が失敗した場合: モックデータにはフォールバックしない。実データに見えてしまうため、エラーまたは0件として扱う。
- 現在地の緯度・経度がない場合: API検索は行わない。
- モックデータ表示は `VITE_USE_MOCK_SHOPS=true` の場合だけ許可する。`VITE_DEMO_PREFECTURE` は表示する都道府県を切り替えるだけで、モック表示の有無は決めない。

## 開発用の代表地点
`VITE_DEMO_PREFECTURE` を使う場合、ブラウザの現在地取得は行わない。
その代わり、`src/data/demoLocations.ts` に定義した都道府県ごとの代表地点を使って Hot Pepper API を検索する。

例:

| 都道府県 | 代表地点 |
| --- | --- |
| 福岡県 | 福岡市天神周辺 |
| 大阪府 | 大阪市なんば周辺 |

代表地点が未定義の都道府県では、Hot Pepper API検索は行わない。
この場合にモック店舗を表示するかどうかは、`VITE_USE_MOCK_SHOPS` で明示的に決める。
