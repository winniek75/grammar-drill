// ============================================================
// IntroScreen.jsx
// 導入画面: STEP1 合体アニメ → STEP2 判断ツリー → STEP3 比較カード → ミニクイズ → ゲームへ
// ============================================================

import { useState, useEffect, useRef } from "react";

// ─────────────────────────────────────────────
// コンテンツ定義
// ─────────────────────────────────────────────

const MERGE_EXAMPLES = {
  grade3: [
    {
      label: "関係代名詞 who（人）",
      sentA: "I have a friend.",
      sentB: "She speaks French.",
      merged: ["I have a friend ", "who", " speaks French."],
      keyword: "who",
      note: "「人」を表す先行詞のあとは who または that",
      color: "#00f5ff",
    },
    {
      label: "関係代名詞 which（物）",
      sentA: "This is the book.",
      sentB: "It changed my life.",
      merged: ["This is the book ", "which", " changed my life."],
      keyword: "which",
      note: "「物・動物」を表す先行詞のあとは which または that",
      color: "#a78bfa",
    },
    {
      label: "現在分詞（〜している）",
      sentA: "The girl is my sister.",
      sentB: "She is playing the piano.",
      merged: ["The girl ", "playing", " the piano is my sister."],
      keyword: "playing",
      note: "「〜している」能動・進行の意味は現在分詞（-ing）で名詞を修飾",
      color: "#34d399",
    },
    {
      label: "過去分詞（〜された）",
      sentA: "The car is very old.",
      sentB: "It was made in Japan.",
      merged: ["The car ", "made", " in Japan is very old."],
      keyword: "made",
      note: "「〜された」受け身の意味は過去分詞（-ed形）で名詞を修飾",
      color: "#fb923c",
    },
  ],
  pre2: [
    {
      label: "関係代名詞 whose（所有格）",
      sentA: "She is the author.",
      sentB: "Her books I love.",
      merged: ["She is the author ", "whose", " books I love."],
      keyword: "whose",
      note: "所有関係（〜の）を表すときは whose（人でも物でも）",
      color: "#f472b6",
    },
    {
      label: "関係副詞 where（場所）",
      sentA: "This is the city.",
      sentB: "I was born there.",
      merged: ["This is the city ", "where", " I was born."],
      keyword: "where",
      note: "先行詞が「場所」で、節内に前置詞の目的語が残らない → where",
      color: "#00f5ff",
    },
    {
      label: "分詞構文（理由・付帯）",
      sentA: "She was tired.",
      sentB: "So she went to bed early.",
      merged: ["", "Feeling", " tired, she went to bed early."],
      keyword: "Feeling",
      note: "主節と同じ主語の副詞節を分詞に圧縮。能動・進行 → 現在分詞",
      color: "#34d399",
    },
    {
      label: "with＋分詞（付帯状況）",
      sentA: "He fell asleep.",
      sentB: "The TV was left on.",
      merged: ["He fell asleep with the TV ", "left", " on."],
      keyword: "left",
      note: "with＋名詞＋分詞。TVは「つけられた」状態 → 過去分詞（left）",
      color: "#fb923c",
    },
  ],
};

// ─── 判断ツリーのデータ ───────────────────────────────────────

