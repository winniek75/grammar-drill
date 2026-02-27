// IntroScreen.jsx — 説明資料に基づく完全再構築版
// C1(who/which/that) → C2(what/that) → C3(-ing/-ed) → C4(exciting/excited) → まとめテスト

import { useState, useRef } from "react";

// ── グローバルCSS ─────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Paytone+One&family=Zen+Maru+Gothic:wght@400;500;700;900&display=swap');

.il * { box-sizing: border-box; margin: 0; padding: 0; }
.il { font-family: "Zen Maru Gothic", "Noto Sans JP", sans-serif; }

.il .icard {
  background: white;
  border: 2.5px solid #1a1a2e;
  border-radius: 18px;
  padding: 18px;
  margin-bottom: 16px;
  box-shadow: 5px 5px 0 #1a1a2e;
}
.il .icard.red  { border-color:#ef6b6b; box-shadow:5px 5px 0 #ef6b6b; }
.il .icard.yel  { border-color:#ffc947; box-shadow:5px 5px 0 #ffc947; }
.il .icard.grn  { border-color:#06d6a0; box-shadow:5px 5px 0 #06d6a0; }
.il .icard.pur  { border-color:#a78bfa; box-shadow:5px 5px 0 #a78bfa; }
.il .icard.blu  { border-color:#118ab2; box-shadow:5px 5px 0 #118ab2; }

.il .itag {
  font-family: "Paytone One", "Nunito", sans-serif;
  font-size: 0.62rem; letter-spacing: 0.8px;
  border-radius: 99px; padding: 3px 11px;
  display: inline-block; margin-bottom: 8px;
  color: white; background: #1a1a2e;
}
.il .icard.red .itag  { background:#ef6b6b; }
.il .icard.yel .itag  { background:#ffc947; color:#1a1a2e; }
.il .icard.grn .itag  { background:#06d6a0; }
.il .icard.pur .itag  { background:#a78bfa; }
.il .icard.blu .itag  { background:#118ab2; }

.il .icard h2 {
  font-family: "Paytone One", "Nunito", sans-serif;
  font-size: 1.08rem; margin-bottom: 10px; line-height: 1.3; color:#1a1a2e;
}
.il .icard p { font-size: 0.87rem; line-height: 1.85; margin-bottom: 7px; color:#333; }

.il .italk {
  display: grid; grid-template-columns: auto 1fr;
  gap: 10px; align-items: start;
  background: #e8f4fd; border: 2px solid #1a1a2e;
  border-radius: 14px; padding: 12px; margin: 10px 0;
}
.il .italk-icon { font-size: 2.2rem; line-height: 1; }
.il .italk-text {
  background: white; border: 2px solid #1a1a2e;
  border-radius: 12px 12px 12px 0;
  padding: 10px 12px; font-size: 0.85rem; line-height: 1.8; color:#1a1a2e;
}
.il .italk-text b { color: #ef6b6b; }
.il .iten {
  font-family: "Paytone One", "Nunito", sans-serif;
  font-size: 0.9rem; color: #118ab2;
  display: block; margin-top: 5px;
}

.il .isbox {
  background: #e8f4fd; border: 2.5px dashed #1a1a2e;
  border-radius: 13px; padding: 13px 15px; margin: 9px 0;
  display: flex; flex-wrap: wrap; align-items: center; gap: 5px;
  font-family: "Paytone One", "Nunito", sans-serif;
  font-size: 0.95rem; color: #073b4c; line-height: 1.9;
}
.il .chip {
  border: 2px solid #1a1a2e; border-radius: 8px; padding: 3px 9px;
  font-size: 0.8rem; font-family: "Zen Maru Gothic", sans-serif;
  font-weight: 700; background: white;
}
.il .chip.r { background:#ffd6d6; border-color:#ef6b6b; }
.il .chip.g { background:#d0f7eb; border-color:#06d6a0; }
.il .chip.p { background:#ece0ff; border-color:#a78bfa; }
.il .chip.y { background:#fff3cc; border-color:#ffc947; }
.il .chip.b { background:#d6eaff; border-color:#118ab2; }

.il .hr { background:#ffd6d6; border-radius:4px; padding:1px 5px; }
.il .hg { background:#d0f7eb; border-radius:4px; padding:1px 5px; }
.il .hp { background:#ece0ff; border-radius:4px; padding:1px 5px; }
.il .hy { background:#fff3cc; border-radius:4px; padding:1px 5px; }
.il .hb { background:#d6eaff; border-radius:4px; padding:1px 5px; }

.il .ivs { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 10px 0; }
.il .ivs-box {
  border-radius: 14px; padding: 13px;
  font-size: 0.8rem; line-height: 1.75; text-align: center;
}
.il .ivs-box h3 {
  font-family: "Paytone One", "Nunito", sans-serif;
  font-size: 1.15rem; margin-bottom: 6px;
}

.il .istep { display: flex; align-items: center; gap: 0; margin: 10px 0; flex-wrap: wrap; }
.il .istep-box {
  background: white; border: 2px solid #1a1a2e;
  border-radius: 10px; padding: 8px 11px;
  font-size: 0.8rem; font-weight: 700; line-height: 1.5;
  flex: 1; min-width: 100px;
}
.il .istep-arr { font-size: 1.2rem; padding: 0 4px; color: #aaa; }

.il .irtable { width:100%; border-collapse:collapse; margin:8px 0; font-size:.8rem; }
.il .irtable th {
  background:#1a1a2e; color:white; padding:7px 9px; text-align:left;
  font-family:"Paytone One","Nunito",sans-serif; font-size:.72rem;
}
.il .irtable td { padding:7px 9px; border-bottom:1.5px solid #eee; vertical-align:top; line-height:1.6; }
.il .irtable .ef { font-family:"Paytone One","Nunito",sans-serif; font-size:.88rem; color:#118ab2; }

.il .iquiz {
  background: white; border: 2.5px solid #1a1a2e;
  border-radius: 14px; padding: 15px; margin-bottom: 13px;
  box-shadow: 4px 4px 0 #1a1a2e;
}
.il .iquiz-q { font-size: 0.88rem; font-weight: 900; margin-bottom: 11px; line-height: 1.85; color: #1a1a2e; }
.il .blank-box {
  display: inline-block; background: #ffd166;
  border-bottom: 3px solid #1a1a2e;
  min-width: 74px; padding: 1px 9px;
  border-radius: 7px; text-align: center;
  font-family: "Paytone One","Nunito", sans-serif;
}
.il .ichoices { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px; }
.il .ich {
  padding: 11px 6px; border: 2.5px solid #1a1a2e;
  border-radius: 12px; background: white;
  font-family: "Paytone One","Nunito", sans-serif;
  font-size: 0.95rem; cursor: pointer;
  transition: all 0.13s; text-align: center;
  box-shadow: 3px 3px 0 #1a1a2e; line-height: 1.2; color: #1a1a2e;
}
.il .ich:hover:not(.ioff) { background: #ffd166; transform: translateY(-2px); }
.il .ich.iok { background:#06d6a0; border-color:#06d6a0; color:white; box-shadow:3px 3px 0 #04a07a; }
.il .ich.ing { background:#ef6b6b; border-color:#ef6b6b; color:white; box-shadow:3px 3px 0 #bf3030; }
.il .ich.ioff { cursor:default; opacity:0.45; }
.il .ifb {
  background: #e8f4fd; border-radius: 10px;
  padding: 10px 13px; font-size: 0.82rem; line-height: 1.75;
  display: none; color: #1a1a2e;
}
.il .ifb.ion { display: block; animation: ifadeUp 0.28s ease; }
.il .ifb.iok { border-left: 4px solid #06d6a0; }
.il .ifb.ing { border-left: 4px solid #ef6b6b; }

.il .iblabel { font-size:.7rem; font-weight:700; color:#999; margin:8px 0 4px; }
.il .ibank {
  display:flex; flex-wrap:wrap; gap:6px;
  padding:9px; background:#f5f5f5;
  border:2px dashed #ccc; border-radius:10px; min-height:42px;
}
.il .idrop {
  display:flex; flex-wrap:wrap; gap:6px;
  padding:10px; background:white;
  border:2.5px solid #1a1a2e; border-radius:10px;
  min-height:48px; align-items:center;
}
.il .iwchip {
  background:white; border:2px solid #1a1a2e;
  border-radius:8px; padding:4px 10px;
  font-size:0.8rem; font-family:"Zen Maru Gothic",sans-serif;
  font-weight:700; cursor:pointer; transition:all .13s; user-select:none;
}
.il .iwchip:hover { background:#ffd166; transform:translateY(-2px); }
.il .iwchip.inbank { background:#fff3cc; border-color:#c08000; }
.il .ibbtns { display:flex; gap:8px; margin-top:9px; flex-wrap:wrap; }
.il .ibcheck {
  padding:9px 18px; border:2.5px solid #1a1a2e;
  border-radius:99px; background:#1a1a2e; color:white;
  font-family:"Paytone One","Nunito",sans-serif; font-size:.83rem;
  cursor:pointer; transition:all .13s; box-shadow:3px 3px 0 #444;
}
.il .ibcheck:hover { transform:translateY(-2px); }
.il .ibreset {
  padding:9px 14px; border:2.5px solid #ccc;
  border-radius:99px; background:white; color:#888;
  font-family:"Paytone One","Nunito",sans-serif; font-size:.83rem; cursor:pointer;
}

.il .inavbtns { display:flex; gap:10px; justify-content:center; margin-top:22px; flex-wrap:wrap; }
.il .inbtn {
  padding:12px 26px; border:2.5px solid #1a1a2e;
  border-radius:99px; background:#1a1a2e; color:white;
  font-family:"Paytone One","Nunito",sans-serif; font-size:.88rem;
  cursor:pointer; box-shadow:4px 4px 0 #444; transition:all .13s;
}
.il .inbtn:hover { transform:translateY(-2px); box-shadow:4px 6px 0 #444; }
.il .inbtn.back { background:white; color:#1a1a2e; box-shadow:4px 4px 0 #1a1a2e; }

.il .iscorebar {
  background:#1a1a2e; color:white; border-radius:99px;
  padding:8px 18px;
  font-family:"Paytone One","Nunito",sans-serif;
  font-size:.82rem; text-align:center; margin-bottom:14px;
  display:flex; align-items:center; justify-content:center; gap:10px;
}
.il .isnum { font-size:1.35rem; color:#ffd166; }

.il .idots { display:flex; gap:5px; justify-content:center; margin-bottom:18px; flex-wrap:wrap; }
.il .idot {
  width:42px; height:42px; border-radius:50%;
  border:2.5px solid #ccc; background:white;
  display:flex; align-items:center; justify-content:center;
  cursor:pointer; transition:all .2s;
  flex-direction:column; gap:1px;
  box-shadow:2px 2px 0 #ddd;
}
.il .idot-icon { font-size:.95rem; }
.il .idot-lbl { font-size:.46rem; font-weight:900; color:#aaa; font-family:"Nunito",sans-serif; }
.il .idot.ion { border-color:#1a1a2e; background:#1a1a2e; color:white; transform:scale(1.15); box-shadow:3px 3px 0 #444; }
.il .idot.ion .idot-lbl { color:#ffd166; }
.il .idot.iok { border-color:#06d6a0; background:#06d6a0; color:white; }
.il .idot.iok .idot-lbl { color:white; }

.il .ihero { text-align:center; padding:18px 10px 14px; }
.il .ihero-icon { font-size:3rem; display:block; margin-bottom:6px; animation:ibob 2.4s infinite ease-in-out; }
.il .ihero h1 { font-family:"Paytone One","Nunito",sans-serif; font-size:clamp(1.25rem,4.5vw,1.85rem); line-height:1.25; margin-bottom:5px; color:#1a1a2e; }
.il .imark { background:#ffd166; border-radius:7px; padding:1px 8px; font-style:italic; }
.il .ihero-note { font-size:.8rem; color:#777; font-weight:500; }

.il .iresult-big { text-align:center; padding:18px 12px 12px; }
.il .iresult-emoji { font-size:3rem; margin-bottom:7px; }
.il .iresult-score {
  font-family:"Paytone One","Nunito",sans-serif; font-size:2.4rem;
  background:linear-gradient(135deg,#ef6b6b,#a78bfa,#118ab2);
  -webkit-background-clip:text; -webkit-text-fill-color:transparent; margin:5px 0;
}
.il .iresult-rank { font-size:.88rem; color:#555; font-weight:700; }

.il .ihome-grid { display:grid; grid-template-columns:1fr 1fr; gap:11px; margin:16px 0; }
.il .ihcard {
  background:white; border:2.5px solid #1a1a2e;
  border-radius:16px; padding:14px; cursor:pointer;
  transition:all .18s; box-shadow:4px 4px 0 #1a1a2e; text-align:left;
}
.il .ihcard:hover { transform:translateY(-3px); box-shadow:4px 7px 0 #1a1a2e; }
.il .ihnum { font-family:"Paytone One","Nunito",sans-serif; font-size:1.55rem; line-height:1; }
.il .ihtitle { font-size:.72rem; font-weight:700; margin-top:4px; color:#444; line-height:1.45; }
.il .ihbadge { font-size:.63rem; border-radius:99px; padding:2px 9px; display:inline-block; margin-top:6px; font-weight:900; }

@keyframes ibob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
@keyframes ifadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
`;

// ── クイズ状態フック ─────────────────────────────────────────
function useQuiz() {
  const [answers, setAnswers] = useState({});
  const answer = (qid, choice, correct, msg) => {
    setAnswers(prev => prev[qid] ? prev : { ...prev, [qid]: { choice, correct, msg } });
  };
  return { answers, answer };
}

// ── 単語並べ替え ─────────────────────────────────────────────
function WordBuild({ words, correctOrder, hint }) {
  const [bank, setBank] = useState(() => [...words].sort(() => Math.random() - 0.5));
  const [placed, setPlaced] = useState([]);
  const [fb, setFb] = useState(null);
  const [animCls, setAnimCls] = useState("");

  const toPlaced = (w, i) => { setBank(b => b.filter((_, j) => j !== i)); setPlaced(p => [...p, w]); setFb(null); };
  const toBank   = (w, i) => { setPlaced(p => p.filter((_, j) => j !== i)); setBank(b => [...b, w]); setFb(null); };

  const check = () => {
    const ok = JSON.stringify(placed) === JSON.stringify(correctOrder);
    setFb({ ok, msg: (ok ? "✅ 正解！ すごい！" : "❌ もう一度考えてみよう！\n") + (ok ? "" : hint) });
    setAnimCls(ok ? "ipop" : "ishake");
    setTimeout(() => setAnimCls(""), 400);
  };
  const reset = () => { setBank([...words].sort(() => Math.random() - 0.5)); setPlaced([]); setFb(null); };

  return (
    <div>
      <div className="iblabel">🃏 単語をタップして下に並べよう</div>
      <div className="ibank">
        {bank.length === 0
          ? <span style={{ color:"#ccc", fontSize:".74rem" }}>全部並べたよ！</span>
          : bank.map((w, i) => <div key={i} className="iwchip" onClick={() => toPlaced(w, i)}>{w}</div>)
        }
      </div>
      <div className="iblabel">📝 あなたの答え（タップで戻せる）</div>
      <div className={`idrop ${animCls}`} style={{ minHeight: 50 }}>
        {placed.length === 0
          ? <span style={{ color:"#ccc", fontSize:".74rem" }}>ここに並べよう</span>
          : placed.map((w, i) => <div key={i} className="iwchip inbank" onClick={() => toBank(w, i)}>{w}</div>)
        }
      </div>
      <div className="ibbtns">
        <button className="ibcheck" onClick={check}>✅ 答え合わせ</button>
        <button className="ibreset" onClick={reset}>🔄 リセット</button>
      </div>
      {fb && (
        <div className={`ifb ion ${fb.ok ? "iok" : "ing"}`} style={{ whiteSpace: "pre-wrap", marginTop: 8 }}>
          {fb.msg}
          {!fb.ok && <><br /><small style={{ opacity:.8 }}>{hint}</small></>}
        </div>
      )}
    </div>
  );
}

// ── クイズ問題 ───────────────────────────────────────────────
function Quiz({ qid, question, choices, answers, answer }) {
  const a = answers[qid];
  return (
    <div className="iquiz">
      <div className="iquiz-q" dangerouslySetInnerHTML={{ __html: question }} />
      <div className="ichoices">
        {choices.map(({ label, correct, msg }) => {
          let cls = "ich";
          if (a) { if (label === a.choice) cls += correct ? " iok" : " ing"; else cls += " ioff"; }
          return (
            <button key={label} className={cls} onClick={() => answer(qid, label, correct, msg)}>
              {label}
            </button>
          );
        })}
      </div>
      {a && <div className={`ifb ion ${a.correct ? "iok" : "ing"}`}>{a.correct ? "✅ " : "❌ "}{a.msg}</div>}
    </div>
  );
}

// ════════════════════════════════════════════════
//  コース1: who / which / that
// ════════════════════════════════════════════════
function CourseC1({ onNext }) {
  const { answers, answer } = useQuiz();
  return (
    <div>
      <div className="ihero">
        <span className="ihero-icon">🧩</span>
        <h1>コース1<br /><span className="imark">うしろから説明してみよう</span></h1>
        <p className="ihero-note">who・which・that のつかい方</p>
      </div>

      <div className="icard red">
        <span className="itag">なぜこの形を使うの？</span>
        <h2>「あの子」だけじゃ伝わらない！</h2>
        <p>友達に「あの子に話しかけて！」と頼むとき、「あの子」だけじゃ誰かわからないよね。</p>
        <div className="italk"><div className="italk-icon">🧒</div><div className="italk-text">「あの子に話しかけて！」<br />👂「…え、誰？」</div></div>
        <div className="italk"><div className="italk-icon">🧒</div>
          <div className="italk-text">「<b>ピアノを弾いている</b>あの子に話しかけて！」<br />👂「あ、わかった！」✅<br /><br />「ピアノを弾いている」がくわしい説明になってる！</div>
        </div>
        <p style={{ marginTop:8 }}>英語でも同じ！ 言葉のうしろに説明をくっつけるとき、<b>who / which / that</b> を「つなぎ言葉」として使うよ。</p>
      </div>

      <div className="icard red">
        <span className="itag">どう使い分けるの？</span>
        <h2>人の説明？ モノの説明？</h2>
        <table className="irtable">
          <thead><tr><th>つなぎ言葉</th><th>使うとき</th><th>例文</th></tr></thead>
          <tbody>
            <tr>
              <td><b><span className="hr">who</span></b></td>
              <td><b>人</b>の説明をするとき</td>
              <td className="ef">the girl <span className="hr">who</span> plays piano<br /><small style={{fontFamily:"sans-serif",color:"#555"}}>ピアノを弾く女の子</small></td>
            </tr>
            <tr>
              <td><b><span className="hg">which</span></b></td>
              <td><b>モノ・動物</b>の説明</td>
              <td className="ef">the bag <span className="hg">which</span> is red<br /><small style={{fontFamily:"sans-serif",color:"#555"}}>赤いカバン</small></td>
            </tr>
            <tr>
              <td><b><span className="hp">that</span></b></td>
              <td>人でもモノでも OK ✨</td>
              <td className="ef">the boy <span className="hp">that</span> I like<br /><small style={{fontFamily:"sans-serif",color:"#555"}}>私が好きな男の子</small></td>
            </tr>
          </tbody>
        </table>
        <div className="italk"><div className="italk-icon">💡</div><div className="italk-text"><b>that</b> は人にもモノにも使える万能選手！迷ったら <b>that</b> でだいたい OK！</div></div>
      </div>

      <div className="icard red">
        <span className="itag">文のかたちを見てみよう</span>
        <h2>説明がうしろにくっつく仕組み</h2>
        <div className="istep">
          <div className="istep-box">I know a girl</div>
          <div className="istep-arr">→</div>
          <div className="istep-box"><span className="hr">who</span> can speak English</div>
          <div className="istep-arr">→</div>
          <div className="istep-box" style={{background:"#ffd6d6"}}>英語が話せる女の子を知っている</div>
        </div>
        <div className="isbox" style={{marginTop:8}}>
          <span className="chip">I</span><span className="chip">know</span><span className="chip">a</span><span className="chip">girl</span>
          <span className="chip r">who</span>
          <span className="chip">can</span><span className="chip">speak</span><span className="chip">English.</span>
        </div>
        <p style={{fontSize:".76rem",textAlign:"center",color:"#666",marginTop:4}}>赤い <span className="hr">who</span> がつなぎ言葉。うしろに説明が続く</p>
        <div className="isbox" style={{marginTop:11}}>
          <span className="chip">This</span><span className="chip">is</span><span className="chip">the</span><span className="chip">book</span>
          <span className="chip g">which</span>
          <span className="chip">I</span><span className="chip">read.</span>
        </div>
        <p style={{fontSize:".76rem",textAlign:"center",color:"#666",marginTop:4}}>緑の <span className="hg">which</span> がつなぎ言葉。「book（本）」の説明が続く</p>
      </div>

      <div className="icard red">
        <span className="itag">もうひとつのポイント</span>
        <h2>つなぎ言葉は省略できることも！</h2>
        <div className="italk"><div className="italk-icon">🤔</div>
          <div className="italk-text">
            「私が読んだ本」を英語にすると…<br /><br />
            <span className="iten">the book <span className="hg">which</span> I read</span>
            <span className="iten">the book I read（which を省いた）</span>
            どちらも同じ意味！<br /><br />
            「私が〜した」という説明のときは、つなぎ言葉を消してもOK✨
          </div>
        </div>
        <div className="italk"><div className="italk-icon">💡</div>
          <div className="italk-text">
            「〜が〜する」という説明のときは省略できないよ！<br />
            <span className="iten">the girl <span className="hr">who</span> plays piano</span>
            ← who は消せない（「弾く」の主役だから）
          </div>
        </div>
      </div>

      <div className="icard red">
        <span className="itag">練習クイズ 3問</span>
        <h2>どれを使う？ 考えてみよう！</h2>
        <Quiz qid="c1q1" answers={answers} answer={answer}
          question={`Q1.「私が飼っている犬」<br>the dog <span class="blank-box">____</span> I have`}
          choices={[
            {label:"who",   correct:false, msg:"人じゃないよ！犬はモノ・動物の仲間。which か that を使おう"},
            {label:"that",  correct:true,  msg:"正解！ that は人にもモノにも使えるよ。which でも OK！"},
            {label:"what",  correct:false, msg:"what はちょっと使い方が違う。C2 で説明するよ！"},
            {label:"whose", correct:false, msg:"whose は「〜の（持ち物）」を表すよ。今回は違う"},
          ]}
        />
        <Quiz qid="c1q2" answers={answers} answer={answer}
          question={`Q2.「手紙を書いてくれた男の子」<br>the boy <span class="blank-box">____</span> wrote me a letter`}
          choices={[
            {label:"who",   correct:true,  msg:"正解！ boy は人なので who を使う！「書いた」の主役が who になっているよ"},
            {label:"which", correct:false, msg:"which はモノや動物に使う。人には who か that！"},
            {label:"what",  correct:false, msg:"前に the boy という説明したい言葉があるので what は使えない！"},
            {label:"where", correct:false, msg:"where は場所の説明をするときに使う。ここでは違うよ"},
          ]}
        />
        <Quiz qid="c1q3" answers={answers} answer={answer}
          question={`Q3.「私が好きな映画」<br>the movie <span class="blank-box">____</span> I like`}
          choices={[
            {label:"who",   correct:false, msg:"映画はモノだよ！who は人に使う"},
            {label:"which", correct:true,  msg:"正解！ movie はモノなので which を使う。that でも OK！つなぎ言葉を省いてもいいよ"},
            {label:"what",  correct:false, msg:"前に the movie があるので what は使えない！"},
            {label:"when",  correct:false, msg:"when は時間の説明に使う。ここでは違うよ"},
          ]}
        />
      </div>

      <div className="inavbtns">
        <button className="inbtn" onClick={onNext}>C2 へ →</button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════
//  コース2: what vs that
// ════════════════════════════════════════════════
function CourseC2({ onNext, onBack }) {
  const { answers, answer } = useQuiz();
  return (
    <div>
      <div className="ihero">
        <span className="ihero-icon">⚠️</span>
        <h1>コース2<br /><span className="imark">what と that どっち？</span></h1>
        <p className="ihero-note">「前に説明したい言葉があるかどうか」を見よう！</p>
      </div>

      <div className="icard yel">
        <span className="itag">一番大事なちがい</span>
        <h2>前に「説明したい言葉」があるかどうか！</h2>
        <div className="ivs">
          <div className="ivs-box" style={{background:"#ece0ff",border:"2px solid #a78bfa"}}>
            <h3 style={{color:"#a78bfa"}}>that</h3>
            <p style={{fontSize:".77rem"}}><b>前に説明したい言葉がある！</b></p>
            <div style={{marginTop:8,fontFamily:"'Paytone One','Nunito',sans-serif",fontSize:".86rem",color:"#073b4c"}}>
              the cake <span className="hp">that</span> she made
            </div>
            <p style={{fontSize:".72rem",marginTop:5}}>↑「cake（ケーキ）」という<br />説明したい言葉がある</p>
          </div>
          <div className="ivs-box" style={{background:"#fff3cc",border:"2px solid #ffc947"}}>
            <h3 style={{color:"#b08000"}}>what</h3>
            <p style={{fontSize:".77rem"}}><b>前に説明したい言葉がない！</b><br />（what の中に「もの・こと」の意味が入っている）</p>
            <div style={{marginTop:8,fontFamily:"'Paytone One','Nunito',sans-serif",fontSize:".86rem",color:"#073b4c"}}>
              <span className="hy">What</span> she made is cake.
            </div>
            <p style={{fontSize:".72rem",marginTop:5}}>↑前に何もない。<br />What = 「〜したもの・こと」</p>
          </div>
        </div>
        <div className="italk"><div className="italk-icon">🔑</div>
          <div className="italk-text">
            <b>what</b> は「〜したもの・こと」という意味がすでに入っている！<br />
            だから前に「ケーキ」「本」などの言葉が来ると意味が重なって変になるよ
          </div>
        </div>
      </div>

      <div className="icard yel">
        <span className="itag">くらべて見よう</span>
        <h2>正しい使い方・まちがいの例</h2>
        {[
          {bg:"#e8f4fd",bc:"#ddd",mark:"✅ 正しい what の使い方（前に説明したい言葉がない）",
            en:<><span className="hy">What</span> she said was funny.</>,
            jp:"「彼女が言ったこと」は笑えた。← 前に何もない ✅",col:"#666"},
          {bg:"#e8f4fd",bc:"#ddd",mark:"✅ 正しい that の使い方（前に説明したい言葉がある）",
            en:<>I ate the cake <span className="hp">that</span> she made.</>,
            jp:"前に「cake」があるので that ✅",col:"#666"},
          {bg:"#fff0f0",bc:"#ef6b6b",mark:"❌ よくあるまちがい",
            en:<s style={{opacity:.5}}>I ate the cake what she made.</s>,
            jp:"前に「cake」があるのに what を使うと変！",col:"#ef6b6b"},
        ].map((row,i)=>(
          <div key={i} className="isbox" style={{flexDirection:"column",gap:5,alignItems:"flex-start",minHeight:"auto",padding:12,marginTop:i>0?7:0,background:row.bg,borderColor:row.bc}}>
            <span style={{fontSize:".74rem",color:row.col}}>{row.mark}</span>
            <span style={{fontFamily:"'Paytone One','Nunito',sans-serif",fontSize:".92rem",color:"#073b4c"}}>{row.en}</span>
            <span style={{fontSize:".74rem",color:row.col}}>{row.jp}</span>
          </div>
        ))}
      </div>

      <div className="icard yel">
        <span className="itag">練習クイズ 3問</span>
        <h2>what か that か選ぼう！</h2>
        <Quiz qid="c2q1" answers={answers} answer={answer}
          question={`Q1.「彼女が作ったケーキを食べた。」<br>I ate the cake <span class="blank-box">____</span> she made.`}
          choices={[
            {label:"what",correct:false,msg:"前に「cake」という説明したい言葉があるよ！what は使えない"},
            {label:"that",correct:true, msg:"正解！ 前に cake があるので that（または which）を使う"},
          ]}
        />
        <Quiz qid="c2q2" answers={answers} answer={answer}
          question={`Q2.「彼が言ったことは本当だ。」<br><span class="blank-box">____</span> he said is true.`}
          choices={[
            {label:"What",correct:true, msg:"正解！ 前に何もない。What = 「彼が言ったこと」"},
            {label:"That",correct:false,msg:"前に何もないので what が自然！「〜したこと・もの」を表すなら What！"},
          ]}
        />
        <Quiz qid="c2q3" answers={answers} answer={answer}
          question={`Q3.「あなたが感じていることを話して。」<br>Tell me <span class="blank-box">____</span> you feel.`}
          choices={[
            {label:"what",correct:true, msg:"正解！ 前に説明したい言葉がない。what = 「あなたが感じていること」"},
            {label:"that",correct:false,msg:"前に説明したい言葉がないので that ではなく what を使おう！"},
          ]}
        />
      </div>

      <div className="icard yel">
        <span className="itag">作ってみよう！</span>
        <h2>「私が聞いたことは信じられなかった。」</h2>
        <p style={{fontSize:".83rem",marginBottom:10}}>ヒント：「私が聞いたこと」← 前に説明したい言葉はある？ない？</p>
        <WordBuild
          words={["What","I","heard","was","unbelievable","."]}
          correctOrder={["What","I","heard","was","unbelievable","."]}
          hint={"正解：What I heard was unbelievable.\n「What」は前に説明したい言葉がないのでここで使う\n「私が聞いたこと」= What I heard"}
        />
      </div>

      <div className="inavbtns">
        <button className="inbtn back" onClick={onBack}>← C1 に戻る</button>
        <button className="inbtn" onClick={onNext}>C3 へ →</button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════
//  コース3: 現在分詞 / 過去分詞
// ════════════════════════════════════════════════
function CourseC3({ onNext, onBack }) {
  const { answers, answer } = useQuiz();
  return (
    <div>
      <div className="ihero">
        <span className="ihero-icon">✂️</span>
        <h1>コース3<br /><span className="imark">-ing と -ed で短く説明</span></h1>
        <p className="ihero-note">「〜している」「〜された」を1語でつけよう！</p>
      </div>

      <div className="icard grn">
        <span className="itag">なんで使うの？</span>
        <h2>説明をもっと短くしたい！</h2>
        <div className="italk"><div className="italk-icon">😅</div>
          <div className="italk-text">
            「走っている犬」を英語にしたい！<br /><br />
            C1 のつなぎ言葉で書くと…<br />
            <span className="iten">the dog <span className="hg">which is running</span></span>
            ちょっと長い…！<br /><br />
            <b>-ing をつかうと短く書ける！</b><br />
            <span className="iten">the <span className="hb">running</span> dog 🐕</span>
            スッキリ！
          </div>
        </div>
        <p>-ing や -ed をつけた言葉で「どんな〇〇か」を説明できるんだ。</p>
      </div>

      <div className="icard grn">
        <span className="itag">使い分けの考え方</span>
        <h2>「自分でする」か「される」かを考えよう</h2>
        <div className="ivs">
          <div className="ivs-box" style={{background:"#d6eaff",border:"2px solid #118ab2"}}>
            <h3 style={{color:"#118ab2"}}>-ing のかたち</h3>
            <p style={{fontSize:".77rem"}}><b>「自分で〜している」</b></p>
            <p style={{fontSize:".74rem",marginTop:7}}>
              a <span className="hb">sleeping</span> cat<br />（自分で眠っているネコ）<br /><br />
              a <span className="hb">running</span> boy<br />（自分で走っている男の子）
            </p>
          </div>
          <div className="ivs-box" style={{background:"#d0f7eb",border:"2px solid #06d6a0"}}>
            <h3 style={{color:"#06d6a0"}}>-ed のかたち</h3>
            <p style={{fontSize:".77rem"}}><b>「〜された・〜されている」</b></p>
            <p style={{fontSize:".74rem",marginTop:7}}>
              a <span className="hg">broken</span> window<br />（割られた窓）<br /><br />
              a <span className="hg">used</span> car<br />（使われた＝中古の車）
            </p>
          </div>
        </div>
        <div className="italk"><div className="italk-icon">🔑</div>
          <div className="italk-text">
            考え方のコツ：<br />
            「その〇〇は、自分で〜する？」→ <span className="hb">-ing</span><br />
            「その〇〇は、誰かに〜される？」→ <span className="hg">-ed</span>
          </div>
        </div>
      </div>

      <div className="icard grn">
        <span className="itag">前と後ろ、どっちにつけるの？</span>
        <h2>1語なら前、2語以上なら後ろ</h2>
        <div className="ivs">
          <div className="ivs-box" style={{background:"#d6eaff",border:"2px solid #118ab2"}}>
            <h3 style={{color:"#118ab2"}}>前につける</h3>
            <p style={{fontSize:".77rem"}}>1語だけのとき</p>
            <div style={{fontFamily:"'Paytone One','Nunito',sans-serif",fontSize:".88rem",marginTop:7}}>a <span className="hb">sleeping</span> cat</div>
            <p style={{fontSize:".72rem",marginTop:5}}>「眠っているネコ」<br />（sleeping 1語だけ）</p>
          </div>
          <div className="ivs-box" style={{background:"#d0f7eb",border:"2px solid #06d6a0"}}>
            <h3 style={{color:"#06d6a0"}}>後ろにつける</h3>
            <p style={{fontSize:".77rem"}}>どこで・何を、など続くとき</p>
            <div style={{fontFamily:"'Paytone One','Nunito',sans-serif",fontSize:".88rem",marginTop:7}}>the cat <span className="hg">sleeping on the sofa</span></div>
            <p style={{fontSize:".72rem",marginTop:5}}>「ソファで眠っているネコ」<br />（on the sofa まで続く）</p>
          </div>
        </div>
      </div>

      <div className="icard grn">
        <span className="itag">練習クイズ 4問</span>
        <h2>-ing か -ed か選ぼう！</h2>
        <Quiz qid="c3q1" answers={answers} answer={answer}
          question={`Q1.「泣いている赤ちゃん」<br>a <span class="blank-box">____</span> baby`}
          choices={[
            {label:"crying",correct:true, msg:"正解！ 赤ちゃんは自分で泣いている → 「自分でする」→ crying（-ing のかたち）"},
            {label:"cried", correct:false,msg:"cried にすると「泣かされた赤ちゃん」みたいな変な意味になっちゃう！"},
          ]}
        />
        <Quiz qid="c3q2" answers={answers} answer={answer}
          question={`Q2.「盗まれた自転車」<br>a <span class="blank-box">____</span> bike`}
          choices={[
            {label:"stealing",correct:false,msg:"stealing にすると「盗んでいる自転車」になって変！自転車は盗まれる側だよ"},
            {label:"stolen",  correct:true, msg:"正解！ 自転車は誰かに盗まれた → 「される」→ stolen（-ed のかたち）"},
          ]}
        />
        <Quiz qid="c3q3" answers={answers} answer={answer}
          question={`Q3.「日本語で書かれた手紙」<br>a letter <span class="blank-box">____</span> in Japanese`}
          choices={[
            {label:"writing",correct:false,msg:"writing にすると「手紙が日本語を書いている」→ 手紙は書かれる側！"},
            {label:"written",correct:true, msg:"正解！ 手紙は「書かれた」→「される」→ written。in Japanese と続くので後ろにつけるよ"},
          ]}
        />
        <Quiz qid="c3q4" answers={answers} answer={answer}
          question={`Q4.「向こうで走っている男の人」<br>the man <span class="blank-box">____</span> over there`}
          choices={[
            {label:"running",correct:true, msg:"正解！ 男の人が自分で走っている → running。over there と続くので後ろにつけるよ"},
            {label:"run",    correct:false,msg:"run は元の形のまま。説明に使うときは running（-ing のかたち）にしよう"},
          ]}
        />
      </div>

      <div className="icard grn">
        <span className="itag">作ってみよう！</span>
        <h2>「窓の外で歌っている少女」を英語にしよう！</h2>
        <p style={{fontSize:".83rem",marginBottom:10}}>「少女が自分で歌っている」→ -ing のかたち。「outside the window」と続くから後ろにつけるよ</p>
        <WordBuild
          words={["the","girl","singing","outside","the","window"]}
          correctOrder={["the","girl","singing","outside","the","window"]}
          hint={"正解：the girl singing outside the window\n少女が自分で歌っている → singing（-ing のかたち）\noutside the window と続くから後ろにつける"}
        />
      </div>

      <div className="inavbtns">
        <button className="inbtn back" onClick={onBack}>← C2 に戻る</button>
        <button className="inbtn" onClick={onNext}>C4 へ →</button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════
//  コース4: exciting vs excited
// ════════════════════════════════════════════════
function CourseC4({ onNext, onBack }) {
  const { answers, answer } = useQuiz();
  return (
    <div>
      <div className="ihero">
        <span className="ihero-icon">🎢</span>
        <h1>コース4<br /><span className="imark">exciting と excited</span></h1>
        <p className="ihero-note">「わくわくさせる側」か「わくわくしている側」かを考えよう</p>
      </div>

      <div className="icard pur">
        <span className="itag">なぜふたつあるの？</span>
        <h2>遊園地に行ったとき…</h2>
        <div className="italk"><div className="italk-icon">🎡</div>
          <div className="italk-text">
            遊園地が「わくわくさせる」<br />→ 遊園地のことを <span className="hp">exciting</span> な場所という<br /><br />
            私が「わくわくする（させられる）」<br />→ 私のことを <span className="hb">excited</span> だという
          </div>
        </div>
        <div className="ivs">
          <div className="ivs-box" style={{background:"#ece0ff",border:"2px solid #a78bfa"}}>
            <h3 style={{color:"#a78bfa"}}>-ing のかたち</h3>
            <p style={{fontSize:".77rem"}}><b>「〜させる（モノや出来事の側）」</b></p>
            <p style={{fontSize:".74rem",marginTop:7}}>
              an <span className="hp">exciting</span> game<br />（わくわくさせる試合）<br /><br />
              a <span className="hp">boring</span> class<br />（退屈させる授業）
            </p>
          </div>
          <div className="ivs-box" style={{background:"#d6eaff",border:"2px solid #118ab2"}}>
            <h3 style={{color:"#118ab2"}}>-ed のかたち</h3>
            <p style={{fontSize:".77rem"}}><b>「〜している（感じている人の側）」</b></p>
            <p style={{fontSize:".74rem",marginTop:7}}>
              I am <span className="hb">excited</span>.<br />（私はわくわくしている）<br /><br />
              He is <span className="hb">bored</span>.<br />（彼は退屈している）
            </p>
          </div>
        </div>
        <div className="italk"><div className="italk-icon">🔑</div>
          <div className="italk-text">
            覚え方のコツ：<br />
            話しているのが<b>「人」</b>なら → <span className="hb">-ed</span><br />
            話しているのが<b>「モノ・出来事」</b>なら → <span className="hp">-ing</span>
          </div>
        </div>
      </div>

      <div className="icard pur">
        <span className="itag">よく出るセット一覧</span>
        <h2>まとめて覚えよう！</h2>
        <table className="irtable">
          <thead><tr><th>-ing（モノ・出来事）</th><th>-ed（人が感じる）</th><th>意味</th></tr></thead>
          <tbody>
            {[["exciting","excited","わくわくする"],["boring","bored","退屈する"],["surprising","surprised","びっくりする"],
              ["interesting","interested","興味を持つ"],["tiring","tired","疲れる"],
              ["confusing","confused","混乱する"],["disappointing","disappointed","がっかりする"]
            ].map(([ing,ed,jp])=>(
              <tr key={ing}>
                <td className="ef"><span className="hp">{ing}</span></td>
                <td className="ef"><span className="hb">{ed}</span></td>
                <td>{jp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="icard pur">
        <span className="itag">練習クイズ 4問</span>
        <h2>-ing か -ed か選ぼう！</h2>
        <Quiz qid="c4q1" answers={answers} answer={answer}
          question={`Q1.「その映画はわくわくした。」<br>The movie was <span class="blank-box">____</span>.`}
          choices={[
            {label:"exciting",correct:true, msg:"正解！ 映画（モノ）が「わくわくさせる側」→ exciting"},
            {label:"excited", correct:false,msg:"excited は「人がわくわくしている」状態。映画（モノ）には使わない！"},
          ]}
        />
        <Quiz qid="c4q2" answers={answers} answer={answer}
          question={`Q2.「私はその結果にがっかりした。」<br>I was <span class="blank-box">____</span> with the result.`}
          choices={[
            {label:"disappointing",correct:false,msg:"disappointing は「モノや出来事ががっかりさせる」のに使う。I（人）なので違う！"},
            {label:"disappointed", correct:true, msg:"正解！ I（人）が「感じている側」→ disappointed"},
          ]}
        />
        <Quiz qid="c4q3" answers={answers} answer={answer}
          question={`Q3.「そのニュースは驚くべきものだった。」<br>The news was <span class="blank-box">____</span>.`}
          choices={[
            {label:"surprising",correct:true, msg:"正解！ ニュース（出来事）が「驚かせる側」→ surprising"},
            {label:"surprised", correct:false,msg:"surprised は人がびっくりしているときに使う。The news was surprising が正しい！"},
          ]}
        />
        <Quiz qid="c4q4" answers={answers} answer={answer}
          question={`Q4.「彼は英語の授業に興味があった。」<br>He was <span class="blank-box">____</span> in English class.`}
          choices={[
            {label:"interesting",correct:false,msg:"interesting は「授業が面白い・興味深い」のに使う。He（人）が興味を持っているので違う！"},
            {label:"interested", correct:true, msg:"正解！ He（人）が「感じている側」→ interested"},
          ]}
        />
      </div>

      <div className="icard pur">
        <span className="itag">作ってみよう！</span>
        <h2>「彼女はそのゲームを退屈に感じた。」</h2>
        <p style={{fontSize:".83rem",marginBottom:10}}>
          「彼女（人）が退屈に感じた」→ boring か bored、どっち？<br />
          ゲーム（モノ）が退屈させる → boring。彼女が退屈を感じている → bored<br />
          ここでは「ゲームが boring だと彼女が思った」という文を作ろう！
        </p>
        <WordBuild
          words={["She","found","the","game","boring","."]}
          correctOrder={["She","found","the","game","boring","."]}
          hint={"正解：She found the game boring.\nゲーム（モノ）が退屈させる → boring\n「彼女がゲームをつまらないと思った」という意味"}
        />
      </div>

      <div className="inavbtns">
        <button className="inbtn back" onClick={onBack}>← C3 に戻る</button>
        <button className="inbtn" onClick={onNext}>🏆 まとめテストへ →</button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════
//  まとめテスト
// ════════════════════════════════════════════════
const FINAL_QS = [
  {id:"f1",tag:"C1 の問題",
    q:`Q1.「彼女に手紙を書いた男の子を知っている。」<br>I know the boy <span class="blank-box">____</span> wrote her a letter.`,
    choices:[
      {label:"who",   correct:true, msg:"✅ 正解！ boy（人）の説明 → who。「書いた」の主役が who になっているよ"},
      {label:"which", correct:false,msg:"❌ which はモノや動物に使う。人には who か that！"},
      {label:"what",  correct:false,msg:"❌ 前に the boy があるので what は使えない！"},
      {label:"whose", correct:false,msg:"❌ whose は「〜の」（持ち物を説明するとき）。今回は違う"},
    ]},
  {id:"f2",tag:"C1 の問題",
    q:`Q2.「これは彼女が描いた絵だ。」<br>This is the picture <span class="blank-box">____</span> she drew.`,
    choices:[
      {label:"who",  correct:false,msg:"❌ 絵はモノだよ！who は人に使う"},
      {label:"which",correct:true, msg:"✅ 正解！ picture（モノ）→ which。that でも OK！つなぎ言葉を省いてもいいよ"},
      {label:"what", correct:false,msg:"❌ 前に the picture があるので what は使えない！"},
      {label:"when", correct:false,msg:"❌ when は時間の説明に使う"},
    ]},
  {id:"f3",tag:"C2 の問題",
    q:`Q3.「あなたが感じていることを話して。」<br>Tell me <span class="blank-box">____</span> you feel.`,
    choices:[
      {label:"what",correct:true, msg:"✅ 正解！ 前に説明したい言葉がない → what = 「あなたが感じていること」"},
      {label:"that",correct:false,msg:"❌ 前に説明したい言葉がないので that ではなく what を使おう！"},
    ]},
  {id:"f4",tag:"C2 の問題",
    q:`Q4.「これが彼が昨日言ったことだ。」<br>This is <span class="blank-box">____</span> he said yesterday.`,
    choices:[
      {label:"what",correct:true, msg:"✅ 正解！ This is 〜のこと。前に説明したい言葉なし → what！"},
      {label:"that",correct:false,msg:"❌ 前に「説明したい言葉」がないので that は合わない。what が正しい！"},
    ]},
  {id:"f5",tag:"C3 の問題",
    q:`Q5.「川の近くで寝ている猫」<br>the cat <span class="blank-box">____</span> near the river`,
    choices:[
      {label:"sleeping",correct:true, msg:"✅ 正解！ 猫が自分で寝ている → sleeping（-ing のかたち）。near the river と続くから後ろにつけるよ"},
      {label:"slept",   correct:false,msg:"❌ slept にすると「寝かされた猫」みたいな変な意味になる！"},
    ]},
  {id:"f6",tag:"C3 の問題",
    q:`Q6.「英語で書かれた本」<br>a book <span class="blank-box">____</span> in English`,
    choices:[
      {label:"writing",correct:false,msg:"❌ writing だと「英語を書いている本」→ 本は書かれる側！"},
      {label:"written",correct:true, msg:"✅ 正解！ 本は「書かれた」→「される」→ written（-ed のかたち）"},
    ]},
  {id:"f7",tag:"C4 の問題",
    q:`Q7.「彼はその授業が退屈だと思った。」<br>He found the class <span class="blank-box">____</span>.`,
    choices:[
      {label:"boring",correct:true, msg:"✅ 正解！ 説明しているのは「授業（モノ）」→ 退屈させる側 → boring！"},
      {label:"bored", correct:false,msg:"❌ bored は人が退屈しているときに使う。ここは授業（モノ）の説明！"},
    ]},
  {id:"f8",tag:"C4 の問題",
    q:`Q8.「その知らせは驚くべきものだった。」<br>The news was <span class="blank-box">____</span>.`,
    choices:[
      {label:"surprising",correct:true, msg:"✅ 正解！ 知らせ（出来事）が「驚かせる側」→ surprising！"},
      {label:"surprised", correct:false,msg:"❌ surprised は「人がびっくりしている」ときに使う。I was surprised. なら OK！"},
    ]},
];

function FinalQuiz({ onBack, onStart }) {
  const { answers, answer } = useQuiz();
  const score = Object.values(answers).filter(a => a.correct).length;
  const done = Object.keys(answers).length >= FINAL_QS.length;
  const rank = score===8?{e:"🎉",t:"完璧！ 英語の達人！"}:score>=6?{e:"😄",t:"すごい！ もうすこし！"}:score>=4?{e:"💪",t:"よく頑張った！ 苦手なコースをもう一度見てみよう"}:{e:"📚",t:"コースをもう一度読んでみよう！必ず上達するよ！"};

  return (
    <div>
      <div className="ihero">
        <span className="ihero-icon">🏆</span>
        <h1>まとめ<br /><span className="imark">テスト</span></h1>
        <p className="ihero-note">4つのコースから出題！全問正解を目指そう</p>
      </div>

      <div className="iscorebar">スコア：<span className="isnum">{score}</span> / 8問</div>

      {FINAL_QS.map(q => (
        <div key={q.id} className="icard">
          <span className="itag">{q.tag}</span>
          <Quiz qid={q.id} answers={answers} answer={answer} question={q.q} choices={q.choices} />
        </div>
      ))}

      {done && (
        <div className="icard blu">
          <div className="iresult-big">
            <div className="iresult-emoji">{rank.e}</div>
            <div className="iresult-score">{score} / 8 問正解</div>
            <div className="iresult-rank">{rank.t}</div>
          </div>
          <div style={{marginTop:16,textAlign:"center"}}>
            <button className="inbtn"
              style={{background:"linear-gradient(135deg,#ef6b6b,#a78bfa,#118ab2)",border:"none",fontSize:"1rem",padding:"14px 32px",boxShadow:"4px 4px 0 #444"}}
              onClick={onStart}
            >🎯 ドリルをスタート！</button>
          </div>
        </div>
      )}

      <div className="inavbtns">
        <button className="inbtn back" onClick={onBack}>← C4 に戻る</button>
        {done && <button className="inbtn" onClick={onStart}>ゲームへ →</button>}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════
//  ホーム
// ════════════════════════════════════════════════
function Home({ onGo, onStart }) {
  const courses = [
    {c:1,col:"#ef6b6b",title:"「どんな〇〇か」を\nうしろから説明する\nwho・which・that",badge:"人とモノの説明"},
    {c:2,col:"#ffc947",title:"what と that\nどっちを使う？\nまちがいやすい！",badge:"⚠️ ひっかけ注意"},
    {c:3,col:"#06d6a0",title:"-ing と -ed で\n「どんな〇〇か」を\n説明する",badge:"短くスッキリ！"},
    {c:4,col:"#a78bfa",title:"exciting と excited\nどっちを使う？\n感情の表し方",badge:"⚠️ ひっかけ注意"},
  ];
  return (
    <div style={{textAlign:"center"}}>
      <div className="ihero">
        <span className="ihero-icon">🌟</span>
        <h1>英語で<br /><span className="imark">くわしく説明</span>しよう！</h1>
        <p className="ihero-note">4つのコースとまとめテストがあるよ</p>
      </div>
      <div className="ihome-grid">
        {courses.map(({c,col,title,badge})=>(
          <div key={c} className="ihcard" style={{borderColor:col,boxShadow:`4px 4px 0 ${col}`}} onClick={()=>onGo(c)}>
            <div className="ihnum" style={{color:col}}>C{c}</div>
            <div className="ihtitle" style={{whiteSpace:"pre-line"}}>{title}</div>
            <div className="ihbadge" style={{background:col+"22",color:c===2?"#7a6000":col}}>{badge}</div>
          </div>
        ))}
      </div>
      <button className="inbtn" style={{fontSize:"1rem",padding:"14px 36px",marginTop:4}} onClick={()=>onGo(1)}>
        C1 からスタート ▶
      </button>
      <br />
      <button onClick={onStart} style={{marginTop:12,padding:"10px 22px",borderRadius:99,border:"2px solid #ccc",background:"white",color:"#999",fontFamily:"'Nunito',sans-serif",fontSize:".8rem",cursor:"pointer"}}>
        レッスンをスキップしてゲームへ →
      </button>
    </div>
  );
}

// ════════════════════════════════════════════════
//  メインコンポーネント
// ════════════════════════════════════════════════
const DOTS = [
  {key:0,icon:"🏠",lbl:"ホーム"},
  {key:1,icon:"🧩",lbl:"C1"},
  {key:2,icon:"⚠️",lbl:"C2"},
  {key:3,icon:"✂️",lbl:"C3"},
  {key:4,icon:"🎢",lbl:"C4"},
  {key:5,icon:"🏆",lbl:"テスト"},
];

export default function IntroScreen({ level, onStart }) {
  const [page, setPage] = useState(0);
  const [done, setDone] = useState({});
  const topRef = useRef(null);

  const go = (p) => {
    setPage(p);
    setTimeout(() => topRef.current?.scrollIntoView({ behavior:"smooth", block:"start" }), 50);
  };
  const finish = (p) => { setDone(d => ({...d,[p]:true})); go(p+1); };

  return (
    <>
      <style>{CSS}</style>
      <div className="il" ref={topRef}>
        {/* ドットナビ */}
        <div className="idots">
          {DOTS.map(({key,icon,lbl})=>{
            let cls="idot";
            if(key===page) cls+=" ion";
            else if(done[key]) cls+=" iok";
            return (
              <div key={key} className={cls} onClick={()=>go(key)}>
                <span className="idot-icon">{done[key]&&key!==page?"✅":icon}</span>
                <span className="idot-lbl">{lbl}</span>
              </div>
            );
          })}
        </div>

        {/* ページ */}
        <div key={page} style={{animation:"ifadeUp 0.3s ease"}}>
          {page===0 && <Home onGo={go} onStart={onStart} />}
          {page===1 && <CourseC1 onNext={()=>finish(1)} />}
          {page===2 && <CourseC2 onNext={()=>finish(2)} onBack={()=>go(1)} />}
          {page===3 && <CourseC3 onNext={()=>finish(3)} onBack={()=>go(2)} />}
          {page===4 && <CourseC4 onNext={()=>finish(4)} onBack={()=>go(3)} />}
          {page===5 && <FinalQuiz onBack={()=>go(4)} onStart={onStart} />}
        </div>
      </div>
    </>
  );
}
