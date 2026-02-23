// ============================================================
//  QUESTION BANK — 英検３級・準２級  関係詞 & 分詞 100問
// ============================================================

export const QUESTIONS = [
  // ───────────────────────────────────────────────
  // ３級 — 関係代名詞 who（主格）
  // ───────────────────────────────────────────────
  {
    id: "g3_who_01", level: "grade3", category: "関係代名詞 who（主格）", type: "multiple",
    sentence: "She is the woman _____ helped me yesterday.",
    options: ["who", "which", "what", "it"], answer: "who",
    explanation: "先行詞「人（woman）」で関係節内が主語の役割 → who。which は物・動物に使う。",
  },
  {
    id: "g3_who_02", level: "grade3", category: "関係代名詞 who（主格）", type: "multiple",
    sentence: "I have a friend _____ lives in Canada.",
    options: ["who", "which", "whose", "where"], answer: "who",
    explanation: "先行詞「人（friend）」で主語の役割 → who。",
  },
  {
    id: "g3_who_03", level: "grade3", category: "関係代名詞 who（主格）", type: "multiple",
    sentence: "The teacher _____ taught us math was very strict.",
    options: ["who", "which", "what", "whom"], answer: "who",
    explanation: "先行詞「人（teacher）」で主語の役割 → who（that も可）。",
  },
  {
    id: "g3_who_04", level: "grade3", category: "関係代名詞 who（主格）", type: "fill",
    sentence: "The boy _____ sits next to me is very tall.",
    answer: "who", hint: "先行詞が「人」・関係節内で主語の役割",
  },
  {
    id: "g3_who_05", level: "grade3", category: "関係代名詞 who（主格）", type: "multiple",
    sentence: "Do you know the girl _____ won the prize?",
    options: ["who", "which", "whose", "where"], answer: "who",
    explanation: "先行詞「人（girl）」で主語の役割 → who（that も可）。",
  },

  // ───────────────────────────────────────────────
  // ３級 — 関係代名詞 which（主格）
  // ───────────────────────────────────────────────
  {
    id: "g3_wh_01", level: "grade3", category: "関係代名詞 which（主格）", type: "multiple",
    sentence: "This is the book _____ changed my life.",
    options: ["which", "who", "whose", "what"], answer: "which",
    explanation: "先行詞「物（book）」で主語の役割 → which（that も可）。",
  },
  {
    id: "g3_wh_02", level: "grade3", category: "関係代名詞 which（主格）", type: "multiple",
    sentence: "The train _____ runs every hour is very fast.",
    options: ["which", "who", "whom", "where"], answer: "which",
    explanation: "先行詞「物（train）」で主語の役割 → which（that も可）。",
  },
  {
    id: "g3_wh_03", level: "grade3", category: "関係代名詞 which（主格）", type: "fill",
    sentence: "I bought a bag _____ was made in Italy.",
    answer: "which", hint: "先行詞が「物」・関係節内で主語の役割",
  },
  {
    id: "g3_wh_04", level: "grade3", category: "関係代名詞 which（主格）", type: "multiple",
    sentence: "She has a cat _____ can open doors.",
    options: ["that", "who", "whose", "what"], answer: "that",
    explanation: "動物の先行詞には that が自然（which も可）。who は人以外には使わない！",
  },
  {
    id: "g3_wh_05", level: "grade3", category: "関係代名詞 which（目的格）", type: "multiple",
    sentence: "The movie _____ I watched last night was exciting.",
    options: ["which", "who", "whom", "it"], answer: "which",
    explanation: "先行詞「物（movie）」で目的語の役割 → which（that も可、省略も可）。",
  },

  // ───────────────────────────────────────────────
  // ３級 — 関係代名詞 that（主格・目的格）
  // ───────────────────────────────────────────────
  {
    id: "g3_that_01", level: "grade3", category: "関係代名詞 that（目的格）", type: "multiple",
    sentence: "The man _____ I met at the station was my uncle.",
    options: ["that", "what", "it", "he"], answer: "that",
    explanation: "先行詞「人」で目的語の役割 → that（who/whom も可）。",
  },
  {
    id: "g3_that_02", level: "grade3", category: "関係代名詞 that（目的格）", type: "fill",
    sentence: "The book _____ Tom wrote is interesting.",
    answer: "that", hint: "先行詞が「物」・目的語の役割（省略も可）",
  },
  {
    id: "g3_that_03", level: "grade3", category: "関係代名詞 that（目的格）", type: "multiple",
    sentence: "Is this the song _____ you like best?",
    options: ["that", "who", "whose", "where"], answer: "that",
    explanation: "先行詞「物（song）」で目的語の役割 → that（which も可、省略も可）。",
  },
  {
    id: "g3_that_04", level: "grade3", category: "関係代名詞 who/which/that 総合", type: "multiple",
    sentence: "I know a restaurant _____ serves great sushi.",
    options: ["that", "who", "whom", "whose"], answer: "that",
    explanation: "先行詞「物（restaurant）」で主語の役割 → that（which も可）。",
  },
  {
    id: "g3_that_05", level: "grade3", category: "関係代名詞 who/which/that 総合", type: "multiple",
    sentence: "The picture _____ he painted is amazing.",
    options: ["that", "who", "whose", "when"], answer: "that",
    explanation: "先行詞「物（picture）」で目的語の役割 → that（which も可）。",
  },

  // ───────────────────────────────────────────────
  // ３級 — what vs that ★ひっかけ
  // ───────────────────────────────────────────────
  {
    id: "g3_what_01", level: "grade3", category: "what vs that", type: "multiple", tricky: true,
    sentence: "This is _____ I wanted to say.",
    options: ["what", "that", "which", "who"], answer: "what",
    explanation: "what ＝ the thing(s) that。先行詞を含む関係代名詞が what。ここには先行詞がないので that は不可！",
  },
  {
    id: "g3_what_02", level: "grade3", category: "what vs that", type: "multiple", tricky: true,
    sentence: "Tell me _____ you know about it.",
    options: ["what", "that", "which", "who"], answer: "what",
    explanation: "「あなたが知っていること」＝ what you know。先行詞なし → what。",
  },
  {
    id: "g3_what_03", level: "grade3", category: "what vs that", type: "multiple", tricky: true,
    sentence: "I can't believe _____ he said.",
    options: ["what", "that", "which", "whose"], answer: "what",
    explanation: "「彼が言ったこと」＝ what he said。先行詞なし → what。",
  },
  {
    id: "g3_what_04", level: "grade3", category: "what vs that", type: "multiple", tricky: true,
    sentence: "The thing _____ surprised me most was his answer.",
    options: ["that", "what", "which", "who"], answer: "that",
    explanation: "先行詞「the thing」がある → that（which も可）。先行詞があるので what は使えない！",
  },
  {
    id: "g3_what_05", level: "grade3", category: "what vs that", type: "fill", tricky: true,
    sentence: "Show me _____ you bought.",
    answer: "what", hint: "「あなたが買ったもの」先行詞なし",
  },
  {
    id: "g3_what_06", level: "grade3", category: "what vs that", type: "multiple", tricky: true,
    sentence: "_____ she needs is more time.",
    options: ["What", "That", "Which", "Who"], answer: "What",
    explanation: "主語節。「彼女が必要なもの（こと）」＝ What she needs。先行詞なし → What。",
  },

  // ───────────────────────────────────────────────
  // ３級 — 現在分詞（前置・後置修飾）
  // ───────────────────────────────────────────────
  {
    id: "g3_prs_01", level: "grade3", category: "現在分詞（前置修飾）", type: "multiple",
    sentence: "Look at the _____ baby over there.",
    options: ["sleeping", "slept", "sleeps", "sleep"], answer: "sleeping",
    explanation: "「眠っている（能動・進行）」名詞の前に → 現在分詞（-ing）。",
  },
  {
    id: "g3_prs_02", level: "grade3", category: "現在分詞（前置修飾）", type: "multiple",
    sentence: "There is a _____ dog in the garden.",
    options: ["running", "ran", "run", "runs"], answer: "running",
    explanation: "「走っている犬」能動・進行 → 現在分詞（running）。",
  },
  {
    id: "g3_prs_03", level: "grade3", category: "現在分詞（後置修飾）", type: "multiple",
    sentence: "The girl _____ the piano is my sister.",
    options: ["playing", "played", "plays", "play"], answer: "playing",
    explanation: "「ピアノを弾いている少女」→ playing the piano で名詞を後ろから修飾。",
  },
  {
    id: "g3_prs_04", level: "grade3", category: "現在分詞（後置修飾）", type: "multiple",
    sentence: "Do you know the boy _____ near the door?",
    options: ["standing", "stood", "stands", "stand"], answer: "standing",
    explanation: "「ドアの近くに立っている少年」→ standing near the door。",
  },
  {
    id: "g3_prs_05", level: "grade3", category: "現在分詞（後置修飾）", type: "fill",
    sentence: "The man _____ (talk) on the phone is my father.",
    answer: "talking", hint: "能動・進行の意味で名詞を後ろから修飾",
  },
  {
    id: "g3_prs_06", level: "grade3", category: "現在分詞（後置修飾）", type: "multiple",
    sentence: "I saw a bird _____ on the branch.",
    options: ["sitting", "sat", "sits", "seat"], answer: "sitting",
    explanation: "「枝に座っている鳥」→ sitting on the branch。現在分詞。",
  },

  // ───────────────────────────────────────────────
  // ３級 — 過去分詞（前置・後置修飾）
  // ───────────────────────────────────────────────
  {
    id: "g3_pp_01", level: "grade3", category: "過去分詞（前置修飾）", type: "multiple",
    sentence: "I found a _____ window in the kitchen.",
    options: ["broken", "breaking", "break", "broke"], answer: "broken",
    explanation: "「壊された窓」受け身の意味 → 過去分詞（broken）。",
  },
  {
    id: "g3_pp_02", level: "grade3", category: "過去分詞（前置修飾）", type: "multiple",
    sentence: "She ate a _____ egg for breakfast.",
    options: ["boiled", "boiling", "boil", "boils"], answer: "boiled",
    explanation: "「ゆでられた卵」受け身 → 過去分詞（boiled）。",
  },
  {
    id: "g3_pp_03", level: "grade3", category: "過去分詞（後置修飾）", type: "multiple",
    sentence: "The car _____ by my father is very old.",
    options: ["driven", "driving", "drives", "drive"], answer: "driven",
    explanation: "「父によって運転される車」受け身 → 過去分詞（driven）。",
  },
  {
    id: "g3_pp_04", level: "grade3", category: "過去分詞（後置修飾）", type: "multiple",
    sentence: "The letter _____ by him was very long.",
    options: ["written", "writing", "wrote", "writes"], answer: "written",
    explanation: "「彼によって書かれた手紙」受け身 → 過去分詞（written）。",
  },
  {
    id: "g3_pp_05", level: "grade3", category: "過去分詞（後置修飾）", type: "fill",
    sentence: "The language _____ (speak) in Brazil is Portuguese.",
    answer: "spoken", hint: "「話される言語」受け身の意味",
  },
  {
    id: "g3_pp_06", level: "grade3", category: "過去分詞（後置修飾）", type: "multiple",
    sentence: "I want to visit the temple _____ 500 years ago.",
    options: ["built", "building", "build", "builds"], answer: "built",
    explanation: "「500年前に建てられた寺」受け身 → 過去分詞（built）。",
  },
  {
    id: "g3_pp_07", level: "grade3", category: "過去分詞（後置修飾）", type: "multiple",
    sentence: "The flowers _____ in the vase are roses.",
    options: ["put", "putting", "puts", "to put"], answer: "put",
    explanation: "「花瓶に入れられた花」受け身 → 過去分詞（put）。",
  },

  // ───────────────────────────────────────────────
  // ３級 — 感情動詞 -ing vs -ed ★ひっかけ
  // ───────────────────────────────────────────────
  {
    id: "g3_emo_01", level: "grade3", category: "感情動詞 -ing vs -ed", type: "multiple", tricky: true,
    sentence: "The story was very _____.",
    options: ["exciting", "excited", "excites", "excite"], answer: "exciting",
    explanation: "物・事が主語のとき → -ing（exciting ＝ワクワクさせる）。人が主語なら excited（ワクワクしている）。",
  },
  {
    id: "g3_emo_02", level: "grade3", category: "感情動詞 -ing vs -ed", type: "multiple", tricky: true,
    sentence: "I was very _____ by the news.",
    options: ["surprised", "surprising", "surprise", "surprises"], answer: "surprised",
    explanation: "人が主語で感情を受ける立場 → 過去分詞（surprised）。",
  },
  {
    id: "g3_emo_03", level: "grade3", category: "感情動詞 -ing vs -ed", type: "multiple", tricky: true,
    sentence: "The game was really _____.",
    options: ["boring", "bored", "bore", "bores"], answer: "boring",
    explanation: "物・事が主語のとき → -ing（boring ＝退屈させる）。",
  },
  {
    id: "g3_emo_04", level: "grade3", category: "感情動詞 -ing vs -ed", type: "multiple", tricky: true,
    sentence: "She was _____ by the beautiful scenery.",
    options: ["amazed", "amazing", "amaze", "amazes"], answer: "amazed",
    explanation: "人が主語で感情を受ける → 過去分詞（amazed）。",
  },
  {
    id: "g3_emo_05", level: "grade3", category: "感情動詞 -ing vs -ed", type: "multiple", tricky: true,
    sentence: "The movie was so _____ that I cried.",
    options: ["touching", "touched", "touch", "touches"], answer: "touching",
    explanation: "映画（物）が主語で「感動させる」→ -ing（touching）。",
  },
  {
    id: "g3_emo_06", level: "grade3", category: "感情動詞 -ing vs -ed", type: "fill", tricky: true,
    sentence: "I felt very _____ (confuse) when I heard that.",
    answer: "confused", hint: "人が感情を受ける → 過去分詞",
  },
  {
    id: "g3_emo_07", level: "grade3", category: "感情動詞 -ing vs -ed", type: "multiple", tricky: true,
    sentence: "The result was _____ to everyone.",
    options: ["disappointing", "disappointed", "disappoint", "disappoints"], answer: "disappointing",
    explanation: "物（result）が主語 → -ing（disappointing ＝がっかりさせる）。",
  },
  {
    id: "g3_emo_08", level: "grade3", category: "感情動詞 -ing vs -ed", type: "multiple", tricky: true,
    sentence: "I was very _____ to hear that you passed.",
    options: ["pleased", "pleasing", "please", "pleases"], answer: "pleased",
    explanation: "人（I）が感情を受ける → 過去分詞（pleased ＝喜んでいる）。",
  },

  // ───────────────────────────────────────────────
  // ３級 — 現在分詞 vs 過去分詞（判断） ★ひっかけ
  // ───────────────────────────────────────────────
  {
    id: "g3_pv_01", level: "grade3", category: "現在分詞 vs 過去分詞", type: "multiple", tricky: true,
    sentence: "The _____ child was taken to the hospital.",
    options: ["injured", "injuring", "injure", "injures"], answer: "injured",
    explanation: "子供は「負傷させられた」受け身 → 過去分詞（injured）。",
  },
  {
    id: "g3_pv_02", level: "grade3", category: "現在分詞 vs 過去分詞", type: "multiple", tricky: true,
    sentence: "I heard my name _____ from outside.",
    options: ["called", "calling", "call", "calls"], answer: "called",
    explanation: "「名前が呼ばれるのが聞こえた」受け身の関係 → 過去分詞（called）。",
  },
  {
    id: "g3_pv_03", level: "grade3", category: "現在分詞 vs 過去分詞", type: "multiple",
    sentence: "She noticed a man _____ behind her.",
    options: ["following", "followed", "follows", "follow"], answer: "following",
    explanation: "「後ろをついてくる男」能動・進行の意味 → 現在分詞（following）。",
  },
  {
    id: "g3_pv_04", level: "grade3", category: "現在分詞 vs 過去分詞", type: "multiple",
    sentence: "Look at the _____ leaves on the ground.",
    options: ["fallen", "falling", "fall", "fell"], answer: "fallen",
    explanation: "「落ちた葉（地面にある）」完了・結果の状態 → 過去分詞（fallen）。",
  },
  {
    id: "g3_pv_05", level: "grade3", category: "現在分詞 vs 過去分詞", type: "multiple",
    sentence: "The children _____ in the park looked happy.",
    options: ["playing", "played", "plays", "play"], answer: "playing",
    explanation: "「公園で遊んでいる子供たち」能動・進行 → 現在分詞（playing）。",
  },

  // ───────────────────────────────────────────────
  // 準２級 — 関係代名詞 whose
  // ───────────────────────────────────────────────
  {
    id: "p2_whose_01", level: "pre2", category: "関係代名詞 whose", type: "multiple",
    sentence: "She is the author _____ books I love.",
    options: ["whose", "who", "which", "that"], answer: "whose",
    explanation: "先行詞「人」の所有格 → whose。「whose ＋ 名詞」でひとかたまり。",
  },
  {
    id: "p2_whose_02", level: "pre2", category: "関係代名詞 whose", type: "multiple",
    sentence: "He is a scientist _____ discoveries changed the world.",
    options: ["whose", "who", "which", "that"], answer: "whose",
    explanation: "先行詞「人」の所有格 → whose（whose discoveries ＝ his discoveries）。",
  },
  {
    id: "p2_whose_03", level: "pre2", category: "関係代名詞 whose（物）", type: "multiple", tricky: true,
    sentence: "I saw a house _____ roof was red.",
    options: ["whose", "which", "who", "where"], answer: "whose",
    explanation: "先行詞「物（house）」でも所有関係には whose を使う（＝ of which the roof）。物に who は誤り！",
  },
  {
    id: "p2_whose_04", level: "pre2", category: "関係代名詞 whose（物）", type: "multiple", tricky: true,
    sentence: "They built a bridge _____ design won an award.",
    options: ["whose", "which", "who", "that"], answer: "whose",
    explanation: "先行詞「物（bridge）」の所有関係 → whose（＝ of which the design）。",
  },
  {
    id: "p2_whose_05", level: "pre2", category: "関係代名詞 whose", type: "fill",
    sentence: "I met a girl _____ father is a famous singer.",
    answer: "whose", hint: "先行詞「人」の所有格",
  },
  {
    id: "p2_whose_06", level: "pre2", category: "関係代名詞 whose", type: "fill",
    sentence: "She told me about the artist _____ paintings are world famous.",
    answer: "whose", hint: "先行詞「人」の所有格 → whose ＋ 名詞",
  },

  // ───────────────────────────────────────────────
  // 準２級 — 関係副詞 where
  // ───────────────────────────────────────────────
  {
    id: "p2_where_01", level: "pre2", category: "関係副詞 where", type: "multiple",
    sentence: "This is the city _____ I was born.",
    options: ["where", "which", "that", "when"], answer: "where",
    explanation: "先行詞「場所（city）」で副詞の役割 → where（＝ in which）。",
  },
  {
    id: "p2_where_02", level: "pre2", category: "関係副詞 where", type: "multiple",
    sentence: "I want to visit the town _____ Shakespeare was born.",
    options: ["where", "when", "which", "whose"], answer: "where",
    explanation: "先行詞「場所（town）」→ where。",
  },
  {
    id: "p2_where_03", level: "pre2", category: "関係副詞 where", type: "fill",
    sentence: "That is the hospital _____ I work.",
    answer: "where", hint: "先行詞「場所」→ where（＝ in which）",
  },
  {
    id: "p2_where_04", level: "pre2", category: "関係副詞 where vs which", type: "multiple", tricky: true,
    sentence: "This is the hotel _____ we stayed at.",
    options: ["which", "where", "when", "whose"], answer: "which",
    explanation: "「stayed at ___」の at の目的語が必要 → which（目的格）。where なら at は不要になる。",
  },
  {
    id: "p2_where_05", level: "pre2", category: "関係副詞 where vs which", type: "multiple", tricky: true,
    sentence: "The city _____ she lives is famous for its festivals.",
    options: ["where", "which", "in which", "that"], answer: "where",
    explanation: "「she lives in the city」→ in which ＝ where。目的語なし → where。",
  },
  {
    id: "p2_where_06", level: "pre2", category: "関係副詞 where vs which", type: "multiple", tricky: true,
    sentence: "The school _____ I studied was near the station.",
    options: ["where", "which", "who", "that"], answer: "where",
    explanation: "「I studied at the school」→ in/at which ＝ where。目的語なし → where。",
  },
  {
    id: "p2_where_07", level: "pre2", category: "関係副詞 where vs which", type: "multiple", tricky: true,
    sentence: "The office _____ he works in is very modern.",
    options: ["which", "where", "who", "whose"], answer: "which",
    explanation: "「works in ___（目的語）」→ which。文末に in が残る。where なら in は不要。",
  },

  // ───────────────────────────────────────────────
  // 準２級 — 関係副詞 when
  // ───────────────────────────────────────────────
  {
    id: "p2_when_01", level: "pre2", category: "関係副詞 when", type: "multiple",
    sentence: "I remember the day _____ we first met.",
    options: ["when", "where", "which", "whose"], answer: "when",
    explanation: "先行詞「時（day）」で副詞の役割 → when（＝ on which）。",
  },
  {
    id: "p2_when_02", level: "pre2", category: "関係副詞 when", type: "multiple",
    sentence: "There are times _____ I feel lonely.",
    options: ["when", "where", "that", "which"], answer: "when",
    explanation: "先行詞「時（times）」→ when。",
  },
  {
    id: "p2_when_03", level: "pre2", category: "関係副詞 when", type: "fill",
    sentence: "Do you know the year _____ the war ended?",
    answer: "when", hint: "先行詞「年（時）」→ when",
  },
  {
    id: "p2_when_04", level: "pre2", category: "関係副詞 when", type: "multiple",
    sentence: "Spring is the season _____ flowers bloom.",
    options: ["when", "where", "which", "whose"], answer: "when",
    explanation: "先行詞「時・季節（season）」→ when（＝ during which）。",
  },

  // ───────────────────────────────────────────────
  // 準２級 — 関係副詞 why ★ひっかけ
  // ───────────────────────────────────────────────
  {
    id: "p2_why_01", level: "pre2", category: "関係副詞 why", type: "multiple", tricky: true,
    sentence: "I don't know the reason _____ she was absent.",
    options: ["why", "which", "that", "when"], answer: "why",
    explanation: "先行詞が reason のとき → why（＝ for which）。",
  },
  {
    id: "p2_why_02", level: "pre2", category: "関係副詞 why", type: "multiple", tricky: true,
    sentence: "Tell me the reason _____ you left early.",
    options: ["why", "when", "where", "whose"], answer: "why",
    explanation: "先行詞「reason」→ why（＝ for which）。",
  },

  // ───────────────────────────────────────────────
  // 準２級 — 目的格 whom
  // ───────────────────────────────────────────────
  {
    id: "p2_whom_01", level: "pre2", category: "関係代名詞 whom（目的格）", type: "multiple", tricky: true,
    sentence: "The professor _____ I respect most retired last year.",
    options: ["whom", "who", "which", "whose"], answer: "whom",
    explanation: "目的語の役割（I respect him → him ＝ whom）。フォーマルな場面では whom。口語では who/that も可。",
  },
  {
    id: "p2_whom_02", level: "pre2", category: "関係代名詞 whom（目的格）", type: "multiple", tricky: true,
    sentence: "The woman to _____ I spoke was very kind.",
    options: ["whom", "who", "which", "whose"], answer: "whom",
    explanation: "前置詞（to）の直後には必ず whom（who は不可）。",
  },

  // ───────────────────────────────────────────────
  // 準２級 — 前置詞＋関係代名詞 ★ひっかけ
  // ───────────────────────────────────────────────
  {
    id: "p2_prep_01", level: "pre2", category: "前置詞＋関係代名詞", type: "multiple", tricky: true,
    sentence: "The company _____ he works for is well-known.",
    options: ["which", "where", "whose", "when"], answer: "which",
    explanation: "「works for ___（目的語）」→ which。文末に for が残る。where なら for は不要になる。",
  },
  {
    id: "p2_prep_02", level: "pre2", category: "前置詞＋関係代名詞", type: "multiple", tricky: true,
    sentence: "The topic _____ we were talking about is important.",
    options: ["which", "who", "whose", "where"], answer: "which",
    explanation: "「talking about ___（目的語）」→ which（＝ the topic）。",
  },

  // ───────────────────────────────────────────────
  // 準２級 — 非制限用法（コンマあり） ★ひっかけ
  // ───────────────────────────────────────────────
  {
    id: "p2_nonres_01", level: "pre2", category: "非制限用法（コンマあり）", type: "multiple", tricky: true,
    sentence: "My brother, _____ lives in London, is a doctor.",
    options: ["who", "that", "which", "whom"], answer: "who",
    explanation: "コンマあり（非制限用法）では that は使えない！→ who を使う。",
  },
  {
    id: "p2_nonres_02", level: "pre2", category: "非制限用法（コンマあり）", type: "multiple", tricky: true,
    sentence: "She bought a new car, _____ surprised her family.",
    options: ["which", "that", "what", "who"], answer: "which",
    explanation: "コンマ後・非制限用法で前の節全体を先行詞にする → which。that・what は不可。",
  },
  {
    id: "p2_nonres_03", level: "pre2", category: "非制限用法（コンマあり）", type: "multiple", tricky: true,
    sentence: "He passed the exam, _____ surprised everyone.",
    options: ["which", "that", "what", "who"], answer: "which",
    explanation: "前の節全体を先行詞にする非制限用法 → which。",
  },
  {
    id: "p2_nonres_04", level: "pre2", category: "非制限用法（コンマあり）", type: "multiple", tricky: true,
    sentence: "Tokyo, _____ I visited last year, is a great city.",
    options: ["which", "that", "where", "who"], answer: "which",
    explanation: "固有名詞（東京）が先行詞の非制限用法 → which（that は不可）。",
  },
  {
    id: "p2_nonres_05", level: "pre2", category: "非制限用法（コンマあり）", type: "multiple", tricky: true,
    sentence: "She finished first, _____ made her very proud.",
    options: ["which", "that", "what", "it"], answer: "which",
    explanation: "前節全体を先行詞にする非制限用法 → which。that/what/it は不可。",
  },

  // ───────────────────────────────────────────────
  // 準２級 — that のみ使える場合 ★ひっかけ
  // ───────────────────────────────────────────────
  {
    id: "p2_onlythat_01", level: "pre2", category: "that のみ使える場合", type: "multiple", tricky: true,
    sentence: "He was the first man _____ walked on the moon.",
    options: ["that", "who", "which", "whom"], answer: "that",
    explanation: "序数（first）の後は that が好まれる（which は不可）。",
  },
  {
    id: "p2_onlythat_02", level: "pre2", category: "that のみ使える場合", type: "multiple", tricky: true,
    sentence: "She is the most talented singer _____ I have ever heard.",
    options: ["that", "who", "which", "whose"], answer: "that",
    explanation: "最上級（most talented）の後は that が好まれる。",
  },
  {
    id: "p2_onlythat_03", level: "pre2", category: "that のみ使える場合", type: "multiple", tricky: true,
    sentence: "It is the only solution _____ works.",
    options: ["that", "which", "who", "where"], answer: "that",
    explanation: "only の後は that が好まれる（which も文法的には可だが that が標準）。",
  },

  // ───────────────────────────────────────────────
  // 準２級 — 分詞構文
  // ───────────────────────────────────────────────
  {
    id: "p2_part_01", level: "pre2", category: "分詞構文（時）", type: "multiple",
    sentence: "_____ the window, she saw a beautiful rainbow.",
    options: ["Opening", "Opened", "Open", "To open"], answer: "Opening",
    explanation: "「窓を開けたとき」主語（she）が能動的に窓を開ける → 現在分詞（Opening）。",
  },
  {
    id: "p2_part_02", level: "pre2", category: "分詞構文（受け身）", type: "multiple",
    sentence: "_____ in 1990, the bridge is still in good condition.",
    options: ["Built", "Building", "Build", "Being built"], answer: "Built",
    explanation: "橋は「建てられた」受け身の分詞構文 → 過去分詞（Built）。",
  },
  {
    id: "p2_part_03", level: "pre2", category: "分詞構文（理由）", type: "multiple",
    sentence: "_____ tired, I went to bed early.",
    options: ["Feeling", "Felt", "Feel", "To feel"], answer: "Feeling",
    explanation: "「疲れを感じていたので」主語（I）が能動的に感じる → 現在分詞（Feeling）。",
  },
  {
    id: "p2_part_04", level: "pre2", category: "分詞構文（否定）", type: "fill",
    sentence: "_____ (not know) what to do, she called her mother.",
    answer: "Not knowing", hint: "否定の分詞構文は Not ＋ 分詞",
  },
  {
    id: "p2_part_05", level: "pre2", category: "分詞構文（完了形）", type: "multiple", tricky: true,
    sentence: "_____ all his homework, he went out to play.",
    options: ["Having finished", "Finishing", "Finished", "To finish"], answer: "Having finished",
    explanation: "主節の動作より先に完了している場合 → Having ＋ 過去分詞（完了分詞構文）。",
  },
  {
    id: "p2_part_06", level: "pre2", category: "分詞構文（完了形）", type: "multiple", tricky: true,
    sentence: "_____ the letter, she felt much better.",
    options: ["Having read", "Reading", "Read", "Being read"], answer: "Having read",
    explanation: "手紙を読んだ後（より前の出来事）→ Having ＋ 過去分詞（Having read）。",
  },
  {
    id: "p2_part_07", level: "pre2", category: "分詞構文（付帯状況）", type: "multiple",
    sentence: "She walked into the room, _____ a big smile.",
    options: ["wearing", "wore", "worn", "wears"], answer: "wearing",
    explanation: "「大きな笑顔を見せながら」付帯状況の分詞構文 → 現在分詞（wearing）。",
  },
  {
    id: "p2_part_08", level: "pre2", category: "分詞構文（条件）", type: "multiple",
    sentence: "_____ to the left, you will find the post office.",
    options: ["Turning", "Turned", "Turn", "To turn"], answer: "Turning",
    explanation: "「左に曲がると」条件の分詞構文 → 現在分詞（Turning）。",
  },
  {
    id: "p2_part_09", level: "pre2", category: "分詞構文（受け身）", type: "multiple", tricky: true,
    sentence: "_____ from the top of the hill, the view is breathtaking.",
    options: ["Seen", "Seeing", "See", "To see"], answer: "Seen",
    explanation: "「丘の上から見ると」景色は「見られる」受け身 → 過去分詞（Seen）で分詞構文。",
  },
  {
    id: "p2_part_10", level: "pre2", category: "分詞構文（否定・完了）", type: "fill", tricky: true,
    sentence: "_____ (not finish) her work, she stayed late.",
    answer: "Not having finished", hint: "否定＋完了形の分詞構文",
  },

  // ───────────────────────────────────────────────
  // 準２級 — 独立分詞構文 ★ひっかけ
  // ───────────────────────────────────────────────
  {
    id: "p2_abs_01", level: "pre2", category: "独立分詞構文", type: "multiple", tricky: true,
    sentence: "Weather _____ fine, we will go on a picnic.",
    options: ["permitting", "permitted", "permits", "permit"], answer: "permitting",
    explanation: "独立分詞構文（主節と分詞の主語が異なる）。「天気が許せば」→ 現在分詞（permitting）。",
  },
  {
    id: "p2_abs_02", level: "pre2", category: "独立分詞構文（慣用）", type: "multiple", tricky: true,
    sentence: "All things _____, she made the right decision.",
    options: ["considered", "considering", "consider", "considers"], answer: "considered",
    explanation: "慣用的独立分詞構文「All things considered（すべてを考慮すると）」→ 過去分詞。",
  },
  {
    id: "p2_abs_03", level: "pre2", category: "独立分詞構文（慣用）", type: "multiple", tricky: true,
    sentence: "Strictly _____, that is not correct.",
    options: ["speaking", "spoken", "speak", "to speak"], answer: "speaking",
    explanation: "慣用的分詞構文「Strictly speaking（厳密に言えば）」→ 現在分詞（speaking）。",
  },
  {
    id: "p2_abs_04", level: "pre2", category: "独立分詞構文（慣用）", type: "multiple", tricky: true,
    sentence: "_____ frankly, I don't like this plan.",
    options: ["Speaking", "Spoken", "To speak", "Speak"], answer: "Speaking",
    explanation: "慣用的分詞構文「Speaking frankly（率直に言えば）」→ 現在分詞（Speaking）。",
  },

  // ───────────────────────────────────────────────
  // 準２級 — with ＋ 分詞（付帯状況） ★ひっかけ
  // ───────────────────────────────────────────────
  {
    id: "p2_with_01", level: "pre2", category: "with＋分詞（付帯状況）", type: "multiple", tricky: true,
    sentence: "He fell asleep with the TV _____ on.",
    options: ["left", "leaving", "leave", "to leave"], answer: "left",
    explanation: "「TVがつけっぱなしで」TV は「つけられた」状態 → 過去分詞（left）。",
  },
  {
    id: "p2_with_02", level: "pre2", category: "with＋分詞（付帯状況）", type: "multiple", tricky: true,
    sentence: "She was talking with her arms _____.",
    options: ["folded", "folding", "fold", "folds"], answer: "folded",
    explanation: "「腕を組んで」腕は「組まれた」受け身の状態 → 過去分詞（folded）。",
  },
  {
    id: "p2_with_03", level: "pre2", category: "with＋分詞（付帯状況）", type: "multiple", tricky: true,
    sentence: "He sat on the bench with his eyes _____.",
    options: ["closed", "closing", "close", "closes"], answer: "closed",
    explanation: "「目を閉じて」目は「閉じられた」状態 → 過去分詞（closed）。",
  },
  {
    id: "p2_with_04", level: "pre2", category: "with＋分詞（付帯状況）", type: "multiple",
    sentence: "She listens to music with her dog _____ beside her.",
    options: ["sitting", "sat", "sits", "to sit"], answer: "sitting",
    explanation: "「犬が横に座っている状態で」犬が能動的に座っている → 現在分詞（sitting）。",
  },
  {
    id: "p2_with_05", level: "pre2", category: "with＋分詞（付帯状況）", type: "multiple", tricky: true,
    sentence: "He gave a speech with his hands _____ in his pockets.",
    options: ["put", "putting", "puts", "to put"], answer: "put",
    explanation: "「手をポケットに入れた状態で」手は「入れられた」受け身の状態 → 過去分詞（put）。",
  },

  // ───────────────────────────────────────────────
  // 準２級 — spend / have / find ＋ 分詞
  // ───────────────────────────────────────────────
  {
    id: "p2_vp_01", level: "pre2", category: "動詞＋目的語＋分詞", type: "multiple",
    sentence: "He spent the evening _____ novels.",
    options: ["reading", "read", "reads", "to read"], answer: "reading",
    explanation: "「spend ＋ 時間 ＋ 現在分詞」→ 「～して過ごす」。",
  },
  {
    id: "p2_vp_02", level: "pre2", category: "動詞＋目的語＋分詞", type: "multiple", tricky: true,
    sentence: "I found the door _____.",
    options: ["locked", "locking", "lock", "to lock"], answer: "locked",
    explanation: "「find ＋ 目的語 ＋ 過去分詞」→ 「ドアが鍵をかけられているのを見つけた」受け身の状態。",
  },
  {
    id: "p2_vp_03", level: "pre2", category: "動詞＋目的語＋分詞", type: "multiple", tricky: true,
    sentence: "She had her hair _____.",
    options: ["cut", "cutting", "cuts", "to cut"], answer: "cut",
    explanation: "「have ＋ 目的語 ＋ 過去分詞」→ 「（人に）～してもらう」使役表現。",
  },

  // ───────────────────────────────────────────────
  // 準２級 — 関係詞 総合復習
  // ───────────────────────────────────────────────
  {
    id: "p2_rev_01", level: "pre2", category: "関係詞 総合", type: "multiple",
    sentence: "2020 was the year _____ the pandemic started.",
    options: ["when", "where", "which", "whose"], answer: "when",
    explanation: "先行詞「年（時）」→ when。",
  },
  {
    id: "p2_rev_02", level: "pre2", category: "関係詞 総合", type: "multiple",
    sentence: "The museum _____ we visited was built in 1850.",
    options: ["which", "where", "who", "when"], answer: "which",
    explanation: "「visited ___（目的語）」→ which（that も可）。",
  },
  {
    id: "p2_rev_03", level: "pre2", category: "関係詞 総合", type: "multiple",
    sentence: "This is the place _____ the accident happened.",
    options: ["where", "which", "that", "when"], answer: "where",
    explanation: "先行詞「場所（place）」で副詞の役割 → where。",
  },
  {
    id: "p2_rev_04", level: "pre2", category: "関係詞 総合", type: "multiple", tricky: true,
    sentence: "I have no idea _____ she is crying.",
    options: ["why", "which", "where", "whose"], answer: "why",
    explanation: "「no idea why ～」＝「～の理由が全くわからない」。先行詞なしで why を使う。",
  },
  {
    id: "p2_rev_05", level: "pre2", category: "関係詞 総合", type: "multiple", tricky: true,
    sentence: "That is _____ she wants to become — a pilot.",
    options: ["what", "that", "which", "when"], answer: "what",
    explanation: "「彼女がなりたいもの」＝ what she wants to become。先行詞なし → what。",
  },
  {
    id: "p2_rev_06", level: "pre2", category: "関係詞 総合", type: "multiple",
    sentence: "The woman _____ bag was stolen called the police.",
    options: ["whose", "who", "which", "that"], answer: "whose",
    explanation: "先行詞「人（woman）」の所有格 → whose。",
  },
  {
    id: "p2_rev_07", level: "pre2", category: "関係詞 総合", type: "multiple",
    sentence: "I came across a book _____ was very useful.",
    options: ["that", "who", "whose", "where"], answer: "that",
    explanation: "先行詞「物（book）」で主語の役割 → that（which も可）。",
  },
  {
    id: "p2_rev_08", level: "pre2", category: "関係詞 総合", type: "fill",
    sentence: "Tell me the place _____ you hid the key.",
    answer: "where", hint: "先行詞「場所」→ where（副詞の役割）",
  },
];
