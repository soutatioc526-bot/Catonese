const yueItem = (id, hanzi, jyutping, meaning, note = "") => ({ id, hanzi, jyutping, meaning, note });

window.YUE_CURRICULUM = [
  {
    id: "day-1", place: "日常", moment: "入门", scene: "daily",
    phrases: [
      yueItem("d1-1", "你好", "nei5 hou2", "你好"),
      yueItem("d1-2", "早晨", "zou2 san4", "早上好"),
      yueItem("d1-3", "唔該", "m4 goi1", "麻烦你／谢谢服务"),
      yueItem("d1-4", "多謝", "do1 ze6", "谢谢礼物／称赞"),
      yueItem("d1-5", "係", "hai6", "是"),
      yueItem("d1-6", "唔係", "m4 hai6", "不是"),
      yueItem("d1-7", "好", "hou2", "好"),
      yueItem("d1-8", "唔好", "m4 hou2", "不要／不好"),
      yueItem("d1-9", "有", "jau5", "有"),
      yueItem("d1-10", "冇", "mou5", "没有"),
      yueItem("d1-11", "今日", "gam1 jat6", "今天"),
      yueItem("d1-12", "聽日", "ting1 jat6", "明天"),
      yueItem("d1-13", "真係", "zan1 hai6", "真的／确实"),
      yueItem("d1-14", "冇問題", "mou5 man6 tai4", "没问题"),
      yueItem("d1-15", "唔明", "m4 ming4", "不明白"),
      yueItem("d1-16", "我明", "ngo5 ming4", "我明白"),
      yueItem("d1-17", "等一陣", "dang2 jat1 zan6", "等一会儿"),
      yueItem("d1-18", "慢啲", "maan6 di1", "慢一点"),
      yueItem("d1-19", "講多次", "gong2 do1 ci3", "再说一次"),
      yueItem("d1-20", "聽唔明", "ting1 m4 ming4", "听不明白")
    ]
  },
  {
    id: "day-2", place: "飲食", moment: "生活", scene: "food",
    phrases: [
      yueItem("d2-1", "唔該，我想要呢個", "m4 goi1 ngo5 soeng2 jiu3 ni1 go3", "麻烦，我想要这个"),
      yueItem("d2-2", "有冇凍檸茶？", "jau5 mou5 dung3 ning2 caa4", "有没有冻柠茶？"),
      yueItem("d2-3", "少甜，走冰", "siu2 tim4 zau2 bing1", "少糖，不要冰"),
      yueItem("d2-4", "唔該埋單", "m4 goi1 maai4 daan1", "麻烦结账"),
      yueItem("d2-5", "食飯", "sik6 faan6", "吃饭"),
      yueItem("d2-6", "飲茶", "jam2 caa4", "喝茶／饮茶"),
      yueItem("d2-7", "凍檸茶", "dung3 ning2 caa4", "冻柠茶"),
      yueItem("d2-8", "少甜", "siu2 tim4", "少糖"),
      yueItem("d2-9", "走冰", "zau2 bing1", "不要冰"),
      yueItem("d2-10", "呢個", "ni1 go3", "这个"),
      yueItem("d2-11", "我想要", "ngo5 soeng2 jiu3", "我想要"),
      yueItem("d2-12", "有冇", "jau5 mou5", "有没有"),
      yueItem("d2-13", "幾多錢", "gei2 do1 cin2", "多少钱"),
      yueItem("d2-14", "埋單", "maai4 daan1", "结账"),
      yueItem("d2-15", "一齊食飯吖", "jat1 cai4 sik6 faan6 aa1", "一起吃饭吧"),
      yueItem("d2-16", "一齊飲茶吖", "jat1 cai4 jam2 caa4 aa1", "一起喝茶吧"),
      yueItem("d2-17", "我食飯", "ngo5 sik6 faan6", "我吃饭"),
      yueItem("d2-18", "我飲茶", "ngo5 jam2 caa4", "我喝茶"),
      yueItem("d2-19", "好食", "hou2 sik6", "好吃"),
      yueItem("d2-20", "唔要呢個", "m4 jiu3 ni1 go3", "不要这个")
    ]
  },
  {
    id: "day-3", place: "出行", moment: "生活", scene: "travel",
    phrases: [
      yueItem("d3-1", "地鐵站喺邊度？", "dei6 tit3 zaam6 hai2 bin1 dou6", "地铁站在哪里？"),
      yueItem("d3-2", "我想去中環", "ngo5 soeng2 heoi3 zung1 waan4", "我想去中环"),
      yueItem("d3-3", "喺下一個站落", "hai2 haa6 jat1 go3 zaam6 lok6", "在下一站下车"),
      yueItem("d3-4", "唔該借借", "m4 goi1 ze3 ze3", "麻烦借过"),
      yueItem("d3-5", "地鐵", "dei6 tit3", "地铁"),
      yueItem("d3-6", "地鐵站", "dei6 tit3 zaam6", "地铁站"),
      yueItem("d3-7", "中環", "zung1 waan4", "中环"),
      yueItem("d3-8", "邊度", "bin1 dou6", "哪里"),
      yueItem("d3-9", "下一個", "haa6 jat1 go3", "下一个"),
      yueItem("d3-10", "下一站", "haa6 jat1 zaam6", "下一站"),
      yueItem("d3-11", "落", "lok6", "下车／落下"),
      yueItem("d3-12", "我想去", "ngo5 soeng2 heoi3", "我想去"),
      yueItem("d3-13", "喺邊度", "hai2 bin1 dou6", "在哪里"),
      yueItem("d3-14", "去邊度", "heoi3 bin1 dou6", "去哪里"),
      yueItem("d3-15", "我喺中環", "ngo5 hai2 zung1 waan4", "我在中环"),
      yueItem("d3-16", "今日去中環", "gam1 jat6 heoi3 zung1 waan4", "今天去中环"),
      yueItem("d3-17", "聽日去中環", "ting1 jat6 heoi3 zung1 waan4", "明天去中环"),
      yueItem("d3-18", "呢個站", "ni1 go3 zaam6", "这个站"),
      yueItem("d3-19", "下一站落", "haa6 jat1 zaam6 lok6", "下一站下车"),
      yueItem("d3-20", "我唔係去中環", "ngo5 m4 hai6 heoi3 zung1 waan4", "我不是去中环")
    ]
  },
  {
    id: "day-4", place: "購物", moment: "生活", scene: "shopping",
    phrases: [
      yueItem("d4-1", "呢個幾多錢？", "ni1 go3 gei2 do1 cin2", "这个多少钱？"),
      yueItem("d4-2", "可唔可以平啲？", "ho2 m4 ho2 ji5 peng4 di1", "可以便宜一点吗？"),
      yueItem("d4-3", "我睇下先", "ngo5 tai2 haa5 sin1", "我先看看"),
      yueItem("d4-4", "我用八達通", "ngo5 jung6 baat3 daat6 tung1", "我用八达通"),
      yueItem("d4-5", "幾多錢", "gei2 do1 cin2", "多少钱"),
      yueItem("d4-6", "平", "peng4", "便宜"),
      yueItem("d4-7", "平啲", "peng4 di1", "便宜一点"),
      yueItem("d4-8", "呢份", "ni1 fan6", "这份"),
      yueItem("d4-9", "呢個", "ni1 go3", "这个"),
      yueItem("d4-10", "我睇", "ngo5 tai2", "我看"),
      yueItem("d4-11", "睇下", "tai2 haa5", "看一下"),
      yueItem("d4-12", "八達通", "baat3 daat6 tung1", "八达通"),
      yueItem("d4-13", "呢份幾多錢？", "ni1 fan6 gei2 do1 cin2", "这份多少钱？"),
      yueItem("d4-14", "可唔可以", "ho2 m4 ho2 ji5", "可不可以"),
      yueItem("d4-15", "我想要呢個", "ngo5 soeng2 jiu3 ni1 go3", "我想要这个"),
      yueItem("d4-16", "唔要呢個", "m4 jiu3 ni1 go3", "不要这个"),
      yueItem("d4-17", "好平", "hou2 peng4", "很便宜"),
      yueItem("d4-18", "幾多", "gei2 do1", "多少"),
      yueItem("d4-19", "有冇呢個", "jau5 mou5 ni1 go3", "有没有这个"),
      yueItem("d4-20", "冇呢個", "mou5 ni1 go3", "没有这个")
    ]
  },
  {
    id: "day-5", place: "社交", moment: "生活", scene: "social",
    phrases: [
      yueItem("d5-1", "你得唔得閒？", "nei5 dak1 m4 dak1 haan4", "你有没有空？"),
      yueItem("d5-2", "一齊食飯吖", "jat1 cai4 sik6 faan6 aa1", "一起吃饭吧"),
      yueItem("d5-3", "等我一陣", "dang2 ngo5 jat1 zan6", "等我一会儿"),
      yueItem("d5-4", "冇問題", "mou5 man6 tai4", "没问题"),
      yueItem("d5-5", "得閒", "dak1 haan4", "有空"),
      yueItem("d5-6", "一齊", "jat1 cai4", "一起"),
      yueItem("d5-7", "一齊食飯", "jat1 cai4 sik6 faan6", "一起吃饭"),
      yueItem("d5-8", "一齊飲茶", "jat1 cai4 jam2 caa4", "一起喝茶"),
      yueItem("d5-9", "等我", "dang2 ngo5", "等我"),
      yueItem("d5-10", "今日得閒", "gam1 jat6 dak1 haan4", "今天有空"),
      yueItem("d5-11", "聽日得閒", "ting1 jat6 dak1 haan4", "明天有空"),
      yueItem("d5-12", "今日一齊食飯", "gam1 jat6 jat1 cai4 sik6 faan6", "今天一起吃饭"),
      yueItem("d5-13", "聽日一齊飲茶", "ting1 jat6 jat1 cai4 jam2 caa4", "明天一起喝茶"),
      yueItem("d5-14", "好吖", "hou2 aa1", "好啊"),
      yueItem("d5-15", "唔得閒", "m4 dak1 haan4", "没空"),
      yueItem("d5-16", "我得閒", "ngo5 dak1 haan4", "我有空"),
      yueItem("d5-17", "你去唔去？", "nei5 heoi3 m4 heoi3", "你去不去？"),
      yueItem("d5-18", "我去", "ngo5 heoi3", "我去"),
      yueItem("d5-19", "我唔去", "ngo5 m4 heoi3", "我不去"),
      yueItem("d5-20", "聽日見", "ting1 jat6 gin3", "明天见")
    ]
  },
  {
    id: "day-6", place: "工作", moment: "进阶", scene: "work",
    phrases: [
      yueItem("d6-1", "我唔係好明", "ngo5 m4 hai6 hou2 ming4", "我不太明白"),
      yueItem("d6-2", "可唔可以講多次？", "ho2 m4 ho2 ji5 gong2 do1 ci3", "可以再说一次吗？"),
      yueItem("d6-3", "我遲少少到", "ngo5 ci4 siu2 siu2 dou3", "我会晚一点到"),
      yueItem("d6-4", "呢份幾時要？", "ni1 fan6 gei2 si4 jiu3", "这份什么时候要？"),
      yueItem("d6-5", "唔明", "m4 ming4", "不明白"),
      yueItem("d6-6", "講多次", "gong2 do1 ci3", "再说一次"),
      yueItem("d6-7", "慢啲", "maan6 di1", "慢一点"),
      yueItem("d6-8", "可唔可以慢啲？", "ho2 m4 ho2 ji5 maan6 di1", "可以慢一点吗？"),
      yueItem("d6-9", "等一陣", "dang2 jat1 zan6", "等一会儿"),
      yueItem("d6-10", "呢份", "ni1 fan6", "这份"),
      yueItem("d6-11", "幾時", "gei2 si4", "什么时候"),
      yueItem("d6-12", "今日要", "gam1 jat6 jiu3", "今天要"),
      yueItem("d6-13", "聽日要", "ting1 jat6 jiu3", "明天要"),
      yueItem("d6-14", "遲少少", "ci4 siu2 siu2", "晚一点"),
      yueItem("d6-15", "搞掂", "gaau2 dim6", "搞定"),
      yueItem("d6-16", "搞掂喇", "gaau2 dim6 laa3", "搞定了"),
      yueItem("d6-17", "辛苦晒", "san1 fu2 saai3", "辛苦了"),
      yueItem("d6-18", "我明", "ngo5 ming4", "我明白"),
      yueItem("d6-19", "我唔明", "ngo5 m4 ming4", "我不明白"),
      yueItem("d6-20", "可唔可以等一陣？", "ho2 m4 ho2 ji5 dang2 jat1 zan6", "可以等一会儿吗？")
    ]
  },
  {
    id: "day-7", place: "综合", moment: "进阶", scene: "advanced",
    phrases: [
      yueItem("d7-1", "今日真係好忙", "gam1 jat6 zan1 hai6 hou2 mong4", "今天真的很忙"),
      yueItem("d7-2", "搞掂喇", "gaau2 dim6 laa3", "搞定了"),
      yueItem("d7-3", "辛苦晒", "san1 fu2 saai3", "辛苦了"),
      yueItem("d7-4", "聽日見", "ting1 jat6 gin3", "明天见"),
      yueItem("d7-5", "好忙", "hou2 mong4", "很忙"),
      yueItem("d7-6", "真係好", "zan1 hai6 hou2", "真的很好"),
      yueItem("d7-7", "我遲少少到", "ngo5 ci4 siu2 siu2 dou3", "我会晚一点到"),
      yueItem("d7-8", "可唔可以等一陣？", "ho2 m4 ho2 ji5 dang2 jat1 zan6", "可以等一会儿吗？"),
      yueItem("d7-9", "可唔可以慢啲？", "ho2 m4 ho2 ji5 maan6 di1", "可以慢一点吗？"),
      yueItem("d7-10", "可唔可以講多次？", "ho2 m4 ho2 ji5 gong2 do1 ci3", "可以再说一次吗？"),
      yueItem("d7-11", "我唔係好明", "ngo5 m4 hai6 hou2 ming4", "我不太明白"),
      yueItem("d7-12", "今日冇問題", "gam1 jat6 mou5 man6 tai4", "今天没问题"),
      yueItem("d7-13", "聽日冇問題", "ting1 jat6 mou5 man6 tai4", "明天没问题"),
      yueItem("d7-14", "今日一齊食飯吖", "gam1 jat6 jat1 cai4 sik6 faan6 aa1", "今天一起吃饭吧"),
      yueItem("d7-15", "聽日一齊飲茶吖", "ting1 jat6 jat1 cai4 jam2 caa4 aa1", "明天一起喝茶吧"),
      yueItem("d7-16", "我想去中環", "ngo5 soeng2 heoi3 zung1 waan4", "我想去中环"),
      yueItem("d7-17", "呢個幾多錢？", "ni1 go3 gei2 do1 cin2", "这个多少钱？"),
      yueItem("d7-18", "地鐵站喺邊度？", "dei6 tit3 zaam6 hai2 bin1 dou6", "地铁站在哪里？"),
      yueItem("d7-19", "唔該埋單", "m4 goi1 maai4 daan1", "麻烦结账"),
      yueItem("d7-20", "多謝，辛苦晒", "do1 ze6 san1 fu2 saai3", "谢谢，辛苦了")
    ]
  }
];

