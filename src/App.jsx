import { useState, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════════════════
//  AUDIO — Web Audio API sound effects
// ═══════════════════════════════════════════════════════════
let _audioCtx = null;
function getAudioCtx() {
  if (!_audioCtx) _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (_audioCtx.state === "suspended") _audioCtx.resume();
  return _audioCtx;
}

/** Correct answer chime: C-E-G triad (sine wave, gain 0.2, 0.3s each, 0.1s spacing) */
function playCorrectChime() {
  try {
    const ctx = getAudioCtx();
    const notes = [523.25, 659.25, 783.99];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.value = 0.2;
      osc.connect(gain);
      gain.connect(ctx.destination);
      const start = ctx.currentTime + i * 0.1;
      osc.start(start);
      gain.gain.setValueAtTime(0.2, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.3);
      osc.stop(start + 0.3);
    });
  } catch (_) { /* audio not available */ }
}

/** Wrong answer sound: square wave, 150Hz->100Hz sweep, 0.2s */
function playWrongBuzz() {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.2);
  } catch (_) { /* audio not available */ }
}

/** TTS: speak an English sentence using Web Speech API */
function speakEnglish(text) {
  try {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = "en-US";
    utt.rate = 0.9;
    utt.pitch = 1;
    // Try to pick an English voice
    const voices = window.speechSynthesis.getVoices();
    const enVoice = voices.find(v => v.lang.startsWith("en"));
    if (enVoice) utt.voice = enVoice;
    window.speechSynthesis.speak(utt);
  } catch (_) { /* TTS not available */ }
}

// ═══════════════════════════════════════════════════════════
//  LOCALSTORAGE — persistence helpers
// ═══════════════════════════════════════════════════════════
const LS_RECORDS     = "vfb_records";
const LS_COMBOS      = "vfb_bestCombos";
const LS_WRONG_LOG   = "vfb_wrongLog";   // persistent wrong-answer log for review

function lsGet(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
}
function lsSet(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* quota */ }
}

/** Append wrong answers from a session to the persistent log */
function appendWrongLog(wrongIds, questions) {
  const log = lsGet(LS_WRONG_LOG, []);
  const ts = Date.now();
  wrongIds.forEach(id => {
    const q = questions.find(qq => qq.id === id);
    if (!q) return;
    log.push({ id: q.id, verb: q.verb, sentence: q.sentence, blank: q.blank, type: q.type, ts });
  });
  // Keep last 200 entries
  lsSet(LS_WRONG_LOG, log.slice(-200));
}

