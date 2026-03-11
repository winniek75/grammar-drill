import { useState, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════════════════
//  DATA  — 94問
// ═══════════════════════════════════════════════════════════
// type: "TO" | "ING" | "BOTH_TO" | "BOTH_ING"
const ALL_Q = [
  // ── WANT ──
  { id:1,  verb:"want",   type:"TO",  sentence:"I want ___ a pilot someday.",              blank:"to be",        ja:"将来パイロットになりたい。",                     ex:"want + to動詞 = 〜したい（願望・意志）" },
  { id:2,  verb:"want",   type:"TO",  sentence:"She wants ___ a new phone.",               blank:"to buy",       ja:"彼女は新しい電話を買いたがっている。",            ex:"want + to + 動詞の原形。未来の願望。" },
  { id:3,  verb:"want",   type:"TO",  sentence:"Do you want ___ with me?",                 blank:"to come",      ja:"一緒に来たいですか？",                            ex:"want + to + 動詞の原形。" },
  // ── HOPE ──
  { id:4,  verb:"hope",   type:"TO",  sentence:"I hope ___ you again soon.",               blank:"to see",       ja:"またすぐに会えることを願っています。",            ex:"hope + to動詞 = 〜することを望む（期待・希望）" },
  { id:5,  verb:"hope",   type:"TO",  sentence:"She hopes ___ the exam.",                  blank:"to pass",      ja:"彼女は試験に合格することを望んでいる。",          ex:"hope + to + 動詞の原形。将来への期待。" },
  { id:6,  verb:"hope",   type:"TO",  sentence:"We hope ___ there in time.",               blank:"to arrive",    ja:"時間通りに着くことを望んでいます。",              ex:"hope + to arrive。" },
  // ── DECIDE ──
  { id:7,  verb:"decide", type:"TO",  sentence:"He decided ___ a new job.",                blank:"to find",      ja:"彼は新しい仕事を見つけることにした。",            ex:"decide + to動詞 = 〜することを決める（決断）" },
  { id:8,  verb:"decide", type:"TO",  sentence:"They decided ___ abroad.",                 blank:"to study",     ja:"彼らは海外で勉強することに決めた。",              ex:"decide + to + 動詞の原形。決断・選択。" },
  { id:9,  verb:"decide", type:"TO",  sentence:"I decided ___ home early.",                blank:"to go",        ja:"早めに帰宅することにした。",                      ex:"decide + to go。" },
  // ── PLAN ──
  { id:10, verb:"plan",   type:"TO",  sentence:"We plan ___ to Italy next summer.",        blank:"to travel",    ja:"来夏イタリアに旅行する予定です。",                ex:"plan + to動詞 = 〜する予定・計画" },
  { id:11, verb:"plan",   type:"TO",  sentence:"She plans ___ her own company.",           blank:"to start",     ja:"彼女は自分の会社を始める計画だ。",                ex:"plan + to + 動詞の原形。将来の計画。" },
  // ── NEED ──
  { id:12, verb:"need",   type:"TO",  sentence:"You need ___ more sleep.",                 blank:"to get",       ja:"もっと睡眠をとる必要があります。",                ex:"need + to動詞 = 〜する必要がある（必要性）" },
  { id:13, verb:"need",   type:"TO",  sentence:"We need ___ harder.",                      blank:"to work",      ja:"もっと頑張る必要がある。",                        ex:"need + to + 動詞の原形。" },
  { id:14, verb:"need",   type:"TO",  sentence:"She needs ___ a doctor.",                  blank:"to see",       ja:"彼女は医者に診てもらう必要がある。",              ex:"need + to see。" },
  // ── PROMISE ──
  { id:15, verb:"promise",type:"TO",  sentence:"He promised ___ on time.",                 blank:"to arrive",    ja:"彼は時間通りに来ると約束した。",                  ex:"promise + to動詞 = 〜することを約束する" },
  { id:16, verb:"promise",type:"TO",  sentence:"I promise ___ you every day.",             blank:"to call",      ja:"毎日電話することを約束します。",                  ex:"promise + to + 動詞の原形。" },
  // ── AGREE ──
  { id:17, verb:"agree",  type:"TO",  sentence:"She agreed ___ us at noon.",               blank:"to meet",      ja:"彼女は正午に会うことに合意した。",                ex:"agree + to動詞 = 〜することに同意する" },
  { id:18, verb:"agree",  type:"TO",  sentence:"They agreed ___ the project.",             blank:"to join",      ja:"彼らはプロジェクトに参加することに同意した。",    ex:"agree + to + 動詞の原形。" },
  // ── REFUSE ──
  { id:19, verb:"refuse", type:"TO",  sentence:"He refused ___ sorry.",                    blank:"to say",       ja:"彼はごめんなさいと言うことを拒んだ。",            ex:"refuse + to動詞 = 〜することを拒否する" },
  { id:20, verb:"refuse", type:"TO",  sentence:"She refused ___ the offer.",               blank:"to accept",    ja:"彼女はその申し出を受け入れることを断った。",      ex:"refuse + to + 動詞の原形。" },
  // ── OFFER ──
  { id:21, verb:"offer",  type:"TO",  sentence:"He offered ___ me home.",                  blank:"to drive",     ja:"彼は私を家まで車で送ることを申し出た。",          ex:"offer + to動詞 = 〜することを申し出る" },
  { id:22, verb:"offer",  type:"TO",  sentence:"She offered ___ with the bags.",           blank:"to help",      ja:"彼女は荷物を手伝うことを申し出た。",              ex:"offer + to + 動詞の原形。" },
  // ── CHOOSE ──
  { id:23, verb:"choose", type:"TO",  sentence:"She chose ___ alone.",                     blank:"to live",      ja:"彼女は1人で暮らすことを選んだ。",                 ex:"choose + to動詞 = 〜することを選ぶ（選択）" },
  { id:24, verb:"choose", type:"TO",  sentence:"He chose ___ the truth.",                  blank:"to tell",      ja:"彼は真実を話すことを選んだ。",                    ex:"choose + to + 動詞の原形。" },
  // ── MANAGE ──
  { id:25, verb:"manage", type:"TO",  sentence:"She managed ___ despite the rain.",        blank:"to run",       ja:"雨にもかかわらずなんとか走ることができた。",      ex:"manage + to動詞 = なんとか〜できる（困難を乗り越えて達成）" },
  { id:26, verb:"manage", type:"TO",  sentence:"He managed ___ first place.",              blank:"to take",      ja:"彼はなんとか1位をとることができた。",             ex:"manage + to + 動詞の原形。" },
  // ── FAIL ──
  { id:27, verb:"fail",   type:"TO",  sentence:"He failed ___ the test.",                  blank:"to pass",      ja:"彼は試験に合格できなかった。",                    ex:"fail + to動詞 = 〜できなかった（失敗・不能）" },
  { id:28, verb:"fail",   type:"TO",  sentence:"She failed ___ the deadline.",             blank:"to meet",      ja:"彼女は締め切りに間に合わなかった。",              ex:"fail + to + 動詞の原形。" },
  // ── EXPECT ──
  { id:29, verb:"expect", type:"TO",  sentence:"I expect ___ you there.",                  blank:"to see",       ja:"そこであなたに会えると思っています。",            ex:"expect + to動詞 = 〜すると予想する・期待する" },
  { id:30, verb:"expect", type:"TO",  sentence:"She expects ___ the prize.",               blank:"to win",       ja:"彼女は賞をとると期待している。",                  ex:"expect + to + 動詞の原形。" },
  // ── AFFORD ──
  { id:31, verb:"afford", type:"TO",  sentence:"We can't afford ___ a new car.",           blank:"to buy",       ja:"新しい車を買う余裕がない。",                      ex:"afford + to動詞 = 〜する余裕がある（主にcan't affordで使う）" },
  { id:32, verb:"afford", type:"TO",  sentence:"I can't afford ___ any mistakes.",         blank:"to make",      ja:"ミスをする余裕はない。",                          ex:"can't afford + to + 動詞の原形。" },
  // ── APPEAR / SEEM ──
  { id:33, verb:"appear", type:"TO",  sentence:"She appears ___ very confident.",          blank:"to be",        ja:"彼女はとても自信があるように見える。",            ex:"appear + to動詞 = 〜のように見える・思われる" },
  { id:34, verb:"seem",   type:"TO",  sentence:"He seems ___ a good person.",              blank:"to be",        ja:"彼は良い人のようだ。",                            ex:"seem + to + 動詞の原形。" },
  // ── PREPARE ──
  { id:35, verb:"prepare",type:"TO",  sentence:"She prepared ___ a speech.",               blank:"to give",      ja:"彼女はスピーチをする準備をした。",                ex:"prepare + to動詞 = 〜する準備をする" },

  // ── ENJOY ──
  { id:36, verb:"enjoy",  type:"ING", sentence:"I enjoy ___ in the rain.",                 blank:"walking",      ja:"雨の中を歩くのが好きだ。",                        ex:"enjoy + -ing = 〜することを楽しむ（必ずing！）" },
  { id:37, verb:"enjoy",  type:"ING", sentence:"She enjoys ___ new recipes.",              blank:"trying",       ja:"彼女は新しいレシピを試すのを楽しんでいる。",      ex:"enjoy + -ing。楽しむ行為 → ing。" },
  { id:38, verb:"enjoy",  type:"ING", sentence:"He enjoys ___ to old songs.",              blank:"listening",    ja:"彼は古い歌を聴くのを楽しんでいる。",              ex:"enjoy + listening。" },
  // ── FINISH ──
  { id:39, verb:"finish", type:"ING", sentence:"Did you finish ___ your essay?",           blank:"writing",      ja:"エッセイを書き終えましたか？",                    ex:"finish + -ing = 〜し終える（完了のイメージ → ing）" },
  { id:40, verb:"finish", type:"ING", sentence:"He finished ___ dinner and left.",         blank:"eating",       ja:"彼は夕食を食べ終えて去った。",                    ex:"finish + eating。完了 → ing。" },
  { id:41, verb:"finish", type:"ING", sentence:"Please finish ___ before the meeting.",   blank:"reading",      ja:"会議の前に読み終えてください。",                  ex:"finish + reading。" },
  // ── KEEP ──
  { id:42, verb:"keep",   type:"ING", sentence:"Keep ___ — don't stop now!",               blank:"going",        ja:"続けて — 今やめないで！",                         ex:"keep + -ing = 〜し続ける（継続のイメージ → ing）" },
  { id:43, verb:"keep",   type:"ING", sentence:"She keeps ___ the same mistake.",          blank:"making",       ja:"彼女は同じミスを繰り返している。",                ex:"keep + making。継続 → ing。" },
  { id:44, verb:"keep",   type:"ING", sentence:"He kept ___ even when tired.",             blank:"running",      ja:"疲れてもずっと走り続けた。",                      ex:"keep + running。" },
  // ── AVOID ──
  { id:45, verb:"avoid",  type:"ING", sentence:"Try to avoid ___ too much sugar.",         blank:"eating",       ja:"砂糖の食べすぎを避けましょう。",                  ex:"avoid + -ing = 〜するのを避ける" },
  { id:46, verb:"avoid",  type:"ING", sentence:"He avoids ___ to crowded places.",         blank:"going",        ja:"彼は混んだ場所に行くのを避ける。",                ex:"avoid + going。回避 → ing。" },
  { id:47, verb:"avoid",  type:"ING", sentence:"She avoided ___ him at the party.",        blank:"meeting",      ja:"彼女はパーティーで彼に会うのを避けた。",          ex:"avoid + meeting。" },
  // ── MIND ──
  { id:48, verb:"mind",   type:"ING", sentence:"Do you mind ___ the door?",                blank:"closing",      ja:"ドアを閉めていただけますか？",                    ex:"mind + -ing = 〜するのが嫌か（Do you mind -ing? は丁寧なお願い）" },
  { id:49, verb:"mind",   type:"ING", sentence:"I don't mind ___ a little longer.",        blank:"waiting",      ja:"もう少し待つのは構いません。",                    ex:"don't mind + waiting。" },
  { id:50, verb:"mind",   type:"ING", sentence:"Would you mind ___ it again?",             blank:"explaining",   ja:"もう一度説明していただけますか？",                ex:"mind + explaining。" },
  // ── MISS ──
  { id:51, verb:"miss",   type:"ING", sentence:"I miss ___ lunch with you.",               blank:"having",       ja:"あなたとランチをしていたことが懐かしい。",        ex:"miss + -ing = 〜しないことが残念・〜を恋しく思う" },
  { id:52, verb:"miss",   type:"ING", sentence:"She misses ___ her friends.",              blank:"seeing",       ja:"彼女は友達に会えなくて寂しい。",                  ex:"miss + seeing。恋しい → ing。" },
  // ── CONSIDER ──
  { id:53, verb:"consider",type:"ING",sentence:"We're considering ___ abroad.",            blank:"living",       ja:"海外に住むことを検討しています。",                ex:"consider + -ing = 〜することを検討する・考慮する" },
  { id:54, verb:"consider",type:"ING",sentence:"She is considering ___ her job.",          blank:"changing",     ja:"彼女は仕事を変えることを考えている。",            ex:"consider + changing。検討 → ing。" },
  // ── SUGGEST ──
  { id:55, verb:"suggest",type:"ING", sentence:"He suggested ___ by train.",               blank:"going",        ja:"彼は電車で行くことを提案した。",                  ex:"suggest + -ing = 〜することを提案する" },
  { id:56, verb:"suggest",type:"ING", sentence:"She suggested ___ a break.",               blank:"taking",       ja:"彼女は休憩をとることを提案した。",                ex:"suggest + taking。提案 → ing。" },
  // ── PRACTICE ──
  { id:57, verb:"practice",type:"ING",sentence:"You should practice ___ aloud.",           blank:"reading",      ja:"声に出して読む練習をするべきだ。",                ex:"practice + -ing = 〜する練習をする" },
  { id:58, verb:"practice",type:"ING",sentence:"He practices ___ kanji every day.",        blank:"writing",      ja:"彼は毎日漢字を書く練習をしている。",              ex:"practice + writing。練習 → ing。" },
  // ── DELAY / PUT OFF ──
  { id:59, verb:"delay",  type:"ING", sentence:"Don't delay ___ the doctor.",              blank:"seeing",       ja:"医者に行くのを先延ばしにしないで。",              ex:"delay + -ing = 〜することを遅らせる" },
  { id:60, verb:"put off",type:"ING", sentence:"He put off ___ his homework.",             blank:"doing",        ja:"彼は宿題をやるのを先延ばしにした。",              ex:"put off + -ing = 〜するのを後回しにする" },
  // ── GIVE UP ──
  { id:61, verb:"give up",type:"ING", sentence:"Never give up ___ your goal.",             blank:"chasing",      ja:"目標を追いかけることをあきらめないで。",          ex:"give up + -ing = 〜するのをあきらめる" },
  { id:62, verb:"give up",type:"ING", sentence:"She gave up ___ meat.",                    blank:"eating",       ja:"彼女は肉を食べるのをやめた。",                    ex:"give up + eating。諦め・中断 → ing。" },
  // ── IMAGINE ──
  { id:63, verb:"imagine",type:"ING", sentence:"Can you imagine ___ on the moon?",         blank:"walking",      ja:"月の上を歩くことを想像できますか？",              ex:"imagine + -ing = 〜することを想像する" },
  { id:64, verb:"imagine",type:"ING", sentence:"I can't imagine ___ without music.",       blank:"living",       ja:"音楽なしで生きることが想像できない。",            ex:"imagine + living。" },
  // ── DISLIKE ──
  { id:65, verb:"dislike",type:"ING", sentence:"He dislikes ___ to school early.",         blank:"going",        ja:"彼は早く学校に行くのが嫌いだ。",                  ex:"dislike + -ing = 〜するのが嫌い" },
  // ── LOOK FORWARD TO ──
  { id:66, verb:"look forward to",type:"ING", sentence:"I look forward to ___ you soon.", blank:"seeing",       ja:"近いうちにあなたに会えるのを楽しみにしています。", ex:"look forward to + -ing\nto は前置詞なのでingが続く！（to不定詞ではない）" },
  { id:67, verb:"look forward to",type:"ING", sentence:"She looks forward to ___ her family.", blank:"visiting", ja:"彼女は家族に会いに行くのを楽しみにしている。",   ex:"look forward to + visiting。to＝前置詞 → ing！" },
  // ── SPEND TIME -ING ──
  { id:68, verb:"spend ... -ing",type:"ING", sentence:"He spends hours ___ video games.",  blank:"playing",      ja:"彼は何時間もゲームをして過ごす。",                ex:"spend + 時間 + -ing = 〜して時間を過ごす" },
  { id:69, verb:"spend ... -ing",type:"ING", sentence:"She spent all day ___ her room.",   blank:"cleaning",     ja:"彼女は1日中部屋の掃除をして過ごした。",          ex:"spend all day + cleaning。時間 + ing。" },

  // ═══ BOTH: REMEMBER ═══
  { id:70, verb:"remember", type:"BOTH_ING", bothHint:"過去に会ったことを覚えている", bothLabel:"過去の記憶",
    sentence:"I remember ___ her for the first time.", blank:"meeting",
    ja:"初めて彼女に会ったことを覚えている。",
    ex:"remember + -ing = 過去にしたことを覚えている\n（すでに起きた出来事の記憶）" },
  { id:71, verb:"remember", type:"BOTH_TO",  bothHint:"これから窓を閉めること＝やるべきタスク", bothLabel:"これからやること",
    sentence:"Please remember ___ the windows.", blank:"to close",
    ja:"忘れずに窓を閉めてください。",
    ex:"remember + to動詞 = これからすることを忘れないようにする\n（未来の行動を覚えておく）" },
  { id:72, verb:"remember", type:"BOTH_ING", bothHint:"以前ここに来た経験の記憶", bothLabel:"過去の記憶",
    sentence:"Do you remember ___ to this place before?", blank:"coming",
    ja:"以前ここに来たことを覚えていますか？",
    ex:"remember + coming = 過去の経験の記憶。" },
  { id:73, verb:"remember", type:"BOTH_TO",  bothHint:"明日持ってくべき行動＝未来のタスク", bothLabel:"これからやること",
    sentence:"Remember ___ your lunch box tomorrow.", blank:"to bring",
    ja:"明日お弁当箱を忘れずに持ってきてください。",
    ex:"remember + to bring = 未来の行動を忘れないように。" },
  { id:74, verb:"remember", type:"BOTH_ING", bothHint:"子供の頃に見た思い出", bothLabel:"過去の記憶",
    sentence:"I remember ___ that movie as a child.", blank:"watching",
    ja:"子供の頃にその映画を見たことを覚えている。",
    ex:"remember + watching = 過去に見た記憶がある。" },
  { id:75, verb:"remember", type:"BOTH_TO",  bothHint:"電気を消すこと＝やるべき行動", bothLabel:"これからやること",
    sentence:"Did you remember ___ off the lights?", blank:"to turn",
    ja:"電気を消したか確認しましたか？",
    ex:"remember + to turn = やるべきことを覚えていたか。" },

  // ═══ BOTH: FORGET ═══
  { id:76, verb:"forget", type:"BOTH_ING", bothHint:"パリで暮らした過去の体験", bothLabel:"過去の出来事",
    sentence:"I'll never forget ___ in Paris.", blank:"living",
    ja:"パリで暮らしたことは決して忘れない。",
    ex:"forget + -ing = 過去にしたことを忘れる\n（もう経験済みのことへの忘却）" },
  { id:77, verb:"forget", type:"BOTH_TO",  bothHint:"持ってくるべき行動を忘れないよう注意", bothLabel:"これからやること",
    sentence:"Don't forget ___ your passport!", blank:"to bring",
    ja:"パスポートを忘れずに持ってきて！",
    ex:"forget + to動詞 = これからすべきことを忘れる\n（未来の行動を忘れてしまう）" },
  { id:78, verb:"forget", type:"BOTH_ING", bothHint:"生で聞いたという過去の体験", bothLabel:"過去の出来事",
    sentence:"She'll never forget ___ that song live.", blank:"hearing",
    ja:"あの曲を生で聞いたことを彼女は決して忘れない。",
    ex:"forget + hearing = 過去に聞いた体験を忘れる。" },
  { id:79, verb:"forget", type:"BOTH_TO",  bothHint:"誕生日を祝うという行動を忘れた", bothLabel:"これからやること",
    sentence:"He forgot ___ her birthday.", blank:"to celebrate",
    ja:"彼は彼女の誕生日を祝うのを忘れた。",
    ex:"forget + to celebrate = すべきことをするのを忘れた。" },
  { id:80, verb:"forget", type:"BOTH_ING", bothHint:"先週手紙を書いたという過去の行動", bothLabel:"過去の出来事",
    sentence:"I forgot ___ to him last week.", blank:"writing",
    ja:"先週彼に手紙を書いたのをすっかり忘れていた。",
    ex:"forget + writing = 過去にしたことを（一時的に）忘れていた。" },

  // ═══ BOTH: STOP ═══
  { id:81, verb:"stop", type:"BOTH_ING", bothHint:"煙草を吸う習慣を終わらせた", bothLabel:"動作を中止・やめる",
    sentence:"She stopped ___ because of her health.", blank:"smoking",
    ja:"健康のために煙草を吸うのをやめた。",
    ex:"stop + -ing = 〜するのをやめる\n（やっていた動作を中断・終了）" },
  { id:82, verb:"stop", type:"BOTH_TO",  bothHint:"パン屋に寄るという目的のために立ち止まった", bothLabel:"〜するために立ち止まる",
    sentence:"He stopped ___ his favorite bakery.", blank:"to visit",
    ja:"彼はお気に入りのパン屋を訪れるために立ち止まった。",
    ex:"stop + to動詞 = 〜するために（別の動作を）止まる\n（目的・理由を表すto不定詞）" },
  { id:83, verb:"stop", type:"BOTH_ING", bothHint:"話すという行為をやめてほしいお願い", bothLabel:"動作を中止・やめる",
    sentence:"Please stop ___ — I'm trying to sleep.", blank:"talking",
    ja:"静かにして — 寝ようとしているんだから。",
    ex:"stop + talking = 話すのをやめる。" },
  { id:84, verb:"stop", type:"BOTH_TO",  bothHint:"カフェで休憩することが目的で立ち寄った", bothLabel:"〜するために立ち止まる",
    sentence:"We stopped ___ at a café on the way.", blank:"to rest",
    ja:"途中でカフェに休憩のために立ち寄った。",
    ex:"stop + to rest = 休むために（移動を）止まった。" },
  { id:85, verb:"stop", type:"BOTH_ING", bothHint:"泣くという行為が終わった", bothLabel:"動作を中止・やめる",
    sentence:"The baby finally stopped ___ at midnight.", blank:"crying",
    ja:"赤ちゃんはやっと夜中に泣くのをやめた。",
    ex:"stop + crying = 泣くのをやめる。" },

  // ═══ BOTH: TRY ═══
  { id:86, verb:"try", type:"BOTH_ING", bothHint:"塩を少なめにした場合の結果を試してみる", bothLabel:"試しに〜してみる（実験）",
    sentence:"Try ___ less salt in the recipe.", blank:"using",
    ja:"レシピで塩を少なめに使ってみてください。",
    ex:"try + -ing = 試しに〜してみる\n（実験・試み。実際にやってみるイメージ）" },
  { id:87, verb:"try", type:"BOTH_TO",  bothHint:"鍵がかかっていて開けられなかった＝努力したが失敗", bothLabel:"〜しようと努力する",
    sentence:"I tried ___ the door but it was locked.", blank:"to open",
    ja:"ドアを開けようとしたが、鍵がかかっていた。",
    ex:"try + to動詞 = 〜しようと努力する\n（成功するかわからない努力・挑戦）" },
  { id:88, verb:"try", type:"BOTH_ING", bothHint:"抹茶アイスという新しいものを経験として試す", bothLabel:"試しに〜してみる（実験）",
    sentence:"Have you tried ___ matcha ice cream?", blank:"eating",
    ja:"抹茶アイスクリームを食べてみたことはありますか？",
    ex:"try + eating = 試しに食べてみる。体験のtry + ing。" },
  { id:89, verb:"try", type:"BOTH_TO",  bothHint:"誰に対しても親切でいようと日々努力している", bothLabel:"〜しようと努力する",
    sentence:"She tries ___ kind to everyone.", blank:"to be",
    ja:"彼女は誰に対しても親切にしようとしている。",
    ex:"try + to be = 〜であろうと努力する。継続的な努力。" },
  { id:90, verb:"try", type:"BOTH_ING", bothHint:"アプリを一度使って試してみるよう勧めている", bothLabel:"試しに〜してみる（実験）",
    sentence:"Try ___ the app — it's really useful.", blank:"using",
    ja:"そのアプリを使ってみて — 本当に便利だよ。",
    ex:"try + using = 試しに使ってみる。" },

  // ═══ BOTH: REGRET ═══
  { id:91, verb:"regret", type:"BOTH_ING", bothHint:"過去にゲームに時間を使いすぎたことへの後悔", bothLabel:"過去の行動を後悔",
    sentence:"I regret ___ so much time on games.", blank:"spending",
    ja:"ゲームにこんなに時間を使ったことを後悔している。",
    ex:"regret + -ing = 過去にしたことを後悔する\n（もうやってしまったことへの反省）" },
  { id:92, verb:"regret", type:"BOTH_TO",  bothHint:"公式な場でイベント中止のお知らせをしている", bothLabel:"残念ながら〜をお知らせする",
    sentence:"We regret ___ that the event is canceled.", blank:"to inform",
    ja:"残念ながらイベントが中止になったことをお知らせします。",
    ex:"regret + to動詞 = 残念ながら〜する\n（フォーマルな場面で使う表現）" },
  { id:93, verb:"regret", type:"BOTH_ING", bothHint:"友達を失ったという過去の結果への後悔", bothLabel:"過去の行動を後悔",
    sentence:"She regrets ___ her old friends.", blank:"losing",
    ja:"彼女は昔の友達を失ったことを後悔している。",
    ex:"regret + losing = 過去の行動・結果を後悔。" },
  { id:94, verb:"regret", type:"BOTH_TO",  bothHint:"出席できないという残念なことをフォーマルに伝える", bothLabel:"残念ながら〜をお知らせする",
    sentence:"I regret ___ that I cannot attend.", blank:"to say",
    ja:"残念ながら出席できないことをお伝えします。",
    ex:"regret + to say = フォーマルに残念な情報を伝える。" },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const MODES = {
  basic:  { key:"basic",  icon:"📖", title:"基礎練習",       sub:"to動詞 vs 動詞ing の2択", color:"#00d4aa", count:20, time:null,
            pool: () => shuffle(ALL_Q.filter(q => q.type === "TO" || q.type === "ING")).slice(0, 20) },
  both:   { key:"both",   icon:"🔄", title:"BOTH 使い分け",   sub:"同じ動詞でも意味が変わる！", color:"#a78bfa", count:16, time:null,
            pool: () => shuffle(ALL_Q.filter(q => q.type === "BOTH_TO" || q.type === "BOTH_ING")).slice(0, 16) },
  attack: { key:"attack", icon:"⚡", title:"タイムアタック",   sub:"12秒制限・全問題から出題", color:"#f59e0b", count:25, time:12,
            pool: () => shuffle(ALL_Q).slice(0, 25) },
};

// ─── CSS ─────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700;900&family=Sora:wght@300;400;600;700;800;900&family=Space+Mono:wght@400;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { min-height: 100%; }
  body { background: #060810; font-family: 'Sora', 'Noto Sans JP', sans-serif; }

  .btn { cursor: pointer; border: none; outline: none; transition: transform .12s, filter .12s; }
  .btn:hover:not(:disabled) { transform: translateY(-2px); filter: brightness(1.1); }
  .btn:active:not(:disabled) { transform: scale(.96); }
  .btn:disabled { cursor: default; }

  .pop   { animation: pop    .32s cubic-bezier(.34,1.56,.64,1); }
  @keyframes pop    { from{transform:scale(.7);opacity:0} to{transform:scale(1);opacity:1} }

  .slide-up { animation: slideUp .35s cubic-bezier(.22,1,.36,1); }
  @keyframes slideUp { from{transform:translateY(22px);opacity:0} to{transform:translateY(0);opacity:1} }

  .shake { animation: shake .4s ease; }
  @keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-10px)} 40%{transform:translateX(10px)} 60%{transform:translateX(-6px)} 80%{transform:translateX(6px)} }

  .fade-in { animation: fadeIn .3s ease; }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }

  .float { animation: floatUp 1.3s ease-out forwards; pointer-events: none; }
  @keyframes floatUp { 0%{transform:translateY(0) scale(1);opacity:1} 100%{transform:translateY(-80px) scale(.4);opacity:0} }

  .combo-pop { animation: comboPop .45s cubic-bezier(.34,1.56,.64,1); }
  @keyframes comboPop { 0%{transform:scale(0) rotate(-18deg)} 60%{transform:scale(1.15) rotate(4deg)} 100%{transform:scale(1) rotate(0)} }

  .blink { animation: blink .5s ease infinite alternate; }
  @keyframes blink { from{opacity:1} to{opacity:.4} }

  .choice-btn {
    cursor: pointer; transition: all .13s ease;
    border-radius: 16px; padding: 16px 12px;
    text-align: center; background: #0d111a; border: 2px solid #141926;
  }
  .choice-btn:hover:not(:disabled) { transform: translateY(-3px) scale(1.02); border-color: #252d3a !important; }
  .choice-btn:active:not(:disabled) { transform: scale(.96); }
  .choice-btn:disabled { cursor: default; }

  .scroll { overflow-y: auto; }
  .scroll::-webkit-scrollbar { width: 3px; }
  .scroll::-webkit-scrollbar-thumb { background: #1e2535; border-radius: 2px; }
`;

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen,     setScreen]     = useState("home");
  const [activeMode, setActiveMode] = useState(null);
  const [questions,  setQuestions]  = useState([]);
  const [qIdx,       setQIdx]       = useState(0);
  const [answered,   setAnswered]   = useState(null);
  const [score,      setScore]      = useState(0);
  const [combo,      setCombo]      = useState(0);
  const [maxCombo,   setMaxCombo]   = useState(0);
  const [wrongIds,   setWrongIds]   = useState([]);
  const [particles,  setParticles]  = useState([]);
  const [qKey,       setQKey]       = useState(0);
  const [timeLeft,   setTimeLeft]   = useState(12);
  const [accuracy,   setAccuracy]   = useState(0);
  const [records,    setRecords]    = useState({ basic:0, both:0, attack:0 });
  const [bestCombos, setBestCombos] = useState({ basic:0, both:0, attack:0 });

  const advRef   = useRef(null);
  const timerRef = useRef(null);
  const optsRef  = useRef([]);
  const comboRef = useRef(0);
  const timeLRef = useRef(12);

  const curQ = questions[qIdx];
  const cfg  = activeMode ? MODES[activeMode] : null;
  const hasTimer = !!cfg?.time;

  function buildOpts(q) {
    if (!q) return [];
    const blank   = q.blank;
    const isTO    = blank.startsWith("to ");
    const rawVerb = isTO ? blank.slice(3) : blank;
    let ing;
    if (rawVerb.endsWith("ing")) {
      ing = rawVerb;
    } else if (rawVerb.endsWith("e") && !rawVerb.endsWith("ee") && !rawVerb.endsWith("oe")) {
      ing = rawVerb.slice(0, -1) + "ing";
    } else if (/[^aeiou][aeiou][bdgmnprst]$/.test(rawVerb)) {
      ing = rawVerb + rawVerb.slice(-1) + "ing";
    } else {
      ing = rawVerb + "ing";
    }
    const toForm = isTO ? blank : "to " + rawVerb;
    const isBoth = q.type.startsWith("BOTH");
    const correctType = q.type === "BOTH_TO" ? "TO" : q.type === "BOTH_ING" ? "ING" : q.type;
    const toOpt  = { label: toForm, type:"TO",  hint: isBoth ? (q.type === "BOTH_TO"  ? q.bothLabel : "別の意味") : null };
    const ingOpt = { label: ing,    type:"ING", hint: isBoth ? (q.type === "BOTH_ING" ? q.bothLabel : "別の意味") : null };
    // Randomize left/right position each time
    return Math.random() < 0.5 ? [toOpt, ingOpt] : [ingOpt, toOpt];
  }

  const startGame = (modeKey, retryWrong = false) => {
    const c = MODES[modeKey];
    const pool = retryWrong && wrongIds.length
      ? shuffle(ALL_Q.filter(q => wrongIds.includes(q.id)))
      : c.pool();
    setActiveMode(modeKey);
    setQuestions(pool);
    setQIdx(0); setScore(0); setCombo(0); setMaxCombo(0);
    setWrongIds([]); setParticles([]); setAnswered(null);
    setQKey(k => k + 1); setTimeLeft(c.time ?? 12);
    comboRef.current = 0; timeLRef.current = c.time ?? 12;
    optsRef.current = buildOpts(pool[0]);
    setScreen("play");
  };

  const advance = useCallback(() => {
    const next = qIdx + 1;
    if (next >= questions.length) { setScreen("result"); return; }
    setAnswered(null); setQIdx(next); setQKey(k => k + 1);
    optsRef.current = buildOpts(questions[next]);
  }, [qIdx, questions]);

  // timer effect
  useEffect(() => {
    if (screen !== "play" || !hasTimer || answered) { clearInterval(timerRef.current); return; }
    const dur = cfg.time;
    setTimeLeft(dur); timeLRef.current = dur;
    timerRef.current = setInterval(() => {
      timeLRef.current -= 1;
      setTimeLeft(timeLRef.current);
      if (timeLRef.current <= 0) { clearInterval(timerRef.current); handleTimeout(); }
    }, 1000);
    return () => clearInterval(timerRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, qIdx, answered, hasTimer]);

  const handleTimeout = useCallback(() => {
    if (!curQ) return;
    clearInterval(timerRef.current);
    setAnswered({ chosenType: "__TIMEOUT__", correct: false, timeout: true });
    setCombo(0); comboRef.current = 0;
    setWrongIds(w => w.includes(curQ.id) ? w : [...w, curQ.id]);
    spawnParticles(false);
    // Timeout → wait for user to press 次へ (no auto-advance)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curQ, advance]);

  function spawnParticles(ok) {
    const emojis = ok ? ["⭐","✨","💫","🎯","🔥"] : ["💨","😅"];
    const np = Array.from({ length: ok ? 5 : 2 }, (_, i) => ({
      id: Date.now() + i,
      e: emojis[Math.floor(Math.random() * emojis.length)],
      x: 25 + Math.random() * 50,
      delay: Math.random() * 0.25,
    }));
    setParticles(p => [...p, ...np]);
    setTimeout(() => setParticles(p => p.filter(pp => !np.find(n => n.id === pp.id))), 1600);
  }

  const handleAnswer = useCallback((opt) => {
    if (answered || !curQ) return;
    clearInterval(timerRef.current);
    clearTimeout(advRef.current);
    const correctType = curQ.type === "BOTH_TO" ? "TO" : curQ.type === "BOTH_ING" ? "ING" : curQ.type;
    const ok = opt.type === correctType;
    setAnswered({ chosenType: opt.type, correct: ok, timeout: false });
    spawnParticles(ok);
    if (ok) {
      const tb  = hasTimer ? Math.max(0, timeLRef.current - 1) * 8 : 0;
      const nc  = comboRef.current + 1;
      const mul = nc >= 10 ? 3 : nc >= 6 ? 2 : nc >= 3 ? 1.5 : 1;
      const pts = Math.round((100 + tb) * mul);
      comboRef.current = nc;
      setCombo(nc); setMaxCombo(mc => Math.max(mc, nc));
      setScore(s => s + pts);
      // Correct → wait for user to press 次へ (no auto-advance)
    } else {
      comboRef.current = 0; setCombo(0);
      setWrongIds(w => w.includes(curQ.id) ? w : [...w, curQ.id]);
      // Wrong → wait for user to press 次へ (no auto-advance)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answered, curQ, hasTimer, advance]);

  useEffect(() => () => { clearTimeout(advRef.current); clearInterval(timerRef.current); }, []);
  useEffect(() => { if (curQ) optsRef.current = buildOpts(curQ); }, [qIdx, questions]); // eslint-disable-line

  useEffect(() => {
    if (screen === "result" && activeMode) {
      const acc = Math.round(((questions.length - wrongIds.length) / questions.length) * 100);
      setAccuracy(acc);
      setRecords(r  => ({ ...r,  [activeMode]: Math.max(r[activeMode],  score) }));
      setBestCombos(b => ({ ...b, [activeMode]: Math.max(b[activeMode], maxCombo) }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen]);

  const opts = optsRef.current.length === 2 ? optsRef.current : (curQ ? buildOpts(curQ) : []);

  return (
    <div style={{ minHeight:"100vh", background:"#060810", fontFamily:"'Sora','Noto Sans JP',sans-serif", position:"relative", overflowX:"hidden" }}>
      <style>{CSS}</style>
      <BgGrid />

      {screen === "home"   && <HomeScreen   onMode={m => { setActiveMode(m); setScreen("rules"); }} records={records} bestCombos={bestCombos} />}
      {screen === "rules"  && cfg && <RulesScreen mode={cfg} onStart={() => startGame(activeMode)} onBack={() => setScreen("home")} />}
      {screen === "play"   && curQ && (
        <PlayScreen
          q={curQ} qIdx={qIdx} total={questions.length} opts={opts}
          answered={answered} score={score} combo={combo}
          timeLeft={timeLeft} hasTimer={hasTimer} cfg={cfg}
          particles={particles} qKey={qKey}
          onAnswer={handleAnswer}
          onAdvance={advance}
          onBack={() => { clearInterval(timerRef.current); clearTimeout(advRef.current); setScreen("home"); }}
        />
      )}
      {screen === "result" && (
        <ResultScreen
          questions={questions} wrongIds={wrongIds} score={score}
          maxCombo={maxCombo} accuracy={accuracy} cfg={cfg}
          onRestart={() => startGame(activeMode)}
          onRetry={wrongIds.length > 0 ? () => startGame(activeMode, true) : null}
          onHome={() => setScreen("home")}
          records={records} bestCombos={bestCombos}
        />
      )}
    </div>
  );
}

// ─── BG GRID ──────────────────────────────────────────────
function BgGrid() {
  return (
    <div style={{ position:"fixed", inset:0, zIndex:0, overflow:"hidden", pointerEvents:"none" }}>
      <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(0,212,170,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,170,.025) 1px,transparent 1px)", backgroundSize:"48px 48px" }} />
      <div style={{ position:"absolute", top:"12%", left:"8%", width:360, height:360, borderRadius:"50%", background:"radial-gradient(circle,rgba(0,212,170,.055) 0%,transparent 70%)" }} />
      <div style={{ position:"absolute", bottom:"15%", right:"8%", width:280, height:280, borderRadius:"50%", background:"radial-gradient(circle,rgba(167,139,250,.045) 0%,transparent 70%)" }} />
    </div>
  );
}

// ─── BACK BUTTON ─────────────────────────────────────────
function BackBtn({ onBack }) {
  return (
    <button className="btn" onClick={onBack} style={{
      position:"fixed", top:12, left:12, zIndex:200,
      padding:"8px 14px", borderRadius:10, border:"1px solid #1e2535",
      background:"rgba(6,8,16,.9)", backdropFilter:"blur(8px)",
      color:"#555", fontSize:13, fontFamily:"Space Mono",
      display:"flex", alignItems:"center", gap:6, cursor:"pointer",
    }}>
      ← 戻る
    </button>
  );
}

// ─── HOME SCREEN ─────────────────────────────────────────
function HomeScreen({ onMode, records, bestCombos }) {
  const toN   = ALL_Q.filter(q => q.type === "TO").length;
  const ingN  = ALL_Q.filter(q => q.type === "ING").length;
  const bothN = ALL_Q.filter(q => q.type.startsWith("BOTH")).length;

  return (
    <div className="scroll" style={{ position:"relative", zIndex:1, minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px 20px" }}>
      <div style={{ textAlign:"center", marginBottom:28 }}>
        <div style={{ width:64, height:64, borderRadius:18, background:"linear-gradient(135deg,#00d4aa,#0ea5e9)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:30, fontWeight:900, color:"#060810", margin:"0 auto 16px", boxShadow:"0 0 36px rgba(0,212,170,.3)" }}>動</div>
        <div style={{ fontSize:11, fontFamily:"Space Mono", color:"#00d4aa", letterSpacing:4, marginBottom:10 }}>VERB PATTERN MASTERY</div>
        <h1 style={{ fontSize:"clamp(30px,7vw,48px)", fontWeight:900, color:"#fff", letterSpacing:-1, lineHeight:1.1, marginBottom:8 }}>
          Verb<span style={{ color:"#00d4aa" }}>Form</span> <span style={{ color:"#a78bfa" }}>Battle</span>
        </h1>
        <p style={{ fontSize:13, color:"#666", lineHeight:1.8 }}>
          英検4〜3級　全{ALL_Q.length}問収録<br />
          <span style={{ color:"#2a3040", fontSize:12 }}>TO {toN}問 ／ ING {ingN}問 ／ BOTH {bothN}問</span>
        </p>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:10, width:"100%", maxWidth:440 }}>
        {Object.values(MODES).map(m => (
          <ModeCard key={m.key} m={m} best={records[m.key]} combo={bestCombos[m.key]} onClick={() => onMode(m.key)} />
        ))}
      </div>

      <div style={{ marginTop:24, display:"flex", gap:12, flexWrap:"wrap", justifyContent:"center" }}>
        {[
          { l:"TO動詞",   v:toN+"問",   c:"#f59e0b" },
          { l:"ING動詞",  v:ingN+"問",  c:"#00d4aa" },
          { l:"BOTH使い分け", v:bothN+"問", c:"#a78bfa" },
        ].map((s, i) => (
          <div key={i} style={{ textAlign:"center", padding:"10px 16px", borderRadius:10, background:"#0a0e16", border:"1px solid #151c28" }}>
            <div style={{ fontSize:10, color:"#444", fontFamily:"Space Mono", marginBottom:4 }}>{s.l}</div>
            <div style={{ fontSize:18, fontWeight:900, color:s.c }}>{s.v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ModeCard({ m, best, combo, onClick }) {
  const C = { basic:"#00d4aa", both:"#a78bfa", attack:"#f59e0b" }[m.key];
  return (
    <button className="btn" onClick={onClick} style={{ padding:"16px 18px", borderRadius:16, background:"#0a0e16", border:`1px solid ${C}1e`, display:"flex", alignItems:"center", gap:14, textAlign:"left", width:"100%", cursor:"pointer" }}>
      <div style={{ fontSize:26, width:44, textAlign:"center", flexShrink:0 }}>{m.icon}</div>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:15, fontWeight:800, color:"#fff", marginBottom:2 }}>{m.title}</div>
        <div style={{ fontSize:12, color:"#555" }}>{m.sub}</div>
        {(best > 0 || combo > 0) && (
          <div style={{ display:"flex", gap:10, marginTop:5 }}>
            {best  > 0 && <span style={{ fontSize:11, color:C, fontFamily:"Space Mono" }}>BEST {best.toLocaleString()}pt</span>}
            {combo > 0 && <span style={{ fontSize:11, color:"#444", fontFamily:"Space Mono" }}>COMBO ×{combo}</span>}
          </div>
        )}
      </div>
      <div style={{ color:C, fontSize:11, fontFamily:"Space Mono", letterSpacing:1, flexShrink:0 }}>{m.count}問 →</div>
    </button>
  );
}

// ─── RULES SCREEN ────────────────────────────────────────
function RulesScreen({ mode, onStart, onBack }) {
  const isBoth   = mode.key === "both";
  const isAttack = mode.key === "attack";

  return (
    <div style={{ position:"relative", zIndex:1, minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"60px 20px 40px" }}>
      <BackBtn onBack={onBack} />
      <div className="pop" style={{ textAlign:"center", width:"100%", maxWidth:460 }}>
        <div style={{ fontSize:44, marginBottom:10 }}>{mode.icon}</div>
        <h2 style={{ fontSize:26, fontWeight:900, color:"#fff", marginBottom:6 }}>{mode.title}</h2>
        <p style={{ fontSize:13, color:"#555", marginBottom:28, lineHeight:1.8 }}>{mode.sub}</p>

        {isBoth ? (
          <div style={{ textAlign:"left", marginBottom:20 }}>
            <div style={{ fontSize:11, color:"#a78bfa", fontFamily:"Space Mono", letterSpacing:3, textAlign:"center", marginBottom:14 }}>BOTH ルール解説</div>
            {[
              { v:"remember", to:"これからやることを覚えておく",         ing:"過去にしたことを覚えている" },
              { v:"forget",   to:"これからやることを忘れる",              ing:"過去にしたことを忘れる" },
              { v:"stop",     to:"〜するために立ち止まる",                ing:"〜するのをやめる" },
              { v:"try",      to:"〜しようと努力する",                    ing:"試しに〜してみる（実験）" },
              { v:"regret",   to:"残念ながら〜する（フォーマル）",        ing:"過去にしたことを後悔する" },
            ].map((r, i) => (
              <div key={i} style={{ marginBottom:10, padding:"12px 14px", borderRadius:12, background:"#0a0e16", border:"1px solid #141926" }}>
                <div style={{ fontSize:13, fontWeight:800, color:"#a78bfa", marginBottom:8, fontFamily:"Space Mono" }}>{r.v}</div>
                <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                  <div style={{ flex:1, minWidth:130, padding:"8px 10px", borderRadius:8, background:"#f59e0b0c", border:"1px solid #f59e0b2e" }}>
                    <div style={{ fontSize:10, color:"#f59e0b", fontFamily:"Space Mono", marginBottom:3 }}>TO + 動詞</div>
                    <div style={{ fontSize:12, color:"#ccc" }}>{r.to}</div>
                  </div>
                  <div style={{ flex:1, minWidth:130, padding:"8px 10px", borderRadius:8, background:"#00d4aa0c", border:"1px solid #00d4aa2e" }}>
                    <div style={{ fontSize:10, color:"#00d4aa", fontFamily:"Space Mono", marginBottom:3 }}>動詞 + ING</div>
                    <div style={{ fontSize:12, color:"#ccc" }}>{r.ing}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign:"left", marginBottom:20 }}>
            <div style={{ display:"flex", gap:10, marginBottom:14 }}>
              <RBox color="#f59e0b" title="TO + 動詞" rows={["want/hope/plan/decide","need/promise/agree/offer","choose/refuse/fail/manage","expect/afford/prepare/seem"]} sub="意志・願望・計画・目標" />
              <RBox color="#00d4aa" title="動詞 + ING" rows={["enjoy/finish/keep/avoid","mind/miss/consider/suggest","practice/give up/imagine","look forward to / put off"]} sub="楽しむ・完了・継続・回避" />
            </div>
            {isAttack && (
              <div style={{ padding:"12px 14px", borderRadius:12, background:"#f59e0b08", border:"1px solid #f59e0b2e" }}>
                <div style={{ fontSize:11, color:"#f59e0b", fontFamily:"Space Mono", marginBottom:6 }}>⚡ TIME ATTACK ルール</div>
                <div style={{ fontSize:12, color:"#888", lineHeight:1.8 }}>
                  ・1問{mode.time}秒制限<br />
                  ・早く答えるほどボーナスPt（残り秒数×8）<br />
                  ・コンボ継続で倍率UP（3x→×1.5 / 6x→×2 / 10x→×3）<br />
                  ・時間切れは自動不正解
                </div>
              </div>
            )}
          </div>
        )}

        <button className="btn" onClick={onStart} style={{ padding:"14px 52px", borderRadius:12, border:"none", background:`linear-gradient(135deg,${mode.color},${mode.color}bb)`, color:"#060810", fontSize:16, fontWeight:800, letterSpacing:2, cursor:"pointer" }}>
          START ▶
        </button>
      </div>
    </div>
  );
}

function RBox({ color, title, rows, sub }) {
  return (
    <div style={{ flex:1, padding:"12px 14px", borderRadius:12, background:`${color}08`, border:`1px solid ${color}2e` }}>
      <div style={{ fontSize:10, color, fontFamily:"Space Mono", letterSpacing:2, marginBottom:8 }}>{title}</div>
      {rows.map((r, i) => <div key={i} style={{ fontSize:11, color:"#888", marginBottom:2 }}>{r}</div>)}
      <div style={{ fontSize:10, color:"#444", marginTop:6 }}>{sub}</div>
    </div>
  );
}

// ─── PLAY SCREEN ─────────────────────────────────────────
function PlayScreen({ q, qIdx, total, opts, answered, score, combo, timeLeft, hasTimer, cfg, particles, qKey, onAnswer, onAdvance, onBack }) {
  const correctType = q.type === "BOTH_TO" ? "TO" : q.type === "BOTH_ING" ? "ING" : q.type;
  const isBoth      = q.type.startsWith("BOTH");
  const progPct     = (qIdx / total) * 100;
  const timerCrit   = hasTimer && timeLeft <= 4;
  const timerColor  = timerCrit ? "#ef4444" : timeLeft <= 7 ? "#f59e0b" : "#00d4aa";
  const timerPct    = hasTimer ? (timeLeft / cfg.time) * 100 : 100;

  return (
    <div style={{ position:"relative", zIndex:1, minHeight:"100vh", display:"flex", flexDirection:"column", paddingBottom:24 }}>
      <BackBtn onBack={onBack} />

      {/* Particles */}
      <div style={{ position:"fixed", top:"36%", left:0, right:0, zIndex:100, pointerEvents:"none" }}>
        {particles.map(p => (
          <div key={p.id} className="float" style={{ position:"absolute", left:`${p.x}%`, fontSize:24, animationDelay:`${p.delay}s` }}>{p.e}</div>
        ))}
      </div>

      {/* Header */}
      <div style={{ padding:"14px 60px 6px 60px", display:"flex", alignItems:"center", gap:10 }}>
        <div style={{ flex:1, height:4, background:"#0d111a", borderRadius:2, overflow:"hidden" }}>
          <div style={{ height:"100%", width:`${progPct}%`, background:"linear-gradient(90deg,#00d4aa,#0ea5e9)", borderRadius:2, transition:"width .4s ease" }} />
        </div>
        <span style={{ fontSize:11, fontFamily:"Space Mono", color:"#444", whiteSpace:"nowrap" }}>{qIdx+1}/{total}</span>
        <span style={{ fontSize:13, fontFamily:"Space Mono", color:"#00d4aa", fontWeight:700, minWidth:68, textAlign:"right" }}>{score.toLocaleString()}pt</span>
      </div>

      {/* Timer */}
      {hasTimer && (
        <div style={{ padding:"4px 20px 2px" }}>
          <div style={{ height:6, background:"#0d111a", borderRadius:3, overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${timerPct}%`, background:`linear-gradient(90deg,${timerColor},${timerColor}88)`, borderRadius:3, transition:"width 1s linear,background .5s" }} />
          </div>
          <div style={{ textAlign:"center", marginTop:3 }}>
            <span className={timerCrit ? "blink" : ""} style={{ fontSize:18, fontWeight:900, fontFamily:"Space Mono", color:timerColor }}>{timeLeft}</span>
            <span style={{ fontSize:10, color:"#333", fontFamily:"Space Mono", marginLeft:3 }}>sec</span>
          </div>
        </div>
      )}

      {/* Combo badge */}
      {combo >= 3 && (
        <div className="combo-pop" style={{ textAlign:"center", marginBottom:2 }}>
          <span style={{ display:"inline-block", padding:"3px 14px", borderRadius:20, background:combo>=10?"#f59e0b1a":"#f59e0b0c", border:`1px solid ${combo>=10?"#f59e0b":"#f59e0b44"}`, fontSize:12, fontFamily:"Space Mono", color:"#f59e0b", letterSpacing:2 }}>
            🔥 {combo}x COMBO{combo>=10?" — MAX!":combo>=6?" — ×2":combo>=3?" — ×1.5":""}
          </span>
        </div>
      )}

      {/* Verb tag */}
      <div style={{ textAlign:"center", margin:"6px 0 2px" }}>
        <span style={{ display:"inline-block", padding:"4px 16px", borderRadius:20, background:"#0d111a", border:`1px solid ${isBoth?"#a78bfa44":"#1e2535"}`, color:isBoth?"#a78bfa":"#444", fontSize:11, fontFamily:"Space Mono", letterSpacing:3 }}>
          {q.verb.toUpperCase()}{isBoth ? " — BOTH!" : ""}
        </span>
      </div>

      {/* Question card */}
      <div className="slide-up" key={`q${qKey}`} style={{ margin:"6px 14px", padding:"20px 18px", borderRadius:18, background:"#0a0e16", border:"1px solid #141926", boxShadow:"0 14px 44px rgba(0,0,0,.5)" }}>
        <div style={{ fontSize:10, color:"#2a3040", fontFamily:"Space Mono", letterSpacing:3, marginBottom:14 }}>Q{qIdx+1} — {cfg?.title}</div>
        <div style={{ fontSize:"clamp(16px,4vw,22px)", color:"#ddd", lineHeight:1.85, fontWeight:400, marginBottom:12 }}>
          {q.sentence.split("___").map((part, i, arr) => (
            <span key={i}>
              {part}
              {i < arr.length - 1 && (
                <span style={{
                  display:"inline-block", minWidth:108, textAlign:"center",
                  borderBottom:`3px solid ${answered ? (answered.correct ? "#00d4aa" : "#ef4444") : "#1e2535"}`,
                  color: answered ? (answered.correct ? "#00d4aa" : "#ef4444") : "transparent",
                  fontWeight:900, transition:"all .3s", paddingBottom:1,
                  fontSize:"clamp(14px,3.8vw,20px)",
                }}>
                  {answered ? q.blank : "　　"}
                </span>
              )}
            </span>
          ))}
        </div>
        <div style={{ fontSize:13, color:"#444", fontFamily:"Noto Sans JP" }}>{q.ja}</div>
        {isBoth && !answered && (
          <div style={{ marginTop:10, padding:"8px 12px", borderRadius:8, background:"#a78bfa0a", border:"1px solid #a78bfa1e" }}>
            <div style={{ fontSize:10, color:"#a78bfa", fontFamily:"Space Mono", letterSpacing:2, marginBottom:2 }}>HINT</div>
            <div style={{ fontSize:12, color:"#777" }}>{q.bothHint}</div>
          </div>
        )}
      </div>

      {/* Choice buttons */}
      <div key={`o${qKey}`} style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, margin:"0 14px" }}>
        {opts.map((opt, i) => {
          const isTO    = opt.type === "TO";
          const RC      = isTO ? "#f59e0b" : "#00d4aa";
          const isChosen  = answered?.chosenType === opt.type;
          const isCorrect = opt.type === correctType;
          let bdr = "#141926", bg = "#0d111a", tc = "#ccc", extra = "choice-btn";
          if (answered) {
            if (isCorrect)              { bg = `${RC}14`; bdr = RC; tc = RC; }
            else if (isChosen && !answered.correct) { bg = "#ef444410"; bdr = "#ef4444"; tc = "#ef4444"; extra += " shake"; }
            else                        { bdr = "#0d111a"; tc = "#2a3040"; }
          }
          return (
            <button key={i} className={extra} disabled={!!answered} onClick={() => onAnswer(opt)}
              style={{ background:bg, borderColor:bdr, color:tc }}>
              <div style={{ fontSize:10, color: answered && !isCorrect && !isChosen ? "#1e2535" : RC, fontFamily:"Space Mono", letterSpacing:2, marginBottom:5, transition:"color .3s" }}>
                {isTO ? "to + 動詞" : "動詞 + ing"}
              </div>
              <div style={{ fontSize:"clamp(15px,4vw,21px)", fontWeight:800, letterSpacing:.5, lineHeight:1.2 }}>{opt.label}</div>
              {isBoth && opt.hint && answered && (
                <div style={{ fontSize:10, marginTop:5, color: isTO ? "#f59e0b66" : "#00d4aa66", fontFamily:"Noto Sans JP" }}>{opt.hint}</div>
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {answered && (
        <div className="fade-in" style={{ margin:"10px 14px 0", padding:"12px 14px", borderRadius:14, background:answered.correct?"#00d4aa0a":"#ef44440a", border:`1px solid ${answered.correct?"#00d4aa2e":"#ef44442e"}` }}>
          <div style={{ fontSize:12, fontWeight:800, color: answered.correct ? "#00d4aa" : answered.timeout ? "#f59e0b" : "#ef4444", marginBottom:5, fontFamily:"Space Mono" }}>
            {answered.timeout ? "⏱ TIME'S UP!" : answered.correct ? `✓ CORRECT!${combo >= 3 ? ` — ${combo}x COMBO` : ""}` : "✗ INCORRECT"}
          </div>
          <div style={{ fontSize:12, color:"#777", lineHeight:1.8, fontFamily:"Noto Sans JP", whiteSpace:"pre-line" }}>{q.ex}</div>
          <button
              className="btn"
              onClick={onAdvance}
              style={{
                marginTop:14, width:"100%", padding:"12px",
                borderRadius:10, border:"none",
                background: answered.correct
                  ? "linear-gradient(135deg,#00d4aa,#0ea5e9)"
                  : "linear-gradient(135deg,#ef4444,#f97316)",
                color:"#fff", fontSize:14, fontWeight:800,
                letterSpacing:1, cursor:"pointer",
                display:"flex", alignItems:"center", justifyContent:"center", gap:8,
              }}
            >
              {answered.correct ? "確認した　→　次の問題へ" : "理解した　→　次の問題へ"}
            </button>
        </div>
      )}
    </div>
  );
}

// ─── RESULT SCREEN ───────────────────────────────────────
function ResultScreen({ questions, wrongIds, score, maxCombo, accuracy, cfg, onRestart, onRetry, onHome, records, bestCombos }) {
  const total       = questions.length;
  const wrongCount  = wrongIds.length;
  const rank = accuracy >= 95 ? "S" : accuracy >= 80 ? "A" : accuracy >= 65 ? "B" : "C";
  const RC   = { S:"#f59e0b", A:"#00d4aa", B:"#60a5fa", C:"#a78bfa" }[rank];
  const RE   = { S:"🏆", A:"⭐", B:"👍", C:"💪" }[rank];
  const newScore = score > 0 && score >= records[cfg.key];
  const newCombo = maxCombo >= 3 && maxCombo >= bestCombos[cfg.key];
  const wrongVerbs = [...new Set(wrongIds.map(id => ALL_Q.find(q => q.id === id)?.verb).filter(Boolean))];

  return (
    <div className="scroll" style={{ position:"relative", zIndex:1, minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px 20px" }}>
      <div className="pop" style={{ textAlign:"center", width:"100%", maxWidth:440 }}>
        <div style={{ fontSize:60, marginBottom:6, filter:`drop-shadow(0 0 18px ${RC})` }}>{RE}</div>
        <div style={{ fontSize:48, fontWeight:900, color:RC, fontFamily:"Space Mono", lineHeight:1 }}>RANK {rank}</div>
        <div style={{ fontSize:12, color:"#444", fontFamily:"Space Mono", marginBottom:16 }}>{cfg?.title} — {total}問</div>

        <div style={{ display:"flex", gap:8, justifyContent:"center", marginBottom:16, flexWrap:"wrap" }}>
          {newScore && <span style={{ padding:"4px 12px", borderRadius:20, background:"#f59e0b18", border:"1px solid #f59e0b", fontSize:11, color:"#f59e0b", fontFamily:"Space Mono" }}>🏅 NEW BEST!</span>}
          {newCombo && <span style={{ padding:"4px 12px", borderRadius:20, background:"#a78bfa18", border:"1px solid #a78bfa", fontSize:11, color:"#a78bfa", fontFamily:"Space Mono" }}>🔥 BEST COMBO!</span>}
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:10, marginBottom:16 }}>
          {[
            { l:"スコア",     v: score.toLocaleString()+"pt", c:"#00d4aa" },
            { l:"正解率",     v: accuracy+"%",                  c: RC },
            { l:"最大コンボ", v: maxCombo+"x",                  c:"#f59e0b" },
            { l:"ミス",       v: wrongCount+"問",               c: wrongCount===0?"#00d4aa":"#ef4444" },
          ].map((s, i) => (
            <div key={i} style={{ padding:"12px 14px", borderRadius:12, background:"#0a0e16", border:"1px solid #141926", textAlign:"center" }}>
              <div style={{ fontSize:10, color:"#444", fontFamily:"Space Mono", letterSpacing:2, marginBottom:4 }}>{s.l}</div>
              <div style={{ fontSize:20, fontWeight:900, color:s.c }}>{s.v}</div>
            </div>
          ))}
        </div>

        {wrongVerbs.length > 0 && (
          <div style={{ marginBottom:16, padding:"12px 14px", borderRadius:12, background:"#0a0e16", border:"1px solid #141926", textAlign:"left" }}>
            <div style={{ fontSize:10, color:"#444", fontFamily:"Space Mono", letterSpacing:2, marginBottom:8 }}>まちがえた動詞</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
              {wrongVerbs.map((v, i) => (
                <span key={i} style={{ padding:"4px 10px", borderRadius:6, background:"#ef444410", border:"1px solid #ef44442e", fontSize:12, color:"#f87171", fontWeight:700 }}>{v}</span>
              ))}
            </div>
          </div>
        )}

        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          <button className="btn" onClick={onRestart} style={{ padding:"13px", borderRadius:12, border:"none", background:`linear-gradient(135deg,${cfg?.color},${cfg?.color}bb)`, color:"#060810", fontSize:15, fontWeight:800, letterSpacing:2, cursor:"pointer" }}>
            もう一度
          </button>
          {onRetry && (
            <button className="btn" onClick={onRetry} style={{ padding:"13px", borderRadius:12, border:"2px solid #ef444440", background:"#ef44440a", color:"#f87171", fontSize:14, fontWeight:700, cursor:"pointer" }}>
              ミスのみ再挑戦 ({wrongIds.length}問)
            </button>
          )}
          <button className="btn" onClick={onHome} style={{ padding:"13px", borderRadius:12, border:"1px solid #1e2535", background:"transparent", color:"#444", fontSize:14, cursor:"pointer" }}>
            ← ホームへ戻る
          </button>
        </div>
      </div>
    </div>
  );
}
