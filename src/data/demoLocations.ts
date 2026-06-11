import type { Coordinates } from '../types'

type DemoLocation = Coordinates & {
  label: string
}

// 他県表示確認用の代表地点。現在地取得なしでHot Pepper API検索を試すために使う
export const demoLocationsByPrefecture: Record<string, DemoLocation> = {
  北海道: {
    label: '札幌市中心部周辺',
    latitude: 43.0618,
    longitude: 141.3545,
  },
  青森県: {
    label: '青森市中心部周辺',
    latitude: 40.8244,
    longitude: 140.74,
  },
  岩手県: {
    label: '盛岡市中心部周辺',
    latitude: 39.7036,
    longitude: 141.1527,
  },
  宮城県: {
    label: '仙台市中心部周辺',
    latitude: 38.2688,
    longitude: 140.8721,
  },
  秋田県: {
    label: '秋田市中心部周辺',
    latitude: 39.7186,
    longitude: 140.1024,
  },
  山形県: {
    label: '山形市中心部周辺',
    latitude: 38.2404,
    longitude: 140.3633,
  },
  福島県: {
    label: '福島市中心部周辺',
    latitude: 37.7608,
    longitude: 140.4747,
  },
  茨城県: {
    label: '水戸市中心部周辺',
    latitude: 36.3418,
    longitude: 140.4468,
  },
  栃木県: {
    label: '宇都宮市中心部周辺',
    latitude: 36.5658,
    longitude: 139.8836,
  },
  群馬県: {
    label: '前橋市中心部周辺',
    latitude: 36.3912,
    longitude: 139.0609,
  },
  埼玉県: {
    label: 'さいたま市大宮周辺',
    latitude: 35.9067,
    longitude: 139.6233,
  },
  千葉県: {
    label: '千葉市中心部周辺',
    latitude: 35.6074,
    longitude: 140.1065,
  },
  東京都: {
    label: '新宿駅周辺',
    latitude: 35.6896,
    longitude: 139.7006,
  },
  神奈川県: {
    label: '横浜駅周辺',
    latitude: 35.4658,
    longitude: 139.6223,
  },
  新潟県: {
    label: '新潟市中心部周辺',
    latitude: 37.9161,
    longitude: 139.0364,
  },
  富山県: {
    label: '富山市中心部周辺',
    latitude: 36.6953,
    longitude: 137.2113,
  },
  石川県: {
    label: '金沢市中心部周辺',
    latitude: 36.5613,
    longitude: 136.6562,
  },
  福井県: {
    label: '福井市中心部周辺',
    latitude: 36.0641,
    longitude: 136.2195,
  },
  山梨県: {
    label: '甲府市中心部周辺',
    latitude: 35.6622,
    longitude: 138.5683,
  },
  長野県: {
    label: '長野市中心部周辺',
    latitude: 36.6513,
    longitude: 138.181,
  },
  岐阜県: {
    label: '岐阜市中心部周辺',
    latitude: 35.4233,
    longitude: 136.7607,
  },
  静岡県: {
    label: '静岡市中心部周辺',
    latitude: 34.9756,
    longitude: 138.3828,
  },
  愛知県: {
    label: '名古屋駅周辺',
    latitude: 35.1709,
    longitude: 136.8815,
  },
  三重県: {
    label: '津市中心部周辺',
    latitude: 34.7303,
    longitude: 136.5086,
  },
  滋賀県: {
    label: '大津市中心部周辺',
    latitude: 35.0045,
    longitude: 135.8686,
  },
  京都府: {
    label: '京都駅周辺',
    latitude: 34.9858,
    longitude: 135.7588,
  },
  大阪府: {
    label: '大阪市なんば周辺',
    latitude: 34.6687,
    longitude: 135.5011,
  },
  兵庫県: {
    label: '神戸三宮周辺',
    latitude: 34.6941,
    longitude: 135.1955,
  },
  奈良県: {
    label: '奈良市中心部周辺',
    latitude: 34.6851,
    longitude: 135.8048,
  },
  和歌山県: {
    label: '和歌山市中心部周辺',
    latitude: 34.2305,
    longitude: 135.1708,
  },
  鳥取県: {
    label: '鳥取市中心部周辺',
    latitude: 35.5011,
    longitude: 134.2351,
  },
  島根県: {
    label: '松江市中心部周辺',
    latitude: 35.4723,
    longitude: 133.0505,
  },
  岡山県: {
    label: '岡山市中心部周辺',
    latitude: 34.6551,
    longitude: 133.9195,
  },
  広島県: {
    label: '広島市中心部周辺',
    latitude: 34.3853,
    longitude: 132.4553,
  },
  山口県: {
    label: '山口市中心部周辺',
    latitude: 34.1785,
    longitude: 131.4737,
  },
  徳島県: {
    label: '徳島市中心部周辺',
    latitude: 34.0703,
    longitude: 134.5549,
  },
  香川県: {
    label: '高松市中心部周辺',
    latitude: 34.3428,
    longitude: 134.0466,
  },
  愛媛県: {
    label: '松山市中心部周辺',
    latitude: 33.8392,
    longitude: 132.7657,
  },
  高知県: {
    label: '高知市中心部周辺',
    latitude: 33.5597,
    longitude: 133.5311,
  },
  福岡県: {
    label: '福岡市天神周辺',
    latitude: 33.5902,
    longitude: 130.4017,
  },
  佐賀県: {
    label: '佐賀市中心部周辺',
    latitude: 33.2494,
    longitude: 130.2988,
  },
  長崎県: {
    label: '長崎市中心部周辺',
    latitude: 32.7448,
    longitude: 129.8737,
  },
  熊本県: {
    label: '熊本市中心部周辺',
    latitude: 32.8031,
    longitude: 130.7079,
  },
  大分県: {
    label: '大分市中心部周辺',
    latitude: 33.2396,
    longitude: 131.6093,
  },
  宮崎県: {
    label: '宮崎市中心部周辺',
    latitude: 31.9111,
    longitude: 131.4239,
  },
  鹿児島県: {
    label: '鹿児島市中心部周辺',
    latitude: 31.5602,
    longitude: 130.5581,
  },
  沖縄県: {
    label: '那覇市国際通り周辺',
    latitude: 26.2144,
    longitude: 127.6792,
  },
}
