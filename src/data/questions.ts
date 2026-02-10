import { Possession } from "@/types/quiz";

// Coordinate system: rim at TOP (y~8-12), 3PT arc ~y=20-85, half-court y=95
// 3PT corners: x=12,y=15 and x=88,y=15
// 3PT wings: x=15,y=65 and x=85,y=65
// Top of key: x=50,y=87

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
  {
    id: "pos-001",
    title: "ピック&ロール（基本）",
    description: "PGがCのスクリーンを使ってドライブするピック&ロール。",
    players: basePlayers,
    initialPositions: {
      pg: { x: 50, y: 88 },
      sg: { x: 85, y: 65 },
      sf: { x: 88, y: 15 },
      pf: { x: 12, y: 65 },
      c: { x: 60, y: 75 },
      d1: { x: 48, y: 84 },
      d2: { x: 82, y: 62 },
      d3: { x: 85, y: 18 },
      d4: { x: 15, y: 62 },
      d5: { x: 57, y: 72 },
    },
    initialBallHolder: "pg",
    steps: [
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
            score: 100,
            explanation: "正解！PGのディフェンスにスクリーンをかけてピック&ロールを仕掛けます。スクリーンの角度はディフェンスの横に設定するのが効果的です。",
          },
          {
            id: "p1s1-a2",
            position: { x: 50, y: 50 },
            moveType: "cut",
            curveDirection: "right",
            score: 0,
            explanation: "いきなりゴールに向かってカットしてもパスが通る状況ではありません。まずはスクリーンでPGの突破をサポートしましょう。",
          },
          {
            id: "p1s1-a3",
            position: { x: 85, y: 80 },
            moveType: "dribble",
            score: 0,
            explanation: "ボールのないCがウィングにドリブルで移動する状況ではありません。ビッグマンの役割はスクリーンでチームメイトを助けることです。",
          },
          {
            id: "p1s1-a4",
            position: { x: 35, y: 88 },
            moveType: "pass",
            score: 50,
            explanation: "ポップアウトしてパスを受けるのも一つの選択肢ですが、この状況ではスクリーンをかけてPGのドライブを助ける方が効果的です。",
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
          "p1s1-a4": [{ steps: [{ playerId: "c", from: { x: 60, y: 75 }, to: { x: 35, y: 88 }, duration: 0.7, type: "move" }], pauseAfter: 0.5 }],
        },
        shootQuality: 2,
        shootExplanation: "まだスクリーンも使っていない段階でのシュートは確率が低いです。ピック&ロールで崩してから打ちましょう。",
        feedback: "ナイススクリーン！ピック&ロール開始！",
        explanation: "【ピック&ロール】ビッグマンがボールハンドラーのディフェンスにスクリーンをセット。NBAでも最も使われるプレーの一つです。",
      },
      {
        description: "PGがスクリーンを使ってドライブ開始。Cはスクリーン後どう動く？",
        targetPlayerId: "c",
        targetPlayerLabel: "C",
        preAnimations: [
          {
            steps: [
              { playerId: "pg", from: { x: 50, y: 88 }, to: { x: 45, y: 68 }, duration: 0.9, type: "dribble", hasBall: true },
              { playerId: "d1", from: { x: 48, y: 84 }, to: { x: 43, y: 70 }, duration: 0.9, type: "move" },
              { playerId: "d5", from: { x: 46, y: 78 }, to: { x: 44, y: 72 }, duration: 0.6, type: "move" },
            ],
            pauseAfter: 0.3,
          },
        ],
        answerSpots: [
          {
            id: "p1s2-a1",
            position: { x: 50, y: 45 },
            moveType: "cut",
            curveDirection: "right",
            score: 100,
            explanation: "正解！ロール（ゴール方向へカット）！スクリーン後にゴールに向かって転がり込むことで、ディフェンスが2人ともPGに寄った瞬間にパスを受けてレイアップできます。",
          },
          {
            id: "p1s2-a2",
            position: { x: 65, y: 88 },
            moveType: "screen",
            score: 50,
            explanation: "ポップ（外に広がる）も選択肢ですが、ディフェンスがPGに寄っている今はロールの方がチャンスが大きいです。シュートに自信がある選手ならポップも有効です。",
          },
          {
            id: "p1s2-a3",
            position: { x: 48, y: 82 },
            moveType: "dribble",
            score: 0,
            explanation: "スクリーン位置に留まるとスペースを潰してしまいます。スクリーン後はすぐにロールかポップで次のアクションに移りましょう。",
          },
          {
            id: "p1s2-a4",
            position: { x: 20, y: 65 },
            moveType: "pass",
            score: 0,
            explanation: "ボールから離れすぎるとピック&ロールのメリットがなくなります。ゴールに向かってロールするのが基本です。",
          },
        ],
        postAnswerActions: {
          "p1s2-a1": [
            {
              steps: [
                { playerId: "c", from: { x: 48, y: 82 }, to: { x: 50, y: 45 }, duration: 0.8, type: "cut" },
                { playerId: "d5", from: { x: 44, y: 72 }, to: { x: 48, y: 48 }, duration: 0.8, type: "move" },
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
        shootExplanation: "ロールでゴール下に飛び込み、レイアップ。ディフェンスが崩れた絶好のシュートチャンスです！",
        feedback: "ロール！ゴール下でフィニッシュ！",
        explanation: "【ロール】スクリーン後のロールはピック&ロールの核心。ディフェンスの隙間を突いてゴール方向に転がり込みます。",
      },
    ],
  },

  // === Possession 2: Wing Entry & Pass-and-Cut ===
  {
    id: "pos-002",
    title: "ウィングエントリー＆カット",
    description: "PGからウィングへのパス後、パス&カットでゴールを狙う。",
    players: basePlayers,
    initialPositions: {
      pg: { x: 50, y: 90 },
      sg: { x: 85, y: 65 },
      sf: { x: 88, y: 15 },
      pf: { x: 15, y: 65 },
      c: { x: 12, y: 15 },
      d1: { x: 48, y: 86 },
      d2: { x: 82, y: 62 },
      d3: { x: 85, y: 18 },
      d4: { x: 18, y: 62 },
      d5: { x: 15, y: 18 },
    },
    initialBallHolder: "pg",
    steps: [
      {
        description: "PGがSGにウィングパスを出しました。PGはどう動くべき？",
        targetPlayerId: "pg",
        targetPlayerLabel: "PG",
        preAnimations: [
          { steps: [], ballPass: { from: "pg", to: "sg" }, pauseAfter: 0.5 },
        ],
        answerSpots: [
          {
            id: "p2s1-a1",
            position: { x: 70, y: 35 },
            moveType: "cut",
            curveDirection: "right",
            score: 100,
            explanation: "正解！パス&カット。パスした方向にゴールへカットしてディフェンスの裏を突きます。レイアップのチャンスを狙いましょう。",
          },
          {
            id: "p2s1-a2",
            position: { x: 50, y: 90 },
            moveType: "screen",
            score: 0,
            explanation: "その場に留まるのはNG。パスした後は必ず動くのがモーションオフェンスの鉄則です。",
          },
          {
            id: "p2s1-a3",
            position: { x: 15, y: 88 },
            moveType: "dribble",
            score: 50,
            explanation: "逆サイドに広がるのは悪くありませんが、まずはゴール方向へのカットを優先。カットが通らなかった後にポジション交換します。",
          },
          {
            id: "p2s1-a4",
            position: { x: 70, y: 80 },
            moveType: "pass",
            score: 0,
            explanation: "ボールに近づくとスペーシングが崩れます。パスした後はゴール方向にカットしましょう。",
          },
        ],
        postAnswerActions: {
          "p2s1-a1": [
            {
              steps: [
                { playerId: "pg", from: { x: 50, y: 90 }, to: { x: 70, y: 35 }, duration: 0.9, type: "cut" },
                { playerId: "d1", from: { x: 48, y: 86 }, to: { x: 67, y: 38 }, duration: 0.9, type: "move" },
              ],
              pauseAfter: 0.5,
            },
          ],
          "p2s1-a2": [{ steps: [], pauseAfter: 0.5 }],
          "p2s1-a3": [{ steps: [{ playerId: "pg", from: { x: 50, y: 90 }, to: { x: 15, y: 88 }, duration: 0.8, type: "move" }], pauseAfter: 0.5 }],
          "p2s1-a4": [{ steps: [{ playerId: "pg", from: { x: 50, y: 90 }, to: { x: 70, y: 80 }, duration: 0.7, type: "move" }], pauseAfter: 0.5 }],
        },
        shootQuality: 3,
        shootExplanation: "SGがウィングでボールを受けたばかり。まだディフェンスが崩れていないので、ここで打つのは得策ではありません。",
        feedback: "ナイスカット！パス&ゴー！",
        explanation: "【パス&カット】パスした方向にゴール方向へ走り込むのがモーションオフェンスの基本です。",
      },
      {
        description: "PGのカットにパスが通りませんでした。PGはどこに抜けるべき？",
        targetPlayerId: "pg",
        targetPlayerLabel: "PG",
        preAnimations: [
          {
            steps: [
              { playerId: "pg", from: { x: 70, y: 35 }, to: { x: 55, y: 15 }, duration: 0.5, type: "cut" },
              { playerId: "d1", from: { x: 67, y: 38 }, to: { x: 52, y: 18 }, duration: 0.5, type: "move" },
            ],
            pauseAfter: 0.3,
          },
        ],
        answerSpots: [
          {
            id: "p2s2-a1",
            position: { x: 12, y: 15 },
            moveType: "cut",
            curveDirection: "left",
            score: 100,
            explanation: "正解！カットが通らなかったら逆サイドコーナーにフィル。スペーシングを維持し、ローテーションを促します。",
          },
          {
            id: "p2s2-a2",
            position: { x: 50, y: 40 },
            moveType: "screen",
            score: 0,
            explanation: "ペイント内に留まるとスペーシングが崩壊します。すぐに外に抜けましょう。",
          },
          {
            id: "p2s2-a3",
            position: { x: 50, y: 90 },
            moveType: "dribble",
            score: 50,
            explanation: "トップに戻るのも選択肢ですが、カットの勢いのまま逆サイドに流れた方がスムーズです。",
          },
          {
            id: "p2s2-a4",
            position: { x: 88, y: 15 },
            moveType: "pass",
            score: 0,
            explanation: "SFがいるポジションです。同じスポットに2人は不要です。",
          },
        ],
        postAnswerActions: {
          "p2s2-a1": [
            {
              steps: [
                { playerId: "pg", from: { x: 55, y: 15 }, to: { x: 12, y: 15 }, duration: 0.8, type: "move" },
                { playerId: "d1", from: { x: 52, y: 18 }, to: { x: 15, y: 18 }, duration: 0.8, type: "move" },
                { playerId: "c", from: { x: 12, y: 15 }, to: { x: 15, y: 65 }, duration: 0.8, type: "move" },
                { playerId: "d5", from: { x: 15, y: 18 }, to: { x: 18, y: 62 }, duration: 0.8, type: "move" },
              ],
              pauseAfter: 0.5,
            },
          ],
          "p2s2-a2": [{ steps: [{ playerId: "pg", from: { x: 55, y: 15 }, to: { x: 50, y: 40 }, duration: 0.6, type: "move" }], pauseAfter: 0.5 }],
          "p2s2-a3": [{ steps: [{ playerId: "pg", from: { x: 55, y: 15 }, to: { x: 50, y: 90 }, duration: 0.9, type: "move" }], pauseAfter: 0.5 }],
          "p2s2-a4": [{ steps: [{ playerId: "pg", from: { x: 55, y: 15 }, to: { x: 88, y: 15 }, duration: 0.7, type: "move" }], pauseAfter: 0.5 }],
        },
        shootQuality: 5,
        shootExplanation: "ローテーションが完了しつつありますが、まだ理想的なシュートチャンスとは言えません。もう少しパスを回しましょう。",
        feedback: "逆サイドコーナーにフィル！ローテーション開始！",
        explanation: "【フィル】カットが通らない場合、空いた逆サイドのスポットに流れてスペーシングを維持します。",
      },
      {
        description: "SGがボールを持っています。PFが上がってきています。SGはどうする？",
        targetPlayerId: "sg",
        targetPlayerLabel: "SG",
        preAnimations: [
          {
            steps: [
              { playerId: "pf", from: { x: 15, y: 65 }, to: { x: 40, y: 85 }, duration: 0.7, type: "move" },
              { playerId: "d4", from: { x: 18, y: 62 }, to: { x: 38, y: 82 }, duration: 0.7, type: "move" },
            ],
            pauseAfter: 0.3,
          },
        ],
        answerSpots: [
          {
            id: "p2s3-a1",
            position: { x: 72, y: 40 },
            moveType: "dribble",
            score: 100,
            explanation: "正解！ベースラインドライブ。ローテーション後にできたスペースを攻めます。ディフェンスがヘルプに寄ったらキックアウト！",
          },
          {
            id: "p2s3-a2",
            position: { x: 40, y: 85 },
            moveType: "pass",
            score: 50,
            explanation: "PFへのパスも選択肢ですが、ドライブできるスペースがある今、自分で攻める方がチャンスが大きいです。",
          },
          {
            id: "p2s3-a3",
            position: { x: 85, y: 65 },
            moveType: "screen",
            score: 0,
            explanation: "ウィングで待っていてもチャンスは生まれません。積極的にアタックしましょう。",
          },
          {
            id: "p2s3-a4",
            position: { x: 88, y: 15 },
            moveType: "pass",
            score: 0,
            explanation: "コーナーのSFにパスしても、そこからの展開が限られます。自分でドライブした方が効果的です。",
          },
        ],
        postAnswerActions: {
          "p2s3-a1": [
            {
              steps: [
                { playerId: "sg", from: { x: 85, y: 65 }, to: { x: 72, y: 40 }, duration: 0.9, type: "dribble", hasBall: true },
                { playerId: "d2", from: { x: 82, y: 62 }, to: { x: 70, y: 42 }, duration: 0.9, type: "move" },
              ],
              pauseAfter: 0.5,
            },
          ],
          "p2s3-a2": [{ steps: [], ballPass: { from: "sg", to: "pf" }, pauseAfter: 0.5 }],
          "p2s3-a3": [{ steps: [], pauseAfter: 0.5 }],
          "p2s3-a4": [{ steps: [], ballPass: { from: "sg", to: "sf" }, pauseAfter: 0.5 }],
        },
        shootQuality: 7,
        shootExplanation: "ドライブからのプルアップジャンパー。ディフェンスを崩した後の良いシュートセレクションです。",
        feedback: "ベースラインドライブ！アタック！",
        explanation: "【ドライブ判断】スペースが空いている時は積極的にドライブ。ディフェンスの反応を見てフィニッシュかキックアウトを判断します。",
      },
    ],
  },

  // === Possession 3: Dribble Drive & Kick ===
  {
    id: "pos-003",
    title: "ドライブ＆キックアウト",
    description: "PGのドライブからキックアウトでオープンショットを作る。",
    players: basePlayers,
    initialPositions: {
      pg: { x: 50, y: 88 },
      sg: { x: 85, y: 65 },
      sf: { x: 88, y: 15 },
      pf: { x: 15, y: 65 },
      c: { x: 50, y: 55 },
      d1: { x: 48, y: 84 },
      d2: { x: 82, y: 62 },
      d3: { x: 85, y: 18 },
      d4: { x: 18, y: 62 },
      d5: { x: 48, y: 52 },
    },
    initialBallHolder: "pg",
    steps: [
      {
        description: "PGがドライブを開始しました。コーナーにいるSFはどう動くべき？",
        targetPlayerId: "sf",
        targetPlayerLabel: "SF",
        preAnimations: [
          {
            steps: [
              { playerId: "pg", from: { x: 50, y: 88 }, to: { x: 60, y: 55 }, duration: 1.0, type: "dribble", hasBall: true },
              { playerId: "d1", from: { x: 48, y: 84 }, to: { x: 58, y: 57 }, duration: 1.0, type: "move" },
              { playerId: "d3", from: { x: 85, y: 18 }, to: { x: 72, y: 35 }, duration: 0.8, type: "move" },
            ],
            pauseAfter: 0.3,
          },
        ],
        answerSpots: [
          {
            id: "p3s1-a1",
            position: { x: 85, y: 42 },
            moveType: "cut",
            curveDirection: "left",
            score: 100,
            explanation: "正解！ヘルプディフェンスが寄ったので、コーナーから45度の位置にリフト。キックアウトパスを受けてオープンシュートが打てます。",
          },
          {
            id: "p3s1-a2",
            position: { x: 88, y: 15 },
            moveType: "screen",
            score: 50,
            explanation: "コーナーに留まるのは悪くありませんが、ディフェンスが寄っている今、少し上がった方がパスを受けやすくなります。",
          },
          {
            id: "p3s1-a3",
            position: { x: 60, y: 30 },
            moveType: "dribble",
            score: 0,
            explanation: "ドライブに近づきすぎです。スペーシングを保ちつつ、キックアウトに備えましょう。",
          },
          {
            id: "p3s1-a4",
            position: { x: 50, y: 15 },
            moveType: "pass",
            score: 0,
            explanation: "ゴール下に入るとPGのドライブコースを塞いでしまいます。外に広がりましょう。",
          },
        ],
        postAnswerActions: {
          "p3s1-a1": [
            {
              steps: [
                { playerId: "sf", from: { x: 88, y: 15 }, to: { x: 85, y: 42 }, duration: 0.7, type: "move" },
              ],
              pauseAfter: 0.2,
            },
            { steps: [], ballPass: { from: "pg", to: "sf" }, pauseAfter: 0.4 },
          ],
          "p3s1-a2": [{ steps: [], pauseAfter: 0.5 }],
          "p3s1-a3": [{ steps: [{ playerId: "sf", from: { x: 88, y: 15 }, to: { x: 60, y: 30 }, duration: 0.7, type: "move" }], pauseAfter: 0.5 }],
          "p3s1-a4": [{ steps: [{ playerId: "sf", from: { x: 88, y: 15 }, to: { x: 50, y: 15 }, duration: 0.7, type: "move" }], pauseAfter: 0.5 }],
        },
        shootQuality: 4,
        shootExplanation: "ドライブ中のPGからのシュートはディフェンスに囲まれています。キックアウトしてオープンを作った方が良いです。",
        feedback: "リフト！キックアウトに備えろ！",
        explanation: "【リフト】ドライブに合わせてコーナーから45度にリフトすることで、キックアウトパスを受ける最適なポジションを取ります。",
      },
      {
        description: "SFがキックアウトパスを受けました。SFの最善の選択は？",
        targetPlayerId: "sf",
        targetPlayerLabel: "SF",
        preAnimations: [],
        answerSpots: [
          {
            id: "p3s2-a1",
            position: { x: 85, y: 42 },
            moveType: "screen",
            score: 100,
            explanation: "正解！キャッチ&シュート。ディフェンスのクローズアウトが間に合わないうちにシュート！オープンなら打つのが鉄則です。",
          },
          {
            id: "p3s2-a2",
            position: { x: 70, y: 25 },
            moveType: "dribble",
            score: 50,
            explanation: "ドライブも選択肢ですが、オープンの今はシュートの方がリスクが低く期待値が高いです。",
          },
          {
            id: "p3s2-a3",
            position: { x: 50, y: 88 },
            moveType: "pass",
            score: 0,
            explanation: "せっかくのオープンチャンスを逃してしまいます。空いたら打ちましょう！",
          },
          {
            id: "p3s2-a4",
            position: { x: 88, y: 65 },
            moveType: "cut",
            curveDirection: "right",
            score: 0,
            explanation: "ウィングに戻ってはクローズアウトが間に合ってしまいます。キャッチした瞬間に打ちましょう。",
          },
        ],
        postAnswerActions: {
          "p3s2-a1": [{ steps: [], pauseAfter: 0.5 }],
          "p3s2-a2": [{ steps: [{ playerId: "sf", from: { x: 85, y: 42 }, to: { x: 70, y: 25 }, duration: 0.7, type: "dribble", hasBall: true }], pauseAfter: 0.5 }],
          "p3s2-a3": [{ steps: [], ballPass: { from: "sf", to: "pg" }, pauseAfter: 0.5 }],
          "p3s2-a4": [{ steps: [{ playerId: "sf", from: { x: 85, y: 42 }, to: { x: 88, y: 65 }, duration: 0.7, type: "move" }], pauseAfter: 0.5 }],
        },
        shootQuality: 9,
        shootExplanation: "キックアウトからのオープン3ポイント！完璧なシュートセレクションです。チーム全体の動きが生んだ最高のチャンスです！",
        feedback: "キャッチ&シュート！ナイスショット！",
        explanation: "【オープンシュート判断】空いたら打つ。ドライブ&キックアウトで作ったオープンショットは迷わず打ちましょう。",
      },
    ],
  },

  // === Possession 4: Off-Ball Screen ===
  {
    id: "pos-004",
    title: "オフボールスクリーン",
    description: "SGがSFのスクリーンを使ってフリーになるオフボールアクション。",
    players: basePlayers,
    initialPositions: {
      pg: { x: 50, y: 88 },
      sg: { x: 12, y: 25 },
      sf: { x: 35, y: 45 },
      pf: { x: 85, y: 65 },
      c: { x: 50, y: 55 },
      d1: { x: 48, y: 84 },
      d2: { x: 15, y: 28 },
      d3: { x: 33, y: 42 },
      d4: { x: 82, y: 62 },
      d5: { x: 48, y: 52 },
    },
    initialBallHolder: "pg",
    steps: [
      {
        description: "SGがオフボールで動きたい。SFはどうすべき？",
        targetPlayerId: "sf",
        targetPlayerLabel: "SF",
        preAnimations: [],
        answerSpots: [
          {
            id: "p4s1-a1",
            position: { x: 20, y: 30 },
            moveType: "screen",
            score: 100,
            explanation: "正解！SGのディフェンスにオフボールスクリーンをセット。SGがスクリーンを使ってフリーになれます。",
          },
          {
            id: "p4s1-a2",
            position: { x: 50, y: 25 },
            moveType: "cut",
            curveDirection: "left",
            score: 0,
            explanation: "自分でカットしてもSGとスペースが被ります。チームメイトのためにスクリーンをかけましょう。",
          },
          {
            id: "p4s1-a3",
            position: { x: 35, y: 75 },
            moveType: "dribble",
            score: 0,
            explanation: "外に広がるだけでは攻撃に進展がありません。オフボールスクリーンでチームメイトを助けましょう。",
          },
          {
            id: "p4s1-a4",
            position: { x: 50, y: 88 },
            moveType: "pass",
            score: 50,
            explanation: "トップに上がるのは一つの選択肢ですが、SGのためにスクリーンをセットする方がチームにとって効果的です。",
          },
        ],
        postAnswerActions: {
          "p4s1-a1": [
            {
              steps: [
                { playerId: "sf", from: { x: 35, y: 45 }, to: { x: 20, y: 30 }, duration: 0.7, type: "move" },
                { playerId: "d3", from: { x: 33, y: 42 }, to: { x: 22, y: 32 }, duration: 0.7, type: "move" },
              ],
              pauseAfter: 0.3,
            },
          ],
          "p4s1-a2": [{ steps: [{ playerId: "sf", from: { x: 35, y: 45 }, to: { x: 50, y: 25 }, duration: 0.7, type: "cut" }], pauseAfter: 0.5 }],
          "p4s1-a3": [{ steps: [{ playerId: "sf", from: { x: 35, y: 45 }, to: { x: 35, y: 75 }, duration: 0.7, type: "move" }], pauseAfter: 0.5 }],
          "p4s1-a4": [{ steps: [{ playerId: "sf", from: { x: 35, y: 45 }, to: { x: 50, y: 88 }, duration: 0.8, type: "move" }], pauseAfter: 0.5 }],
        },
        shootQuality: 2,
        shootExplanation: "まだオフボールアクションが始まったばかり。スクリーンを使ってフリーの選手を作ってからシュートを狙いましょう。",
        feedback: "ナイススクリーン！SGをフリーにしよう！",
        explanation: "【オフボールスクリーン】ボールのない場所でスクリーンをかけてチームメイトをフリーにする。利他的なプレーがチームを強くします。",
      },
      {
        description: "SFがスクリーンをセット。SGはどう使うべき？",
        targetPlayerId: "sg",
        targetPlayerLabel: "SG",
        preAnimations: [],
        answerSpots: [
          {
            id: "p4s2-a1",
            position: { x: 30, y: 65 },
            moveType: "cut",
            curveDirection: "right",
            score: 100,
            explanation: "正解！スクリーンを使ってカールカット。ディフェンスがスクリーンに引っかかっている間にフリーでボールを受けられます。",
          },
          {
            id: "p4s2-a2",
            position: { x: 12, y: 50 },
            moveType: "cut",
            curveDirection: "left",
            score: 50,
            explanation: "フェードカット（スクリーンと反対方向に逃げる）も選択肢。ただしカールの方がゴールに近いシュートが打てます。",
          },
          {
            id: "p4s2-a3",
            position: { x: 12, y: 25 },
            moveType: "screen",
            score: 0,
            explanation: "その場に留まるのはスクリーンを無駄にしています。スクリーンを使って動きましょう！",
          },
          {
            id: "p4s2-a4",
            position: { x: 50, y: 15 },
            moveType: "dribble",
            score: 0,
            explanation: "ゴール下への直線的な動きではスクリーンを活用できません。スクリーンの周りをカールしましょう。",
          },
        ],
        postAnswerActions: {
          "p4s2-a1": [
            {
              steps: [
                { playerId: "sg", from: { x: 12, y: 25 }, to: { x: 30, y: 65 }, duration: 0.9, type: "cut" },
                { playerId: "d2", from: { x: 15, y: 28 }, to: { x: 25, y: 55 }, duration: 1.0, type: "move" },
              ],
              pauseAfter: 0.2,
            },
            { steps: [], ballPass: { from: "pg", to: "sg" }, pauseAfter: 0.4 },
          ],
          "p4s2-a2": [
            {
              steps: [{ playerId: "sg", from: { x: 12, y: 25 }, to: { x: 12, y: 50 }, duration: 0.7, type: "cut" }],
              pauseAfter: 0.5,
            },
          ],
          "p4s2-a3": [{ steps: [], pauseAfter: 0.5 }],
          "p4s2-a4": [{ steps: [{ playerId: "sg", from: { x: 12, y: 25 }, to: { x: 50, y: 15 }, duration: 0.8, type: "move" }], pauseAfter: 0.5 }],
        },
        shootQuality: 8,
        shootExplanation: "カールカットでフリーになり、ミドルレンジからのジャンプシュート。素晴らしいショットセレクション！",
        feedback: "カールカット！フリーでキャッチ！",
        explanation: "【カールカット】スクリーンの周りをカールするように動き、フリーでボールを受ける。スクリーナーとのコンビネーションが重要です。",
      },
    ],
  },

  // === Possession 5: Fast Break (3 on 2) ===
  {
    id: "pos-005",
    title: "速攻（3対2）",
    description: "3対2のトランジションで素早く得点を狙う。",
    players: basePlayers,
    initialPositions: {
      pg: { x: 50, y: 75 },
      sg: { x: 82, y: 55 },
      sf: { x: 18, y: 55 },
      pf: { x: 50, y: 92 },
      c: { x: 30, y: 92 },
      d1: { x: 45, y: 50 },
      d2: { x: 55, y: 35 },
      d3: { x: 70, y: 90 },
      d4: { x: 30, y: 90 },
      d5: { x: 50, y: 95 },
    },
    initialBallHolder: "pg",
    steps: [
      {
        description: "3対2の速攻！PGがボールを運んでいます。PGはどうすべき？",
        targetPlayerId: "pg",
        targetPlayerLabel: "PG",
        preAnimations: [
          {
            steps: [
              { playerId: "pg", from: { x: 50, y: 75 }, to: { x: 50, y: 58 }, duration: 0.8, type: "dribble", hasBall: true },
              { playerId: "sg", from: { x: 82, y: 55 }, to: { x: 80, y: 40 }, duration: 0.8, type: "move" },
              { playerId: "sf", from: { x: 18, y: 55 }, to: { x: 20, y: 40 }, duration: 0.8, type: "move" },
            ],
            pauseAfter: 0.3,
          },
        ],
        answerSpots: [
          {
            id: "p5s1-a1",
            position: { x: 50, y: 35 },
            moveType: "dribble",
            score: 100,
            explanation: "正解！ペイント方向にアタック。ディフェンスにコミットさせて、味方をフリーにしてからパスかフィニッシュを判断します。",
          },
          {
            id: "p5s1-a2",
            position: { x: 80, y: 40 },
            moveType: "pass",
            score: 50,
            explanation: "SGへのパスも選択肢ですが、まず自分でアタックしてディフェンスを引きつけてからの方がチームとして効率的です。",
          },
          {
            id: "p5s1-a3",
            position: { x: 50, y: 58 },
            moveType: "screen",
            score: 0,
            explanation: "速攻ではスピードが命。止まってしまうとディフェンスが戻る時間を与えてしまいます。",
          },
          {
            id: "p5s1-a4",
            position: { x: 20, y: 40 },
            moveType: "pass",
            score: 50,
            explanation: "SFへのパスも選択肢。ただし先にアタックしてディフェンスの判断を迫った方が有効です。",
          },
        ],
        postAnswerActions: {
          "p5s1-a1": [
            {
              steps: [
                { playerId: "pg", from: { x: 50, y: 58 }, to: { x: 50, y: 35 }, duration: 0.7, type: "dribble", hasBall: true },
                { playerId: "d1", from: { x: 45, y: 50 }, to: { x: 48, y: 38 }, duration: 0.7, type: "move" },
                { playerId: "d2", from: { x: 55, y: 35 }, to: { x: 52, y: 30 }, duration: 0.5, type: "move" },
              ],
              pauseAfter: 0.3,
            },
          ],
          "p5s1-a2": [{ steps: [], ballPass: { from: "pg", to: "sg" }, pauseAfter: 0.5 }],
          "p5s1-a3": [{ steps: [], pauseAfter: 0.5 }],
          "p5s1-a4": [{ steps: [], ballPass: { from: "pg", to: "sf" }, pauseAfter: 0.5 }],
        },
        shootQuality: 5,
        shootExplanation: "フリーレーンの途中でのプルアップ。まだ味方がフリーになる前に打つのは早計です。",
        feedback: "アタック！ディフェンスを引きつけろ！",
        explanation: "【速攻の原則】数的優位ではまず自分でアタック。ディフェンスが寄ったらパス、来なければそのままフィニッシュ。",
      },
      {
        description: "ディフェンス2人がPGに寄りました。PGはどうする？",
        targetPlayerId: "pg",
        targetPlayerLabel: "PG",
        preAnimations: [],
        answerSpots: [
          {
            id: "p5s2-a1",
            position: { x: 20, y: 40 },
            moveType: "pass",
            score: 100,
            explanation: "正解！ディフェンスが2人寄ったら即パス。SFがフリーでレイアップに行けます。速攻では判断のスピードが命！",
          },
          {
            id: "p5s2-a2",
            position: { x: 50, y: 20 },
            moveType: "dribble",
            score: 0,
            explanation: "2人に囲まれたままドライブするとターンオーバーの危険性が高いです。フリーの味方にパスしましょう。",
          },
          {
            id: "p5s2-a3",
            position: { x: 80, y: 40 },
            moveType: "pass",
            score: 50,
            explanation: "SGへのパスも可能ですが、SFの方がよりゴールに近くフリーです。最も良いチャンスに出しましょう。",
          },
          {
            id: "p5s2-a4",
            position: { x: 50, y: 55 },
            moveType: "dribble",
            score: 0,
            explanation: "後退してはせっかくの速攻のチャンスを潰してしまいます。迷わずパス！",
          },
        ],
        postAnswerActions: {
          "p5s2-a1": [
            { steps: [], ballPass: { from: "pg", to: "sf" }, pauseAfter: 0.3 },
            {
              steps: [
                { playerId: "sf", from: { x: 20, y: 40 }, to: { x: 35, y: 15 }, duration: 0.6, type: "cut", hasBall: true },
              ],
              pauseAfter: 0.5,
            },
          ],
          "p5s2-a2": [{ steps: [{ playerId: "pg", from: { x: 50, y: 35 }, to: { x: 50, y: 20 }, duration: 0.6, type: "dribble", hasBall: true }], pauseAfter: 0.5 }],
          "p5s2-a3": [{ steps: [], ballPass: { from: "pg", to: "sg" }, pauseAfter: 0.5 }],
          "p5s2-a4": [{ steps: [{ playerId: "pg", from: { x: 50, y: 35 }, to: { x: 50, y: 55 }, duration: 0.6, type: "dribble", hasBall: true }], pauseAfter: 0.5 }],
        },
        shootQuality: 9,
        shootExplanation: "速攻からのフリーレイアップ！ディフェンスが間に合わない最高のシュートチャンスです！",
        feedback: "ナイスパス！フリーレイアップ！",
        explanation: "【速攻の判断】ディフェンスが寄ったら即パス。迷いなく最もフリーな味方に出すことで得点チャンスを最大化します。",
      },
    ],
  },

  // === Possession 6: Post Entry ===
  {
    id: "pos-006",
    title: "ポストエントリー",
    description: "Cへのポストエントリーからの展開。",
    players: basePlayers,
    initialPositions: {
      pg: { x: 50, y: 88 },
      sg: { x: 85, y: 65 },
      sf: { x: 88, y: 15 },
      pf: { x: 15, y: 65 },
      c: { x: 60, y: 35 },
      d1: { x: 48, y: 84 },
      d2: { x: 82, y: 62 },
      d3: { x: 85, y: 18 },
      d4: { x: 18, y: 62 },
      d5: { x: 58, y: 38 },
    },
    initialBallHolder: "pg",
    steps: [
      {
        description: "Cがローポストでポジションを取っています。SGはどう動くべき？",
        targetPlayerId: "sg",
        targetPlayerLabel: "SG",
        preAnimations: [
          {
            steps: [
              { playerId: "c", from: { x: 60, y: 35 }, to: { x: 65, y: 28 }, duration: 0.5, type: "move" },
              { playerId: "d5", from: { x: 58, y: 38 }, to: { x: 63, y: 32 }, duration: 0.5, type: "move" },
            ],
            pauseAfter: 0.3,
          },
        ],
        answerSpots: [
          {
            id: "p6s1-a1",
            position: { x: 72, y: 50 },
            moveType: "pass",
            score: 100,
            explanation: "正解！ウィングの高い位置に動いてCへのエントリーパスの角度を作ります。ローポストへのパスはウィングからが最も出しやすい。",
          },
          {
            id: "p6s1-a2",
            position: { x: 85, y: 65 },
            moveType: "screen",
            score: 0,
            explanation: "元の位置に留まっていてはCへのパスの角度が悪いです。もう少しベースライン寄りに動きましょう。",
          },
          {
            id: "p6s1-a3",
            position: { x: 60, y: 50 },
            moveType: "cut",
            curveDirection: "right",
            score: 0,
            explanation: "Cのポストアップエリアに近づくとスペーシングが悪くなります。外で角度を作りましょう。",
          },
          {
            id: "p6s1-a4",
            position: { x: 88, y: 30 },
            moveType: "dribble",
            score: 50,
            explanation: "コーナーに下がるのも一つの手ですが、エントリーパスの角度としてはウィング付近の方が良いです。",
          },
        ],
        postAnswerActions: {
          "p6s1-a1": [
            {
              steps: [
                { playerId: "sg", from: { x: 85, y: 65 }, to: { x: 72, y: 50 }, duration: 0.6, type: "move" },
                { playerId: "d2", from: { x: 82, y: 62 }, to: { x: 70, y: 48 }, duration: 0.6, type: "move" },
              ],
              pauseAfter: 0.2,
            },
            { steps: [], ballPass: { from: "pg", to: "sg" }, pauseAfter: 0.3 },
            { steps: [], ballPass: { from: "sg", to: "c" }, pauseAfter: 0.4 },
          ],
          "p6s1-a2": [{ steps: [], pauseAfter: 0.5 }],
          "p6s1-a3": [{ steps: [{ playerId: "sg", from: { x: 85, y: 65 }, to: { x: 60, y: 50 }, duration: 0.7, type: "cut" }], pauseAfter: 0.5 }],
          "p6s1-a4": [{ steps: [{ playerId: "sg", from: { x: 85, y: 65 }, to: { x: 88, y: 30 }, duration: 0.7, type: "move" }], pauseAfter: 0.5 }],
        },
        shootQuality: 3,
        shootExplanation: "まだポストにボールが入っていません。Cの力を活かすために、まずエントリーパスを成功させましょう。",
        feedback: "ウィングへ移動！エントリーパスの角度確保！",
        explanation: "【ポストエントリー】ローポストへのパスはウィングの45度付近からが最も効果的。角度を作るために適切なポジションに移動します。",
      },
      {
        description: "Cがボールを受けました。ダブルチームが来ます。SGはどうする？",
        targetPlayerId: "sg",
        targetPlayerLabel: "SG",
        preAnimations: [
          {
            steps: [
              { playerId: "d4", from: { x: 18, y: 62 }, to: { x: 55, y: 30 }, duration: 0.7, type: "move" },
            ],
            pauseAfter: 0.3,
          },
        ],
        answerSpots: [
          {
            id: "p6s2-a1",
            position: { x: 15, y: 65 },
            moveType: "cut",
            curveDirection: "left",
            score: 100,
            explanation: "正解！ダブルチームが来たPFのディフェンスがいた場所が空いています。そこに移動してCからのパスを受ければオープンシュートが打てます。",
          },
          {
            id: "p6s2-a2",
            position: { x: 72, y: 50 },
            moveType: "screen",
            score: 50,
            explanation: "その場に留まるのも悪くありませんが、ダブルチームが来た方向の逆サイドに動いた方が効果的です。",
          },
          {
            id: "p6s2-a3",
            position: { x: 65, y: 35 },
            moveType: "dribble",
            score: 0,
            explanation: "ポストに近づくとダブルチームの渋滞に巻き込まれます。離れてパスレーンを確保しましょう。",
          },
          {
            id: "p6s2-a4",
            position: { x: 88, y: 15 },
            moveType: "pass",
            score: 0,
            explanation: "コーナーに行くとCからのパスが通りにくくなります。空いたスペースに動きましょう。",
          },
        ],
        postAnswerActions: {
          "p6s2-a1": [
            {
              steps: [
                { playerId: "sg", from: { x: 72, y: 50 }, to: { x: 15, y: 65 }, duration: 0.8, type: "cut" },
              ],
              pauseAfter: 0.2,
            },
            { steps: [], ballPass: { from: "c", to: "sg" }, pauseAfter: 0.4 },
          ],
          "p6s2-a2": [{ steps: [], pauseAfter: 0.5 }],
          "p6s2-a3": [{ steps: [{ playerId: "sg", from: { x: 72, y: 50 }, to: { x: 65, y: 35 }, duration: 0.6, type: "move" }], pauseAfter: 0.5 }],
          "p6s2-a4": [{ steps: [{ playerId: "sg", from: { x: 72, y: 50 }, to: { x: 88, y: 15 }, duration: 0.8, type: "move" }], pauseAfter: 0.5 }],
        },
        shootQuality: 8,
        shootExplanation: "ダブルチームの逆サイドでフリーになってのシュート。Cの判断力とSGのスペーシングが生んだナイスショットです！",
        feedback: "ダブルチームの逆へ！オープンシュート！",
        explanation: "【ダブルチーム対応】ポストにダブルチームが来たら、ディフェンスが抜けた場所が空く。そこに移動してパスを受けるのがチームの約束事です。",
      },
    ],
  },

  // === Possession 7: Horns Set ===
  {
    id: "pos-007",
    title: "ホーンズセット",
    description: "ハイポストに2人のビッグマンが並ぶホーンズから攻める。",
    players: basePlayers,
    initialPositions: {
      pg: { x: 50, y: 88 },
      sg: { x: 88, y: 18 },
      sf: { x: 12, y: 18 },
      pf: { x: 35, y: 65 },
      c: { x: 65, y: 65 },
      d1: { x: 48, y: 84 },
      d2: { x: 85, y: 20 },
      d3: { x: 15, y: 20 },
      d4: { x: 33, y: 62 },
      d5: { x: 63, y: 62 },
    },
    initialBallHolder: "pg",
    steps: [
      {
        description: "ホーンズセット。PGがCのスクリーンを使います。PFはどうすべき？",
        targetPlayerId: "pf",
        targetPlayerLabel: "PF",
        preAnimations: [
          {
            steps: [
              { playerId: "c", from: { x: 65, y: 65 }, to: { x: 55, y: 80 }, duration: 0.6, type: "move" },
              { playerId: "d5", from: { x: 63, y: 62 }, to: { x: 53, y: 76 }, duration: 0.6, type: "move" },
            ],
            pauseAfter: 0.2,
          },
          {
            steps: [
              { playerId: "pg", from: { x: 50, y: 88 }, to: { x: 65, y: 70 }, duration: 0.8, type: "dribble", hasBall: true },
              { playerId: "d1", from: { x: 48, y: 84 }, to: { x: 63, y: 68 }, duration: 0.8, type: "move" },
            ],
            pauseAfter: 0.3,
          },
        ],
        answerSpots: [
          {
            id: "p7s1-a1",
            position: { x: 15, y: 45 },
            moveType: "cut",
            curveDirection: "left",
            score: 100,
            explanation: "正解！PGがCのスクリーンで右に行っている間、PFはバックドアカットでゴール方向へ。ディフェンスの注意がPG側に集中している隙を突きます。",
          },
          {
            id: "p7s1-a2",
            position: { x: 35, y: 65 },
            moveType: "screen",
            score: 0,
            explanation: "その場に留まるとディフェンスが楽に守れます。PGのスクリーンプレーに合わせて動きましょう。",
          },
          {
            id: "p7s1-a3",
            position: { x: 35, y: 88 },
            moveType: "dribble",
            score: 50,
            explanation: "ポップアウトしてパスを受けるのも選択肢ですが、ゴール方向へのカットの方がチャンスが大きいです。",
          },
          {
            id: "p7s1-a4",
            position: { x: 50, y: 65 },
            moveType: "pass",
            score: 0,
            explanation: "PGの方に寄るとスペースが詰まります。逆方向に動いてチャンスを作りましょう。",
          },
        ],
        postAnswerActions: {
          "p7s1-a1": [
            {
              steps: [
                { playerId: "pf", from: { x: 35, y: 65 }, to: { x: 15, y: 45 }, duration: 0.8, type: "cut" },
                { playerId: "d4", from: { x: 33, y: 62 }, to: { x: 18, y: 48 }, duration: 0.8, type: "move" },
              ],
              pauseAfter: 0.3,
            },
          ],
          "p7s1-a2": [{ steps: [], pauseAfter: 0.5 }],
          "p7s1-a3": [{ steps: [{ playerId: "pf", from: { x: 35, y: 65 }, to: { x: 35, y: 88 }, duration: 0.7, type: "move" }], pauseAfter: 0.5 }],
          "p7s1-a4": [{ steps: [{ playerId: "pf", from: { x: 35, y: 65 }, to: { x: 50, y: 65 }, duration: 0.5, type: "move" }], pauseAfter: 0.5 }],
        },
        shootQuality: 4,
        shootExplanation: "PGのドライブ途中でのシュート。まだ良いポジションではありません。もっと崩してから打ちましょう。",
        feedback: "バックドアカット！逆をつけ！",
        explanation: "【ホーンズの裏】PGがスクリーンで一方に行く時、逆サイドのビッグマンがカットで裏を突く。ディフェンスの注意の裏をつく高IQプレーです。",
      },
      {
        description: "PFのカットにパスが通りました。PFはフィニッシュできる？",
        targetPlayerId: "pf",
        targetPlayerLabel: "PF",
        preAnimations: [
          { steps: [], ballPass: { from: "pg", to: "pf" }, pauseAfter: 0.4 },
        ],
        answerSpots: [
          {
            id: "p7s2-a1",
            position: { x: 35, y: 18 },
            moveType: "dribble",
            score: 100,
            explanation: "正解！パスを受けたらそのままゴールに向かってフィニッシュ。ディフェンスが後手に回っている今がチャンスです。",
          },
          {
            id: "p7s2-a2",
            position: { x: 12, y: 18 },
            moveType: "pass",
            score: 50,
            explanation: "コーナーのSFにパスするのも手ですが、ゴールに向かえるスペースがあるので自分でフィニッシュが最善です。",
          },
          {
            id: "p7s2-a3",
            position: { x: 15, y: 65 },
            moveType: "screen",
            score: 0,
            explanation: "パスを受けた後にウィングに戻ってはチャンスを逃します。攻めましょう！",
          },
          {
            id: "p7s2-a4",
            position: { x: 50, y: 88 },
            moveType: "pass",
            score: 0,
            explanation: "PGに戻すのはせっかくのバックドアカットのチャンスを完全に無駄にします。",
          },
        ],
        postAnswerActions: {
          "p7s2-a1": [
            {
              steps: [
                { playerId: "pf", from: { x: 15, y: 45 }, to: { x: 35, y: 18 }, duration: 0.7, type: "dribble", hasBall: true },
              ],
              pauseAfter: 0.5,
            },
          ],
          "p7s2-a2": [{ steps: [], ballPass: { from: "pf", to: "sf" }, pauseAfter: 0.5 }],
          "p7s2-a3": [{ steps: [{ playerId: "pf", from: { x: 15, y: 45 }, to: { x: 15, y: 65 }, duration: 0.6, type: "move", hasBall: true }], pauseAfter: 0.5 }],
          "p7s2-a4": [{ steps: [], ballPass: { from: "pf", to: "pg" }, pauseAfter: 0.5 }],
        },
        shootQuality: 9,
        shootExplanation: "バックドアカットからのレイアップ！ゴール下でフリーの最高のシュートチャンスです！",
        feedback: "ゴールにアタック！レイアップ！",
        explanation: "【フィニッシュ判断】ゴール方向にフリーのスペースがあるなら迷わずアタック。パスを受けた勢いのままフィニッシュに行きましょう。",
      },
    ],
  },

  // === Possession 8: Back Screen ===
  {
    id: "pos-008",
    title: "バックスクリーン",
    description: "オフボールのバックスクリーンでSGをフリーにする。",
    players: basePlayers,
    initialPositions: {
      pg: { x: 50, y: 88 },
      sg: { x: 85, y: 65 },
      sf: { x: 88, y: 18 },
      pf: { x: 15, y: 65 },
      c: { x: 65, y: 50 },
      d1: { x: 48, y: 84 },
      d2: { x: 82, y: 62 },
      d3: { x: 85, y: 20 },
      d4: { x: 18, y: 62 },
      d5: { x: 62, y: 48 },
    },
    initialBallHolder: "pg",
    steps: [
      {
        description: "CがSGの背後のディフェンスにバックスクリーンをセットしに行きます。SGはどう動く？",
        targetPlayerId: "sg",
        targetPlayerLabel: "SG",
        preAnimations: [
          {
            steps: [
              { playerId: "c", from: { x: 65, y: 50 }, to: { x: 78, y: 58 }, duration: 0.7, type: "move" },
              { playerId: "d5", from: { x: 62, y: 48 }, to: { x: 75, y: 55 }, duration: 0.7, type: "move" },
            ],
            pauseAfter: 0.3,
          },
        ],
        answerSpots: [
          {
            id: "p8s1-a1",
            position: { x: 70, y: 25 },
            moveType: "cut",
            curveDirection: "right",
            score: 100,
            explanation: "正解！バックスクリーンを使ってゴール方向にカット。ディフェンスがスクリーンに引っかかってフリーでレイアップが狙えます。",
          },
          {
            id: "p8s1-a2",
            position: { x: 85, y: 85 },
            moveType: "cut",
            curveDirection: "left",
            score: 50,
            explanation: "スクリーンと逆方向に逃げる（フレア）も選択肢ですが、バックスクリーンではゴール方向へのカットが第一選択です。",
          },
          {
            id: "p8s1-a3",
            position: { x: 85, y: 65 },
            moveType: "screen",
            score: 0,
            explanation: "スクリーンが来ているのに留まっていてはもったいない！スクリーンを使って動きましょう。",
          },
          {
            id: "p8s1-a4",
            position: { x: 50, y: 65 },
            moveType: "dribble",
            score: 0,
            explanation: "ボール方向に移動するとPGのスペースを潰します。ゴール方向にカットしましょう。",
          },
        ],
        postAnswerActions: {
          "p8s1-a1": [
            {
              steps: [
                { playerId: "sg", from: { x: 85, y: 65 }, to: { x: 70, y: 25 }, duration: 0.8, type: "cut" },
                { playerId: "d2", from: { x: 82, y: 62 }, to: { x: 72, y: 30 }, duration: 0.9, type: "move" },
              ],
              pauseAfter: 0.2,
            },
            { steps: [], ballPass: { from: "pg", to: "sg" }, pauseAfter: 0.4 },
          ],
          "p8s1-a2": [{ steps: [{ playerId: "sg", from: { x: 85, y: 65 }, to: { x: 85, y: 85 }, duration: 0.6, type: "cut" }], pauseAfter: 0.5 }],
          "p8s1-a3": [{ steps: [], pauseAfter: 0.5 }],
          "p8s1-a4": [{ steps: [{ playerId: "sg", from: { x: 85, y: 65 }, to: { x: 50, y: 65 }, duration: 0.6, type: "move" }], pauseAfter: 0.5 }],
        },
        shootQuality: 9,
        shootExplanation: "バックスクリーンからのカットでゴール下フリー！最高のシュートチャンスです！",
        feedback: "バックスクリーンカット！フリーでフィニッシュ！",
        explanation: "【バックスクリーン】ディフェンスの背後からスクリーンをかける。ディフェンスが気づきにくく、ゴール方向へのカットが非常に効果的です。",
      },
      {
        description: "SGがカットした後、スクリーンをセットしたCはどう動く？",
        targetPlayerId: "c",
        targetPlayerLabel: "C",
        preAnimations: [],
        answerSpots: [
          {
            id: "p8s2-a1",
            position: { x: 85, y: 68 },
            moveType: "cut",
            curveDirection: "right",
            score: 100,
            explanation: "正解！スクリーン&ロールと同じ原則。スクリーン後にポップして外のスペースに広がります。SGにパスが通らなかった場合の次のオプションになります。",
          },
          {
            id: "p8s2-a2",
            position: { x: 78, y: 58 },
            moveType: "screen",
            score: 0,
            explanation: "スクリーン位置に留まるのはスペーシングの邪魔になります。次のアクションに移行しましょう。",
          },
          {
            id: "p8s2-a3",
            position: { x: 50, y: 30 },
            moveType: "dribble",
            score: 50,
            explanation: "ゴール方向にロールするのも選択肢ですが、SGがすでにそこにいるのでスペースが被ります。外に広がりましょう。",
          },
          {
            id: "p8s2-a4",
            position: { x: 50, y: 88 },
            moveType: "pass",
            score: 0,
            explanation: "トップまで上がりすぎです。ウィング付近で待機する方がバランスが良いです。",
          },
        ],
        postAnswerActions: {
          "p8s2-a1": [
            {
              steps: [
                { playerId: "c", from: { x: 78, y: 58 }, to: { x: 85, y: 68 }, duration: 0.6, type: "move" },
                { playerId: "d5", from: { x: 75, y: 55 }, to: { x: 82, y: 65 }, duration: 0.6, type: "move" },
              ],
              pauseAfter: 0.5,
            },
          ],
          "p8s2-a2": [{ steps: [], pauseAfter: 0.5 }],
          "p8s2-a3": [{ steps: [{ playerId: "c", from: { x: 78, y: 58 }, to: { x: 50, y: 30 }, duration: 0.7, type: "move" }], pauseAfter: 0.5 }],
          "p8s2-a4": [{ steps: [{ playerId: "c", from: { x: 78, y: 58 }, to: { x: 50, y: 88 }, duration: 0.8, type: "move" }], pauseAfter: 0.5 }],
        },
        shootQuality: 6,
        shootExplanation: "Cがポップしてキャッチ&シュート。悪くないですが、もっとインサイドのチャンスを狙えた可能性もあります。",
        feedback: "ポップ！外に広がれ！",
        explanation: "【スクリーン後の動き】スクリーンをかけた後はロール（ゴール方向）かポップ（外に広がる）。状況に応じて選択しますが、味方がカットしている時はポップが効果的です。",
      },
    ],
  },

  // === Possession 9: Motion Read ===
  {
    id: "pos-009",
    title: "モーションリード（状況判断）",
    description: "ディフェンスのリアクションを読んで適切な判断をする。",
    players: basePlayers,
    initialPositions: {
      pg: { x: 50, y: 88 },
      sg: { x: 85, y: 65 },
      sf: { x: 88, y: 15 },
      pf: { x: 15, y: 65 },
      c: { x: 12, y: 15 },
      d1: { x: 48, y: 84 },
      d2: { x: 82, y: 62 },
      d3: { x: 85, y: 18 },
      d4: { x: 18, y: 62 },
      d5: { x: 15, y: 18 },
    },
    initialBallHolder: "pg",
    steps: [
      {
        description: "PGがPFにパスを出します。PFのディフェンスはボールを見て離れました。PFはどうする？",
        targetPlayerId: "pf",
        targetPlayerLabel: "PF",
        preAnimations: [
          { steps: [], ballPass: { from: "pg", to: "pf" }, pauseAfter: 0.4 },
          {
            steps: [
              { playerId: "d4", from: { x: 18, y: 62 }, to: { x: 25, y: 58 }, duration: 0.4, type: "move" },
            ],
            pauseAfter: 0.3,
          },
        ],
        answerSpots: [
          {
            id: "p9s1-a1",
            position: { x: 25, y: 40 },
            moveType: "dribble",
            score: 100,
            explanation: "正解！ディフェンスが離れている隙にドライブ！クローズアウトが遅いディフェンスを攻撃的に崩します。",
          },
          {
            id: "p9s1-a2",
            position: { x: 50, y: 88 },
            moveType: "pass",
            score: 0,
            explanation: "PGに戻してもチャンスは生まれません。ディフェンスが離れている今がアタックのチャンスです。",
          },
          {
            id: "p9s1-a3",
            position: { x: 15, y: 65 },
            moveType: "screen",
            score: 50,
            explanation: "シュートを打つのも一つの手ですが、ディフェンスが中途半端な距離なのでドライブの方がリスクが低いです。",
          },
          {
            id: "p9s1-a4",
            position: { x: 12, y: 15 },
            moveType: "pass",
            score: 0,
            explanation: "Cへのパスは角度が悪く、スティールされるリスクがあります。自分で攻めましょう。",
          },
        ],
        postAnswerActions: {
          "p9s1-a1": [
            {
              steps: [
                { playerId: "pf", from: { x: 15, y: 65 }, to: { x: 25, y: 40 }, duration: 0.9, type: "dribble", hasBall: true },
                { playerId: "d4", from: { x: 25, y: 58 }, to: { x: 27, y: 42 }, duration: 0.9, type: "move" },
                { playerId: "d5", from: { x: 15, y: 18 }, to: { x: 25, y: 30 }, duration: 0.7, type: "move" },
              ],
              pauseAfter: 0.3,
            },
          ],
          "p9s1-a2": [{ steps: [], ballPass: { from: "pf", to: "pg" }, pauseAfter: 0.5 }],
          "p9s1-a3": [{ steps: [], pauseAfter: 0.5 }],
          "p9s1-a4": [{ steps: [], ballPass: { from: "pf", to: "c" }, pauseAfter: 0.5 }],
        },
        shootQuality: 5,
        shootExplanation: "ウィングからのシュート。ディフェンスが離れてはいますが、ドライブでもっと良いシュートを作れる状況です。",
        feedback: "クローズアウトアタック！攻めろ！",
        explanation: "【クローズアウト攻撃】ディフェンスが遅れて寄ってくる時は、その隙を突いてドライブ。リードリアクション（読んで反応する）が高IQプレーです。",
      },
      {
        description: "PFがドライブ中。ヘルプが来ました。コーナーのCが空いています。PFは？",
        targetPlayerId: "pf",
        targetPlayerLabel: "PF",
        preAnimations: [],
        answerSpots: [
          {
            id: "p9s2-a1",
            position: { x: 12, y: 15 },
            moveType: "pass",
            score: 100,
            explanation: "正解！ヘルプが来たらフリーの味方にパス。Cがコーナーでフリーなのでキックアウトが最善です。",
          },
          {
            id: "p9s2-a2",
            position: { x: 30, y: 18 },
            moveType: "dribble",
            score: 0,
            explanation: "ヘルプディフェンスに突っ込むとターンオーバーの危険性が高いです。フリーの味方を見つけましょう。",
          },
          {
            id: "p9s2-a3",
            position: { x: 85, y: 65 },
            moveType: "pass",
            score: 50,
            explanation: "SGへのパスも可能ですが、Cの方がよりフリーでシュートしやすい位置にいます。最もフリーな選手を選びましょう。",
          },
          {
            id: "p9s2-a4",
            position: { x: 15, y: 50 },
            moveType: "dribble",
            score: 0,
            explanation: "後退してしまうとチャンスが消えます。迷わずキックアウト！",
          },
        ],
        postAnswerActions: {
          "p9s2-a1": [
            { steps: [], ballPass: { from: "pf", to: "c" }, pauseAfter: 0.4 },
          ],
          "p9s2-a2": [{ steps: [{ playerId: "pf", from: { x: 25, y: 40 }, to: { x: 30, y: 18 }, duration: 0.7, type: "dribble", hasBall: true }], pauseAfter: 0.5 }],
          "p9s2-a3": [{ steps: [], ballPass: { from: "pf", to: "sg" }, pauseAfter: 0.5 }],
          "p9s2-a4": [{ steps: [{ playerId: "pf", from: { x: 25, y: 40 }, to: { x: 15, y: 50 }, duration: 0.5, type: "dribble", hasBall: true }], pauseAfter: 0.5 }],
        },
        shootQuality: 8,
        shootExplanation: "コーナー3ポイント！ヘルプが寄った後のキックアウトで完全にフリーです。高確率ショット！",
        feedback: "キックアウト！コーナー3！",
        explanation: "【ヘルプ&リカバリー】ドライブにヘルプが来たら、ヘルプが抜けた場所を見つけてパス。この判断力がバスケIQの本質です。",
      },
    ],
  },

  // === Possession 10: Stagger Screen ===
  {
    id: "pos-010",
    title: "スタッガースクリーン",
    description: "連続スクリーンでシューターをフリーにする。",
    players: basePlayers,
    initialPositions: {
      pg: { x: 50, y: 88 },
      sg: { x: 12, y: 22 },
      sf: { x: 40, y: 45 },
      pf: { x: 55, y: 35 },
      c: { x: 88, y: 18 },
      d1: { x: 48, y: 84 },
      d2: { x: 15, y: 25 },
      d3: { x: 38, y: 42 },
      d4: { x: 53, y: 32 },
      d5: { x: 85, y: 20 },
    },
    initialBallHolder: "pg",
    steps: [
      {
        description: "SFとPFが並んでスクリーンを用意しています。SGはどう動くべき？",
        targetPlayerId: "sg",
        targetPlayerLabel: "SG",
        preAnimations: [],
        answerSpots: [
          {
            id: "p10s1-a1",
            position: { x: 65, y: 65 },
            moveType: "cut",
            curveDirection: "right",
            score: 100,
            explanation: "正解！スタッガースクリーン（連続スクリーン）を使ってウィングまでカール。2枚のスクリーンを続けて使うことで、ディフェンスが追いつけなくなります。",
          },
          {
            id: "p10s1-a2",
            position: { x: 50, y: 55 },
            moveType: "cut",
            curveDirection: "left",
            score: 50,
            explanation: "1枚目のスクリーンだけ使うのは途中で止まっているようなもの。2枚目のスクリーンまで使い切りましょう。",
          },
          {
            id: "p10s1-a3",
            position: { x: 12, y: 22 },
            moveType: "screen",
            score: 0,
            explanation: "スクリーンが用意されているのに動かないのは大きな無駄です。積極的にスクリーンを使いましょう。",
          },
          {
            id: "p10s1-a4",
            position: { x: 30, y: 15 },
            moveType: "dribble",
            score: 0,
            explanation: "スクリーンと逆方向に動いてはスクリーンの意味がありません。スクリーンの裏を通ってフリーになりましょう。",
          },
        ],
        postAnswerActions: {
          "p10s1-a1": [
            {
              steps: [
                { playerId: "sg", from: { x: 12, y: 22 }, to: { x: 65, y: 65 }, duration: 1.2, type: "cut" },
                { playerId: "d2", from: { x: 15, y: 25 }, to: { x: 55, y: 58 }, duration: 1.3, type: "move" },
              ],
              pauseAfter: 0.2,
            },
            { steps: [], ballPass: { from: "pg", to: "sg" }, pauseAfter: 0.4 },
          ],
          "p10s1-a2": [{ steps: [{ playerId: "sg", from: { x: 12, y: 22 }, to: { x: 50, y: 55 }, duration: 0.9, type: "cut" }], pauseAfter: 0.5 }],
          "p10s1-a3": [{ steps: [], pauseAfter: 0.5 }],
          "p10s1-a4": [{ steps: [{ playerId: "sg", from: { x: 12, y: 22 }, to: { x: 30, y: 15 }, duration: 0.6, type: "move" }], pauseAfter: 0.5 }],
        },
        shootQuality: 8,
        shootExplanation: "スタッガースクリーンで完全にフリーになった状態からのキャッチ&シュート。絶好のチャンスです！",
        feedback: "スタッガーカール！フリーでキャッチ！",
        explanation: "【スタッガースクリーン】2枚のスクリーンを連続で使うことで、ディフェンスが対応できなくなる。シューターをフリーにする強力なセットプレーです。",
      },
      {
        description: "SGがキャッチ。1枚目のスクリーナーSFはどう動く？",
        targetPlayerId: "sf",
        targetPlayerLabel: "SF",
        preAnimations: [],
        answerSpots: [
          {
            id: "p10s2-a1",
            position: { x: 30, y: 25 },
            moveType: "cut",
            curveDirection: "left",
            score: 100,
            explanation: "正解！スクリーン後にゴール方向にダイブ。SGのシュートにディフェンスが飛びついたらパスを受けてレイアップ。スクリーナーのダイブは重要なオプションです。",
          },
          {
            id: "p10s2-a2",
            position: { x: 40, y: 45 },
            moveType: "screen",
            score: 0,
            explanation: "スクリーン位置に留まるとスペーシングの邪魔です。次のアクションに移りましょう。",
          },
          {
            id: "p10s2-a3",
            position: { x: 15, y: 65 },
            moveType: "dribble",
            score: 50,
            explanation: "外に広がる（ポップ）も選択肢ですが、ゴール方向へのダイブの方がプレッシャーをかけられます。",
          },
          {
            id: "p10s2-a4",
            position: { x: 50, y: 88 },
            moveType: "pass",
            score: 0,
            explanation: "トップに上がりすぎです。SGのシュートのリバウンドにも入れる位置にいましょう。",
          },
        ],
        postAnswerActions: {
          "p10s2-a1": [
            {
              steps: [
                { playerId: "sf", from: { x: 40, y: 45 }, to: { x: 30, y: 25 }, duration: 0.7, type: "cut" },
                { playerId: "d3", from: { x: 38, y: 42 }, to: { x: 28, y: 28 }, duration: 0.7, type: "move" },
              ],
              pauseAfter: 0.5,
            },
          ],
          "p10s2-a2": [{ steps: [], pauseAfter: 0.5 }],
          "p10s2-a3": [{ steps: [{ playerId: "sf", from: { x: 40, y: 45 }, to: { x: 15, y: 65 }, duration: 0.7, type: "move" }], pauseAfter: 0.5 }],
          "p10s2-a4": [{ steps: [{ playerId: "sf", from: { x: 40, y: 45 }, to: { x: 50, y: 88 }, duration: 0.8, type: "move" }], pauseAfter: 0.5 }],
        },
        shootQuality: 7,
        shootExplanation: "SGのキャッチ&シュート、もしくはSFへのダンプオフパスからのレイアップ。良いシュートセレクションです。",
        feedback: "ダイブ！スクリーン後のアクション！",
        explanation: "【スクリーン後のダイブ】スクリーンをかけた後にゴールに向かうダイブ。SGのシュートに合わせてリバウンドやオフェンスリバウンドにも参加できます。",
      },
    ],
  },
];
