import { useState, useEffect, useCallback, useRef } from "react";
import { QUESTIONS } from "./questions.js";
import IntroScreen from "./IntroScreen.jsx";

// ── utils ──────────────────────────────────────────────────
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickQuestions(level, count) {
  const pool =
    level === "all"
      ? QUESTIONS
      : QUESTIONS.filter((q) => q.level === level);

  const tricky = shuffle(pool.filter((q) => q.tricky));
  const normal = shuffle(pool.filter((q) => !q.tricky));

  const trickyCount = Math.min(Math.ceil(count * 0.38), tricky.length);
  const normalCount = Math.min(count - trickyCount, normal.length);

  return shuffle([
    ...tricky.slice(0, trickyCount),
    ...normal.slice(0, normalCount),
  ]);
}

const COMBO_MSGS = [
  { min: 1, text: "NICE!", color: "#00f5ff" },
  { min: 3, text: "GREAT! 🔥", color: "#ffd700" },
  { min: 5, text: "EXCELLENT!! ⚡", color: "#ff6eb4" },
  { min: 8, text: "LEGENDARY!!! 💥", color: "#ff4444" },
];

function getComboMsg(combo) {
  let msg = null;
  for (const m of COMBO_MSGS) {
    if (combo >= m.min) msg = m;
  }
  return msg;
}

// ── styles (single string) ─────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Noto+Sans+JP:wght@400;700;900&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

:root{
  --bg:#080812;--sf:#111120;--sf2:#17172a;
  --border:rgba(255,255,255,0.07);
  --cyan:#00f5ff;--gold:#ffd700;--pink:#ff6eb4;
  --green:#39ff14;--red:#ff4444;
  --text:#e4e4f0;--muted:#6060808;
  --grade3:#00f5ff;--pre2:#ffd700;
  font-size:16px;
}

body{background:var(--bg);color:var(--text);font-family:'Noto Sans JP',sans-serif;overflow-x:hidden}

/* ── layout ── */
.app{min-height:100dvh;display:flex;flex-direction:column;align-items:center;padding:14px 12px 40px;position:relative}
.bg-grid{position:fixed;inset:0;z-index:0;background-image:linear-gradient(rgba(0,245,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,245,255,0.025) 1px,transparent 1px);background-size:40px 40px;pointer-events:none}
.glow{position:fixed;border-radius:50%;filter:blur(90px);opacity:0.12;pointer-events:none;z-index:0}
.g1{width:500px;height:500px;background:var(--cyan);top:-150px;left:-150px}
.g2{width:350px;height:350px;background:var(--pink);bottom:-80px;right:-80px}
.g3{width:280px;height:280px;background:var(--gold);top:42%;left:48%;transform:translate(-50%,-50%)}
.wrap{position:relative;z-index:1;width:100%;max-width:640px}