const TREE_DATA = {
  grade3: {
    id: "root",
    q: "名詞のあとに何がある？",
    hint: "空欄の後ろをよく見てみよう",
    children: [
      {
        id: "clause",
        label: "主語＋動詞のかたまり",
        badge: "関係代名詞",
        badgeColor: "#00f5ff",
        q: "先行詞（修飾される名詞）は？",
        children: [
          {
            id: "who",
            label: "人（man / girl / friend など）",
            result: true,
            answer: "who / that",
            answerColor: "#00f5ff",
            example: "I have a friend ___ speaks French.",
            filled: "who",
            note: "who と that はどちらも使える。thatの方がカジュアル",
          },
          {
            id: "which",
            label: "物・動物（book / cat など）",
            result: true,
            answer: "which / that",
            answerColor: "#a78bfa",
            example: "This is the book ___ changed my life.",
            filled: "which",
            note: "which と that はどちらも使える",
          },
          {
            id: "what",
            label: "先行詞なし（「〜なこと／もの」）",
            result: true,
            answer: "what",
            answerColor: "#f472b6",
            example: "This is ___ I wanted.",
            filled: "what",
            note: "what ＝ the thing that。先行詞を自分で含むのがポイント！",
            tricky: true,
          },
        ],
      },
      {
        id: "participle",
        label: "-ing / -ed のかたまり（主語なし）",
        badge: "分詞",
        badgeColor: "#34d399",
        q: "名詞との関係は？",
        children: [
          {
            id: "pres",
            label: "名詞が「〜している」（能動・進行）",
            result: true,
            answer: "現在分詞（-ing）",
            answerColor: "#34d399",
            example: "The girl ___ the piano is my sister.",
            filled: "playing",
            note: "動作の主体が名詞自身 → -ing形",
          },
          {
            id: "past",
            label: "名詞が「〜された」（受け身・完了）",
            result: true,
            answer: "過去分詞（-ed形）",
            answerColor: "#fb923c",
            example: "The car ___ in Japan is old.",
            filled: "made",
            note: "名詞が動作を受ける側 → 過去分詞形",
          },
        ],
      },
    ],
  },
  pre2: {
    id: "root",
    q: "どんな修飾をしたい？",
    hint: "文の構造と意味から判断しよう",
    children: [
      {
        id: "rel",
        label: "関係詞（節で名詞を修飾）",
        badge: "関係詞",
        badgeColor: "#00f5ff",
        q: "先行詞の種類と節内の役割は？",
        children: [
          {
            id: "who_pre2",
            label: "人 → 節内で主語・目的語",
            result: true,
            answer: "who / that / whom(目的格)",
            answerColor: "#00f5ff",
            example: "The professor ___ I respect retired.",
            filled: "whom",
            note: "目的格フォーマルはwhom。口語ではwhoやthatも可",
          },
          {
            id: "whose_pre2",
            label: "人・物 → 節内で所有格（〜の）",
            result: true,
            answer: "whose",
            answerColor: "#f472b6",
            example: "I saw a house ___ roof was red.",
            filled: "whose",
            note: "先行詞が物でも所有関係 → whose！whichは不可",
            tricky: true,
          },
          {
            id: "where_pre2",
            label: "場所 → 節内に前置詞の目的語が残らない",
            result: true,
            answer: "where（＝ in/at which）",
            answerColor: "#34d399",
            example: "This is the city ___ I was born.",
            filled: "where",
            note: "in which ＝ where。目的語が残るなら which！",
            tricky: true,
          },
          {
            id: "when_pre2",
            label: "時 → 節内で時の副詞",
            result: true,
            answer: "when（＝ on/at which）",
            answerColor: "#a78bfa",
            example: "I remember the day ___ we first met.",
            filled: "when",
            note: "先行詞が時（day/year/time）→ when",
          },
          {
            id: "comma_pre2",
            label: "コンマあり（非制限用法）",
            result: true,
            answer: "who / which（that は不可！）",
            answerColor: "#fb923c",
            example: "My brother, ___ lives in London, is a doctor.",
            filled: "who",
            note: "コンマつき非制限用法では that は絶対に使えない！",
            tricky: true,
          },
        ],
      },
      {
        id: "part_pre2",
        label: "分詞（句・構文で修飾）",
        badge: "分詞",
        badgeColor: "#34d399",
        q: "どの種類の分詞修飾？",
        children: [
          {
            id: "pconst_pre2",
            label: "分詞構文（副詞節を圧縮）",
            q: "主語との関係は？",
            children: [
              {
                id: "pc_active",
                label: "主語が「〜している/したので」（能動）",
                result: true,
                answer: "現在分詞（-ing）",
                answerColor: "#34d399",
                example: "___ tired, she went to bed early.",
                filled: "Feeling",
                note: "否定は「Not ＋ -ing」。Neverも可",
              },
              {
                id: "pc_passive",
                label: "主語が「〜された/されているので」（受け身）",
                result: true,
                answer: "過去分詞（-ed形）",
                answerColor: "#fb923c",
                example: "___ in 1990, the bridge is still strong.",
                filled: "Built",
                note: "受け身の分詞構文 ＝ Being built → Built と省略可",
              },
            ],
          },
          {
            id: "with_pre2",
            label: "with＋名詞＋分詞（付帯状況）",
            q: "名詞と分詞の関係は？",
            children: [
              {
                id: "with_ing",
                label: "名詞が「〜している」（能動）",
                result: true,
                answer: "現在分詞（-ing）",
                answerColor: "#34d399",
                example: "She listened with her dog ___ beside her.",
                filled: "sitting",
                note: "犬が自分で座っている → 能動 → sitting",
              },
              {
                id: "with_ed",
                label: "名詞が「〜されている/された状態」",
                result: true,
                answer: "過去分詞（-ed形）",
                answerColor: "#fb923c",
                example: "He slept with the TV ___ on.",
                filled: "left",
                note: "TVは「つけられた」状態 → 受け身 → left",
                tricky: true,
              },
            ],
          },
        ],
      },
    ],
  },
};

// ─── 比較カードのデータ ───────────────────────────────────────

