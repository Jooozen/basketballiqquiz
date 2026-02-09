import { QuizQuestion } from "@/types/quiz";

// Coordinate system: rim at TOP (y~10), half-court at BOTTOM (y~95)
// x: 0=left, 100=right

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
      p1: { x: 50, y: 80 }, // PG top of key
      p2: { x: 75, y: 65 }, // SG wing right
      p3: { x: 88, y: 30 }, // SF corner right (user)
      p4: { x: 25, y: 65 }, // PF wing left
      p5: { x: 50, y: 45 }, // C high post
      d1: { x: 48, y: 75 },
      d2: { x: 72, y: 62 },
      d3: { x: 85, y: 32 },
    },
    initialBallHolder: "p1",
    actions: [
      // Move 1: PG dribbles right to create angle
      {
        steps: [
          {
            playerId: "p1",
            from: { x: 50, y: 80 },
            to: { x: 58, y: 78 },
            duration: 0.8,
            type: "dribble",
            hasBall: true,
          },
          {
            playerId: "d1",
            from: { x: 48, y: 75 },
            to: { x: 55, y: 73 },
            duration: 0.8,
            type: "move",
          },
        ],
        pauseAfter: 0.4,
      },
      // Move 2: PG passes to wing (p2)
      {
        steps: [
          {
            playerId: "p1",
            from: { x: 58, y: 78 },
            to: { x: 55, y: 80 },
            duration: 0.6,
            type: "move",
            hasBall: true,
          },
        ],
        ballPass: { from: "p1", to: "p2" },
        pauseAfter: 0.5,
      },
      // Move 3: Wing receives and starts dribble drive
      {
        steps: [
          {
            playerId: "p2",
            from: { x: 75, y: 65 },
            to: { x: 70, y: 58 },
            duration: 0.9,
            type: "dribble",
            hasBall: true,
          },
          {
            playerId: "d2",
            from: { x: 72, y: 62 },
            to: { x: 68, y: 56 },
            duration: 0.9,
            type: "move",
          },
        ],
        pauseAfter: 0.3,
      },
    ],
    targetPlayerId: "p3",
    targetPlayerLabel: "3",
    answerSpots: [
      {
        id: "a1",
        position: { x: 90, y: 22 },
        score: 100,
        explanation:
          "正解！コーナーに留まり、少し深い位置を取ることでディフェンスとの距離を保てます。ウィングがドライブした時のキックアウトパスも受けやすく、3ポイントラインの角度も最適です。",
      },
      {
        id: "a2",
        position: { x: 65, y: 48 },
        score: 50,
        explanation:
          "惜しい！ウィングに近づきすぎると、ディフェンスが2人を同時に守りやすくなります。スペーシング（選手間の距離）が縮まり、ヘルプディフェンスが効きやすくなります。",
      },
      {
        id: "a3",
        position: { x: 50, y: 65 },
        score: 0,
        explanation:
          "ボールハンドラーに向かって動くと、スペーシングが完全に崩れます。味方同士が近すぎると、1人のディフェンスで2人を守られてしまいます。",
      },
      {
        id: "a4",
        position: { x: 20, y: 30 },
        score: 0,
        explanation:
          "逆サイドのコーナーに移動する必要はありません。ボールから遠すぎると攻撃に関与できなくなります。ボールサイドで適切な距離を保つことが大切です。",
      },
    ],
    postAnswerActions: {
      // If correct (a1): wing kicks out to corner for open 3
      a1: [
        {
          steps: [
            {
              playerId: "p3",
              from: { x: 88, y: 30 },
              to: { x: 90, y: 22 },
              duration: 0.6,
              type: "move",
            },
          ],
          pauseAfter: 0.3,
        },
        {
          steps: [
            {
              playerId: "p2",
              from: { x: 70, y: 58 },
              to: { x: 72, y: 45 },
              duration: 0.7,
              type: "dribble",
              hasBall: true,
            },
            {
              playerId: "d3",
              from: { x: 85, y: 32 },
              to: { x: 78, y: 42 },
              duration: 0.7,
              type: "move",
            },
          ],
          ballPass: { from: "p2", to: "p3" },
          pauseAfter: 0.5,
        },
      ],
      a2: [
        {
          steps: [
            {
              playerId: "p3",
              from: { x: 88, y: 30 },
              to: { x: 65, y: 48 },
              duration: 0.7,
              type: "move",
            },
          ],
          pauseAfter: 0.5,
        },
      ],
      a3: [
        {
          steps: [
            {
              playerId: "p3",
              from: { x: 88, y: 30 },
              to: { x: 50, y: 65 },
              duration: 0.7,
              type: "move",
            },
          ],
          pauseAfter: 0.5,
        },
      ],
      a4: [
        {
          steps: [
            {
              playerId: "p3",
              from: { x: 88, y: 30 },
              to: { x: 20, y: 30 },
              duration: 0.7,
              type: "move",
            },
          ],
          pauseAfter: 0.5,
        },
      ],
    },
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
      p1: { x: 50, y: 82 }, // PG top with ball
      p2: { x: 78, y: 68 }, // SG wing (user)
      p3: { x: 88, y: 28 }, // SF corner
      p4: { x: 22, y: 65 }, // PF wing left
      p5: { x: 50, y: 50 }, // C high post
      d1: { x: 48, y: 78 },
      d2: { x: 68, y: 72 }, // Denying the pass to p2
    },
    initialBallHolder: "p1",
    actions: [
      // Move 1: PG dribbles toward wing side
      {
        steps: [
          {
            playerId: "p1",
            from: { x: 50, y: 82 },
            to: { x: 58, y: 80 },
            duration: 0.7,
            type: "dribble",
            hasBall: true,
          },
          {
            playerId: "d1",
            from: { x: 48, y: 78 },
            to: { x: 56, y: 76 },
            duration: 0.7,
            type: "move",
          },
        ],
        pauseAfter: 0.4,
      },
      // Move 2: Defender overplays, denying hard
      {
        steps: [
          {
            playerId: "d2",
            from: { x: 68, y: 72 },
            to: { x: 65, y: 74 },
            duration: 0.6,
            type: "move",
          },
          {
            playerId: "p5",
            from: { x: 50, y: 50 },
            to: { x: 55, y: 48 },
            duration: 0.6,
            type: "move",
          },
        ],
        pauseAfter: 0.4,
      },
      // Move 3: PG looks toward wing, defender denies even harder
      {
        steps: [
          {
            playerId: "d2",
            from: { x: 65, y: 74 },
            to: { x: 63, y: 76 },
            duration: 0.5,
            type: "move",
          },
          {
            playerId: "p1",
            from: { x: 58, y: 80 },
            to: { x: 60, y: 79 },
            duration: 0.5,
            type: "dribble",
            hasBall: true,
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
        position: { x: 65, y: 38 },
        score: 100,
        explanation:
          "正解！バックドアカットです。ディフェンスがパスコースをディナイしている時、ゴール方向に素早くカットすることで、ディフェンスの裏を取れます。PGからのバウンスパスを受けてレイアップに行けます。",
      },
      {
        id: "a2",
        position: { x: 90, y: 75 },
        score: 50,
        explanation:
          "コーナー方向に広がるのは悪くありませんが、ディフェンスがディナイしている時はバックカットの方が効果的です。外に逃げるとパスコースは作れますが、得点チャンスは低くなります。",
      },
      {
        id: "a3",
        position: { x: 58, y: 75 },
        score: 0,
        explanation:
          "ボールに向かって行くと、ディフェンスの思うツボです。ディナイされているのに正面から受けに行くと、スティールされるリスクが高くなります。",
      },
      {
        id: "a4",
        position: { x: 25, y: 55 },
        score: 0,
        explanation:
          "逆サイドへの移動はこの場面では不適切です。PGがあなたの方向を見ている（パスを出そうとしている）ので、ゴール方向にカットしてチャンスを作るべきです。",
      },
    ],
    postAnswerActions: {
      // If correct (a1): backdoor cut leads to layup
      a1: [
        {
          steps: [
            {
              playerId: "p2",
              from: { x: 78, y: 68 },
              to: { x: 65, y: 38 },
              duration: 0.8,
              type: "cut",
            },
          ],
          pauseAfter: 0.2,
        },
        {
          steps: [
            {
              playerId: "p1",
              from: { x: 60, y: 79 },
              to: { x: 60, y: 79 },
              duration: 0.5,
              type: "pass",
              hasBall: true,
            },
          ],
          ballPass: { from: "p1", to: "p2" },
          pauseAfter: 0.3,
        },
        {
          steps: [
            {
              playerId: "p2",
              from: { x: 65, y: 38 },
              to: { x: 52, y: 18 },
              duration: 0.7,
              type: "cut",
              hasBall: true,
            },
          ],
          pauseAfter: 0.5,
        },
      ],
      a2: [
        {
          steps: [
            {
              playerId: "p2",
              from: { x: 78, y: 68 },
              to: { x: 90, y: 75 },
              duration: 0.7,
              type: "move",
            },
          ],
          pauseAfter: 0.5,
        },
      ],
      a3: [
        {
          steps: [
            {
              playerId: "p2",
              from: { x: 78, y: 68 },
              to: { x: 58, y: 75 },
              duration: 0.7,
              type: "move",
            },
          ],
          pauseAfter: 0.5,
        },
      ],
      a4: [
        {
          steps: [
            {
              playerId: "p2",
              from: { x: 78, y: 68 },
              to: { x: 25, y: 55 },
              duration: 0.7,
              type: "move",
            },
          ],
          pauseAfter: 0.5,
        },
      ],
    },
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
      p1: { x: 50, y: 82 },
      p2: { x: 75, y: 65 }, // Wing with ball
      p3: { x: 88, y: 28 }, // Corner (user)
      p4: { x: 22, y: 65 },
      p5: { x: 50, y: 45 },
      d1: { x: 48, y: 78 },
      d2: { x: 73, y: 62 },
      d3: { x: 85, y: 30 },
    },
    initialBallHolder: "p2",
    actions: [
      // Move 1: PG passes to wing
      {
        steps: [
          {
            playerId: "p1",
            from: { x: 50, y: 82 },
            to: { x: 45, y: 80 },
            duration: 0.6,
            type: "move",
          },
        ],
        pauseAfter: 0.3,
      },
      // Move 2: Wing starts baseline drive
      {
        steps: [
          {
            playerId: "p2",
            from: { x: 75, y: 65 },
            to: { x: 80, y: 48 },
            duration: 1.0,
            type: "dribble",
            hasBall: true,
          },
          {
            playerId: "d2",
            from: { x: 73, y: 62 },
            to: { x: 78, y: 50 },
            duration: 1.0,
            type: "move",
          },
        ],
        pauseAfter: 0.3,
      },
      // Move 3: Help defense rotates to the drive
      {
        steps: [
          {
            playerId: "d3",
            from: { x: 85, y: 30 },
            to: { x: 78, y: 40 },
            duration: 0.7,
            type: "move",
          },
          {
            playerId: "p2",
            from: { x: 80, y: 48 },
            to: { x: 78, y: 40 },
            duration: 0.7,
            type: "dribble",
            hasBall: true,
          },
        ],
        pauseAfter: 0.3,
      },
    ],
    targetPlayerId: "p3",
    targetPlayerLabel: "3",
    answerSpots: [
      {
        id: "a1",
        position: { x: 85, y: 22 },
        score: 100,
        explanation:
          "正解！ヘルプディフェンスがドライブに寄った瞬間、元のコーナーポジションの少し外側にドリフトすることで、キックアウトパスを受けてオープンの3ポイントシュートが打てます。",
      },
      {
        id: "a2",
        position: { x: 68, y: 35 },
        score: 50,
        explanation:
          "ドライブに近づきすぎです。ヘルプディフェンスの近くにいると、パスを受けてもすぐにクローズアウトされてしまいます。もう少し距離を取って、3ポイントラインの外でパスを待ちましょう。",
      },
      {
        id: "a3",
        position: { x: 50, y: 48 },
        score: 0,
        explanation:
          "ペイントエリアに入るとドライブの邪魔になります。ドライブする味方のスペースを潰してしまうので、外に広がって合わせるのが正解です。",
      },
      {
        id: "a4",
        position: { x: 20, y: 28 },
        score: 0,
        explanation:
          "逆サイドに移動するのはこの場面では遅すぎます。ドライブは一瞬の判断が求められるので、近いポジションでキックアウトパスに備えるべきです。",
      },
    ],
    postAnswerActions: {
      // If correct (a1): kick out to corner for open 3
      a1: [
        {
          steps: [
            {
              playerId: "p3",
              from: { x: 88, y: 28 },
              to: { x: 85, y: 22 },
              duration: 0.5,
              type: "move",
            },
          ],
          pauseAfter: 0.2,
        },
        {
          steps: [
            {
              playerId: "p2",
              from: { x: 78, y: 40 },
              to: { x: 78, y: 40 },
              duration: 0.4,
              type: "pass",
              hasBall: true,
            },
          ],
          ballPass: { from: "p2", to: "p3" },
          pauseAfter: 0.3,
        },
        {
          steps: [
            {
              playerId: "p3",
              from: { x: 85, y: 22 },
              to: { x: 85, y: 22 },
              duration: 0.5,
              type: "move",
              hasBall: true,
            },
          ],
          pauseAfter: 0.8,
        },
      ],
      a2: [
        {
          steps: [
            {
              playerId: "p3",
              from: { x: 88, y: 28 },
              to: { x: 68, y: 35 },
              duration: 0.7,
              type: "move",
            },
          ],
          pauseAfter: 0.5,
        },
      ],
      a3: [
        {
          steps: [
            {
              playerId: "p3",
              from: { x: 88, y: 28 },
              to: { x: 50, y: 48 },
              duration: 0.7,
              type: "move",
            },
          ],
          pauseAfter: 0.5,
        },
      ],
      a4: [
        {
          steps: [
            {
              playerId: "p3",
              from: { x: 88, y: 28 },
              to: { x: 20, y: 28 },
              duration: 0.7,
              type: "move",
            },
          ],
          pauseAfter: 0.5,
        },
      ],
    },
    correctFeedback: "ナイスパス！👌",
    conceptExplanation:
      "【ドライブへの合わせの基本】味方がドライブした時、コーナーにいる選手は「ドリフト」（少し位置をずらす）してオープンを作ります。ヘルプディフェンスがドライブに寄る＝自分のマークが離れる、と読むことが大切です。",
    difficulty: 1,
  },
];