/* ── card ── */
.card{background:var(--sf);border:1px solid var(--border);border-radius:16px;padding:18px;margin-bottom:14px}
.clabel{font-size:.68rem;font-family:'Space Mono',monospace;letter-spacing:.1em;color:#7070a0;text-transform:uppercase;margin-bottom:12px}

/* ── home ── */
.home-logo{font-family:'Orbitron',sans-serif;font-size:clamp(1.3rem,6vw,2rem);font-weight:900;text-align:center;line-height:1.15;padding:18px 0 4px}
.logo-c{color:var(--cyan);text-shadow:0 0 24px var(--cyan)}
.logo-g{color:var(--gold);text-shadow:0 0 24px var(--gold)}
.home-sub{text-align:center;font-size:.78rem;color:#6060a0;font-family:'Space Mono',monospace;margin-bottom:24px}

.level-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.lvl-btn{padding:14px 6px;border-radius:12px;border:2px solid transparent;background:var(--sf2);color:var(--text);font-family:'Noto Sans JP',sans-serif;font-weight:700;font-size:.8rem;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:5px;transition:all .18s}
.lvl-btn:hover{transform:translateY(-3px)}
.lvl-btn.act-grade3{border-color:var(--cyan);background:rgba(0,245,255,.1);box-shadow:0 0 20px rgba(0,245,255,.2)}
.lvl-btn.act-pre2{border-color:var(--gold);background:rgba(255,215,0,.1);box-shadow:0 0 20px rgba(255,215,0,.2)}
.lvl-btn.act-all{border-color:var(--pink);background:rgba(255,110,180,.1);box-shadow:0 0 20px rgba(255,110,180,.2)}
.lvl-icon{font-size:1.5rem}
.lvl-name{font-size:.78rem}
.lvl-desc{font-size:.62rem;color:#7070a0;text-align:center;line-height:1.4}

.cnt-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}
.cnt-btn{padding:13px;border-radius:10px;border:2px solid transparent;background:var(--sf2);color:var(--text);font-family:'Orbitron',sans-serif;font-size:1rem;font-weight:700;cursor:pointer;transition:all .18s}
.cnt-btn:hover{transform:scale(1.05)}
.cnt-btn.act{border-color:var(--cyan);color:var(--cyan);box-shadow:0 0 14px rgba(0,245,255,.3)}

.start-btn{width:100%;padding:17px;border-radius:14px;border:none;cursor:pointer;font-family:'Orbitron',sans-serif;font-size:1rem;font-weight:900;letter-spacing:.07em;transition:all .2s}
.s-grade3{background:linear-gradient(135deg,#004f6e,#00c0d5);color:#fff;box-shadow:0 4px 28px rgba(0,220,255,.35)}
.s-pre2{background:linear-gradient(135deg,#5a3d00,#c89600);color:#fff;box-shadow:0 4px 28px rgba(255,210,0,.35)}
.s-all{background:linear-gradient(135deg,#4a0045,#b82888);color:#fff;box-shadow:0 4px 28px rgba(255,80,180,.35)}
.start-btn:hover{transform:translateY(-2px) scale(1.01);filter:brightness(1.1)}
.start-btn:active{transform:scale(.98)}

.info-box{background:transparent;border:1px solid rgba(0,245,255,.12);border-radius:14px;padding:16px;margin-bottom:14px;font-size:.76rem;line-height:2;color:#7070a0}
.info-box b{font-weight:700}

/* ── drill header ── */
.drillhd{display:flex;align-items:center;gap:10px;margin-bottom:12px}
.score{font-family:'Orbitron',sans-serif;font-size:1.15rem;font-weight:700;color:var(--cyan);text-shadow:0 0 10px var(--cyan);white-space:nowrap}
.pb-wrap{flex:1;display:flex;align-items:center;gap:8px}
.pb-track{flex:1;height:6px;background:var(--sf2);border-radius:3px;overflow:hidden}
.pb-fill{height:100%;background:linear-gradient(90deg,var(--cyan),var(--pink));border-radius:3px;transition:width .35s ease}
.pb-num{font-family:'Space Mono',monospace;font-size:.72rem;color:#7070a0;white-space:nowrap}
.combo-badge{font-family:'Orbitron',sans-serif;font-size:.8rem;font-weight:700;padding:5px 11px;border-radius:20px;background:rgba(255,215,0,.12);border:1px solid rgba(255,215,0,.3);color:var(--gold);white-space:nowrap}
.combo-badge.hot{background:rgba(255,215,0,.25);box-shadow:0 0 14px rgba(255,215,0,.4)}

/* ── question ── */
.qcat{font-size:.67rem;font-family:'Space Mono',monospace;color:#7070a0;margin-bottom:6px;display:flex;align-items:center;flex-wrap:wrap;gap:5px}
.badge{display:inline-flex;align-items:center;padding:2px 9px;border-radius:20px;font-size:.66rem;font-family:'Space Mono',monospace;font-weight:700}
.b-c{background:rgba(0,245,255,.12);border:1px solid rgba(0,245,255,.35);color:var(--cyan)}
.b-g{background:rgba(255,215,0,.12);border:1px solid rgba(255,215,0,.35);color:var(--gold)}
.b-p{background:rgba(255,110,180,.12);border:1px solid rgba(255,110,180,.35);color:var(--pink)}
.tricky-tag{background:rgba(255,100,160,.15);border:1px solid rgba(255,100,160,.4);color:var(--pink);font-size:.6rem;padding:2px 8px;border-radius:20px;font-family:'Space Mono',monospace}

.qcard{background:var(--sf);border:1px solid var(--border);border-radius:16px;padding:22px 18px;margin-bottom:12px}
.qcard.shake{animation:shake .38s ease}
.qcard.pop{animation:pop .35s ease}
@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-8px)}75%{transform:translateX(8px)}}
@keyframes pop{0%{transform:scale(1)}40%{transform:scale(1.025)}100%{transform:scale(1)}}

.qtext{font-size:1.05rem;font-weight:700;line-height:1.75;margin-bottom:2px}
.blank{display:inline-block;min-width:80px;border-bottom:2px solid var(--cyan);padding:0 6px;color:var(--cyan);font-family:'Space Mono',monospace;text-align:center}

.opts{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:15px}
@media(max-width:380px){.opts{grid-template-columns:1fr}}
.opt{padding:13px 14px;border-radius:11px;border:2px solid var(--border);background:var(--sf2);color:var(--text);font-family:'Space Mono',monospace;font-size:.92rem;font-weight:700;cursor:pointer;transition:all .16s;text-align:center}
.opt:hover:not(:disabled){border-color:var(--cyan);background:rgba(0,245,255,.08);transform:translateY(-2px)}
.opt:disabled{cursor:default}
.opt.oc{border-color:var(--green)!important;background:rgba(57,255,20,.1)!important;color:var(--green)!important;box-shadow:0 0 14px rgba(57,255,20,.25)}
.opt.ow{border-color:var(--red)!important;background:rgba(255,68,68,.1)!important;color:var(--red)!important}
.opt.dim{opacity:.35}

.fill-row{display:flex;gap:8px;margin-top:15px;flex-wrap:wrap}
.fill-in{flex:1;min-width:140px;padding:13px 15px;border-radius:11px;border:2px solid var(--border);background:var(--sf2);color:var(--text);font-family:'Space Mono',monospace;font-size:.95rem;outline:none;transition:border-color .18s}
.fill-in:focus{border-color:var(--cyan)}
.fill-in.fc{border-color:var(--green);color:var(--green)}
.fill-in.fw{border-color:var(--red);color:var(--red)}
.hint{font-size:.71rem;color:#7070a0;font-family:'Space Mono',monospace;margin-top:7px}

.sub-btn{padding:13px 18px;border-radius:11px;border:2px solid var(--cyan);background:rgba(0,245,255,.08);color:var(--cyan);font-family:'Space Mono',monospace;font-weight:700;font-size:.88rem;cursor:pointer;transition:all .18s;white-space:nowrap}
.sub-btn:hover:not(:disabled){background:rgba(0,245,255,.18);transform:scale(1.02)}
.sub-btn:disabled{opacity:.35;cursor:default}

.exp{margin-top:13px;padding:13px 15px;border-radius:11px;background:var(--sf2);border-left:3px solid;animation:fadeUp .28s ease}
.exp.ec{border-color:var(--green)}
.exp.ew{border-color:var(--red)}
@keyframes fadeUp{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}
.exp-hd{font-weight:700;font-size:.88rem;margin-bottom:5px;display:flex;align-items:center;gap:6px}
.exp-ok{color:var(--green)}
.exp-ng{color:var(--red)}
.exp-ans{font-family:'Space Mono',monospace;color:var(--cyan);font-weight:700}
.exp-txt{font-size:.8rem;line-height:1.7;color:var(--text)}

.next-btn{width:100%;padding:15px;border-radius:12px;border:none;background:linear-gradient(135deg,#004560,#007090);color:#fff;font-family:'Orbitron',sans-serif;font-size:.88rem;font-weight:700;letter-spacing:.06em;cursor:pointer;transition:all .18s;margin-top:8px}
.next-btn:hover{transform:translateY(-2px);filter:brightness(1.15);box-shadow:0 4px 20px rgba(0,180,220,.4)}

/* ── combo toast ── */
.toast{position:fixed;top:65px;left:50%;transform:translateX(-50%);font-family:'Orbitron',sans-serif;font-size:1.5rem;font-weight:900;pointer-events:none;animation:toast .85s ease forwards;z-index:200;white-space:nowrap}
@keyframes toast{0%{opacity:0;transform:translateX(-50%) translateY(0) scale(.6)}20%{opacity:1;transform:translateX(-50%) translateY(-4px) scale(1.1)}70%{opacity:1;transform:translateX(-50%) translateY(-10px) scale(1)}100%{opacity:0;transform:translateX(-50%) translateY(-22px) scale(.9)}}

/* ── result ── */
.rank{font-family:'Orbitron',sans-serif;font-size:5.5rem;font-weight:900;text-align:center;line-height:1;margin:8px 0 3px;animation:rankpop .5s ease}
@keyframes rankpop{0%{transform:scale(.25);opacity:0}60%{transform:scale(1.18);opacity:1}100%{transform:scale(1)}}
.rank-msg{text-align:center;font-weight:700;font-size:.95rem;color:#7070a0;margin-bottom:18px}

.stats-g{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin-bottom:14px}
.stat-c{background:var(--sf2);border:1px solid var(--border);border-radius:12px;padding:14px 8px;text-align:center}
.stat-v{font-family:'Orbitron',sans-serif;font-size:1.3rem;font-weight:700;color:var(--cyan)}
.stat-l{font-size:.62rem;color:#7070a0;margin-top:4px;font-family:'Space Mono',monospace}

.streak{display:flex;gap:3px;flex-wrap:wrap;justify-content:center;margin-bottom:14px}
.sdot{width:17px;height:17px;border-radius:4px;font-size:.58rem;display:flex;align-items:center;justify-content:center;font-weight:700}
.sdot.ok{background:rgba(57,255,20,.2);border:1px solid var(--green);color:var(--green)}
.sdot.ng{background:rgba(255,68,68,.2);border:1px solid var(--red);color:var(--red)}

.wlist{display:flex;flex-direction:column;gap:9px}
.wi{background:var(--sf2);border:1px solid rgba(255,68,68,.18);border-radius:11px;padding:13px 15px}
.wi-q{font-weight:700;font-size:.88rem;margin-bottom:5px}
.wi-a{font-size:.78rem;color:#7070a0;font-family:'Space Mono',monospace}
.wc{color:var(--green)}
.wy{color:var(--red)}
.wi-e{font-size:.74rem;color:#9090b0;margin-top:5px;line-height:1.65}

.act-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px}
.a-btn{padding:13px;border-radius:12px;border:2px solid;cursor:pointer;font-family:'Orbitron',sans-serif;font-size:.72rem;font-weight:700;letter-spacing:.05em;transition:all .18s}
.a-btn:hover{transform:translateY(-2px);filter:brightness(1.2)}
.a-retry{border-color:var(--cyan);background:rgba(0,245,255,.08);color:var(--cyan)}
.a-wrong{border-color:var(--pink);background:rgba(255,110,180,.08);color:var(--pink)}
.a-home{border-color:#555575;background:transparent;color:#8080a0}
.a-full{grid-column:1/-1}
`;

// ── component ──────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("home"); // home | intro | drill | result
  const [level, setLevel] = useState("grade3");
  const [qCount, setQCount] = useState(10);
  const [questions, setQuestions] = useState([]);
  const [cur, setCur] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [selected, setSelected] = useState(null);
  const [fill, setFill] = useState("");
  const [shown, setShown] = useState(false); // explanation shown
  const [wrongs, setWrongs] = useState([]);
  const [streak, setStreak] = useState([]);
  const [total, setTotal] = useState(0);
  const [anim, setAnim] = useState(""); // "shake" | "pop"
  const [toastKey, setToastKey] = useState(0);
  const [toastMsg, setToastMsg] = useState(null);
  const inputRef = useRef(null);

  const q = questions[cur];

  // start game
  const startGame = useCallback(
    (lvl, cnt, customQs) => {
      const qs = customQs ?? pickQuestions(lvl, cnt);
      setQuestions(qs);
      setCur(0);
      setScore(0);
      setCombo(0);
      setMaxCombo(0);
      setSelected(null);
      setFill("");
      setShown(false);
      setWrongs([]);
      setStreak([]);
      setTotal(0);
      setAnim("");
      setToastMsg(null);
      setScreen("drill");
    },
    []
  );

  // answer handler
  const handleAnswer = useCallback(
    (ans) => {
      if (shown) return;
      const correct =
        ans.trim().toLowerCase() === q.answer.trim().toLowerCase();
      setSelected(ans);
      setShown(true);
      setTotal((t) => t + 1);

      if (correct) {
        const nc = combo + 1;
        setCombo(nc);
        setMaxCombo((m) => Math.max(m, nc));
        const bonus = Math.min(nc - 1, 5) * 15;
        setScore((s) => s + 100 + bonus);
        setStreak((h) => [...h, true]);
        setAnim("pop");
        setTimeout(() => setAnim(""), 400);
        const msg = getComboMsg(nc);
        if (msg && nc > 1) {
          setToastMsg(msg);
          setToastKey((k) => k + 1);
        }
      } else {
        setCombo(0);
        setToastMsg(null);
        setWrongs((w) => [...w, { ...q, yourAnswer: ans }]);
        setStreak((h) => [...h, false]);
        setAnim("shake");
        setTimeout(() => setAnim(""), 450);
      }
    },
    [shown, q, combo]
  );

  // next question
  const next = useCallback(() => {
    if (cur + 1 >= questions.length) {
      setScreen("result");
    } else {
      setCur((c) => c + 1);
      setSelected(null);
      setFill("");
      setShown(false);
      setAnim("");
    }
  }, [cur, questions.length]);

  // keyboard
  useEffect(() => {
    const onKey = (e) => {
      if (screen !== "drill") return;
      if (e.key === "Enter") {
        if (shown) {
          next();
        } else if (q?.type === "fill" && fill.trim()) {
          handleAnswer(fill);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [screen, shown, next, q, fill, handleAnswer]);

  // auto-focus fill input
  useEffect(() => {
    if (screen === "drill" && q?.type === "fill") {
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [cur, screen, q]);

  const accuracy =
    total > 0 ? Math.round(((total - wrongs.length) / total) * 100) : 0;

  const rank = (() => {
    if (accuracy === 100) return { label: "S", color: "#ffd700", msg: "🎉 完璧！ Perfect Score!" };
    if (accuracy >= 90) return { label: "A", color: "#00f5ff", msg: "✨ 素晴らしい！" };
    if (accuracy >= 75) return { label: "B", color: "#90ff90", msg: "👍 よくできました！" };
    if (accuracy >= 55) return { label: "C", color: "#ffb347", msg: "📖 苦手を復習しよう" };
    return { label: "D", color: "#ff6b6b", msg: "💪 もう一度チャレンジ！" };
  })();

  const isCorrect =
    selected !== null &&
    selected.trim().toLowerCase() === (q?.answer ?? "").trim().toLowerCase();

  // ── HOME ──────────────────────────────────────────────────
  if (screen === "home") {
    return (
      <>
        <style>{CSS}</style>
        <div className="app">
          <div className="bg-grid" />
          <div className="glow g1" />
          <div className="glow g2" />
          <div className="glow g3" />
          <div className="wrap">
            <div className="home-logo">
              <span className="logo-c">英検</span> GRAMMAR<br />
              <span className="logo-g">DRILL</span> MASTER
            </div>
            <div className="home-sub">関係詞 ＆ 分詞 完全攻略 — 108問収録</div>

            <div className="card">
              <div className="clabel">📊 レベル選択</div>
              <div className="level-grid">
                {[
                  { key: "grade3", icon: "🌊", name: "３級", desc: "who / which / that\n現在・過去分詞" },
                  { key: "pre2",   icon: "⚡", name: "準２級", desc: "whose / where / when\n分詞構文" },
                  { key: "all",    icon: "🔥", name: "全レベル", desc: "３級 ＋ 準２級\nMIX" },
                ].map((l) => (
                  <button
                    key={l.key}
                    className={`lvl-btn ${level === l.key ? `act-${l.key}` : ""}`}
                    onClick={() => setLevel(l.key)}
                  >
                    <span className="lvl-icon">{l.icon}</span>
                    <span className="lvl-name">{l.name}</span>
                    <span className="lvl-desc" style={{ whiteSpace: "pre-line" }}>
                      {l.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="clabel">❓ 問題数</div>
              <div className="cnt-grid">
                {[10, 20, 30, 50].map((n) => (
                  <button
                    key={n}
                    className={`cnt-btn ${qCount === n ? "act" : ""}`}
                    onClick={() => setQCount(n)}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div className="info-box">
              <div style={{ color: "var(--cyan)", fontFamily: "'Space Mono',monospace", fontSize: ".68rem", letterSpacing: ".1em", marginBottom: 6 }}>🎯 FEATURES</div>
              ・<b style={{ color: "var(--pink)" }}>⚠ ひっかけ問題</b>（what vs that, which vs where など）を特別マーク<br />
              ・連続正解で <b style={{ color: "var(--gold)" }}>コンボボーナス</b> スコアUP！<br />
              ・間違えた問題は <b style={{ color: "var(--green)" }}>苦手だけ再ドリル</b> できる<br />
              ・Enterキー で素早く次の問題へ<br />
              ・毎回 <b style={{ color: "var(--cyan)" }}>ランダム出題</b>（ひっかけ約38%を確保）
            </div>

            <button
              className={`start-btn s-${level}`}
              onClick={() => setScreen("intro")}
            >
              📖 導入レッスン → ゲームへ
            </button>
            <button
              style={{ width: "100%", marginTop: 8, padding: "12px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "#6b7280", fontFamily: "'Space Mono',monospace", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", letterSpacing: "0.04em" }}
              onClick={() => startGame(level, qCount)}
            >
              スキップしてゲームへ →
            </button>
          </div>
        </div>
      </>
    );
  }

  // ── INTRO ─────────────────────────────────────────────────
  if (screen === "intro") {
    return (
      <>
        <style>{CSS}</style>
        <div className="app">
          <div className="bg-grid" />
          <div className="glow g1" />
          <div className="glow g2" />
          <div className="glow g3" />
          <div className="wrap">
            <IntroScreen
              level={level}
              onStart={() => startGame(level, qCount)}
            />
          </div>
        </div>
      </>
    );
  }

  // ── DRILL ─────────────────────────────────────────────────
  if (screen === "drill" && q) {
    const levelColor = q.level === "grade3" ? "b-c" : "b-g";
    const levelLabel = q.level === "grade3" ? "３級" : "準２級";

    return (
      <>
        <style>{CSS}</style>
        <div className="app">
          <div className="bg-grid" />
          <div className="glow g1" />
          <div className="glow g2" />
          <div className="wrap">
            {/* combo toast */}
            {toastMsg && (
              <div
                key={toastKey}
                className="toast"
                style={{ color: toastMsg.color, textShadow: `0 0 20px ${toastMsg.color}` }}
              >
                {toastMsg.text} ×{combo}
              </div>
            )}

            {/* header */}
            <div className="drillhd">
              <div className="score">{score.toLocaleString()}</div>
              <div className="pb-wrap">
                <div className="pb-track">
                  <div className="pb-fill" style={{ width: `${((cur + 1) / questions.length) * 100}%` }} />
                </div>
                <span className="pb-num">{cur + 1}/{questions.length}</span>
              </div>
              {combo >= 2 && (
                <div className={`combo-badge ${combo >= 5 ? "hot" : ""}`}>🔥×{combo}</div>
              )}
            </div>

            {/* category */}
            <div className="qcat">
              <span className={`badge ${levelColor}`}>{levelLabel}</span>
              <span>{q.category}</span>
              {q.tricky && <span className="tricky-tag">⚠ ひっかけ</span>}
            </div>

            {/* question card */}
            <div className={`qcard ${anim}`}>
              <div className="qtext">
                {q.sentence.split("_____").map((part, i, arr) => (
                  <span key={i}>
                    {part}
                    {i < arr.length - 1 && (
                      <span className="blank">{shown ? q.answer : "　　　"}</span>
                    )}
                  </span>
                ))}
              </div>

              {/* multiple choice */}
              {q.type === "multiple" && (
                <div className="opts">
                  {q.options.map((opt) => {
                    let cls = "opt";
                    if (shown) {
                      if (opt === q.answer) cls += " oc";
                      else if (opt === selected) cls += " ow";
                      else cls += " dim";
                    }
                    return (
                      <button
                        key={opt}
                        className={cls}
                        disabled={shown}
                        onClick={() => handleAnswer(opt)}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* fill */}
              {q.type === "fill" && (
                <div>
                  <div className="fill-row">
                    <input
                      ref={inputRef}
                      className={`fill-in ${shown ? (isCorrect ? "fc" : "fw") : ""}`}
                      value={fill}
                      onChange={(e) => setFill(e.target.value)}
                      placeholder="答えを入力…"
                      disabled={shown}
                    />
                    {!shown && (
                      <button
                        className="sub-btn"
                        disabled={!fill.trim()}
                        onClick={() => handleAnswer(fill)}
                      >
                        決定
                      </button>
                    )}
                  </div>
                  {q.hint && <div className="hint">💡 {q.hint}</div>}
                </div>
              )}

              {/* explanation */}
              {shown && (
                <div className={`exp ${isCorrect ? "ec" : "ew"}`}>
                  <div className="exp-hd">
                    {isCorrect ? (
                      <span className="exp-ok">✓ 正解！</span>
                    ) : (
                      <span className="exp-ng">
                        ✗ 不正解 → 正解:{" "}
                        <span className="exp-ans">{q.answer}</span>
                      </span>
                    )}
                  </div>
                  <div className="exp-txt">{q.explanation || q.hint}</div>
                </div>
              )}
            </div>

            {shown && (
              <button className="next-btn" onClick={next}>
                {cur + 1 >= questions.length
                  ? "結果を見る →"
                  : "次の問題 → (Enter)"}
              </button>
            )}
          </div>
        </div>
      </>
    );
  }

  // ── RESULT ────────────────────────────────────────────────
  if (screen === "result") {
    const correct = total - wrongs.length;
    return (
      <>
        <style>{CSS}</style>
        <div className="app">
          <div className="bg-grid" />
          <div className="glow g1" />
          <div className="glow g2" />
          <div className="wrap">
            <div
              className="rank"
              style={{ color: rank.color, textShadow: `0 0 32px ${rank.color}, 0 0 60px ${rank.color}40` }}
            >
              {rank.label}
            </div>
            <div className="rank-msg">{rank.msg}</div>

            {/* streak dots */}
            <div className="streak">
              {streak.map((ok, i) => (
                <div key={i} className={`sdot ${ok ? "ok" : "ng"}`}>
                  {ok ? "○" : "×"}
                </div>
              ))}
            </div>

            {/* stats */}
            <div className="stats-g">
              <div className="stat-c">
                <div className="stat-v">{score.toLocaleString()}</div>
                <div className="stat-l">SCORE</div>
              </div>
              <div className="stat-c">
                <div className="stat-v">{accuracy}%</div>
                <div className="stat-l">ACCURACY</div>
              </div>
              <div className="stat-c">
                <div className="stat-v" style={{ color: "var(--gold)" }}>×{maxCombo}</div>
                <div className="stat-l">MAX COMBO</div>
              </div>
            </div>

            <div className="card">
              <div className="clabel">📈 スコア詳細</div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".85rem", marginBottom: 6 }}>
                <span>正解数</span>
                <span style={{ fontFamily: "'Space Mono',monospace", color: "var(--green)" }}>
                  {correct} / {total}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".85rem" }}>
                <span>レベル</span>
                <span className={`badge ${level === "grade3" ? "b-c" : level === "pre2" ? "b-g" : "b-p"}`}>
                  {level === "grade3" ? "３級" : level === "pre2" ? "準２級" : "全レベル"}
                </span>
              </div>
            </div>

            {/* wrong answers */}
            {wrongs.length > 0 && (
              <div className="card">
                <div className="clabel">❌ 間違えた問題（{wrongs.length}問）</div>
                <div className="wlist">
                  {wrongs.map((w, i) => (
                    <div key={i} className="wi">
                      <div className="wi-q">
                        {w.sentence.replace("_____", `[${w.answer}]`)}
                      </div>
                      <div className="wi-a">
                        <span className="wc">正解: {w.answer}</span>
                        {" / "}
                        <span className="wy">あなた: {w.yourAnswer}</span>
                      </div>
                      {w.explanation && (
                        <div className="wi-e">{w.explanation}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* actions */}
            <div className="act-grid">
              <button
                className="a-btn a-retry"
                onClick={() => startGame(level, qCount)}
              >
                🔄 もう一度
              </button>
              {wrongs.length > 0 ? (
                <button
                  className="a-btn a-wrong"
                  onClick={() => startGame(level, wrongs.length, [...wrongs])}
                >
                  💪 苦手だけ
                </button>
              ) : (
                <button
                  className="a-btn a-retry"
                  onClick={() => startGame(level, qCount)}
                >
                  🎯 次のセット
                </button>
              )}
              <button
                className="a-btn a-home"
                onClick={() => setScreen("intro")}
                style={{ borderColor: "#4b5563", color: "#9ca3af" }}
              >
                📖 導入レッスンを復習
              </button>
              <button
                className="a-btn a-home"
                onClick={() => setScreen("home")}
              >
                🏠 ホームへ戻る
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return null;
}