const COMPARE_CARDS = {
  grade3: [
    {
      title: "who vs which",
      subtitle: "先行詞で使い分ける",
      left: {
        label: "who",
        color: "#00f5ff",
        rule: "先行詞が「人」",
        example: "the woman **who** helped me",
        jp: "私を助けてくれた女性",
        badge: "人",
      },
      right: {
        label: "which",
        color: "#a78bfa",
        rule: "先行詞が「物・動物」",
        example: "the book **which** changed my life",
        jp: "私の人生を変えた本",
        badge: "物・動物",
      },
      trickNote: null,
    },
    {
      title: "what vs that",
      subtitle: "先行詞があるかどうかで決まる",
      left: {
        label: "what",
        color: "#f472b6",
        rule: "先行詞なし（= the thing that）",
        example: "**What** I said is true.",
        jp: "私が言ったことは本当だ",
        badge: "先行詞なし",
      },
      right: {
        label: "that",
        color: "#00f5ff",
        rule: "先行詞あり",
        example: "the thing **that** I said",
        jp: "私が言ったこと（先行詞あり）",
        badge: "先行詞あり",
      },
      trickNote: "⚠ 「The thing what I said」は✗！先行詞があれば that / which",
    },
    {
      title: "-ing vs -ed（感情動詞）",
      subtitle: "主語が「物/事」か「人」かで決まる",
      left: {
        label: "-ing",
        color: "#34d399",
        rule: "物・事が主語 → 「〜させる」",
        example: "The movie was **exciting**.",
        jp: "その映画はワクワクさせた",
        badge: "物・事が主語",
      },
      right: {
        label: "-ed",
        color: "#fb923c",
        rule: "人が主語 → 「〜している/された」",
        example: "I was **excited**.",
        jp: "私はワクワクしていた",
        badge: "人が主語",
      },
      trickNote: "⚠ boring / bored, interesting / interested も同じパターン！",
    },
  ],
  pre2: [
    {
      title: "which vs where",
      subtitle: "節内に前置詞の目的語が残るかで決まる",
      left: {
        label: "which",
        color: "#a78bfa",
        rule: "前置詞の目的語として残る",
        example: "the hotel **which** we stayed **at**",
        jp: "at の目的語 → which",
        badge: "目的語が残る",
      },
      right: {
        label: "where",
        color: "#34d399",
        rule: "前置詞ごと副詞に変換（= in/at which）",
        example: "the city **where** she lives",
        jp: "前置詞なし → where",
        badge: "目的語が残らない",
      },
      trickNote: "⚠ 「the hotel where we stayed at」は✗！at が余分になる",
    },
    {
      title: "that vs which（非制限用法）",
      subtitle: "コンマがあるかどうかで決まる",
      left: {
        label: "that",
        color: "#00f5ff",
        rule: "制限用法（コンマなし）にのみ使える",
        example: "the book **that** I read",
        jp: "私が読んだ（特定の）本",
        badge: "コンマなし",
      },
      right: {
        label: "which",
        color: "#a78bfa",
        rule: "非制限用法（コンマあり）に使える",
        example: "Tokyo, **which** is the capital, ...",
        jp: "東京（それ自体が特定されている）",
        badge: "コンマあり → which",
      },
      trickNote: "⚠ 「My brother, that lives in London」は✗！コンマ後はthat不可",
    },
    {
      title: "whose（人にも物にも）",
      subtitle: "所有関係なら先行詞が物でも whose",
      left: {
        label: "whose（人）",
        color: "#f472b6",
        rule: "先行詞が人の所有格",
        example: "the author **whose** books I love",
        jp: "私が好きな本の作者",
        badge: "人 → whose",
      },
      right: {
        label: "whose（物）",
        color: "#fb923c",
        rule: "先行詞が物でも所有関係はwhose",
        example: "a house **whose** roof was red",
        jp: "屋根が赤かった家",
        badge: "物でも → whose ✓",
      },
      trickNote: "⚠ 「a house which roof was red」は✗！物の所有格も whose",
    },
  ],
};

// ─── ミニクイズの問題 ───────────────────────────────────────

const MINI_QUIZ = {
  grade3: [
    {
      q: "She is the woman _____ helped me.",
      options: ["who", "which", "what", "it"],
      answer: "who",
      exp: "先行詞「人（woman）」で節内の主語 → who",
    },
    {
      q: "This is _____ I really wanted.",
      options: ["what", "that", "which", "who"],
      answer: "what",
      exp: "先行詞なし、「私が欲しかったもの」→ what（= the thing that）",
      tricky: true,
    },
    {
      q: "The story was very _____.",
      options: ["exciting", "excited", "excite", "excites"],
      answer: "exciting",
      exp: "物（story）が主語 → -ing（exciting＝ワクワクさせる）",
      tricky: true,
    },
  ],
  pre2: [
    {
      q: "This is the hotel _____ we stayed at.",
      options: ["which", "where", "when", "whose"],
      answer: "which",
      exp: "「stayed at ___」の目的語が残る → which（where なら at が余分）",
      tricky: true,
    },
    {
      q: "My sister, _____ lives in Osaka, is a nurse.",
      options: ["who", "that", "which", "whose"],
      answer: "who",
      exp: "コンマあり非制限用法 → that は不可！先行詞が人 → who",
      tricky: true,
    },
    {
      q: "I saw a house _____ roof was green.",
      options: ["whose", "which", "that", "where"],
      answer: "whose",
      exp: "先行詞が物（house）でも所有関係は whose！",
      tricky: true,
    },
  ],
};