window.YUE_TRANSFER_PATTERNS = {
  "d2-1": [
    yueItem("t2-1", "唔該，我想要凍檸茶", "m4 goi1 ngo5 soeng2 jiu3 dung3 ning2 caa4", "麻烦，我想要冻柠茶"),
    yueItem("t2-2", "唔該，我想要少甜", "m4 goi1 ngo5 soeng2 jiu3 siu2 tim4", "麻烦，我想要少糖")
  ],
  "d3-2": [
    yueItem("t3-1", "我想去地鐵站", "ngo5 soeng2 heoi3 dei6 tit3 zaam6", "我想去地铁站"),
    yueItem("t3-2", "我想去街市", "ngo5 soeng2 heoi3 gaai1 si5", "我想去市场")
  ],
  "d4-1": [
    yueItem("t4-1", "凍檸茶幾多錢？", "dung3 ning2 caa4 gei2 do1 cin2", "冻柠茶多少钱？"),
    yueItem("t4-2", "呢份幾多錢？", "ni1 fan6 gei2 do1 cin2", "这份多少钱？")
  ],
  "d5-2": [
    yueItem("t5-1", "一齊去中環吖", "jat1 cai4 heoi3 zung1 waan4 aa1", "一起去中环吧"),
    yueItem("t5-2", "一齊飲茶吖", "jat1 cai4 jam2 caa4 aa1", "一起喝茶吧")
  ],
  "d6-2": [
    yueItem("t6-1", "可唔可以慢啲？", "ho2 m4 ho2 ji5 maan6 di1", "可以慢一点吗？"),
    yueItem("t6-2", "可唔可以等一陣？", "ho2 m4 ho2 ji5 dang2 jat1 zan6", "可以等一会儿吗？")
  ]
};

window.YUE_TONE_NAMES = {
  1: "高平", 2: "高升", 3: "中平", 4: "低降", 5: "低升", 6: "低平"
};
