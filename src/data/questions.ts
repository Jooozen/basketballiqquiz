import { Possession } from "@/types/quiz";

// Coordinate system: rim at TOP (y~8-12), 3PT arc ~y=20-85, half-court y=95
// 3PT corners: x=12,y=15 and x=88,y=15
// 3PT wings: x=15,y=65 and x=85,y=65
// Top of key: x=50,y=87
//
// Screen angle convention (degrees):
//   0 = horizontal bar (blocks vertical movement)
//  90 = vertical bar (blocks lateral/horizontal movement)
//  45 = diagonal

const basePlayers = [
  { id: "pg", label: "PG", isOffense: true },
  { id: "sg", label: "SG", isOffense: true },
  { id: "sf", label: "SF", isOffense: true },
  { id: "pf", label: "PF", isOffense: true },
  { id: "c", label: "C", isOffense: true },
  { id: "d1", label: "×", isOffense: false },
  { id: "d2", label: "×", isOffense: false },
  { id: "d3", label: "×", isOffense: false },
  { id: "d4", label: "×", isOffense: false },
  { id: "d5", label: "×", isOffense: false },
];

export const possessions: Possession[] = [
  // === Possession 1: Pick & Roll ===
  // PGがトップでボール保持。Cがスクリーンをセットし、PGがドライブ。
  // Cのロール/ポップの判断を問う。
  {
    id: "pos-001",
    title: "ピック&ロール（基本）",
    description: "PGがCのスクリーンを使ってドライブするピック&ロール。",
    players: basePlayers,
    initialPositions: {
      pg: { x: 50, y: 88 },  // トップ
      sg: { x: 85, y: 65 },  // 右ウィング
      sf: { x: 88, y: 15 },  // 右コーナー
      pf: { x: 12, y: 65 },  // 左ウィング
      c: { x: 60, y: 75 },   // ハイポスト右寄り
      d1: { x: 48, y: 84 },  // PGのDF
      d2: { x: 82, y: 62 },
      d3: { x: 85, y: 18 },
      d4: { x: 15, y: 62 },
      d5: { x: 57, y: 72 },  // CのDF
    },
    initialBallHolder: "pg",
    steps: [
      // Step 1: C is OFF-BALL. PGがボール保持。Cはどう動く？
      // 正解: PGのDFにスクリーンをセット (screen)
      // バスケ的にCの選択肢: スクリーン or カット
      {
        description: "PGがボールを持っています。Cはどう動くべき？",
        targetPlayerId: "c",
        targetPlayerLabel: "C",
        preAnimations: [],
        answerSpots: [
          {
            id: "p1s1-a1",
            position: { x: 48, y: 82 },
            moveType: "screen",
            // PGは左にドライブしたいので、d1(x:48,y:84)の横にスクリーン
            // 縦方向の移動を防ぐ → 横向きバー（screenAngle=90: 垂直バー=横移動をブロック）
            screenAngle: 90,
            score: 100,
            explanation: "正解！PGのディフェンス(d1)にスクリーンをセット。PGが左方向にドライブできるよう、ディフェンスの横にスクリーンの壁を作ります。これがピック&ロールの第一歩です。",
          },
          {
            id: "p1s1-a2",
            position: { x: 50, y: 50 },
            moveType: "cut",
            curveDirection: "right",
            score: 0,
            explanation: "いきなりゴール方向にカットしても、スクリーンなしではディフェンスに簡単についていかれます。まずはPGのためにスクリーンをセットしましょう。",
          },
          {
            id: "p1s1-a3",
            position: { x: 85, y: 80 },
            moveType: "cut",
            curveDirection: "straight",
            score: 0,
            explanation: "ウィング方向にカットしてもオフェンスに貢献できません。ビッグマンの大事な仕事はスクリーンでチームメイトの突破を助けることです。",
          },
          {
            id: "p1s1-a4",
            position: { x: 35, y: 82 },
            moveType: "screen",
            // PGの逆サイドにスクリーン → 位置が悪い
            screenAngle: 90,
            score: 50,
            explanation: "スクリーンをかける判断は正しいですが、この角度ではPGのディフェンスに効きません。ディフェンスのすぐ横にセットして、PGのドライブコースを作りましょう。",
          },
        ],
        postAnswerActions: {
          "p1s1-a1": [
            {
              steps: [
                { playerId: "c", from: { x: 60, y: 75 }, to: { x: 48, y: 82 }, duration: 0.7, type: "move" },
                { playerId: "d5", from: { x: 57, y: 72 }, to: { x: 46, y: 78 }, duration: 0.7, type: "move" },
              ],
              pauseAfter: 0.3,
            },
          ],
          "p1s1-a2": [{ steps: [{ playerId: "c", from: { x: 60, y: 75 }, to: { x: 50, y: 50 }, duration: 0.8, type: "cut" }], pauseAfter: 0.5 }],
          "p1s1-a3": [{ steps: [{ playerId: "c", from: { x: 60, y: 75 }, to: { x: 85, y: 80 }, duration: 0.8, type: "move" }], pauseAfter: 0.5 }],
          "p1s1-a4": [{ steps: [{ playerId: "c", from: { x: 60, y: 75 }, to: { x: 35, y: 82 }, duration: 0.7, type: "move" }], pauseAfter: 0.5 }],
        },
        shootQuality: 2,
        shootExplanation: "まだスクリーンも使っていない段階。ディフェンスが全く崩れていないので、シュート確率は低いです。",
        feedback: "ナイススクリーン！ピック&ロール開始！",
        explanation: "【ピック&ロール】ビッグマンがボールハンドラーのディフェンスにスクリーンをセット。NBAでも最も多用されるプレーです。スクリーンの位置と角度が重要で、ディフェンスのすぐ横に体を寄せることでドライブコースを確保します。",
      },

      // Step 2: C is still OFF-BALL. PGがスクリーンを使ってドライブ中。
      // Cはスクリーン後どう動く？
      // 正解: ロール（ゴール方向へカット）
      {
        description: "PGがスクリーンを使って左にドライブ開始！ディフェンスが2人ともPGに寄っています。Cはスクリーン後どう動く？",
        targetPlayerId: "c",
        targetPlayerLabel: "C",
        preAnimations: [
          {
            steps: [
              { playerId: "pg", from: { x: 50, y: 88 }, to: { x: 38, y: 68 }, duration: 0.9, type: "dribble", hasBall: true },
              { playerId: "d1", from: { x: 48, y: 84 }, to: { x: 40, y: 70 }, duration: 0.9, type: "move" },
              { playerId: "d5", from: { x: 46, y: 78 }, to: { x: 42, y: 72 }, duration: 0.6, type: "move" },
            ],
            pauseAfter: 0.3,
          },
        ],
        answerSpots: [
          {
            id: "p1s2-a1",
            position: { x: 50, y: 40 },
            moveType: "cut",
            // ロール: スクリーン位置からゴール方向へ、PGのドライブと反対側にカーブ
            curveDirection: "right",
            score: 100,
            explanation: "正解！ロール（ゴール方向へカット）！PGのドライブにディフェンスが2人寄っているので、ゴールに向かって転がり込めばフリーでパスを受けてレイアップできます。ピック&ロールの核心です。",
          },
          {
            id: "p1s2-a2",
            position: { x: 65, y: 88 },
            moveType: "cut",
            // ポップ: 3ポイントライン外に広がる（直線的に外へ出る）
            curveDirection: "straight",
            score: 50,
            explanation: "ポップ（外に広がる）も選択肢の一つ。3ポイントシュートに自信があるビッグマンなら有効ですが、ディフェンスが2人ともPGに寄っている今はゴール下に飛び込むロールの方がチャンスが大きいです。",
          },
          {
            id: "p1s2-a3",
            position: { x: 48, y: 82 },
            moveType: "screen",
            // スクリーン位置に留まってもう一度スクリーン → 無意味
            screenAngle: 90,
            score: 0,
            explanation: "スクリーン位置に留まっていてはスペースを潰してしまいます。PGはすでにスクリーンを使って突破しているので、Cも次のアクション（ロールかポップ）に移りましょう。",
          },
          {
            id: "p1s2-a4",
            position: { x: 20, y: 65 },
            moveType: "cut",
            // 逆サイドにカット → ボールから離れすぎ
            curveDirection: "straight",
            score: 0,
            explanation: "ボールと反対方向に離れすぎです。ピック&ロールのメリットはスクリーナーとハンドラーの2対1を作ること。離れるとその優位性がなくなります。",
          },
        ],
        postAnswerActions: {
          "p1s2-a1": [
            {
              steps: [
                { playerId: "c", from: { x: 48, y: 82 }, to: { x: 50, y: 40 }, duration: 0.8, type: "cut" },
                { playerId: "d5", from: { x: 42, y: 72 }, to: { x: 48, y: 43 }, duration: 0.8, type: "move" },
              ],
              pauseAfter: 0.2,
            },
            {
              steps: [],
              ballPass: { from: "pg", to: "c" },
              pauseAfter: 0.3,
            },
          ],
          "p1s2-a2": [{ steps: [{ playerId: "c", from: { x: 48, y: 82 }, to: { x: 65, y: 88 }, duration: 0.7, type: "move" }], pauseAfter: 0.5 }],
          "p1s2-a3": [{ steps: [], pauseAfter: 0.5 }],
          "p1s2-a4": [{ steps: [{ playerId: "c", from: { x: 48, y: 82 }, to: { x: 20, y: 65 }, duration: 0.8, type: "move" }], pauseAfter: 0.5 }],
        },
        shootQuality: 8,
        shootExplanation: "ロールでゴール下に飛び込みレイアップ！ディフェンスが崩れた絶好のシュートチャンスです。PGとCの2人で作った得点機会を逃さずフィニッシュしましょう。",
        feedback: "ロール！ゴール下でフィニッシュ！",
        explanation: "【ロール】スクリーン後にゴール方向へ転がり込む動き。ディフェンスがボールハンドラーに集中した瞬間にフリーになれます。ピック&ロールでは「スクリーン→ロール」の流れがセットです。",
      },
    ],
  },
];
