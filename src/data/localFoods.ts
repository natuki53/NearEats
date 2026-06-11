import type { LocalFoodCategory } from '../types'

type PrefectureFoodDefinition = {
  prefecture: string
  foods: Omit<LocalFoodCategory, 'prefecture'>[]
}

const prefectureFoodDefinitions: PrefectureFoodDefinition[] = [
  {
    prefecture: '北海道',
    foods: [
      {
        id: 'hokkaido-jingisukan',
        name: 'ジンギスカン',
        description: '羊肉を焼いて楽しむ、北海道らしい定番の肉料理です。',
        keywords: ['ジンギスカン', '成吉思汗'],
      },
      {
        id: 'hokkaido-seafood',
        name: '海鮮',
        description: '港町や市場の雰囲気も味わいやすい、旅行向きの候補です。',
        keywords: ['海鮮', '刺身'],
      },
      {
        id: 'hokkaido-soup-curry',
        name: 'スープカレー',
        description: '野菜や肉をしっかり楽しめる、札幌発祥の人気料理です。',
        keywords: ['スープカレー'],
      },
      {
        id: 'hokkaido-ramen',
        name: 'ラーメン',
        description: '札幌味噌や函館塩など、地域ごとの味を比べやすい一品です。',
        keywords: ['ラーメン', '味噌ラーメン'],
      },
    ],
  },
  {
    prefecture: '青森県',
    foods: [
      {
        id: 'aomori-senbei-jiru',
        name: 'せんべい汁',
        description: '南部せんべいを煮込む、青森らしい郷土鍋です。',
        keywords: ['せんべい汁'],
      },
      {
        id: 'aomori-barayaki',
        name: 'バラ焼き',
        description: '牛バラ肉と玉ねぎを甘辛く焼く、満足感のある名物です。',
        keywords: ['バラ焼き', '十和田バラ焼き'],
      },
      {
        id: 'aomori-niboshi-ramen',
        name: '煮干しラーメン',
        description: '煮干しだしの香りを楽しめる、青森で探しやすい麺料理です。',
        keywords: ['煮干しラーメン', '津軽ラーメン'],
      },
      {
        id: 'aomori-seafood',
        name: '海鮮',
        description: 'まぐろやほたてなど、北国の魚介を味わえる候補です。',
        keywords: ['海鮮', 'まぐろ'],
      },
    ],
  },
  {
    prefecture: '岩手県',
    foods: [
      {
        id: 'iwate-morioka-reimen',
        name: '盛岡冷麺',
        description: '弾力のある麺とすっきりしたスープが特徴の名物です。',
        keywords: ['盛岡冷麺', '冷麺'],
      },
      {
        id: 'iwate-wanko-soba',
        name: 'わんこそば',
        description: '盛岡観光の体験にもなりやすい、岩手を代表するそばです。',
        keywords: ['わんこそば'],
      },
      {
        id: 'iwate-jajamen',
        name: 'じゃじゃ麺',
        description: '肉味噌を混ぜて食べる、盛岡三大麺のひとつです。',
        keywords: ['じゃじゃ麺'],
      },
      {
        id: 'iwate-maesawa-beef',
        name: '前沢牛',
        description: '少し特別な食事に選びやすい、岩手のブランド牛です。',
        keywords: ['前沢牛', '岩手牛'],
      },
    ],
  },
  {
    prefecture: '宮城県',
    foods: [
      {
        id: 'miyagi-gyutan',
        name: '牛タン',
        description: '仙台名物として定番の、食事にも飲み会にも合う料理です。',
        keywords: ['牛タン', '仙台牛タン'],
      },
      {
        id: 'miyagi-seri-nabe',
        name: 'せり鍋',
        description: '香りのよいせりを味わう、宮城らしい鍋料理です。',
        keywords: ['せり鍋'],
      },
      {
        id: 'miyagi-harako-meshi',
        name: 'はらこ飯',
        description: '鮭といくらを楽しめる、季節感のある郷土料理です。',
        keywords: ['はらこ飯'],
      },
      {
        id: 'miyagi-oyster',
        name: '牡蠣',
        description: '三陸の海の幸を楽しめる、旅行先で選びやすい候補です。',
        keywords: ['牡蠣', 'かき'],
      },
    ],
  },
  {
    prefecture: '秋田県',
    foods: [
      {
        id: 'akita-kiritanpo',
        name: 'きりたんぽ鍋',
        description: '米どころ秋田らしさを感じやすい、あたたかい鍋料理です。',
        keywords: ['きりたんぽ鍋', 'きりたんぽ'],
      },
      {
        id: 'akita-inaniwa-udon',
        name: '稲庭うどん',
        description: 'なめらかな細麺を楽しめる、昼食にも向いた名物です。',
        keywords: ['稲庭うどん'],
      },
      {
        id: 'akita-hinai-jidori',
        name: '比内地鶏',
        description: '焼き鳥や親子丼でも味わいやすい、秋田の地鶏です。',
        keywords: ['比内地鶏'],
      },
      {
        id: 'akita-yokote-yakisoba',
        name: '横手やきそば',
        description: '目玉焼きと甘めのソースが特徴の、気軽なご当地麺です。',
        keywords: ['横手やきそば', '横手焼きそば'],
      },
    ],
  },
  {
    prefecture: '山形県',
    foods: [
      {
        id: 'yamagata-imoni',
        name: '芋煮',
        description: '里芋と肉を煮込む、山形の季節感がある郷土料理です。',
        keywords: ['芋煮'],
      },
      {
        id: 'yamagata-soba',
        name: '山形そば',
        description: '板そばなど、香りのよいそばを楽しめる定番です。',
        keywords: ['山形そば', '板そば'],
      },
      {
        id: 'yamagata-yonezawa-beef',
        name: '米沢牛',
        description: '旅先でのご褒美ごはんに選びやすいブランド牛です。',
        keywords: ['米沢牛'],
      },
      {
        id: 'yamagata-nikusoba',
        name: '冷たい肉そば',
        description: '鶏だしの風味を楽しめる、山形で人気の麺料理です。',
        keywords: ['冷たい肉そば', '肉そば'],
      },
    ],
  },
  {
    prefecture: '福島県',
    foods: [
      {
        id: 'fukushima-kitakata-ramen',
        name: '喜多方ラーメン',
        description: '太めの縮れ麺が特徴の、福島を代表するラーメンです。',
        keywords: ['喜多方ラーメン'],
      },
      {
        id: 'fukushima-enban-gyoza',
        name: '円盤餃子',
        description: '丸く並べて焼く、福島市周辺で親しまれる餃子です。',
        keywords: ['円盤餃子'],
      },
      {
        id: 'fukushima-sauce-katsudon',
        name: 'ソースカツ丼',
        description: '会津などで親しまれる、甘辛ソースのカツ丼です。',
        keywords: ['ソースカツ丼'],
      },
      {
        id: 'fukushima-basashi',
        name: '馬刺し',
        description: '会津の食文化を感じやすい、酒場でも探しやすい候補です。',
        keywords: ['馬刺し', '会津馬刺し'],
      },
    ],
  },
  {
    prefecture: '茨城県',
    foods: [
      {
        id: 'ibaraki-ankou-nabe',
        name: 'あんこう鍋',
        description: '冬の味覚として知られる、茨城らしい海の鍋料理です。',
        keywords: ['あんこう鍋', 'あんこう'],
      },
      {
        id: 'ibaraki-hitachi-beef',
        name: '常陸牛',
        description: 'しっかり食事を楽しみたい時に選びやすいブランド牛です。',
        keywords: ['常陸牛'],
      },
      {
        id: 'ibaraki-stamina-ramen',
        name: 'スタミナラーメン',
        description: '甘辛いあんをかける、水戸周辺で親しまれる麺料理です。',
        keywords: ['スタミナラーメン'],
      },
      {
        id: 'ibaraki-kenchin-soba',
        name: 'けんちんそば',
        description: '野菜たっぷりの汁で食べる、素朴な郷土そばです。',
        keywords: ['けんちんそば'],
      },
    ],
  },
  {
    prefecture: '栃木県',
    foods: [
      {
        id: 'tochigi-utsunomiya-gyoza',
        name: '宇都宮餃子',
        description: '食べ比べもしやすい、栃木を代表する定番料理です。',
        keywords: ['宇都宮餃子', '餃子'],
      },
      {
        id: 'tochigi-sano-ramen',
        name: '佐野ラーメン',
        description: '青竹打ちの麺が特徴の、栃木で探しやすいラーメンです。',
        keywords: ['佐野ラーメン'],
      },
      {
        id: 'tochigi-tochigi-wagyu',
        name: 'とちぎ和牛',
        description: '焼肉やステーキで楽しみやすい、栃木のブランド牛です。',
        keywords: ['とちぎ和牛', '栃木和牛'],
      },
      {
        id: 'tochigi-yuba',
        name: '湯波料理',
        description: '日光周辺でも親しまれる、落ち着いた食事向きの料理です。',
        keywords: ['湯波', 'ゆば'],
      },
    ],
  },
  {
    prefecture: '群馬県',
    foods: [
      {
        id: 'gunma-mizusawa-udon',
        name: '水沢うどん',
        description: 'つるっとした麺を楽しめる、群馬の代表的なうどんです。',
        keywords: ['水沢うどん'],
      },
      {
        id: 'gunma-yaki-manju',
        name: '焼きまんじゅう',
        description: '甘い味噌だれを塗って焼く、群馬らしい軽食です。',
        keywords: ['焼きまんじゅう'],
      },
      {
        id: 'gunma-himokawa-udon',
        name: 'ひもかわうどん',
        description: '幅広の麺が印象的な、見た目でも楽しめる名物です。',
        keywords: ['ひもかわうどん', 'ひもかわ'],
      },
      {
        id: 'gunma-joshu-beef',
        name: '上州牛',
        description: '焼肉やステーキで選びやすい、群馬のブランド牛です。',
        keywords: ['上州牛'],
      },
    ],
  },
  {
    prefecture: '埼玉県',
    foods: [
      {
        id: 'saitama-musashino-udon',
        name: '武蔵野うどん',
        description: 'コシのある麺をつけ汁で楽しむ、埼玉で探しやすいうどんです。',
        keywords: ['武蔵野うどん'],
      },
      {
        id: 'saitama-kawagoe-unagi',
        name: '川越うなぎ',
        description: '少し特別な昼食にも向く、川越で親しまれる名物です。',
        keywords: ['川越うなぎ', 'うなぎ'],
      },
      {
        id: 'saitama-waraji-katsudon',
        name: 'わらじカツ丼',
        description: '大きなカツが印象的な、秩父方面のご当地丼です。',
        keywords: ['わらじカツ丼'],
      },
      {
        id: 'saitama-zerifurai',
        name: 'ゼリーフライ',
        description: 'おからとじゃがいもを使う、行田周辺の素朴な名物です。',
        keywords: ['ゼリーフライ'],
      },
    ],
  },
  {
    prefecture: '千葉県',
    foods: [
      {
        id: 'chiba-namerou',
        name: 'なめろう',
        description: '新鮮な魚をたたいて味噌で和える、房総らしい料理です。',
        keywords: ['なめろう'],
      },
      {
        id: 'chiba-seafood',
        name: '海鮮',
        description: '港町で魚介を楽しみたい時に選びやすいカテゴリです。',
        keywords: ['海鮮', '刺身'],
      },
      {
        id: 'chiba-katsuura-tantanmen',
        name: '勝浦タンタンメン',
        description: 'ラー油の辛さが特徴の、千葉のご当地ラーメンです。',
        keywords: ['勝浦タンタンメン'],
      },
      {
        id: 'chiba-narita-unagi',
        name: '成田うなぎ',
        description: '成田観光と合わせて楽しみやすい、満足感のある名物です。',
        keywords: ['成田うなぎ', 'うなぎ'],
      },
    ],
  },
  {
    prefecture: '東京都',
    foods: [
      {
        id: 'tokyo-edomae-sushi',
        name: '江戸前寿司',
        description: '東京らしい食事として選びやすい、定番の寿司です。',
        keywords: ['江戸前寿司', '寿司'],
      },
      {
        id: 'tokyo-monjayaki',
        name: 'もんじゃ焼き',
        description: '月島などで食べ比べしやすい、鉄板のご当地料理です。',
        keywords: ['もんじゃ焼き', 'もんじゃ'],
      },
      {
        id: 'tokyo-fukagawa-meshi',
        name: '深川めし',
        description: 'あさりを使った、江戸の下町文化を感じるご飯です。',
        keywords: ['深川めし'],
      },
      {
        id: 'tokyo-chanko',
        name: 'ちゃんこ鍋',
        description: '両国周辺でも楽しみやすい、みんなで囲める鍋料理です。',
        keywords: ['ちゃんこ鍋', 'ちゃんこ'],
      },
    ],
  },
  {
    prefecture: '神奈川県',
    foods: [
      {
        id: 'kanagawa-iekei-ramen',
        name: '横浜家系ラーメン',
        description: '濃厚な豚骨醤油が特徴の、横浜発祥のラーメンです。',
        keywords: ['横浜家系ラーメン', '家系ラーメン'],
      },
      {
        id: 'kanagawa-chinatown',
        name: '中華街グルメ',
        description: '横浜観光と相性がよい、食べ歩きにも向いたカテゴリです。',
        keywords: ['中華街', '中華料理'],
      },
      {
        id: 'kanagawa-shirasu-don',
        name: 'しらす丼',
        description: '湘南や江の島周辺で探しやすい、海沿いらしい丼です。',
        keywords: ['しらす丼', 'しらす'],
      },
      {
        id: 'kanagawa-sunmamen',
        name: 'サンマーメン',
        description: '野菜あんをのせる、神奈川で親しまれる麺料理です。',
        keywords: ['サンマーメン'],
      },
    ],
  },
  {
    prefecture: '新潟県',
    foods: [
      {
        id: 'niigata-hegi-soba',
        name: 'へぎそば',
        description: '布海苔をつなぎに使う、新潟らしいそばです。',
        keywords: ['へぎそば'],
      },
      {
        id: 'niigata-tare-katsudon',
        name: 'タレカツ丼',
        description: '甘辛いたれの薄いカツをのせる、新潟の定番丼です。',
        keywords: ['タレカツ丼'],
      },
      {
        id: 'niigata-noppe',
        name: 'のっぺ',
        description: '里芋や野菜を煮る、郷土色を感じやすい料理です。',
        keywords: ['のっぺ'],
      },
      {
        id: 'niigata-seafood',
        name: '海鮮',
        description: '日本海の魚介を楽しみたい時に選びやすい候補です。',
        keywords: ['海鮮', '寿司'],
      },
    ],
  },
  {
    prefecture: '富山県',
    foods: [
      {
        id: 'toyama-black-ramen',
        name: '富山ブラック',
        description: '濃い醤油味が特徴の、富山で有名なラーメンです。',
        keywords: ['富山ブラック', '富山ブラックラーメン'],
      },
      {
        id: 'toyama-shiroebi',
        name: '白えび',
        description: '富山湾の名物を、刺身や天ぷらで楽しめる候補です。',
        keywords: ['白えび', '白エビ'],
      },
      {
        id: 'toyama-masu-zushi',
        name: 'ます寿司',
        description: '土産だけでなく食事でも楽しめる、富山の名物寿司です。',
        keywords: ['ます寿司', '鱒寿司'],
      },
      {
        id: 'toyama-himi-udon',
        name: '氷見うどん',
        description: '細くなめらかな麺を味わえる、富山のうどんです。',
        keywords: ['氷見うどん'],
      },
    ],
  },
  {
    prefecture: '石川県',
    foods: [
      {
        id: 'ishikawa-kanazawa-curry',
        name: '金沢カレー',
        description: '濃厚なルーとカツが定番の、金沢で探しやすい料理です。',
        keywords: ['金沢カレー'],
      },
      {
        id: 'ishikawa-kaga-ryori',
        name: '加賀料理',
        description: '落ち着いた食事で土地らしさを感じやすいカテゴリです。',
        keywords: ['加賀料理'],
      },
      {
        id: 'ishikawa-nodoguro',
        name: 'のどぐろ',
        description: '日本海の高級魚を味わえる、少し特別な候補です。',
        keywords: ['のどぐろ'],
      },
      {
        id: 'ishikawa-hanton-rice',
        name: 'ハントンライス',
        description: '洋食気分で楽しめる、金沢のご当地メニューです。',
        keywords: ['ハントンライス'],
      },
    ],
  },
  {
    prefecture: '福井県',
    foods: [
      {
        id: 'fukui-oroshi-soba',
        name: '越前そば',
        description: '大根おろしでさっぱり味わう、福井の代表的なそばです。',
        keywords: ['越前そば', 'おろしそば'],
      },
      {
        id: 'fukui-sauce-katsudon',
        name: 'ソースカツ丼',
        description: '薄めのカツにソースがしみた、福井で定番の丼です。',
        keywords: ['ソースカツ丼'],
      },
      {
        id: 'fukui-echizen-gani',
        name: '越前がに',
        description: '冬のごちそうとして選びやすい、福井の海の幸です。',
        keywords: ['越前がに', '越前ガニ'],
      },
      {
        id: 'fukui-yaki-saba',
        name: '焼き鯖',
        description: '香ばしい鯖を楽しめる、福井らしい魚料理です。',
        keywords: ['焼き鯖', '焼きサバ'],
      },
    ],
  },
  {
    prefecture: '山梨県',
    foods: [
      {
        id: 'yamanashi-houtou',
        name: 'ほうとう',
        description: '太い麺と野菜を味噌で煮込む、山梨の定番料理です。',
        keywords: ['ほうとう'],
      },
      {
        id: 'yamanashi-yoshida-udon',
        name: '吉田のうどん',
        description: '強いコシの麺を楽しめる、富士吉田の名物です。',
        keywords: ['吉田のうどん'],
      },
      {
        id: 'yamanashi-wine-beef',
        name: '甲州ワインビーフ',
        description: '肉料理で山梨らしさを楽しみたい時の候補です。',
        keywords: ['甲州ワインビーフ'],
      },
      {
        id: 'yamanashi-torimotsuni',
        name: '鳥もつ煮',
        description: '甘辛く照りよく煮る、甲府周辺で知られる料理です。',
        keywords: ['鳥もつ煮'],
      },
    ],
  },
  {
    prefecture: '長野県',
    foods: [
      {
        id: 'nagano-shinshu-soba',
        name: '信州そば',
        description: '香りのよいそばを楽しめる、長野を代表する定番です。',
        keywords: ['信州そば', 'そば'],
      },
      {
        id: 'nagano-sanzokuyaki',
        name: '山賊焼き',
        description: '大きな鶏肉を揚げ焼きにする、食べ応えのある名物です。',
        keywords: ['山賊焼き'],
      },
      {
        id: 'nagano-oyaki',
        name: 'おやき',
        description: '野菜や味噌を包んだ、軽食にも向く郷土料理です。',
        keywords: ['おやき'],
      },
      {
        id: 'nagano-basashi',
        name: '馬刺し',
        description: '信州の酒場でも探しやすい、地域色のある肉料理です。',
        keywords: ['馬刺し'],
      },
    ],
  },
  {
    prefecture: '岐阜県',
    foods: [
      {
        id: 'gifu-hida-beef',
        name: '飛騨牛',
        description: '焼肉やステーキで楽しめる、岐阜のブランド牛です。',
        keywords: ['飛騨牛'],
      },
      {
        id: 'gifu-takayama-ramen',
        name: '高山ラーメン',
        description: '醤油味の細縮れ麺が特徴の、飛騨高山の名物です。',
        keywords: ['高山ラーメン'],
      },
      {
        id: 'gifu-keichan',
        name: '鶏ちゃん',
        description: '味付けした鶏肉と野菜を焼く、岐阜の郷土料理です。',
        keywords: ['鶏ちゃん', 'けいちゃん'],
      },
      {
        id: 'gifu-hoba-miso',
        name: '朴葉味噌',
        description: '朴葉の上で味噌を焼く、飛騨らしさのある一品です。',
        keywords: ['朴葉味噌'],
      },
    ],
  },
  {
    prefecture: '静岡県',
    foods: [
      {
        id: 'shizuoka-oden',
        name: '静岡おでん',
        description: '黒いだしと粉をかける食べ方が特徴の名物です。',
        keywords: ['静岡おでん'],
      },
      {
        id: 'shizuoka-hamamatsu-gyoza',
        name: '浜松餃子',
        description: '円形に焼く餃子を楽しめる、静岡西部の定番です。',
        keywords: ['浜松餃子'],
      },
      {
        id: 'shizuoka-unagi',
        name: 'うなぎ',
        description: '浜名湖周辺でも探しやすい、満足感のあるご当地候補です。',
        keywords: ['うなぎ', '浜名湖うなぎ'],
      },
      {
        id: 'shizuoka-sakuraebi',
        name: '桜えび',
        description: '駿河湾の名物を、かき揚げや海鮮料理で味わえます。',
        keywords: ['桜えび', '桜エビ'],
      },
    ],
  },
  {
    prefecture: '愛知県',
    foods: [
      {
        id: 'aichi-hitsumabushi',
        name: 'ひつまぶし',
        description: '薬味やだしで味を変えながら楽しめる名古屋名物です。',
        keywords: ['ひつまぶし'],
      },
      {
        id: 'aichi-miso-katsu',
        name: '味噌カツ',
        description: '濃厚な味噌だれで食べる、名古屋めしの定番です。',
        keywords: ['味噌カツ', 'みそかつ'],
      },
      {
        id: 'aichi-misonikomi-udon',
        name: '味噌煮込みうどん',
        description: '赤味噌のコクを楽しめる、あたたかい麺料理です。',
        keywords: ['味噌煮込みうどん'],
      },
      {
        id: 'aichi-tebasaki',
        name: '手羽先',
        description: '甘辛い味付けで、夜ごはんや居酒屋にも合う名物です。',
        keywords: ['手羽先'],
      },
    ],
  },
  {
    prefecture: '三重県',
    foods: [
      {
        id: 'mie-matsusaka-beef',
        name: '松阪牛',
        description: '特別な食事に選びやすい、三重を代表するブランド牛です。',
        keywords: ['松阪牛'],
      },
      {
        id: 'mie-ise-udon',
        name: '伊勢うどん',
        description: 'やわらかい太麺と濃いたれを楽しむ、伊勢の名物です。',
        keywords: ['伊勢うどん'],
      },
      {
        id: 'mie-tekone-zushi',
        name: 'てこね寿司',
        description: '漬け魚を酢飯に合わせる、伊勢志摩らしい郷土寿司です。',
        keywords: ['てこね寿司'],
      },
      {
        id: 'mie-oyster',
        name: '牡蠣',
        description: '鳥羽や志摩の海の幸を楽しめる、旅行向きの候補です。',
        keywords: ['牡蠣', '浦村牡蠣'],
      },
    ],
  },
  {
    prefecture: '滋賀県',
    foods: [
      {
        id: 'shiga-omi-beef',
        name: '近江牛',
        description: '焼肉やすき焼きで楽しめる、滋賀のブランド牛です。',
        keywords: ['近江牛'],
      },
      {
        id: 'shiga-funa-zushi',
        name: '鮒寿司',
        description: '琵琶湖の食文化を感じられる、個性の強い郷土料理です。',
        keywords: ['鮒寿司', 'ふなずし'],
      },
      {
        id: 'shiga-omi-chanpon',
        name: '近江ちゃんぽん',
        description: '野菜たっぷりで食べやすい、滋賀で親しまれる麺料理です。',
        keywords: ['近江ちゃんぽん'],
      },
      {
        id: 'shiga-kamo-nabe',
        name: '鴨鍋',
        description: '冬の食事にも合う、滋賀らしい鍋料理の候補です。',
        keywords: ['鴨鍋'],
      },
    ],
  },
  {
    prefecture: '京都府',
    foods: [
      {
        id: 'kyoto-kyo-ryori',
        name: '京料理',
        description: '落ち着いた食事で京都らしさを味わえるカテゴリです。',
        keywords: ['京料理'],
      },
      {
        id: 'kyoto-yudofu',
        name: '湯豆腐',
        description: '寺社巡りの食事にも合わせやすい、京都の定番料理です。',
        keywords: ['湯豆腐'],
      },
      {
        id: 'kyoto-nishin-soba',
        name: 'にしんそば',
        description: '甘辛く炊いたにしんをのせる、京都で親しまれるそばです。',
        keywords: ['にしんそば', 'ニシンそば'],
      },
      {
        id: 'kyoto-obanzai',
        name: 'おばんざい',
        description: '小鉢でいろいろ楽しめる、夜ごはんにも合う京都の家庭料理です。',
        keywords: ['おばんざい'],
      },
    ],
  },
  {
    prefecture: '大阪府',
    foods: [
      {
        id: 'osaka-okonomiyaki',
        name: 'お好み焼き',
        description: '鉄板で焼く香ばしさを楽しめる、大阪らしい定番料理です。',
        keywords: ['お好み焼き'],
      },
      {
        id: 'osaka-takoyaki',
        name: 'たこ焼き',
        description: '食べ歩きでも楽しみやすい、大阪観光と相性のよい料理です。',
        keywords: ['たこ焼き'],
      },
      {
        id: 'osaka-kushikatsu',
        name: '串カツ',
        description: '気軽な夜ごはんに選びやすい、大阪らしい揚げ物料理です。',
        keywords: ['串カツ', '串揚げ'],
      },
      {
        id: 'osaka-udon',
        name: 'うどん',
        description: 'だしの味を楽しめる、昼食にも夜食にも選びやすい候補です。',
        keywords: ['うどん', 'かすうどん'],
      },
    ],
  },
  {
    prefecture: '兵庫県',
    foods: [
      {
        id: 'hyogo-kobe-beef',
        name: '神戸牛',
        description: '特別な食事に選びやすい、兵庫を代表するブランド牛です。',
        keywords: ['神戸牛'],
      },
      {
        id: 'hyogo-akashiyaki',
        name: '明石焼き',
        description: 'だしで食べるふんわりした粉もの料理です。',
        keywords: ['明石焼き'],
      },
      {
        id: 'hyogo-sobameshi',
        name: 'そばめし',
        description: '焼きそばとご飯を炒める、神戸周辺で親しまれる料理です。',
        keywords: ['そばめし'],
      },
      {
        id: 'hyogo-himeji-oden',
        name: '姫路おでん',
        description: 'しょうが醤油で味わう、兵庫らしいおでんです。',
        keywords: ['姫路おでん'],
      },
    ],
  },
  {
    prefecture: '奈良県',
    foods: [
      {
        id: 'nara-kakinoha-zushi',
        name: '柿の葉寿司',
        description: '柿の葉で包んだ、奈良らしい郷土寿司です。',
        keywords: ['柿の葉寿司'],
      },
      {
        id: 'nara-miwa-somen',
        name: '三輪そうめん',
        description: '細くのどごしのよい、奈良を代表する麺料理です。',
        keywords: ['三輪そうめん'],
      },
      {
        id: 'nara-chagayu',
        name: '茶粥',
        description: 'お茶で米を炊く、素朴な奈良の郷土料理です。',
        keywords: ['茶粥'],
      },
      {
        id: 'nara-yamato-beef',
        name: '大和牛',
        description: '肉料理で奈良らしさを楽しみたい時の候補です。',
        keywords: ['大和牛'],
      },
    ],
  },
  {
    prefecture: '和歌山県',
    foods: [
      {
        id: 'wakayama-ramen',
        name: '和歌山ラーメン',
        description: '豚骨醤油の味わいが特徴の、和歌山の定番ラーメンです。',
        keywords: ['和歌山ラーメン'],
      },
      {
        id: 'wakayama-maguro',
        name: 'まぐろ',
        description: '那智勝浦などの海の幸を味わえる、旅行向きの候補です。',
        keywords: ['まぐろ', 'マグロ'],
      },
      {
        id: 'wakayama-mehari-zushi',
        name: 'めはり寿司',
        description: '高菜で包んだ、山間部でも親しまれる郷土寿司です。',
        keywords: ['めはり寿司'],
      },
      {
        id: 'wakayama-kue-nabe',
        name: 'クエ鍋',
        description: '海沿いの食事で選びやすい、特別感のある鍋料理です。',
        keywords: ['クエ鍋', 'くえ鍋'],
      },
    ],
  },
  {
    prefecture: '鳥取県',
    foods: [
      {
        id: 'tottori-kani',
        name: 'かに',
        description: '冬の味覚として楽しめる、鳥取を代表する海の幸です。',
        keywords: ['かに', '松葉ガニ'],
      },
      {
        id: 'tottori-gyukotsu-ramen',
        name: '牛骨ラーメン',
        description: '牛骨だしの香りが特徴の、鳥取らしいラーメンです。',
        keywords: ['牛骨ラーメン'],
      },
      {
        id: 'tottori-wagyu',
        name: '鳥取和牛',
        description: '焼肉やステーキで楽しめる、鳥取のブランド牛です。',
        keywords: ['鳥取和牛'],
      },
      {
        id: 'tottori-tofu-chikuwa',
        name: 'とうふちくわ',
        description: '豆腐と魚のすり身を使う、鳥取らしい軽い一品です。',
        keywords: ['とうふちくわ', '豆腐ちくわ'],
      },
    ],
  },
  {
    prefecture: '島根県',
    foods: [
      {
        id: 'shimane-izumo-soba',
        name: '出雲そば',
        description: '割子で食べるスタイルも有名な、島根の代表的なそばです。',
        keywords: ['出雲そば'],
      },
      {
        id: 'shimane-shijimi',
        name: 'しじみ',
        description: '宍道湖の味として知られる、汁物や料理で探しやすい食材です。',
        keywords: ['しじみ'],
      },
      {
        id: 'shimane-nodoguro',
        name: 'のどぐろ',
        description: '日本海の魚を楽しみたい時に選びやすい候補です。',
        keywords: ['のどぐろ'],
      },
      {
        id: 'shimane-wagyu',
        name: 'しまね和牛',
        description: '肉料理で島根らしさを楽しみたい時の候補です。',
        keywords: ['しまね和牛', '島根和牛'],
      },
    ],
  },
  {
    prefecture: '岡山県',
    foods: [
      {
        id: 'okayama-ebimeshi',
        name: 'えびめし',
        description: '黒いソース色のご飯が特徴の、岡山のご当地洋食です。',
        keywords: ['えびめし'],
      },
      {
        id: 'okayama-demi-katsudon',
        name: 'デミカツ丼',
        description: 'デミグラスソースで食べる、岡山で探しやすいカツ丼です。',
        keywords: ['デミカツ丼'],
      },
      {
        id: 'okayama-bara-zushi',
        name: 'ばら寿司',
        description: '海の幸や野菜を彩りよくのせる、岡山の郷土寿司です。',
        keywords: ['ばら寿司', '岡山ばら寿司'],
      },
      {
        id: 'okayama-mamakari',
        name: 'ままかり',
        description: '瀬戸内の小魚を酢漬けなどで楽しむ、岡山らしい一品です。',
        keywords: ['ままかり'],
      },
    ],
  },
  {
    prefecture: '広島県',
    foods: [
      {
        id: 'hiroshima-okonomiyaki',
        name: 'お好み焼き',
        description: '麺を重ねて焼く、広島で外せない鉄板料理です。',
        keywords: ['広島お好み焼き', 'お好み焼き'],
      },
      {
        id: 'hiroshima-oyster',
        name: '牡蠣',
        description: '焼き牡蠣や牡蠣料理で楽しめる、広島の海の幸です。',
        keywords: ['牡蠣', 'かき'],
      },
      {
        id: 'hiroshima-shirunashi-tantanmen',
        name: '汁なし担々麺',
        description: '辛味としびれを楽しめる、広島で人気の麺料理です。',
        keywords: ['汁なし担々麺'],
      },
      {
        id: 'hiroshima-anago-meshi',
        name: '穴子飯',
        description: '宮島方面でも有名な、香ばしい穴子のご当地ご飯です。',
        keywords: ['穴子飯', 'あなごめし'],
      },
    ],
  },
  {
    prefecture: '山口県',
    foods: [
      {
        id: 'yamaguchi-fugu',
        name: 'ふぐ',
        description: '下関の名物として知られる、特別感のある魚料理です。',
        keywords: ['ふぐ', 'フグ'],
      },
      {
        id: 'yamaguchi-kawara-soba',
        name: '瓦そば',
        description: '熱した瓦に茶そばをのせる、山口らしい名物です。',
        keywords: ['瓦そば'],
      },
      {
        id: 'yamaguchi-iwakuni-zushi',
        name: '岩国寿司',
        description: '押し寿司のように重ねる、岩国周辺の郷土寿司です。',
        keywords: ['岩国寿司'],
      },
      {
        id: 'yamaguchi-seafood',
        name: '海鮮',
        description: '瀬戸内や日本海の魚介を楽しめる、旅行向きの候補です。',
        keywords: ['海鮮', '刺身'],
      },
    ],
  },
  {
    prefecture: '徳島県',
    foods: [
      {
        id: 'tokushima-ramen',
        name: '徳島ラーメン',
        description: '甘辛い豚バラ肉や生卵と合う、徳島の定番麺です。',
        keywords: ['徳島ラーメン'],
      },
      {
        id: 'tokushima-awaodori',
        name: '阿波尾鶏',
        description: '炭火焼きや鶏料理で楽しめる、徳島の地鶏です。',
        keywords: ['阿波尾鶏'],
      },
      {
        id: 'tokushima-iya-soba',
        name: '祖谷そば',
        description: '山あいの食文化を感じられる、素朴なそばです。',
        keywords: ['祖谷そば'],
      },
      {
        id: 'tokushima-naruto-tai',
        name: '鳴門鯛',
        description: '鳴門の海の幸を楽しめる、少し特別な魚料理です。',
        keywords: ['鳴門鯛'],
      },
    ],
  },
  {
    prefecture: '香川県',
    foods: [
      {
        id: 'kagawa-sanuki-udon',
        name: '讃岐うどん',
        description: 'コシのある麺を気軽に楽しめる、香川の代表料理です。',
        keywords: ['讃岐うどん', 'うどん'],
      },
      {
        id: 'kagawa-honetsukidori',
        name: '骨付鳥',
        description: '骨付きの鶏肉を焼く、夜ごはんにも合う名物です。',
        keywords: ['骨付鳥'],
      },
      {
        id: 'kagawa-olive-beef',
        name: 'オリーブ牛',
        description: '肉料理で香川らしさを楽しみたい時の候補です。',
        keywords: ['オリーブ牛'],
      },
      {
        id: 'kagawa-somen',
        name: '小豆島そうめん',
        description: '小豆島の食文化を感じる、軽めの麺料理です。',
        keywords: ['小豆島そうめん', 'そうめん'],
      },
    ],
  },
  {
    prefecture: '愛媛県',
    foods: [
      {
        id: 'ehime-taimeshi',
        name: '鯛めし',
        description: '炊き込みや刺身のせなど、地域差も楽しめる名物です。',
        keywords: ['鯛めし'],
      },
      {
        id: 'ehime-jakoten',
        name: 'じゃこ天',
        description: '魚のすり身を揚げた、酒場でも探しやすい一品です。',
        keywords: ['じゃこ天'],
      },
      {
        id: 'ehime-imabari-yakitori',
        name: '今治焼鳥',
        description: '鉄板で焼くスタイルが特徴の、愛媛のご当地焼鳥です。',
        keywords: ['今治焼鳥', '今治焼き鳥'],
      },
      {
        id: 'ehime-yawatahama-chanpon',
        name: '八幡浜ちゃんぽん',
        description: '海の町らしいあっさりスープのご当地麺です。',
        keywords: ['八幡浜ちゃんぽん'],
      },
    ],
  },
  {
    prefecture: '高知県',
    foods: [
      {
        id: 'kochi-katsuo-tataki',
        name: 'かつおのたたき',
        description: '高知でまず選びやすい、香ばしい名物魚料理です。',
        keywords: ['かつおのたたき', '鰹のたたき'],
      },
      {
        id: 'kochi-sawachi',
        name: '皿鉢料理',
        description: '大皿で魚介や寿司を楽しむ、高知らしい宴席料理です。',
        keywords: ['皿鉢料理'],
      },
      {
        id: 'kochi-nabeyaki-ramen',
        name: '鍋焼きラーメン',
        description: '土鍋で熱々を楽しむ、須崎周辺で知られる麺料理です。',
        keywords: ['鍋焼きラーメン'],
      },
      {
        id: 'kochi-akaushi',
        name: '土佐あかうし',
        description: '肉料理で高知の食材を楽しみたい時の候補です。',
        keywords: ['土佐あかうし'],
      },
    ],
  },
  {
    prefecture: '福岡県',
    foods: [
      {
        id: 'hakata-ramen',
        name: '博多ラーメン',
        description: '細麺と豚骨スープで、福岡らしさをすぐ味わえる定番です。',
        keywords: ['博多ラーメン', '豚骨ラーメン'],
      },
      {
        id: 'motsunabe',
        name: 'もつ鍋',
        description: '夜ごはんでゆっくり楽しみたい、福岡を代表する鍋料理です。',
        keywords: ['もつ鍋'],
      },
      {
        id: 'seafood',
        name: '海鮮',
        description: '市場や港町の雰囲気も楽しめる、旅行向きのカテゴリです。',
        keywords: ['海鮮', '刺身'],
      },
      {
        id: 'unagi',
        name: 'うなぎ',
        description: '少し特別な食事に選びやすい、満足感のあるご当地候補です。',
        keywords: ['うなぎ', 'せいろ蒸し'],
      },
    ],
  },
  {
    prefecture: '佐賀県',
    foods: [
      {
        id: 'saga-saga-beef',
        name: '佐賀牛',
        description: '焼肉やステーキで楽しめる、佐賀のブランド牛です。',
        keywords: ['佐賀牛'],
      },
      {
        id: 'saga-yobuko-ika',
        name: '呼子いか',
        description: '透明感のあるいかを味わえる、佐賀を代表する海の幸です。',
        keywords: ['呼子いか', 'イカ活造り'],
      },
      {
        id: 'saga-sicilian-rice',
        name: 'シシリアンライス',
        description: 'ご飯に肉と野菜をのせる、佐賀市周辺のご当地洋食です。',
        keywords: ['シシリアンライス'],
      },
      {
        id: 'saga-chanpon',
        name: 'ちゃんぽん',
        description: '野菜や魚介を楽しめる、佐賀でも親しまれる麺料理です。',
        keywords: ['ちゃんぽん'],
      },
    ],
  },
  {
    prefecture: '長崎県',
    foods: [
      {
        id: 'nagasaki-chanpon',
        name: '長崎ちゃんぽん',
        description: '魚介と野菜を一杯で楽しめる、長崎の代表的な麺料理です。',
        keywords: ['長崎ちゃんぽん', 'ちゃんぽん'],
      },
      {
        id: 'nagasaki-sara-udon',
        name: '皿うどん',
        description: '香ばしい麺とあんを楽しむ、長崎で定番の料理です。',
        keywords: ['皿うどん'],
      },
      {
        id: 'nagasaki-toruko-rice',
        name: 'トルコライス',
        description: '洋食を一皿に盛る、長崎らしい満足感のある一品です。',
        keywords: ['トルコライス'],
      },
      {
        id: 'nagasaki-sasebo-burger',
        name: '佐世保バーガー',
        description: '手作り感のある大きなバーガーを楽しめる名物です。',
        keywords: ['佐世保バーガー'],
      },
    ],
  },
  {
    prefecture: '熊本県',
    foods: [
      {
        id: 'kumamoto-basashi',
        name: '馬刺し',
        description: '熊本の食事で選びやすい、代表的な肉料理です。',
        keywords: ['馬刺し'],
      },
      {
        id: 'kumamoto-ramen',
        name: '熊本ラーメン',
        description: 'マー油やにんにくの香りが特徴の、熊本の定番麺です。',
        keywords: ['熊本ラーメン'],
      },
      {
        id: 'kumamoto-akaushi',
        name: 'あか牛',
        description: 'ステーキや丼で楽しめる、阿蘇でも知られるブランド牛です。',
        keywords: ['あか牛'],
      },
      {
        id: 'kumamoto-taipien',
        name: '太平燕',
        description: '春雨と野菜を使う、熊本で親しまれる中華風の料理です。',
        keywords: ['太平燕', 'タイピーエン'],
      },
    ],
  },
  {
    prefecture: '大分県',
    foods: [
      {
        id: 'oita-toriten',
        name: 'とり天',
        description: '鶏肉を天ぷらにする、大分で探しやすい定番料理です。',
        keywords: ['とり天'],
      },
      {
        id: 'oita-dango-jiru',
        name: 'だんご汁',
        description: '平たいだんごと野菜を煮込む、ほっとする郷土料理です。',
        keywords: ['だんご汁'],
      },
      {
        id: 'oita-ryukyu',
        name: 'りゅうきゅう',
        description: '刺身をたれに漬ける、酒場でも楽しみやすい魚料理です。',
        keywords: ['りゅうきゅう'],
      },
      {
        id: 'oita-seki-aji',
        name: '関あじ・関さば',
        description: '大分の海の幸を少し特別に楽しみたい時の候補です。',
        keywords: ['関あじ', '関さば'],
      },
    ],
  },
  {
    prefecture: '宮崎県',
    foods: [
      {
        id: 'miyazaki-chicken-nanban',
        name: 'チキン南蛮',
        description: '甘酢とタルタルで食べる、宮崎の定番料理です。',
        keywords: ['チキン南蛮'],
      },
      {
        id: 'miyazaki-jidori',
        name: '地鶏炭火焼',
        description: '香ばしく焼いた地鶏を楽しめる、夜ごはん向きの名物です。',
        keywords: ['地鶏炭火焼', '宮崎地鶏'],
      },
      {
        id: 'miyazaki-hiyajiru',
        name: '冷や汁',
        description: '暑い日にも食べやすい、宮崎で親しまれる郷土料理です。',
        keywords: ['冷や汁'],
      },
      {
        id: 'miyazaki-beef',
        name: '宮崎牛',
        description: '焼肉やステーキで楽しめる、宮崎のブランド牛です。',
        keywords: ['宮崎牛'],
      },
    ],
  },
  {
    prefecture: '鹿児島県',
    foods: [
      {
        id: 'kagoshima-kurobuta',
        name: '黒豚',
        description: 'しゃぶしゃぶやとんかつで楽しめる、鹿児島の名物です。',
        keywords: ['黒豚'],
      },
      {
        id: 'kagoshima-ramen',
        name: '鹿児島ラーメン',
        description: '豚骨ベースながら店ごとの個性を楽しめるご当地麺です。',
        keywords: ['鹿児島ラーメン'],
      },
      {
        id: 'kagoshima-kibinago',
        name: 'きびなご',
        description: '刺身や天ぷらで味わえる、鹿児島の海の幸です。',
        keywords: ['きびなご'],
      },
      {
        id: 'kagoshima-keihan',
        name: '鶏飯',
        description: '鶏だしをかけて食べる、奄美の郷土料理です。',
        keywords: ['鶏飯'],
      },
    ],
  },
  {
    prefecture: '沖縄県',
    foods: [
      {
        id: 'okinawa-soba',
        name: '沖縄そば',
        description: '小麦麺とだしを楽しむ、沖縄で外せない定番です。',
        keywords: ['沖縄そば'],
      },
      {
        id: 'okinawa-goya-champuru',
        name: 'ゴーヤチャンプルー',
        description: 'ゴーヤと豆腐を炒める、沖縄らしい家庭料理です。',
        keywords: ['ゴーヤチャンプルー', 'ゴーヤーチャンプルー'],
      },
      {
        id: 'okinawa-rafute',
        name: 'ラフテー',
        description: '豚の角煮を泡盛や黒糖で煮る、沖縄の定番料理です。',
        keywords: ['ラフテー'],
      },
      {
        id: 'okinawa-taco-rice',
        name: 'タコライス',
        description: 'ご飯にタコス具材をのせる、沖縄発祥の人気料理です。',
        keywords: ['タコライス'],
      },
    ],
  },
]

// 画面側では従来通り、都道府県名を持ったフラットなカテゴリ一覧として扱う
export const localFoodCategories: LocalFoodCategory[] =
  prefectureFoodDefinitions.flatMap(({ prefecture, foods }) =>
    foods.map((food) => ({
      ...food,
      prefecture,
    })),
  )