// ─────────────────────────────────────────────
// サブコンポーネント
// ─────────────────────────────────────────────

// ── STEP 1: 合体アニメーション ─────────────────────────────

function MergeAnimation({ level }) {
  const examples = MERGE_EXAMPLES[level] || MERGE_EXAMPLES.grade3;
  const [exIdx, setExIdx] = useState(0);
  const [phase, setPhase] = useState("idle"); // idle | merge | done
  const ex = examples[exIdx];

  const runMerge = () => {
    setPhase("merge");
    setTimeout(() => setPhase("done"), 700);
  };

  const next = () => {
    setPhase("idle");
    setExIdx((i) => (i + 1) % examples.length);
  };

  const prev = () => {
    setPhase("idle");
    setExIdx((i) => (i - 1 + examples.length) % examples.length);
  };

  return (
    <div>
      <p style={{ color: "#9ca3af", fontSize: "0.82rem", marginBottom: 16, lineHeight: 1.7 }}>
        英語では「2つの文をくっつけて、名詞を詳しく説明する」ときに<br />
        <strong style={{ color: "#e8e8f0" }}>関係詞</strong>や<strong style={{ color: "#e8e8f0" }}>分詞</strong>を使います。アニメーションで確認しましょう。
      </p>

      {/* example nav */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <button onClick={prev} style={S.navSmBtn}>‹</button>
        <div style={{ flex: 1, textAlign: "center" }}>
          <span style={{
            fontFamily: "'Space Mono',monospace", fontSize: "0.68rem", letterSpacing: "0.08em",
            color: ex.color, background: `${ex.color}18`, border: `1px solid ${ex.color}40`,
            padding: "3px 12px", borderRadius: 20,
          }}>
            {ex.label}
          </span>
        </div>
        <button onClick={next} style={S.navSmBtn}>›</button>
      </div>
      <div style={{ fontSize: "0.68rem", textAlign: "center", color: "#4b5563", marginTop: -10, marginBottom: 14, fontFamily: "'Space Mono',monospace" }}>
        {exIdx + 1} / {examples.length}
      </div>

      {/* sentences */}
      <div style={{
        background: "#0e0e1c", border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 14, padding: "20px 18px", marginBottom: 14,
      }}>
        {phase !== "done" ? (
          <>
            {/* 2 sentences */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
              {[ex.sentA, ex.sentB].map((s, i) => (
                <div key={i} style={{
                  padding: "11px 16px", borderRadius: 10,
                  background: i === 0 ? "rgba(0,245,255,0.07)" : "rgba(167,139,250,0.07)",
                  border: `1px solid ${i === 0 ? "rgba(0,245,255,0.2)" : "rgba(167,139,250,0.2)"}`,
                  fontWeight: 700, fontSize: "1rem",
                  transform: phase === "merge" ? `translateY(${i === 0 ? "30px" : "-30px"})` : "none",
                  opacity: phase === "merge" ? 0 : 1,
                  transition: "all 0.6s ease",
                }}>
                  {s}
                </div>
              ))}
            </div>
            <div style={{ textAlign: "center" }}>
              <button onClick={runMerge} disabled={phase === "merge"} style={{
                padding: "10px 28px", borderRadius: 10,
                background: `${ex.color}20`,
                border: `1px solid ${ex.color}60`, color: ex.color,
                fontFamily: "'Orbitron',sans-serif", fontWeight: 700, fontSize: "0.82rem",
                cursor: "pointer", letterSpacing: "0.06em",
              }}>
                ▶ くっつける！
              </button>
            </div>
          </>
        ) : (
          <div style={{ animation: "fadeSlide 0.4s ease" }}>
            <div style={{ fontSize: "0.7rem", color: "#6b7280", fontFamily: "'Space Mono',monospace", marginBottom: 10 }}>
              ↓ 1文に合体
            </div>
            <div style={{ fontSize: "1.05rem", fontWeight: 700, lineHeight: 1.8, marginBottom: 14 }}>
              {ex.merged.map((part, i) =>
                i === 1 ? (
                  <span key={i} style={{
                    background: `${ex.color}25`, border: `1.5px solid ${ex.color}`,
                    borderRadius: 6, padding: "1px 8px", color: ex.color,
                    fontFamily: "'Space Mono',monospace",
                  }}>
                    {part}
                  </span>
                ) : <span key={i}>{part}</span>
              )}
            </div>
            <div style={{
              fontSize: "0.78rem", color: "#9ca3af", lineHeight: 1.7,
              background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: "8px 12px",
            }}>
              💡 {ex.note}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── STEP 2: インタラクティブ判断ツリー ─────────────────────

function DecisionTree({ level }) {
  const tree = TREE_DATA[level] || TREE_DATA.grade3;
  const [path, setPath] = useState([]); // 選択肢のidの配列
  const [resultNode, setResultNode] = useState(null);

  const reset = () => { setPath([]); setResultNode(null); };

  // 現在のノードをたどる
  const getCurrentNode = () => {
    let node = tree;
    for (const id of path) {
      const child = (node.children || []).find((c) => c.id === id);
      if (!child) break;
      node = child;
    }
    return node;
  };

  const current = getCurrentNode();

  const choose = (child) => {
    if (child.result) {
      setResultNode(child);
    } else if (child.children) {
      setPath((p) => [...p, child.id]);
    }
  };

  return (
    <div>
      <p style={{ color: "#9ca3af", fontSize: "0.82rem", marginBottom: 16, lineHeight: 1.7 }}>
        どれを使うか迷ったときは、このフローで判断しましょう。
        クリックして答えを探してみてください。
      </p>

      {/* breadcrumb */}
      {path.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
          <button onClick={reset} style={{ ...S.navSmBtn, fontSize: "0.72rem", padding: "4px 10px" }}>← 最初から</button>
          {path.map((id, i) => {
            let node = tree;
            for (let j = 0; j <= i; j++) {
              const child = (node.children || []).find((c) => c.id === path[j]);
              if (child) node = child;
            }
            return (
              <span key={id} style={{ fontSize: "0.68rem", color: "#6b7280", fontFamily: "'Space Mono',monospace" }}>
                › {node.label || node.q?.slice(0, 12) + "…"}
              </span>
            );
          })}
        </div>
      )}

      {/* result */}
      {resultNode ? (
        <div style={{ animation: "fadeSlide 0.35s ease" }}>
          <div style={{
            background: `${resultNode.answerColor}12`,
            border: `2px solid ${resultNode.answerColor}50`,
            borderRadius: 14, padding: "18px 18px",
          }}>
            <div style={{
              fontFamily: "'Orbitron',sans-serif", fontSize: "1.35rem", fontWeight: 900,
              color: resultNode.answerColor, marginBottom: 8,
            }}>
              {resultNode.answer}
            </div>
            <div style={{
              fontFamily: "'Space Mono',monospace", fontSize: "0.85rem",
              background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "8px 12px",
              marginBottom: 10, color: "#e8e8f0",
            }}>
              {resultNode.example.replace("___", `[${resultNode.filled}]`)}
            </div>
            <div style={{ fontSize: "0.78rem", color: "#9ca3af", lineHeight: 1.7, marginBottom: 12 }}>
              {resultNode.note}
            </div>
            {resultNode.tricky && (
              <div style={{
                fontSize: "0.72rem", color: "#f472b6",
                background: "rgba(244,114,182,0.1)", border: "1px solid rgba(244,114,182,0.3)",
                borderRadius: 8, padding: "6px 12px", marginBottom: 12,
              }}>
                ⚠ ひっかけ注意！よく間違えるポイントです
              </div>
            )}
            <button onClick={reset} style={{
              padding: "9px 20px", borderRadius: 9, border: `1px solid ${resultNode.answerColor}50`,
              background: `${resultNode.answerColor}15`, color: resultNode.answerColor,
              fontFamily: "'Space Mono',monospace", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer",
            }}>
              ↩ 別のケースを調べる
            </button>
          </div>
        </div>
      ) : (
        <div>
          {/* question */}
          <div style={{
            background: "#0e0e1c", border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 12, padding: "14px 16px", marginBottom: 12,
          }}>
            <div style={{ fontSize: "0.72rem", color: "#6b7280", fontFamily: "'Space Mono',monospace", marginBottom: 6 }}>
              Q.
            </div>
            <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#e8e8f0" }}>
              {current.q}
            </div>
            {current.hint && (
              <div style={{ fontSize: "0.73rem", color: "#6b7280", marginTop: 5 }}>💡 {current.hint}</div>
            )}
          </div>

          {/* choices */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {(current.children || []).map((child) => (
              <button key={child.id} onClick={() => choose(child)} style={{
                padding: "13px 16px", borderRadius: 11, border: "1px solid rgba(255,255,255,0.08)",
                background: child.badge
                  ? `${child.badgeColor}12`
                  : "#1a1a2e",
                borderColor: child.badge ? `${child.badgeColor}30` : undefined,
                color: "#e8e8f0", fontFamily: "'Noto Sans JP',sans-serif",
                fontWeight: 700, fontSize: "0.88rem", cursor: "pointer",
                textAlign: "left", transition: "all 0.15s",
                display: "flex", alignItems: "center", gap: 10,
              }}>
                {child.badge && (
                  <span style={{
                    fontFamily: "'Space Mono',monospace", fontSize: "0.65rem", fontWeight: 700,
                    background: `${child.badgeColor}25`, border: `1px solid ${child.badgeColor}50`,
                    color: child.badgeColor, padding: "2px 8px", borderRadius: 20, whiteSpace: "nowrap",
                  }}>
                    {child.badge}
                  </span>
                )}
                <span>{child.label}</span>
                <span style={{ marginLeft: "auto", color: "#4b5563" }}>›</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── STEP 3: 比較フリップカード ────────────────────────────

function FlipCard({ card }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ fontSize: "0.72rem", color: "#6b7280", fontFamily: "'Space Mono',monospace", marginBottom: 8 }}>
        vs.
      </div>
      <div style={{
        fontWeight: 900, fontSize: "1rem", color: "#e8e8f0", marginBottom: 4,
      }}>
        {card.title}
      </div>
      <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: 12 }}>
        {card.subtitle}
      </div>

      {/* side by side */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
        {[card.left, card.right].map((side, i) => (
          <div key={i} style={{
            background: `${side.color}10`,
            border: `1.5px solid ${side.color}40`,
            borderRadius: 12, padding: "14px 12px",
            transition: "all 0.2s",
          }}>
            <div style={{
              fontFamily: "'Orbitron',sans-serif", fontSize: "1.1rem", fontWeight: 900,
              color: side.color, marginBottom: 6,
            }}>
              {side.label}
            </div>
            <div style={{
              fontSize: "0.65rem", color: side.color,
              background: `${side.color}18`, border: `1px solid ${side.color}30`,
              borderRadius: 20, padding: "2px 8px", display: "inline-block", marginBottom: 8,
            }}>
              {side.badge}
            </div>
            <div style={{ fontSize: "0.75rem", color: "#9ca3af", marginBottom: 6 }}>
              {side.rule}
            </div>
            <div style={{
              fontFamily: "'Space Mono',monospace", fontSize: "0.78rem", fontWeight: 700,
              color: "#e8e8f0", lineHeight: 1.6,
              dangerouslySetInnerHTML: undefined,
            }}>
              {side.example.split("**").map((part, j) =>
                j % 2 === 1
                  ? <span key={j} style={{ color: side.color, background: `${side.color}20`, borderRadius: 4, padding: "0 3px" }}>{part}</span>
                  : <span key={j}>{part}</span>
              )}
            </div>
            <div style={{ fontSize: "0.7rem", color: "#6b7280", marginTop: 4 }}>{side.jp}</div>
          </div>
        ))}
      </div>

      {/* tricky note */}
      {card.trickNote && (
        <div style={{
          fontSize: "0.75rem", color: "#f472b6",
          background: "rgba(244,114,182,0.08)", border: "1px solid rgba(244,114,182,0.25)",
          borderRadius: 9, padding: "8px 12px", lineHeight: 1.65,
        }}>
          {card.trickNote}
        </div>
      )}
    </div>
  );
}

function CompareCards({ level }) {
  const cards = COMPARE_CARDS[level] || COMPARE_CARDS.grade3;
  return (
    <div>
      <p style={{ color: "#9ca3af", fontSize: "0.82rem", marginBottom: 16, lineHeight: 1.7 }}>
        間違いやすい「ひっかけペア」を並べて比較します。
        違いの<strong style={{ color: "#f472b6" }}>核心ポイント</strong>を意識しながら読みましょう。
      </p>
      {cards.map((card, i) => <FlipCard key={i} card={card} />)}
    </div>
  );
}

// ── ミニクイズ ─────────────────────────────────────────────

function MiniQuiz({ level, onDone }) {
  const questions = MINI_QUIZ[level] || MINI_QUIZ.grade3;
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [results, setResults] = useState([]);

  const q = questions[idx];
  const isCorrect = selected === q?.answer;
  const done = idx >= questions.length;

  const choose = (opt) => {
    if (selected) return;
    const ok = opt === q.answer;
    setSelected(opt);
    setResults((r) => [...r, ok]);
  };

  const next = () => {
    setSelected(null);
    setIdx((i) => i + 1);
  };

  if (done) {
    const correctCount = results.filter(Boolean).length;
    return (
      <div style={{ textAlign: "center", padding: "20px 0", animation: "fadeSlide 0.4s ease" }}>
        <div style={{ fontSize: "2.5rem", marginBottom: 8 }}>
          {correctCount === questions.length ? "🎉" : correctCount >= 2 ? "👍" : "💪"}
        </div>
        <div style={{
          fontFamily: "'Orbitron',sans-serif", fontSize: "1.5rem", fontWeight: 900,
          color: "#00f5ff", marginBottom: 6,
        }}>
          {correctCount} / {questions.length} 正解
        </div>
        <div style={{ color: "#9ca3af", fontSize: "0.85rem", marginBottom: 20 }}>
          {correctCount === questions.length
            ? "完璧！準備バッチリです"
            : "復習しながらゲームで練習しよう"}
        </div>
        <button onClick={onDone} style={{
          padding: "16px 36px", borderRadius: 12, border: "none",
          background: "linear-gradient(135deg, #004f6e, #00c8d9)", color: "#fff",
          fontFamily: "'Orbitron',sans-serif", fontWeight: 900, fontSize: "1rem",
          cursor: "pointer", letterSpacing: "0.08em",
          boxShadow: "0 4px 20px rgba(0,200,220,0.5)",
        }}>
          ドリルゲームへ GO →
        </button>
      </div>
    );
  }

  return (
    <div>
      <p style={{ color: "#9ca3af", fontSize: "0.82rem", marginBottom: 16, lineHeight: 1.7 }}>
        学んだことを即チェック！{questions.length}問だけ解いてみましょう。
      </p>

      {/* progress dots */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        {questions.map((_, i) => (
          <div key={i} style={{
            width: 10, height: 10, borderRadius: "50%",
            background: i < results.length
              ? (results[i] ? "#39ff14" : "#ff4444")
              : i === idx ? "#00f5ff" : "#1a1a2e",
            border: i === idx ? "2px solid #00f5ff" : "2px solid transparent",
            transition: "all 0.3s",
          }} />
        ))}
      </div>

      <div style={{
        background: "#0e0e1c", border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 14, padding: "18px 16px", marginBottom: 14,
        animation: "fadeSlide 0.3s ease",
      }}>
        {q.tricky && (
          <div style={{
            fontSize: "0.65rem", color: "#f472b6", fontFamily: "'Space Mono',monospace",
            background: "rgba(244,114,182,0.1)", border: "1px solid rgba(244,114,182,0.3)",
            display: "inline-block", padding: "2px 8px", borderRadius: 20, marginBottom: 10,
          }}>
            ⚠ ひっかけ注意
          </div>
        )}
        <div style={{ fontWeight: 700, fontSize: "1rem", marginBottom: 16, lineHeight: 1.7 }}>
          {q.q.replace("_____", "[ ？ ]")}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {q.options.map((opt) => {
            let border = "rgba(255,255,255,0.08)";
            let bg = "#1a1a2e";
            let color = "#e8e8f0";
            if (selected) {
              if (opt === q.answer) { border = "#39ff14"; bg = "rgba(57,255,20,0.1)"; color = "#39ff14"; }
              else if (opt === selected) { border = "#ff4444"; bg = "rgba(255,68,68,0.1)"; color = "#ff4444"; }
              else { color = "#4b5563"; }
            }
            return (
              <button key={opt} onClick={() => choose(opt)} disabled={!!selected} style={{
                padding: "12px 10px", borderRadius: 10, border: `2px solid ${border}`,
                background: bg, color, fontFamily: "'Space Mono',monospace",
                fontSize: "0.9rem", fontWeight: 700, cursor: selected ? "default" : "pointer",
                transition: "all 0.18s",
              }}>
                {opt}
              </button>
            );
          })}
        </div>

        {selected && (
          <div style={{
            marginTop: 12, padding: "10px 14px", borderRadius: 9,
            background: "#12121f", borderLeft: `3px solid ${isCorrect ? "#39ff14" : "#ff4444"}`,
            animation: "fadeSlide 0.3s ease",
          }}>
            <div style={{ fontWeight: 700, fontSize: "0.85rem", color: isCorrect ? "#39ff14" : "#ff4444", marginBottom: 4 }}>
              {isCorrect ? "✓ 正解！" : `✗ 正解は ${q.answer}`}
            </div>
            <div style={{ fontSize: "0.77rem", color: "#9ca3af", lineHeight: 1.65 }}>{q.exp}</div>
          </div>
        )}
      </div>

      {selected && (
        <button onClick={next} style={{
          width: "100%", padding: "13px", borderRadius: 11,
          background: idx + 1 >= questions.length
            ? "linear-gradient(135deg, #004f6e, #007a9a)"
            : "#1a1a2e",
          border: "1px solid rgba(0,245,255,0.3)",
          color: "#00f5ff", fontFamily: "'Orbitron',sans-serif",
          fontWeight: 700, fontSize: "0.85rem", cursor: "pointer",
          animation: "fadeSlide 0.2s ease",
        }}>
          {idx + 1 >= questions.length ? "結果を見る →" : "次へ →"}
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// メイン: IntroScreen
// ─────────────────────────────────────────────

const STEPS = [
  { id: "merge",   icon: "⚡", label: "なぜ使う？",     sub: "2文→1文 合体" },
  { id: "tree",    icon: "🗺", label: "どれを使う？",   sub: "判断フロー" },
  { id: "compare", icon: "⚖", label: "ひっかけ対策",    sub: "比較カード" },
  { id: "quiz",    icon: "🎯", label: "確認クイズ",      sub: "3問チェック" },
];

export default function IntroScreen({ level, onStart }) {
  const [stepIdx, setStepIdx] = useState(0);
  const step = STEPS[stepIdx];
  const bodyRef = useRef(null);

  const goNext = () => {
    if (stepIdx < STEPS.length - 1) {
      setStepIdx((i) => i + 1);
      bodyRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  const goPrev = () => {
    if (stepIdx > 0) setStepIdx((i) => i - 1);
  };

  const levelInfo = {
    grade3: { label: "３級", color: "#00f5ff" },
    pre2:   { label: "準２級", color: "#ffd700" },
    all:    { label: "全レベル", color: "#ff6eb4" },
  };
  const li = levelInfo[level] || levelInfo.grade3;
  // For "all", show grade3 content in intro, pre2 content added
  const introLevel = level === "pre2" ? "pre2" : "grade3";

  return (
    <div style={{ paddingTop: 12, maxWidth: 680, margin: "0 auto" }}>
      {/* header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div>
          <div style={{
            fontFamily: "'Orbitron',sans-serif", fontWeight: 900, fontSize: "1rem",
            color: "#e8e8f0",
          }}>
            📖 導入レッスン
          </div>
          <div style={{ fontSize: "0.72rem", color: "#6b7280", marginTop: 2 }}>
            <span style={{ color: li.color, fontFamily: "'Space Mono',monospace" }}>{li.label}</span>
            {" "}レベル
          </div>
        </div>
        <button onClick={onStart} style={{
          padding: "8px 16px", borderRadius: 20, border: "1px solid rgba(255,255,255,0.1)",
          background: "transparent", color: "#6b7280", fontFamily: "'Space Mono',monospace",
          fontSize: "0.72rem", cursor: "pointer",
        }}>
          スキップ →
        </button>
      </div>

      {/* step indicators */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6, marginBottom: 20 }}>
        {STEPS.map((s, i) => {
          const active = i === stepIdx;
          const done = i < stepIdx;
          return (
            <button key={s.id} onClick={() => setStepIdx(i)} style={{
              padding: "10px 4px", borderRadius: 11, border: "none", cursor: "pointer",
              background: active ? "rgba(0,245,255,0.12)" : done ? "rgba(57,255,20,0.07)" : "#12121f",
              borderTop: `2px solid ${active ? "#00f5ff" : done ? "#39ff14" : "transparent"}`,
              textAlign: "center", transition: "all 0.2s",
            }}>
              <div style={{ fontSize: "1.1rem", marginBottom: 2 }}>
                {done ? "✓" : s.icon}
              </div>
              <div style={{
                fontSize: "0.6rem", fontFamily: "'Space Mono',monospace",
                color: active ? "#00f5ff" : done ? "#39ff14" : "#4b5563",
                fontWeight: 700,
              }}>
                {s.label}
              </div>
            </button>
          );
        })}
      </div>

      {/* step content */}
      <div ref={bodyRef} style={{
        background: "#12121f", border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 16, padding: "20px 18px",
        minHeight: 360,
        animation: "fadeSlide 0.3s ease",
        overflowY: "auto",
        maxHeight: "calc(100vh - 320px)",
      }} key={stepIdx}>
        {/* step header */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 9, background: "rgba(0,245,255,0.12)",
            border: "1px solid rgba(0,245,255,0.3)", display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: "1.2rem", flexShrink: 0,
          }}>
            {step.icon}
          </div>
          <div>
            <div style={{ fontWeight: 900, fontSize: "0.95rem", color: "#e8e8f0" }}>{step.label}</div>
            <div style={{ fontSize: "0.68rem", color: "#6b7280", fontFamily: "'Space Mono',monospace" }}>{step.sub}</div>
          </div>
          <div style={{ marginLeft: "auto", fontFamily: "'Space Mono',monospace", fontSize: "0.68rem", color: "#4b5563" }}>
            {stepIdx + 1} / {STEPS.length}
          </div>
        </div>

        {/* content */}
        {step.id === "merge"   && <MergeAnimation level={introLevel} />}
        {step.id === "tree"    && <DecisionTree level={introLevel} />}
        {step.id === "compare" && <CompareCards level={introLevel} />}
        {step.id === "quiz"    && <MiniQuiz level={introLevel} onDone={onStart} />}
      </div>

      {/* navigation */}
      {step.id !== "quiz" && (
        <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
          {stepIdx > 0 && (
            <button onClick={goPrev} style={S.navBtn}>
              ← 前へ
            </button>
          )}
          <button onClick={goNext} style={{ ...S.navBtn, flex: 1, background: "rgba(0,245,255,0.1)", border: "1px solid rgba(0,245,255,0.4)", color: "#00f5ff" }}>
            {stepIdx < STEPS.length - 1 ? "次へ →" : "クイズへ →"}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── local styles ─────────────────────────────────────────────

const S = {
  navSmBtn: {
    padding: "6px 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)",
    background: "#12121f", color: "#9ca3af", cursor: "pointer",
    fontFamily: "'Space Mono',monospace", fontSize: "0.8rem",
  },
  navBtn: {
    padding: "13px 20px", borderRadius: 11, border: "1px solid rgba(255,255,255,0.1)",
    background: "#1a1a2e", color: "#9ca3af", fontFamily: "'Orbitron',sans-serif",
    fontWeight: 700, fontSize: "0.82rem", cursor: "pointer", letterSpacing: "0.05em",
    transition: "all 0.2s",
  },
};