// ═══════════════════════════════════════════════════════════
//  DATA  — 94問
// ═══════════════════════════════════════════════════════════
// type: "TO" | "ING" | "BOTH_TO" | "BOTH_ING"
const ALL_Q = [
  // ── WANT ──
  { id:1,  verb:"want",   type:"TO",  sentence:"I want ___ a pilot someday.",              blank:"to be",        ja:"将来パイロットになりたい。",                     ex:"【want + to + 動詞】= 「〜したい」\nwant はこれからしたいことを表すよ。\nまだやっていない「未来のこと」だから to を使うんだ！\n✅ I want to be ..." },
  { id:2,  verb:"want",   type:"TO",  sentence:"She wants ___ a new phone.",               blank:"to buy",       ja:"彼女は新しい電話を買いたがっている。",            ex:"【want + to + 動詞】= 「〜したい」\n「買いたい」はまだ買っていない＝未来のこと。\nwant のあとには必ず to がくるよ！\n✅ She wants to buy ..." },
  { id:3,  verb:"want",   type:"TO",  sentence:"Do you want ___ with me?",                 blank:"to come",      ja:"一緒に来たいですか？",                            ex:"【want + to + 動詞】= 「〜したい」\n「来たい？」はこれからのこと。\nwant のうしろは いつも to + 動詞 だよ！\n✅ Do you want to come ...?" },
  // ── HOPE ──
  { id:4,  verb:"hope",   type:"TO",  sentence:"I hope ___ you again soon.",               blank:"to see",       ja:"またすぐに会えることを願っています。",            ex:"【hope + to + 動詞】= 「〜したいと願う」\nhope は「こうなってほしいな」という気持ち。\nまだ起きていない未来のことだから to を使うよ！\n✅ I hope to see ..." },
  { id:5,  verb:"hope",   type:"TO",  sentence:"She hopes ___ the exam.",                  blank:"to pass",      ja:"彼女は試験に合格することを望んでいる。",          ex:"【hope + to + 動詞】= 「〜することを願う」\n「受かりたい！」は未来の夢・期待。\nhope のあとは to + 動詞 だよ。\n✅ She hopes to pass ..." },
  { id:6,  verb:"hope",   type:"TO",  sentence:"We hope ___ there in time.",               blank:"to arrive",    ja:"時間通りに着くことを望んでいます。",              ex:"【hope + to + 動詞】= 「〜できればいいな」\n「間に合いたい」は未来への期待。\nhope はいつも to + 動詞 とセットだよ！\n✅ We hope to arrive ..." },
  // ── DECIDE ──
  { id:7,  verb:"decide", type:"TO",  sentence:"He decided ___ a new job.",                blank:"to find",      ja:"彼は新しい仕事を見つけることにした。",            ex:"【decide + to + 動詞】= 「〜することに決める」\n「よし、やろう！」と決断するのは未来の行動。\n決めた → これからやる → to！\n✅ He decided to find ..." },
  { id:8,  verb:"decide", type:"TO",  sentence:"They decided ___ abroad.",                 blank:"to study",     ja:"彼らは海外で勉強することに決めた。",              ex:"【decide + to + 動詞】= 「〜することに決める」\n「留学しよう！」と決めた＝これからのこと。\ndecide のあとは to + 動詞 だよ。\n✅ They decided to study ..." },
  { id:9,  verb:"decide", type:"TO",  sentence:"I decided ___ home early.",                blank:"to go",        ja:"早めに帰宅することにした。",                      ex:"【decide + to + 動詞】= 「〜することに決める」\n「早く帰ろう」と決めた＝これからの行動。\ndecide は必ず to とセットだよ！\n✅ I decided to go ..." },
  // ── PLAN ──
  { id:10, verb:"plan",   type:"TO",  sentence:"We plan ___ to Italy next summer.",        blank:"to travel",    ja:"来夏イタリアに旅行する予定です。",                ex:"【plan + to + 動詞】= 「〜する予定」\n計画はこれからやること＝未来！\n未来のことだから to を使うよ。\n✅ We plan to travel ..." },
  { id:11, verb:"plan",   type:"TO",  sentence:"She plans ___ her own company.",           blank:"to start",     ja:"彼女は自分の会社を始める計画だ。",                ex:"【plan + to + 動詞】= 「〜する計画がある」\n「これからやるぞ！」という計画＝未来。\nplan のあとは to + 動詞 だよ。\n✅ She plans to start ..." },
  // ── NEED ──
  { id:12, verb:"need",   type:"TO",  sentence:"You need ___ more sleep.",                 blank:"to get",       ja:"もっと睡眠をとる必要があります。",                ex:"【need + to + 動詞】= 「〜する必要がある」\n「もっと寝なきゃ！」＝これからやるべきこと。\nneed のあとは to + 動詞 だよ。\n✅ You need to get ..." },
  { id:13, verb:"need",   type:"TO",  sentence:"We need ___ harder.",                      blank:"to work",      ja:"もっと頑張る必要がある。",                        ex:"【need + to + 動詞】= 「〜する必要がある」\n「頑張らなきゃ！」＝これからやること。\nneed は必ず to + 動詞 とセットだよ！\n✅ We need to work ..." },
  { id:14, verb:"need",   type:"TO",  sentence:"She needs ___ a doctor.",                  blank:"to see",       ja:"彼女は医者に診てもらう必要がある。",              ex:"【need + to + 動詞】= 「〜する必要がある」\n「お医者さんに行かなきゃ」＝未来の行動。\nneed + to はセットで覚えよう！\n✅ She needs to see ..." },
  // ── PROMISE ──
  { id:15, verb:"promise",type:"TO",  sentence:"He promised ___ on time.",                 blank:"to arrive",    ja:"彼は時間通りに来ると約束した。",                  ex:"【promise + to + 動詞】= 「〜すると約束する」\n約束するのは「これからすること」だよね。\n未来のことだから to を使うんだ！\n✅ He promised to arrive ..." },
  { id:16, verb:"promise",type:"TO",  sentence:"I promise ___ you every day.",             blank:"to call",      ja:"毎日電話することを約束します。",                  ex:"【promise + to + 動詞】= 「〜すると約束する」\n「毎日電話するね！」という未来の約束。\npromise + to はセットだよ！\n✅ I promise to call ..." },
  // ── AGREE ──
  { id:17, verb:"agree",  type:"TO",  sentence:"She agreed ___ us at noon.",               blank:"to meet",      ja:"彼女は正午に会うことに合意した。",                ex:"【agree + to + 動詞】= 「〜することに賛成する」\n「いいよ！」とOKした＝これからやること。\nagree のあとは to + 動詞 だよ。\n✅ She agreed to meet ..." },
  { id:18, verb:"agree",  type:"TO",  sentence:"They agreed ___ the project.",             blank:"to join",      ja:"彼らはプロジェクトに参加することに同意した。",    ex:"【agree + to + 動詞】= 「〜することに賛成する」\n「参加しよう！」と決めた＝未来のこと。\nagree + to はセットで覚えよう！\n✅ They agreed to join ..." },
  // ── REFUSE ──
  { id:19, verb:"refuse", type:"TO",  sentence:"He refused ___ sorry.",                    blank:"to say",       ja:"彼はごめんなさいと言うことを拒んだ。",            ex:"【refuse + to + 動詞】= 「〜するのを断る」\n「やだ！やらない！」と拒否する＝未来のこと。\nrefuse のあとは to + 動詞 だよ。\n✅ He refused to say ..." },
  { id:20, verb:"refuse", type:"TO",  sentence:"She refused ___ the offer.",               blank:"to accept",    ja:"彼女はその申し出を受け入れることを断った。",      ex:"【refuse + to + 動詞】= 「〜するのを断る」\n「受け入れない！」と拒否＝未来の行動の拒否。\nrefuse + to はセットだよ！\n✅ She refused to accept ..." },
  // ── OFFER ──
  { id:21, verb:"offer",  type:"TO",  sentence:"He offered ___ me home.",                  blank:"to drive",     ja:"彼は私を家まで車で送ることを申し出た。",          ex:"【offer + to + 動詞】= 「〜しましょうか？と申し出る」\n「送ってあげるよ！」＝これからやること。\noffer のあとは to + 動詞 だよ。\n✅ He offered to drive ..." },
  { id:22, verb:"offer",  type:"TO",  sentence:"She offered ___ with the bags.",           blank:"to help",      ja:"彼女は荷物を手伝うことを申し出た。",              ex:"【offer + to + 動詞】= 「〜しましょうかと申し出る」\n「手伝うよ！」と言った＝未来の行動。\noffer + to はセットで覚えよう！\n✅ She offered to help ..." },
  // ── CHOOSE ──
  { id:23, verb:"choose", type:"TO",  sentence:"She chose ___ alone.",                     blank:"to live",      ja:"彼女は1人で暮らすことを選んだ。",                 ex:"【choose + to + 動詞】= 「〜することを選ぶ」\n「1人で暮らそう！」と決めた＝未来の行動。\nchoose のあとは to + 動詞 だよ。\n✅ She chose to live ..." },
  { id:24, verb:"choose", type:"TO",  sentence:"He chose ___ the truth.",                  blank:"to tell",      ja:"彼は真実を話すことを選んだ。",                    ex:"【choose + to + 動詞】= 「〜することを選ぶ」\n「本当のことを言おう！」と選んだ＝未来の行動。\nchoose + to はセットだよ！\n✅ He chose to tell ..." },
  // ── MANAGE ──
  { id:25, verb:"manage", type:"TO",  sentence:"She managed ___ despite the rain.",        blank:"to run",       ja:"雨にもかかわらずなんとか走ることができた。",      ex:"【manage + to + 動詞】= 「なんとか〜できた」\n大変だったけどできた！という意味。\n達成した行動＝ to + 動詞 だよ。\n✅ She managed to run ..." },
  { id:26, verb:"manage", type:"TO",  sentence:"He managed ___ first place.",              blank:"to take",      ja:"彼はなんとか1位をとることができた。",             ex:"【manage + to + 動詞】= 「なんとか〜できた」\nがんばって達成した！ということ。\nmanage + to はセットで覚えよう！\n✅ He managed to take ..." },
  // ── FAIL ──
  { id:27, verb:"fail",   type:"TO",  sentence:"He failed ___ the test.",                  blank:"to pass",      ja:"彼は試験に合格できなかった。",                    ex:"【fail + to + 動詞】= 「〜できなかった」\nやろうとしたけどダメだった... という意味。\nfail のあとは to + 動詞 だよ。\n✅ He failed to pass ..." },
  { id:28, verb:"fail",   type:"TO",  sentence:"She failed ___ the deadline.",             blank:"to meet",      ja:"彼女は締め切りに間に合わなかった。",              ex:"【fail + to + 動詞】= 「〜できなかった」\n「間に合わなかった...」＝できなかったこと。\nfail + to はセットで覚えよう！\n✅ She failed to meet ..." },
  // ── EXPECT ──
  { id:29, verb:"expect", type:"TO",  sentence:"I expect ___ you there.",                  blank:"to see",       ja:"そこであなたに会えると思っています。",            ex:"【expect + to + 動詞】= 「〜すると思う・期待する」\n「会えるだろうな」＝未来の予想。\nexpect のあとは to + 動詞 だよ。\n✅ I expect to see ..." },
  { id:30, verb:"expect", type:"TO",  sentence:"She expects ___ the prize.",               blank:"to win",       ja:"彼女は賞をとると期待している。",                  ex:"【expect + to + 動詞】= 「〜すると期待する」\n「勝てると思う！」＝未来への期待。\nexpect + to はセットで覚えよう！\n✅ She expects to win ..." },
  // ── AFFORD ──
  { id:31, verb:"afford", type:"TO",  sentence:"We can't afford ___ a new car.",           blank:"to buy",       ja:"新しい車を買う余裕がない。",                      ex:"【afford + to + 動詞】= 「〜する余裕がある」\nよく can't afford（余裕がない）で使うよ。\nafford のあとは to + 動詞！\n✅ We can't afford to buy ..." },
  { id:32, verb:"afford", type:"TO",  sentence:"I can't afford ___ any mistakes.",         blank:"to make",      ja:"ミスをする余裕はない。",                          ex:"【afford + to + 動詞】= 「〜する余裕がある」\n「ミスできない！」＝余裕がないということ。\nafford + to はセットだよ！\n✅ I can't afford to make ..." },
  // ── APPEAR / SEEM ──
  { id:33, verb:"appear", type:"TO",  sentence:"She appears ___ very confident.",          blank:"to be",        ja:"彼女はとても自信があるように見える。",            ex:"【appear + to + 動詞】= 「〜のように見える」\n「自信がありそうだな」と見た目の印象。\nappear のあとは to + 動詞 だよ。\n✅ She appears to be ..." },
  { id:34, verb:"seem",   type:"TO",  sentence:"He seems ___ a good person.",              blank:"to be",        ja:"彼は良い人のようだ。",                            ex:"【seem + to + 動詞】= 「〜のようだ」\n「良い人っぽいな」という印象を表すよ。\nseem のあとは to + 動詞 だよ。\n✅ He seems to be ..." },
  // ── PREPARE ──
  { id:35, verb:"prepare",type:"TO",  sentence:"She prepared ___ a speech.",               blank:"to give",      ja:"彼女はスピーチをする準備をした。",                ex:"【prepare + to + 動詞】= 「〜する準備をする」\n「これからスピーチするぞ！」＝未来の行動。\nprepare のあとは to + 動詞 だよ。\n✅ She prepared to give ..." },

  // ── ENJOY ──
  { id:36, verb:"enjoy",  type:"ING", sentence:"I enjoy ___ in the rain.",                 blank:"walking",      ja:"雨の中を歩くのが好きだ。",                        ex:"【enjoy + 動詞ing】= 「〜するのを楽しむ」\n今やっていることを楽しんでいるイメージ！\nenjoy のあとは必ず ing だよ。to はダメ！\n✅ I enjoy walking ..." },
  { id:37, verb:"enjoy",  type:"ING", sentence:"She enjoys ___ new recipes.",              blank:"trying",       ja:"彼女は新しいレシピを試すのを楽しんでいる。",      ex:"【enjoy + 動詞ing】= 「〜するのを楽しむ」\n料理を試すこと自体が楽しい！＝今の体験。\nenjoy のあとは必ず ing！ to は使えないよ。\n✅ She enjoys trying ..." },
  { id:38, verb:"enjoy",  type:"ING", sentence:"He enjoys ___ to old songs.",              blank:"listening",    ja:"彼は古い歌を聴くのを楽しんでいる。",              ex:"【enjoy + 動詞ing】= 「〜するのを楽しむ」\n音楽を聴くこと自体を楽しんでいるよ。\nenjoy は絶対に ing とセット！覚えよう！\n✅ He enjoys listening ..." },
  // ── FINISH ──
  { id:39, verb:"finish", type:"ING", sentence:"Did you finish ___ your essay?",           blank:"writing",      ja:"エッセイを書き終えましたか？",                    ex:"【finish + 動詞ing】= 「〜し終える」\n「書き終わった？」＝やっていたことが完了。\nfinish のあとは必ず ing だよ！\n✅ Did you finish writing ...?" },
  { id:40, verb:"finish", type:"ING", sentence:"He finished ___ dinner and left.",         blank:"eating",       ja:"彼は夕食を食べ終えて去った。",                    ex:"【finish + 動詞ing】= 「〜し終える」\n「食べ終わった」＝やっていた動作の完了。\nfinish のあとは ing！to は使えないよ。\n✅ He finished eating ..." },
  { id:41, verb:"finish", type:"ING", sentence:"Please finish ___ before the meeting.",   blank:"reading",      ja:"会議の前に読み終えてください。",                  ex:"【finish + 動詞ing】= 「〜し終える」\n「読み終えて！」＝今やっていることを完了して。\nfinish + ing はセットで覚えよう！\n✅ Please finish reading ..." },
  // ── KEEP ──
  { id:42, verb:"keep",   type:"ING", sentence:"Keep ___ — don't stop now!",               blank:"going",        ja:"続けて — 今やめないで！",                         ex:"【keep + 動詞ing】= 「〜し続ける」\n「続けて！」＝今やっていることをずっとやる。\nkeep のあとは必ず ing だよ！\n✅ Keep going ..." },
  { id:43, verb:"keep",   type:"ING", sentence:"She keeps ___ the same mistake.",          blank:"making",       ja:"彼女は同じミスを繰り返している。",                ex:"【keep + 動詞ing】= 「〜し続ける」\n何度も同じミスをする＝繰り返し続けている。\nkeep のあとは ing！to は使えないよ。\n✅ She keeps making ..." },
  { id:44, verb:"keep",   type:"ING", sentence:"He kept ___ even when tired.",             blank:"running",      ja:"疲れてもずっと走り続けた。",                      ex:"【keep + 動詞ing】= 「〜し続ける」\n「走り続けた！」＝ずっとやっていた動作。\nkeep + ing はセットで覚えよう！\n✅ He kept running ..." },
  // ── AVOID ──
  { id:45, verb:"avoid",  type:"ING", sentence:"Try to avoid ___ too much sugar.",         blank:"eating",       ja:"砂糖の食べすぎを避けましょう。",                  ex:"【avoid + 動詞ing】= 「〜するのを避ける」\n「食べすぎないようにしよう」＝その行為を避ける。\navoid のあとは必ず ing だよ！\n✅ Try to avoid eating ..." },
  { id:46, verb:"avoid",  type:"ING", sentence:"He avoids ___ to crowded places.",         blank:"going",        ja:"彼は混んだ場所に行くのを避ける。",                ex:"【avoid + 動詞ing】= 「〜するのを避ける」\n「行かないようにする」＝その行動を避ける。\navoid のあとは ing！ to は使えないよ。\n✅ He avoids going ..." },
  { id:47, verb:"avoid",  type:"ING", sentence:"She avoided ___ him at the party.",        blank:"meeting",      ja:"彼女はパーティーで彼に会うのを避けた。",          ex:"【avoid + 動詞ing】= 「〜するのを避ける」\n「会わないようにした」＝会うことを避けた。\navoid + ing はセットで覚えよう！\n✅ She avoided meeting ..." },
  // ── MIND ──
  { id:48, verb:"mind",   type:"ING", sentence:"Do you mind ___ the door?",                blank:"closing",      ja:"ドアを閉めていただけますか？",                    ex:"【mind + 動詞ing】= 「〜するのは嫌ですか？」\nDo you mind ...ing? は「〜してもらえますか？」というていねいなお願い！\nmind のあとは必ず ing だよ。\n✅ Do you mind closing ...?" },
  { id:49, verb:"mind",   type:"ING", sentence:"I don't mind ___ a little longer.",        blank:"waiting",      ja:"もう少し待つのは構いません。",                    ex:"【mind + 動詞ing】= 「〜するのは嫌ですか？」\ndon't mind = 「気にしないよ、大丈夫！」\nmind のあとは ing！ to は使えないよ。\n✅ I don't mind waiting ..." },
  { id:50, verb:"mind",   type:"ING", sentence:"Would you mind ___ it again?",             blank:"explaining",   ja:"もう一度説明していただけますか？",                ex:"【mind + 動詞ing】= 「〜するのは嫌ですか？」\nWould you mind ...ing? はとてもていねいなお願い。\nmind + ing はセットで覚えよう！\n✅ Would you mind explaining ...?" },
  // ── MISS ──
  { id:51, verb:"miss",   type:"ING", sentence:"I miss ___ lunch with you.",               blank:"having",       ja:"あなたとランチをしていたことが懐かしい。",        ex:"【miss + 動詞ing】= 「〜していたことが懐かしい」\n前にやっていたことを恋しく思う気持ち。\nmiss のあとは必ず ing だよ！\n✅ I miss having ..." },
  { id:52, verb:"miss",   type:"ING", sentence:"She misses ___ her friends.",              blank:"seeing",       ja:"彼女は友達に会えなくて寂しい。",                  ex:"【miss + 動詞ing】= 「〜できなくて寂しい」\n「会いたいなぁ...」＝前にしていたことが恋しい。\nmiss + ing はセットで覚えよう！\n✅ She misses seeing ..." },
  // ── CONSIDER ──
  { id:53, verb:"consider",type:"ING",sentence:"We're considering ___ abroad.",            blank:"living",       ja:"海外に住むことを検討しています。",                ex:"【consider + 動詞ing】= 「〜しようか考えている」\n「海外に住もうかなぁ」と頭の中で考えている。\nconsider のあとは必ず ing だよ！\n✅ We're considering living ..." },
  { id:54, verb:"consider",type:"ING",sentence:"She is considering ___ her job.",          blank:"changing",     ja:"彼女は仕事を変えることを考えている。",            ex:"【consider + 動詞ing】= 「〜しようか考えている」\n「転職しようかな...」と検討中。\nconsider + ing はセットで覚えよう！\n✅ She is considering changing ..." },
  // ── SUGGEST ──
  { id:55, verb:"suggest",type:"ING", sentence:"He suggested ___ by train.",               blank:"going",        ja:"彼は電車で行くことを提案した。",                  ex:"【suggest + 動詞ing】= 「〜することを提案する」\n「電車で行こうよ！」と提案している。\nsuggest のあとは必ず ing だよ！\n✅ He suggested going ..." },
  { id:56, verb:"suggest",type:"ING", sentence:"She suggested ___ a break.",               blank:"taking",       ja:"彼女は休憩をとることを提案した。",                ex:"【suggest + 動詞ing】= 「〜しようと提案する」\n「休もうよ！」というアイデアの提案。\nsuggest + ing はセットで覚えよう！\n✅ She suggested taking ..." },
  // ── PRACTICE ──
  { id:57, verb:"practice",type:"ING",sentence:"You should practice ___ aloud.",           blank:"reading",      ja:"声に出して読む練習をするべきだ。",                ex:"【practice + 動詞ing】= 「〜する練習をする」\n「音読の練習をしよう！」＝実際にやる練習。\npractice のあとは必ず ing だよ！\n✅ You should practice reading ..." },
  { id:58, verb:"practice",type:"ING",sentence:"He practices ___ kanji every day.",        blank:"writing",      ja:"彼は毎日漢字を書く練習をしている。",              ex:"【practice + 動詞ing】= 「〜する練習をする」\n「毎日書く練習をする」＝実際にやっている動作。\npractice + ing はセットで覚えよう！\n✅ He practices writing ..." },
  // ── DELAY / PUT OFF ──
  { id:59, verb:"delay",  type:"ING", sentence:"Don't delay ___ the doctor.",              blank:"seeing",       ja:"医者に行くのを先延ばしにしないで。",              ex:"【delay + 動詞ing】= 「〜するのを遅らせる」\n「後でいいや...」と先のばしにしちゃダメ！\ndelay のあとは必ず ing だよ。\n✅ Don't delay seeing ..." },
  { id:60, verb:"put off",type:"ING", sentence:"He put off ___ his homework.",             blank:"doing",        ja:"彼は宿題をやるのを先延ばしにした。",              ex:"【put off + 動詞ing】= 「〜するのを後回しにする」\n「あとでやろ〜」と先のばしにした。\nput off のあとは必ず ing だよ！\n✅ He put off doing ..." },
  // ── GIVE UP ──
  { id:61, verb:"give up",type:"ING", sentence:"Never give up ___ your goal.",             blank:"chasing",      ja:"目標を追いかけることをあきらめないで。",          ex:"【give up + 動詞ing】= 「〜するのをあきらめる」\n「あきらめないで！」＝やっていることを止めるな。\ngive up のあとは必ず ing だよ！\n✅ Never give up chasing ..." },
  { id:62, verb:"give up",type:"ING", sentence:"She gave up ___ meat.",                    blank:"eating",       ja:"彼女は肉を食べるのをやめた。",                    ex:"【give up + 動詞ing】= 「〜するのをやめる」\n「肉を食べるのをやめた」＝習慣をやめた。\ngive up + ing はセットで覚えよう！\n✅ She gave up eating ..." },
  // ── IMAGINE ──
  { id:63, verb:"imagine",type:"ING", sentence:"Can you imagine ___ on the moon?",         blank:"walking",      ja:"月の上を歩くことを想像できますか？",              ex:"【imagine + 動詞ing】= 「〜することを想像する」\n頭の中でやっている場面を思いうかべるよ。\nimagine のあとは必ず ing だよ！\n✅ Can you imagine walking ...?" },
  { id:64, verb:"imagine",type:"ING", sentence:"I can't imagine ___ without music.",       blank:"living",       ja:"音楽なしで生きることが想像できない。",            ex:"【imagine + 動詞ing】= 「〜することが想像できない」\n「音楽なしの生活なんてムリ！」という気持ち。\nimagine + ing はセットで覚えよう！\n✅ I can't imagine living ..." },
  // ── DISLIKE ──
  { id:65, verb:"dislike",type:"ING", sentence:"He dislikes ___ to school early.",         blank:"going",        ja:"彼は早く学校に行くのが嫌いだ。",                  ex:"【dislike + 動詞ing】= 「〜するのが嫌い」\n「早起きイヤだ〜！」＝その行動が嫌い。\ndislike のあとは必ず ing だよ！\n✅ He dislikes going ..." },
  // ── LOOK FORWARD TO ──
  { id:66, verb:"look forward to",type:"ING", sentence:"I look forward to ___ you soon.", blank:"seeing",       ja:"近いうちにあなたに会えるのを楽しみにしています。", ex:"【look forward to + 動詞ing】= 「〜するのを楽しみにしている」\nここの to は「〜へ向かって」という前置詞！\nto不定詞の to じゃないから、うしろは ing になるよ。\n✅ I look forward to seeing ..." },
  { id:67, verb:"look forward to",type:"ING", sentence:"She looks forward to ___ her family.", blank:"visiting", ja:"彼女は家族に会いに行くのを楽しみにしている。",   ex:"【look forward to + 動詞ing】= 「〜するのが楽しみ」\nこの to は前置詞だから、うしろは ing！\n「to + 動詞の原形」の to とはちがうよ。ひっかけ注意！\n✅ She looks forward to visiting ..." },
  // ── SPEND TIME -ING ──
  { id:68, verb:"spend ... -ing",type:"ING", sentence:"He spends hours ___ video games.",  blank:"playing",      ja:"彼は何時間もゲームをして過ごす。",                ex:"【spend + 時間 + 動詞ing】= 「〜して時間を過ごす」\n「何時間もゲームしてる」＝時間を使ってやっていること。\nspend + 時間のあとは ing だよ！\n✅ He spends hours playing ..." },
  { id:69, verb:"spend ... -ing",type:"ING", sentence:"She spent all day ___ her room.",   blank:"cleaning",     ja:"彼女は1日中部屋の掃除をして過ごした。",          ex:"【spend + 時間 + 動詞ing】= 「〜して時間を過ごす」\n「1日中おそうじしてた」＝その時間ずっとやっていた。\nspend + 時間 + ing はセットだよ！\n✅ She spent all day cleaning ..." },

  // ═══ BOTH: REMEMBER ═══
  { id:70, verb:"remember", type:"BOTH_ING", bothHint:"過去に会ったことを覚えている", bothLabel:"過去の記憶",
    sentence:"I remember ___ her for the first time.", blank:"meeting",
    ja:"初めて彼女に会ったことを覚えている。",
    ex:"【remember + 動詞ing】= 「〜したことを覚えている」\n「初めて会った」＝もう終わった過去のこと！\n過去の思い出 → ing を使うよ。\nもし to を使うと「これから会うのを忘れないで」という意味になっちゃう！\n✅ I remember meeting ..." },
  { id:71, verb:"remember", type:"BOTH_TO",  bothHint:"これから窓を閉めること＝やるべきタスク", bothLabel:"これからやること",
    sentence:"Please remember ___ the windows.", blank:"to close",
    ja:"忘れずに窓を閉めてください。",
    ex:"【remember + to + 動詞】= 「忘れずに〜する」\n「窓を閉めてね！」＝これからやるべきこと！\n未来のやるべきこと → to を使うよ。\nもし ing を使うと「窓を閉めたことを覚えている」になっちゃう！\n✅ Please remember to close ..." },
  { id:72, verb:"remember", type:"BOTH_ING", bothHint:"以前ここに来た経験の記憶", bothLabel:"過去の記憶",
    sentence:"Do you remember ___ to this place before?", blank:"coming",
    ja:"以前ここに来たことを覚えていますか？",
    ex:"【remember + 動詞ing】= 「〜したことを覚えている」\n「前に来たこと覚えてる？」＝過去の体験。\n前にやったことの記憶 → ing！\n✅ Do you remember coming ...?" },
  { id:73, verb:"remember", type:"BOTH_TO",  bothHint:"明日持ってくべき行動＝未来のタスク", bothLabel:"これからやること",
    sentence:"Remember ___ your lunch box tomorrow.", blank:"to bring",
    ja:"明日お弁当箱を忘れずに持ってきてください。",
    ex:"【remember + to + 動詞】= 「忘れずに〜する」\n「お弁当持ってきてね！」＝明日やること。\nこれからやるべきこと → to！\n✅ Remember to bring ..." },
  { id:74, verb:"remember", type:"BOTH_ING", bothHint:"子供の頃に見た思い出", bothLabel:"過去の記憶",
    sentence:"I remember ___ that movie as a child.", blank:"watching",
    ja:"子供の頃にその映画を見たことを覚えている。",
    ex:"【remember + 動詞ing】= 「〜したことを覚えている」\n「子供の頃に見た」＝昔の思い出！\n過去の体験を覚えている → ing だよ。\n✅ I remember watching ..." },
  { id:75, verb:"remember", type:"BOTH_TO",  bothHint:"電気を消すこと＝やるべき行動", bothLabel:"これからやること",
    sentence:"Did you remember ___ off the lights?", blank:"to turn",
    ja:"電気を消したか確認しましたか？",
    ex:"【remember + to + 動詞】= 「忘れずに〜する」\n「ちゃんと電気消した？」＝やるべきだったこと。\nやるべきタスクを忘れなかったか → to！\n✅ Did you remember to turn ...?" },

  // ═══ BOTH: FORGET ═══
  { id:76, verb:"forget", type:"BOTH_ING", bothHint:"パリで暮らした過去の体験", bothLabel:"過去の出来事",
    sentence:"I'll never forget ___ in Paris.", blank:"living",
    ja:"パリで暮らしたことは決して忘れない。",
    ex:"【forget + 動詞ing】= 「〜したことを忘れる」\n「パリで暮らした思い出」＝もう終わった過去のこと！\n過去の体験を忘れない → ing を使うよ。\n✅ I'll never forget living ..." },
  { id:77, verb:"forget", type:"BOTH_TO",  bothHint:"持ってくるべき行動を忘れないよう注意", bothLabel:"これからやること",
    sentence:"Don't forget ___ your passport!", blank:"to bring",
    ja:"パスポートを忘れずに持ってきて！",
    ex:"【forget + to + 動詞】= 「〜するのを忘れる」\n「パスポート持ってきてね！」＝これからやるべきこと。\nやるべきことを忘れるな → to を使うよ。\n✅ Don't forget to bring ..." },
  { id:78, verb:"forget", type:"BOTH_ING", bothHint:"生で聞いたという過去の体験", bothLabel:"過去の出来事",
    sentence:"She'll never forget ___ that song live.", blank:"hearing",
    ja:"あの曲を生で聞いたことを彼女は決して忘れない。",
    ex:"【forget + 動詞ing】= 「〜したことを忘れる」\n「生で聴いた」＝もう終わった素敵な体験！\n過去の思い出 → ing だよ。\n✅ She'll never forget hearing ..." },
  { id:79, verb:"forget", type:"BOTH_TO",  bothHint:"誕生日を祝うという行動を忘れた", bothLabel:"これからやること",
    sentence:"He forgot ___ her birthday.", blank:"to celebrate",
    ja:"彼は彼女の誕生日を祝うのを忘れた。",
    ex:"【forget + to + 動詞】= 「〜するのを忘れた」\n「お祝いしなきゃ！」と思っていたのに忘れちゃった。\nやるべきだったこと → to！\n✅ He forgot to celebrate ..." },
  { id:80, verb:"forget", type:"BOTH_ING", bothHint:"先週手紙を書いたという過去の行動", bothLabel:"過去の出来事",
    sentence:"I forgot ___ to him last week.", blank:"writing",
    ja:"先週彼に手紙を書いたのをすっかり忘れていた。",
    ex:"【forget + 動詞ing】= 「〜したことを忘れていた」\n「あ、先週手紙書いたんだった！」＝過去にやったこと。\n過去の行動の記憶 → ing だよ。\n✅ I forgot writing ..." },

  // ═══ BOTH: STOP ═══
  { id:81, verb:"stop", type:"BOTH_ING", bothHint:"煙草を吸う習慣を終わらせた", bothLabel:"動作を中止・やめる",
    sentence:"She stopped ___ because of her health.", blank:"smoking",
    ja:"健康のために煙草を吸うのをやめた。",
    ex:"【stop + 動詞ing】= 「〜するのをやめる」\n「タバコを吸うのをやめた」＝やっていたことを中止！\nstop + ing → その動作をストップ！\nもし to を使うと「タバコを吸うために止まった」になっちゃう。\n✅ She stopped smoking ..." },
  { id:82, verb:"stop", type:"BOTH_TO",  bothHint:"パン屋に寄るという目的のために立ち止まった", bothLabel:"〜するために立ち止まる",
    sentence:"He stopped ___ his favorite bakery.", blank:"to visit",
    ja:"彼はお気に入りのパン屋を訪れるために立ち止まった。",
    ex:"【stop + to + 動詞】= 「〜するために止まる」\n「パン屋に行くために立ち止まった」＝目的があって止まった！\nstop + to → 目的のために一時停止。\nもし ing を使うと「訪れるのをやめた」になっちゃう。\n✅ He stopped to visit ..." },
  { id:83, verb:"stop", type:"BOTH_ING", bothHint:"話すという行為をやめてほしいお願い", bothLabel:"動作を中止・やめる",
    sentence:"Please stop ___ — I'm trying to sleep.", blank:"talking",
    ja:"静かにして — 寝ようとしているんだから。",
    ex:"【stop + 動詞ing】= 「〜するのをやめて」\n「しゃべるのをやめて！」＝今やっている動作をストップ。\nやめてほしい動作 → ing だよ。\n✅ Please stop talking ..." },
  { id:84, verb:"stop", type:"BOTH_TO",  bothHint:"カフェで休憩することが目的で立ち寄った", bothLabel:"〜するために立ち止まる",
    sentence:"We stopped ___ at a café on the way.", blank:"to rest",
    ja:"途中でカフェに休憩のために立ち寄った。",
    ex:"【stop + to + 動詞】= 「〜するために止まる」\n「休むためにカフェに寄った」＝目的があって止まった。\n「〜するために」→ to だよ。\n✅ We stopped to rest ..." },
  { id:85, verb:"stop", type:"BOTH_ING", bothHint:"泣くという行為が終わった", bothLabel:"動作を中止・やめる",
    sentence:"The baby finally stopped ___ at midnight.", blank:"crying",
    ja:"赤ちゃんはやっと夜中に泣くのをやめた。",
    ex:"【stop + 動詞ing】= 「〜するのをやめる」\n「泣くのをやめた」＝やっていた動作が終わった！\nやめた動作 → ing だよ。\n✅ The baby stopped crying ..." },

  // ═══ BOTH: TRY ═══
  { id:86, verb:"try", type:"BOTH_ING", bothHint:"塩を少なめにした場合の結果を試してみる", bothLabel:"試しに〜してみる（実験）",
    sentence:"Try ___ less salt in the recipe.", blank:"using",
    ja:"レシピで塩を少なめに使ってみてください。",
    ex:"【try + 動詞ing】= 「試しに〜してみる」\n「塩を減らしてみたら？」＝ちょっとやってみる実験。\nかるく試す → ing を使うよ。\nもし to を使うと「塩を減らそうとがんばる」になるよ。\n✅ Try using ..." },
  { id:87, verb:"try", type:"BOTH_TO",  bothHint:"鍵がかかっていて開けられなかった＝努力したが失敗", bothLabel:"〜しようと努力する",
    sentence:"I tried ___ the door but it was locked.", blank:"to open",
    ja:"ドアを開けようとしたが、鍵がかかっていた。",
    ex:"【try + to + 動詞】= 「〜しようとがんばる」\n「開けようとした（けどダメだった）」＝努力・挑戦！\nがんばってやろうとする → to を使うよ。\n✅ I tried to open ..." },
  { id:88, verb:"try", type:"BOTH_ING", bothHint:"抹茶アイスという新しいものを経験として試す", bothLabel:"試しに〜してみる（実験）",
    sentence:"Have you tried ___ matcha ice cream?", blank:"eating",
    ja:"抹茶アイスクリームを食べてみたことはありますか？",
    ex:"【try + 動詞ing】= 「試しに〜してみる」\n「食べてみたことある？」＝体験としてやってみる。\n新しいことを試す → ing だよ。\n✅ Have you tried eating ...?" },
  { id:89, verb:"try", type:"BOTH_TO",  bothHint:"誰に対しても親切でいようと日々努力している", bothLabel:"〜しようと努力する",
    sentence:"She tries ___ kind to everyone.", blank:"to be",
    ja:"彼女は誰に対しても親切にしようとしている。",
    ex:"【try + to + 動詞】= 「〜しようとがんばる」\n「親切にしよう！」と毎日がんばっている＝努力。\n一生懸命やろうとする → to だよ。\n✅ She tries to be ..." },
  { id:90, verb:"try", type:"BOTH_ING", bothHint:"アプリを一度使って試してみるよう勧めている", bothLabel:"試しに〜してみる（実験）",
    sentence:"Try ___ the app — it's really useful.", blank:"using",
    ja:"そのアプリを使ってみて — 本当に便利だよ。",
    ex:"【try + 動詞ing】= 「試しに〜してみて」\n「使ってみなよ！」＝かるく試してみるだけ。\n体験としてやってみる → ing だよ。\n✅ Try using ..." },

  // ═══ BOTH: REGRET ═══
  { id:91, verb:"regret", type:"BOTH_ING", bothHint:"過去にゲームに時間を使いすぎたことへの後悔", bothLabel:"過去の行動を後悔",
    sentence:"I regret ___ so much time on games.", blank:"spending",
    ja:"ゲームにこんなに時間を使ったことを後悔している。",
    ex:"【regret + 動詞ing】= 「〜したことを後悔する」\n「ゲームしすぎた...」＝もう終わった過去への反省。\n過去にやったことを後悔 → ing だよ。\n✅ I regret spending ..." },
  { id:92, verb:"regret", type:"BOTH_TO",  bothHint:"公式な場でイベント中止のお知らせをしている", bothLabel:"残念ながら〜をお知らせする",
    sentence:"We regret ___ that the event is canceled.", blank:"to inform",
    ja:"残念ながらイベントが中止になったことをお知らせします。",
    ex:"【regret + to + 動詞】= 「残念ながら〜します」\nビジネスや公式な場面でていねいに伝える表現。\n「これからお知らせする」→ to を使うよ。\n✅ We regret to inform ..." },
  { id:93, verb:"regret", type:"BOTH_ING", bothHint:"友達を失ったという過去の結果への後悔", bothLabel:"過去の行動を後悔",
    sentence:"She regrets ___ her old friends.", blank:"losing",
    ja:"彼女は昔の友達を失ったことを後悔している。",
    ex:"【regret + 動詞ing】= 「〜したことを後悔する」\n「友達を失ってしまった...」＝過去の出来事への後悔。\n過去にしたことを悔やむ → ing だよ。\n✅ She regrets losing ..." },
  { id:94, verb:"regret", type:"BOTH_TO",  bothHint:"出席できないという残念なことをフォーマルに伝える", bothLabel:"残念ながら〜をお知らせする",
    sentence:"I regret ___ that I cannot attend.", blank:"to say",
    ja:"残念ながら出席できないことをお伝えします。",
    ex:"【regret + to + 動詞】= 「残念ながら〜します」\n「申し上げにくいのですが...」というていねいな表現。\nこれから伝える → to だよ。\n✅ I regret to say ..." },
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

  .combo-milestone-overlay {
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    display: flex; align-items: center; justify-content: center;
    z-index: 9999; pointer-events: none;
    animation: milestoneAnim 1.5s ease forwards;
  }
  .combo-milestone-text {
    font-family: 'Sora', sans-serif; font-weight: 900;
    font-size: clamp(36px, 10vw, 64px); color: #fff;
    text-shadow: 0 0 40px rgba(0,212,170,.6), 0 4px 20px rgba(0,0,0,.5);
    animation: milestoneTextPop 1.5s cubic-bezier(.34,1.56,.64,1) forwards;
  }
  @keyframes milestoneAnim { 0%{opacity:0} 10%{opacity:1} 70%{opacity:1} 100%{opacity:0} }
  @keyframes milestoneTextPop { 0%{transform:scale(0) rotate(-10deg);opacity:0} 30%{transform:scale(1.3) rotate(3deg);opacity:1} 50%{transform:scale(1) rotate(0)} 100%{transform:scale(.8) translateY(-30px);opacity:0} }

  .adaptive-hint {
    margin: 8px 14px 0; padding: 10px 14px; border-radius: 12px;
    background: #a78bfa0f; border: 1px solid #a78bfa2e;
    font-size: 12px; color: #a78bfa; line-height: 1.7;
    animation: fadeIn .3s ease;
  }

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
  const [records,    setRecords]    = useState(() => lsGet(LS_RECORDS, { basic:0, both:0, attack:0 }));
  const [bestCombos, setBestCombos] = useState(() => lsGet(LS_COMBOS,  { basic:0, both:0, attack:0 }));

  const advRef   = useRef(null);
  const timerRef = useRef(null);
  const optsRef  = useRef([]);
  const comboRef = useRef(0);
  const timeLRef = useRef(12);
  const [comboMilestone, setComboMilestone] = useState(null);
  const [recentResults, setRecentResults] = useState([]); // last 5 results for adaptive hints
  const [showAdaptiveHint, setShowAdaptiveHint] = useState(false);

  const COMBO_MILESTONES = { 3: "NICE! \u2728", 5: "GREAT! \uD83D\uDD25", 7: "AMAZING! \u26A1", 10: "UNSTOPPABLE! \uD83D\uDC8E" };

  const curQ = questions[qIdx];
  const cfg  = activeMode ? MODES[activeMode] : null;
  const hasTimer = !!cfg?.time;

  // ing→原形の逆変換マップ（不規則なものを登録）
  const ING_TO_BASE = {
    living:"live", coming:"come", making:"make", writing:"write", closing:"close",
    having:"have", changing:"change", taking:"take", chasing:"chase", using:"use",
    walking:"walk", trying:"try", listening:"listen", eating:"eat", reading:"read",
    going:"go", running:"run", meeting:"meet", waiting:"wait", explaining:"explain",
    seeing:"see", visiting:"visit", playing:"play", cleaning:"clean", smoking:"smoke",
    talking:"talk", crying:"cry", spending:"spend", losing:"lose", doing:"do",
    hearing:"hear", watching:"watch",
  };
  function ingToBase(ingForm) {
    // Check explicit map first
    const mapped = ING_TO_BASE[ingForm];
    if (mapped) return mapped.includes("→") ? mapped.split("→")[1] : mapped;
    // Heuristic: strip -ing and guess base form
    if (!ingForm.endsWith("ing")) return ingForm;
    const stem = ingForm.slice(0, -3);
    // doubled consonant: running→run, swimming→swim
    if (stem.length >= 3 && stem.slice(-1) === stem.slice(-2, -1) && /[bcdfgmnprst]/.test(stem.slice(-1))) {
      return stem.slice(0, -1);
    }
    // stem + e: living→live (but not going→goe)
    const withE = stem + "e";
    // Simple check: if stem ends in consonant, try adding e
    if (/[^aeiou]$/.test(stem) && !/^(go|do|see)$/.test(stem)) {
      return withE;
    }
    return stem;
  }

  function buildOpts(q) {
    if (!q) return [];
    const blank   = q.blank;
    const isTO    = blank.startsWith("to ");
    // Get base verb form regardless of blank format
    let baseVerb, ing;
    if (isTO) {
      baseVerb = blank.slice(3); // "to run" → "run"
    } else {
      // blank is in -ing form, convert back to base
      baseVerb = ingToBase(blank);
    }
    // Build -ing form from base verb
    if (blank.endsWith("ing") && !isTO) {
      ing = blank; // Already in -ing form, use as-is
    } else if (baseVerb.endsWith("e") && !baseVerb.endsWith("ee") && !baseVerb.endsWith("oe")) {
      ing = baseVerb.slice(0, -1) + "ing";
    } else if (/[^aeiou][aeiou][bdgmnprst]$/.test(baseVerb)) {
      ing = baseVerb + baseVerb.slice(-1) + "ing";
    } else {
      ing = baseVerb + "ing";
    }
    const toForm = "to " + baseVerb;
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
    playWrongBuzz();
    setCombo(0); comboRef.current = 0;
    setWrongIds(w => w.includes(curQ.id) ? w : [...w, curQ.id]);
    spawnParticles(false);
    // TTS: speak the correct sentence even on timeout
    speakEnglish(curQ.sentence.replace("___", curQ.blank));
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
      playCorrectChime();
      const tb  = hasTimer ? Math.max(0, timeLRef.current - 1) * 8 : 0;
      const nc  = comboRef.current + 1;
      const mul = nc >= 10 ? 3 : nc >= 6 ? 2 : nc >= 3 ? 1.5 : 1;
      const pts = Math.round((100 + tb) * mul);
      comboRef.current = nc;
      setCombo(nc); setMaxCombo(mc => Math.max(mc, nc));
      setScore(s => s + pts);
      // TTS: speak the completed sentence
      speakEnglish(curQ.sentence.replace("___", curQ.blank));
    } else {
      playWrongBuzz();
      comboRef.current = 0; setCombo(0);
      setWrongIds(w => w.includes(curQ.id) ? w : [...w, curQ.id]);
      // Report wrong answer to WiseXP
      if (window.WiseXP) {
        window.WiseXP.reportWrong({ question: curQ.sentence, correct: correctType + " → " + curQ.blank, playerAnswer: opt.type });
      }
      // TTS: speak the correct sentence so student learns
      speakEnglish(curQ.sentence.replace("___", curQ.blank));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answered, curQ, hasTimer, advance]);

  useEffect(() => () => { clearTimeout(advRef.current); clearInterval(timerRef.current); }, []);
  useEffect(() => { if (window.WiseXP) window.WiseXP.init('grammar-drill'); }, []);
  // Options are already set in startGame() and advance() — do NOT rebuild here
  // as buildOpts randomizes button positions, causing left/right swap after render.

  useEffect(() => {
    if (screen === "result" && activeMode) {
      const acc = Math.round(((questions.length - wrongIds.length) / questions.length) * 100);
      setAccuracy(acc);
      setRecords(r  => {
        const next = { ...r,  [activeMode]: Math.max(r[activeMode],  score) };
        lsSet(LS_RECORDS, next);
        return next;
      });
      setBestCombos(b => {
        const next = { ...b, [activeMode]: Math.max(b[activeMode], maxCombo) };
        lsSet(LS_COMBOS, next);
        return next;
      });
      // → MoWISE portal へスコア送信 (WiseGame Bridge)
      try {
        const wrongDetail = questions.filter(q => wrongIds.includes(q.id))
          .map(q => {
            const ct = q.type === "BOTH_TO" ? "TO" : q.type === "BOTH_ING" ? "ING" : q.type;
            return { q: q.sentence, correct: ct + " → " + q.blank, chosen: "", tag: ct === "TO" ? "to_infinitive" : "gerund" };
          }).slice(0, 20);
        window.WiseGame && window.WiseGame.reportComplete({
          score: score, maxScore: questions.length * 10, accuracy: acc,
          metadata: { mode: activeMode, maxCombo: maxCombo, wrongAnswers: wrongDetail }
        });
      } catch(e) {}

      // Persist wrong answers for review
      if (wrongIds.length > 0) {
        appendWrongLog(wrongIds, questions);
      }
      // Report game result to WiseXP
      if (window.WiseXP) {
        const correct = questions.length - wrongIds.length;
        const grade = acc >= 95 ? "S" : acc >= 80 ? "A" : acc >= 65 ? "B" : "C";
        window.WiseXP.reportGame({ score, correct, total: questions.length, maxCombo, grade });
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen]);

  // If optsRef is somehow empty, rebuild and cache (avoid re-randomizing on each render)
  if (optsRef.current.length !== 2 && curQ) {
    optsRef.current = buildOpts(curQ);
  }
  const opts = optsRef.current.length === 2 ? optsRef.current : [];

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
function WrongReviewPanel() {
  const [log, setLog] = useState(() => lsGet(LS_WRONG_LOG, []));
  if (log.length === 0) return null;

  // Group by verb, count occurrences, sort by most frequent
  const grouped = {};
  log.forEach(e => {
    if (!grouped[e.verb]) grouped[e.verb] = { verb: e.verb, count: 0, items: [] };
    grouped[e.verb].count++;
    // Keep only latest entry per question id
    const existing = grouped[e.verb].items.findIndex(x => x.id === e.id);
    if (existing >= 0) grouped[e.verb].items[existing] = e;
    else grouped[e.verb].items.push(e);
  });
  const sorted = Object.values(grouped).sort((a, b) => b.count - a.count).slice(0, 8);

  return (
    <div style={{ width:"100%", maxWidth:440, marginTop:20, padding:"14px 16px", borderRadius:14, background:"#0a0e16", border:"1px solid #141926" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
        <div style={{ fontSize:11, color:"#ef4444", fontFamily:"Space Mono", letterSpacing:3 }}>WRONG ANSWER LOG</div>
        <button className="btn" onClick={() => { lsSet(LS_WRONG_LOG, []); setLog([]); }}
          style={{ fontSize:10, color:"#333", background:"none", border:"1px solid #1e2535", borderRadius:6, padding:"3px 8px", cursor:"pointer" }}>
          クリア
        </button>
      </div>
      {sorted.map((g, i) => (
        <div key={i} style={{ marginBottom:8 }}>
          <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:3 }}>
            <span style={{ fontSize:12, fontWeight:800, color:"#f87171", fontFamily:"Space Mono" }}>{g.verb}</span>
            <span style={{ fontSize:10, color:"#444", fontFamily:"Space Mono" }}>x{g.count}</span>
          </div>
          {g.items.slice(0, 2).map((item, j) => (
            <div key={j} style={{ fontSize:11, color:"#555", marginLeft:8, lineHeight:1.6, display:"flex", alignItems:"center", gap:4 }}>
              <span style={{ flex:1 }}>{item.sentence.replace("___", item.blank)}</span>
              <button className="btn" onClick={() => speakEnglish(item.sentence.replace("___", item.blank))}
                style={{ flexShrink:0, width:22, height:22, borderRadius:4, background:"none", border:"1px solid #1e2535", color:"#555", fontSize:11, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", padding:0 }}>
                🔊
              </button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

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

      <WrongReviewPanel />
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
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
          <div style={{ fontSize:13, color:"#444", fontFamily:"Noto Sans JP", flex:1 }}>{q.ja}</div>
          {answered && (
            <button className="btn" onClick={() => speakEnglish(q.sentence.replace("___", q.blank))}
              style={{ flexShrink:0, width:34, height:34, borderRadius:8, background:"#0d111a", border:"1px solid #1e2535", color:"#00d4aa", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}
              title="もう一度聞く">
              🔊
            </button>
          )}
        </div>
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
          <div style={{ fontSize:13, color:"#999", lineHeight:1.9, fontFamily:"Noto Sans JP", whiteSpace:"pre-line" }}>{q.ex}</div>
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
              次の問題へ
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
