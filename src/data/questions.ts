import { QuizQuestion } from "@/types/quiz";

export const sampleQuestions: QuizQuestion[] = [
  // Question 1: Spacing - Corner drift when ball goes to wing
  {
    id: "spacing-001",
    category: "spacing",
    title: "ウィングへのパス後のスペーシング",
    description:
      "PGがウィングの2番にパスを出しました。あなたはコーナーにいる3番です。次にどこに動くべきでしょうか？",
    players: [
      { id: "p1", label: "1", isOffense: true },
      { id: "p2", label: "2", isOffense: true },
      { id: "p3", label: "3", isOffense: true },
      { id: "p4", label: "4", isOffense: true },
      { id: "p5", label: "5", isOffense: true },
      { id: "d1", label: "×", isOffense: false },
      { id: "d2", label: "×", isOffense: false },
      { id: "d3", label: "×", isOffense: false },
    ],
    initialPositions: {
      p1: { x: 50, y: 20 }, // PG top
      p2: { x: 75, y: 35 }, // SG wing right
      p3: { x: 85, y: 70 }, // SF corner right (user)
      p4: { x: 25, y: 35 }, // PF wing left
      p5: { x: 50, y: 55 }, // C high post
      d1: { x: 48, y: 25 },
      d2: { x: 72, y: 38 },
      d3: { x: 82, y: 68 },
    },
    actions: [
      {
        steps: [
          {
            playerId: "p1",
            from: { x: 50, y: 20 },
            to: { x: 50, y: 20 },
            duration: 0.5,
            type: "pass",
            hasBall: true,
            showArrow: true,
            arrowStyle: "dashed",
          },
          {
            playerId: "p2",
            from: { x: 75, y: 35 },
            to: { x: 75, y: 35 },
            duration: 0.5,
            type: "move",
            hasBall: false,
          },
        ],
        pauseAfter: 0.3,
      },
      {
        steps: [
          {
            playerId: "p2",
            from: { x: 75, y: 35 },
            to: { x: 70, y: 40 },
            duration: 0.8,
            type: "dribble",
            hasBall: true,
          },
        ],
        pauseAfter: 0.5,
      },
    ],
    targetPlayerId: "p3",
    targetPlayerLabel: "3",
    answerSpots: [
      {
        id: "a1",
        position: { x: 85, y: 80 },
        score: 100,
        explanation:
          "正解！コーナーに留まり、少し深い位置を取ることでディフェンスとの距離を保てます。ウィングがドライブした時のキックアウトパスも受けやすく、3ポイントラインの角度も最適です。",
      },
      {
        id: "a2",
        position: { x: 65, y: 50 },
        score: 50,
        explanation:
          "惜しい！ウィングに近づきすぎると、ディフェンスが2人を同時に守りやすくなります。スペーシング（選手間の距離）が縮まり、ヘルプディフェンスが効きやすくなります。",
      },
      {
        id: "a3",
        position: { x: 50, y: 35 },
        score: 0,
        explanation:
          "ボールハンドラーに向かって動くと、スペーシングが完全に崩れます。味方同士が近すぎると、1人のディフェンスで2人を守られてしまいます。",
      },
      {
        id: "a4",
        position: { x: 30, y: 70 },
        score: 0,
        explanation:
          "逆サイドのコーナーに移動する必要はありません。ボールから遠すぎると攻撃に関与できなくなります。ボールサイドで適切な距離を保つことが大切です。",
      },
    ],
    correctFeedback: "ナイスポジショニング！🏀",
    conceptExplanation:
      "【スペーシングの基本】選手間の距離は約4.5m（15フィート）を保つのが理想です。ボールがウィングにある時、コーナーの選手は深い位置（ベースライン寄り）で待つことで、ドライブ時のキックアウトパスを受けやすくなります。",
    difficulty: 1,
  },

  // Question 2: Cutting - Backdoor cut when overplayed
  {
    id: "cutting-001",
    category: "cutting",
    title: "ディナイされた時のバックカット",
    description:
      "あなたはウィングの2番です。ディフェンスにパスコースを強くディナイされています。PGがあなたの方向を見ています。どこに動くべきでしょうか？",
    players: [
      { id: "p1", label: "1", isOffense: true },
      { id: "p2", label: "2", isOffense: true },
      { id: "p3", label: "3", isOffense: true },
      { id: "p4", label: "4", isOffense: true },
      { id: "p5", label: "5", isOffense: true },
      { id: "d1", label: "×", isOffense: false },
      { id: "d2", label: "×", isOffense: false },
    ],
    initialPositions: {
      p1: { x: 50, y: 18 }, // PG top with ball
      p2: { x: 78, y: 32 }, // SG wing (user)
      p3: { x: 85, y: 72 }, // SF corner
      p4: { x: 22, y: 35 }, // PF wing left
      p5: { x: 50, y: 50 }, // C high post
      d1: { x: 48, y: 22 },
      d2: { x: 70, y: 28 }, // Denying the pass to p2
    },
    actions: [
      {
        steps: [
          {
            playerId: "d2",
            from: { x: 70, y: 28 },
            to: { x: 68, y: 26 },
            duration: 0.6,
            type: "move",
          },
          {
            playerId: "p1",
            from: { x: 50, y: 18 },
            to: { x: 55, y: 20 },
            duration: 0.6,
            type: "dribble",
            hasBall: true,
          },
        ],
        pauseAfter: 0.5,
      },
      {
        steps: [
          {
            playerId: "d2",
            from: { x: 68, y: 26 },
            to: { x: 65, y: 24 },
            duration: 0.5,
            type: "move",
          },
        ],
        pauseAfter: 0.3,
      },
    ],
    targetPlayerId: "p2",
    targetPlayerLabel: "2",
    answerSpots: [
      {
        id: "a1",
        position: { x: 70, y: 60 },
        score: 100,
        explanation:
          "正解！バックドアカットです。ディフェンスがパスコースをディナイしている時、ゴール方向に素早くカットすることで、ディフェンスの裏を取れます。PGからのバウンスパスを受けてレイアップに行けます。",
      },
      {
        id: "a2",
        position: { x: 85, y: 25 },
        score: 50,
        explanation:
          "コーナー方向に広がるのは悪くありませんが、ディフェンスがディナイしている時はバックカットの方が効果的です。外に逃げるとパスコースは作れますが、得点チャンスは低くなります。",
      },
      {
        id: "a3",
        position: { x: 55, y: 25 },
        score: 0,
        explanation:
          "ボールに向かって行くと、ディフェンスの思うツボです。ディナイされているのに正面から受けに行くと、スティールされるリスクが高くなります。",
      },
      {
        id: "a4",
        position: { x: 30, y: 40 },
        score: 0,
        explanation:
          "逆サイドへの移動はこの場面では不適切です。PGがあなたの方向を見ている（パスを出そうとしている）ので、ゴール方向にカットしてチャンスを作るべきです。",
      },
    ],
    correctFeedback: "ナイスカット！🔥",
    conceptExplanation:
      "【バックドアカットの原則】ディフェンスがパスコースを強くディナイしている時は、その力を利用してゴール方向にカット（バックドアカット）するのが基本です。「ディナイが強い＝裏が空く」と覚えましょう。",
    difficulty: 1,
  },

  // Question 3: Drive & Kick - Reacting to a teammate's drive
  {
    id: "drive-kick-001",
    category: "drive-kick",
    title: "ドライブへの合わせ（キックアウト）",
    description:
      "ウィングの2番がベースライン方向にドライブを開始しました。あなたはコーナーにいる3番です。ヘルプディフェンスがドライブに寄っています。次にどこに動くべきでしょうか？",
    players: [
      { id: "p1", label: "1", isOffense: true },
      { id: "p2", label: "2", isOffense: true },
      { id: "p3", label: "3", isOffense: true },
      { id: "p4", label: "4", isOffense: true },
      { id: "p5", label: "5", isOffense: true },
      { id: "d1", label: "×", isOffense: false },
      { id: "d2", label: "×", isOffense: false },
      { id: "d3", label: "×", isOffense: false },
    ],
    initialPositions: {
      p1: { x: 50, y: 18 },
      p2: { x: 75, y: 35 }, // Wing with ball
      p3: { x: 85, y: 72 }, // Corner (user)
      p4: { x: 22, y: 35 },
      p5: { x: 50, y: 55 },
      d1: { x: 48, y: 22 },
      d2: { x: 73, y: 38 },
      d3: { x: 82, y: 70 },
    },
    actions: [
      {
        steps: [
          {
            playerId: "p2",
            from: { x: 75, y: 35 },
            to: { x: 80, y: 55 },
            duration: 1.0,
            type: "dribble",
            hasBall: true,
            showArrow: true,
            arrowStyle: "solid",
          },
          {
            playerId: "d2",
            from: { x: 73, y: 38 },
            to: { x: 78, y: 52 },
            duration: 1.0,
            type: "move",
          },
        ],
        pauseAfter: 0.3,
      },
      {
        steps: [
          {
            playerId: "d3",
            from: { x: 82, y: 70 },
            to: { x: 78, y: 60 },
            duration: 0.6,
            type: "move",
          },
        ],
        pauseAfter: 0.5,
      },
    ],
    targetPlayerId: "p3",
    targetPlayerLabel: "3",
    answerSpots: [
      {
        id: "a1",
        position: { x: 78, y: 78 },
        score: 100,
        explanation:
          "正解！ヘルプディフェンスがドライブに寄った瞬間、元のコーナーポジションの少し外側にドリフトすることで、キックアウトパスを受けてオープンの3ポイントシュートが打てます。",
      },
      {
        id: "a2",
        position: { x: 65, y: 65 },
        score: 50,
        explanation:
          "ドライブに近づきすぎです。ヘルプディフェンスの近くにいると、パスを受けてもすぐにクローズアウトされてしまいます。もう少し距離を取って、3ポイントラインの外でパスを待ちましょう。",
      },
      {
        id: "a3",
        position: { x: 50, y: 50 },
        score: 0,
        explanation:
          "ペイントエリアに入るとドライブの邪魔になります。ドライブする味方のスペースを潰してしまうので、外に広がって合わせるのが正解です。",
      },
      {
        id: "a4",
        position: { x: 30, y: 75 },
        score: 0,
        explanation:
          "逆サイドに移動するのはこの場面では遅すぎます。ドライブは一瞬の判断が求められるので、近いポジションでキックアウトパスに備えるべきです。",
      },
    ],
    correctFeedback: "ナイスパス！👌",
    conceptExplanation:
      "【ドライブへの合わせの基本】味方がドライブした時、コーナーにいる選手は「ドリフト」（少し位置をずらす）してオープンを作ります。ヘルプディフェンスがドライブに寄る＝自分のマークが離れる、と読むことが大切です。",
    difficulty: 1,
  },
];
