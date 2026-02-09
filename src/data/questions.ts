import { QuizSequence } from "@/types/quiz";

// Coordinate system: rim at TOP (y~8-12), 3PT arc ~y=20-85, half-court y=95
// 3PT corners: x=12,y=15 and x=88,y=15
// 3PT wings: x=15,y=65 and x=85,y=65
// 3PT top: x=35,y=88 and x=65,y=88
// Top of key: x=50,y=87

export const quizSequences: QuizSequence[] = [
  {
    id: "seq-001",
    title: "5アウト モーションオフェンス",
    subtitle: "基本のパス&カット",
    description:
      "5アウトのセットオフェンスです。全員が3ポイントラインの外にスペーシングしています。ボールの動きに合わせて、各選手がどう動くべきかを順番に答えてください。",
    players: [
      { id: "p1", label: "1", isOffense: true },
      { id: "p2", label: "2", isOffense: true },
      { id: "p3", label: "3", isOffense: true },
      { id: "p4", label: "4", isOffense: true },
      { id: "p5", label: "5", isOffense: true },
      { id: "d1", label: "×", isOffense: false },
      { id: "d2", label: "×", isOffense: false },
      { id: "d3", label: "×", isOffense: false },
      { id: "d4", label: "×", isOffense: false },
      { id: "d5", label: "×", isOffense: false },
    ],
    // 5-out spacing: all outside 3PT line
    initialPositions: {
      p1: { x: 50, y: 90 }, // PG top
      p2: { x: 85, y: 68 }, // SG right wing
      p3: { x: 90, y: 18 }, // SF right corner
      p4: { x: 15, y: 68 }, // PF left wing
      p5: { x: 10, y: 18 }, // C left corner
      d1: { x: 48, y: 85 },
      d2: { x: 82, y: 65 },
      d3: { x: 87, y: 20 },
      d4: { x: 18, y: 65 },
      d5: { x: 13, y: 20 },
    },
    initialBallHolder: "p1",
    difficulty: 1,
    steps: [
      // Step 1: PG passes to right wing - where should PG go?
      {
        description:
          "1番（PG）が2番（右ウィング）にパスを出しました。パスした後、1番はどこに動くべき？",
        targetPlayerId: "p1",
        targetPlayerLabel: "1",
        preAnimations: [
          {
            steps: [],
            ballPass: { from: "p1", to: "p2" },
            pauseAfter: 0.5,
          },
        ],
        answerSpots: [
          {
            id: "s1-a1",
            position: { x: 70, y: 30 },
            score: 100,
            explanation:
              "正解！パス&カットの基本。パスした方向にカット（ゴール方向へ走り込む）するのがモーションオフェンスの原則です。ディフェンスの裏を突いてレイアップのチャンスを作れます。",
          },
          {
            id: "s1-a2",
            position: { x: 50, y: 90 },
            score: 0,
            explanation:
              "パスした後にその場に立ち止まるのはNGです。ディフェンスが楽に守れてしまいます。「パスしたら動く」が鉄則です。",
          },
          {
            id: "s1-a3",
            position: { x: 15, y: 88 },
            score: 50,
            explanation:
              "逆サイドに広がるのは間違いではありませんが、まずはゴール方向へのカットを狙うのが第一選択。カットが通らなかった場合にポジションを入れ替えます。",
          },
          {
            id: "s1-a4",
            position: { x: 65, y: 78 },
            score: 0,
            explanation:
              "ボールに近づくとスペーシングが崩れます。パスした後はゴール方向にカットするか、逆サイドに抜けてスペースを空けましょう。",
          },
        ],
        postAnswerActions: {
          "s1-a1": [
            {
              steps: [
                { playerId: "p1", from: { x: 50, y: 90 }, to: { x: 70, y: 30 }, duration: 0.9, type: "cut" },
                { playerId: "d1", from: { x: 48, y: 85 }, to: { x: 65, y: 35 }, duration: 0.9, type: "move" },
              ],
              pauseAfter: 0.5,
            },
          ],
          "s1-a2": [{ steps: [], pauseAfter: 0.5 }],
          "s1-a3": [
            {
              steps: [
                { playerId: "p1", from: { x: 50, y: 90 }, to: { x: 15, y: 88 }, duration: 0.8, type: "move" },
              ],
              pauseAfter: 0.5,
            },
          ],
          "s1-a4": [
            {
              steps: [
                { playerId: "p1", from: { x: 50, y: 90 }, to: { x: 65, y: 78 }, duration: 0.7, type: "move" },
              ],
              pauseAfter: 0.5,
            },
          ],
        },
        feedback: "ナイスカット！パス&ゴー！",
        explanation:
          "【パス&カット】パスした方向にゴール方向へ走り込むのがモーションオフェンスの基本。レイアップのチャンスを作り、ディフェンスにプレッシャーをかけます。",
      },

      // Step 2: PG's cut didn't receive pass - where should PG fill?
      {
        description:
          "1番のカットにパスが通りませんでした。1番はどこにポジションを取るべき？",
        targetPlayerId: "p1",
        targetPlayerLabel: "1",
        preAnimations: [
          // PG continues cutting through to basket area
          {
            steps: [
              { playerId: "p1", from: { x: 70, y: 30 }, to: { x: 55, y: 15 }, duration: 0.6, type: "cut" },
              { playerId: "d1", from: { x: 65, y: 35 }, to: { x: 52, y: 18 }, duration: 0.6, type: "move" },
            ],
            pauseAfter: 0.3,
          },
        ],
        answerSpots: [
          {
            id: "s2-a1",
            position: { x: 10, y: 18 },
            score: 100,
            explanation:
              "正解！カットが通らなかった場合、逆サイドのコーナーに抜けて（フィル）スペーシングを維持します。5番がいたコーナーに入り、5番は上がってポジションチェンジします。",
          },
          {
            id: "s2-a2",
            position: { x: 50, y: 45 },
            score: 0,
            explanation:
              "ペイントエリアに留まるとスペーシングが崩れます。中に留まると味方のドライブコースを塞いでしまいます。",
          },
          {
            id: "s2-a3",
            position: { x: 50, y: 90 },
            score: 50,
            explanation:
              "トップに戻るのは悪くありませんが、効率が悪い。カットした勢いのまま逆サイドコーナーに流れた方が、ローテーションがスムーズに進みます。",
          },
          {
            id: "s2-a4",
            position: { x: 90, y: 18 },
            score: 0,
            explanation:
              "ボールサイドのコーナーには3番がいます。同じスポットに2人が行くとスペーシングが崩壊します。",
          },
        ],
        postAnswerActions: {
          "s2-a1": [
            {
              steps: [
                { playerId: "p1", from: { x: 55, y: 15 }, to: { x: 10, y: 18 }, duration: 0.8, type: "move" },
                { playerId: "d1", from: { x: 52, y: 18 }, to: { x: 13, y: 20 }, duration: 0.8, type: "move" },
              ],
              pauseAfter: 0.3,
            },
          ],
          "s2-a2": [
            { steps: [{ playerId: "p1", from: { x: 55, y: 15 }, to: { x: 50, y: 45 }, duration: 0.7, type: "move" }], pauseAfter: 0.5 },
          ],
          "s2-a3": [
            { steps: [{ playerId: "p1", from: { x: 55, y: 15 }, to: { x: 50, y: 90 }, duration: 0.9, type: "move" }], pauseAfter: 0.5 },
          ],
          "s2-a4": [
            { steps: [{ playerId: "p1", from: { x: 55, y: 15 }, to: { x: 90, y: 18 }, duration: 0.8, type: "move" }], pauseAfter: 0.5 },
          ],
        },
        feedback: "逆サイドコーナーにフィル！",
        explanation:
          "【フィル（Fill）】カットが通らなかったら、空いたスポット（逆サイドのコーナー）に流れます。これでスペーシングが崩れず、次のアクションにつながります。",
      },

      // Step 3: P5 (left corner) needs to move up - where?
      {
        description:
          "1番がコーナーにフィルしたので、元々左コーナーにいた5番はどこに動くべき？",
        targetPlayerId: "p5",
        targetPlayerLabel: "5",
        preAnimations: [],
        answerSpots: [
          {
            id: "s3-a1",
            position: { x: 15, y: 68 },
            score: 100,
            explanation:
              "正解！1番がコーナーに入ったので、5番は左ウィングに上がります。4番はウィングから上がってトップに。こうしてポジションが全員ローテーションします。",
          },
          {
            id: "s3-a2",
            position: { x: 10, y: 18 },
            score: 0,
            explanation:
              "1番がそこに入ったばかりです。同じスポットに2人は入れません。上のポジション（ウィング）に移動しましょう。",
          },
          {
            id: "s3-a3",
            position: { x: 50, y: 45 },
            score: 0,
            explanation:
              "ペイントエリアに入るとスペーシングが崩れます。3ポイントラインの外のポジションに移動しましょう。",
          },
          {
            id: "s3-a4",
            position: { x: 50, y: 90 },
            score: 50,
            explanation:
              "トップに上がるのも間違いではありませんが、ウィングの方が近く効率的。4番がトップに上がるので、5番はウィングが正解です。",
          },
        ],
        postAnswerActions: {
          "s3-a1": [
            {
              steps: [
                { playerId: "p5", from: { x: 10, y: 18 }, to: { x: 15, y: 68 }, duration: 0.8, type: "move" },
                { playerId: "d5", from: { x: 13, y: 20 }, to: { x: 18, y: 65 }, duration: 0.8, type: "move" },
                { playerId: "p4", from: { x: 15, y: 68 }, to: { x: 40, y: 90 }, duration: 0.8, type: "move" },
                { playerId: "d4", from: { x: 18, y: 65 }, to: { x: 38, y: 85 }, duration: 0.8, type: "move" },
              ],
              pauseAfter: 0.5,
            },
          ],
          "s3-a2": [{ steps: [{ playerId: "p5", from: { x: 10, y: 18 }, to: { x: 10, y: 18 }, duration: 0.3, type: "move" }], pauseAfter: 0.5 }],
          "s3-a3": [{ steps: [{ playerId: "p5", from: { x: 10, y: 18 }, to: { x: 50, y: 45 }, duration: 0.7, type: "move" }], pauseAfter: 0.5 }],
          "s3-a4": [
            {
              steps: [
                { playerId: "p5", from: { x: 10, y: 18 }, to: { x: 50, y: 90 }, duration: 0.9, type: "move" },
                { playerId: "p4", from: { x: 15, y: 68 }, to: { x: 15, y: 68 }, duration: 0.3, type: "move" },
              ],
              pauseAfter: 0.5,
            },
          ],
        },
        feedback: "ローテーション！上にスライド！",
        explanation:
          "【ローテーション】カットした選手がコーナーにフィルしたら、全員が一つずつ上にローテーション。コーナー→ウィング→トップの順に上がり、5アウトのスペーシングを再構築します。",
      },

      // Step 4: 2 has the ball on right wing - drives baseline. Where should 3 (corner) go?
      {
        description:
          "2番がベースラインドライブを開始しました。コーナーにいる3番はどこに動くべき？",
        targetPlayerId: "p3",
        targetPlayerLabel: "3",
        preAnimations: [
          {
            steps: [
              { playerId: "p2", from: { x: 85, y: 68 }, to: { x: 82, y: 40 }, duration: 1.0, type: "dribble", hasBall: true },
              { playerId: "d2", from: { x: 82, y: 65 }, to: { x: 80, y: 42 }, duration: 1.0, type: "move" },
              { playerId: "d3", from: { x: 87, y: 20 }, to: { x: 82, y: 35 }, duration: 0.8, type: "move" },
            ],
            pauseAfter: 0.3,
          },
        ],
        answerSpots: [
          {
            id: "s4-a1",
            position: { x: 85, y: 68 },
            score: 100,
            explanation:
              "正解！ドリフト（少しずれる）して、2番が空けたウィングのスポットに上がります。ヘルプディフェンスが寄った分、オープンでキックアウトパスを受けられます。",
          },
          {
            id: "s4-a2",
            position: { x: 70, y: 35 },
            score: 50,
            explanation:
              "ドライブに近づきすぎです。ヘルプディフェンスに捕まりやすく、パスを受けてもシュートスペースがありません。3ポイントラインの外に留まりましょう。",
          },
          {
            id: "s4-a3",
            position: { x: 90, y: 18 },
            score: 0,
            explanation:
              "コーナーに留まるのはこの場面では不適切。2番がウィングからドライブしたので、空いたウィングの位置に上がるのが正しい動きです。",
          },
          {
            id: "s4-a4",
            position: { x: 50, y: 55 },
            score: 0,
            explanation:
              "ペイントエリア付近に入るとドライブコースを塞いでしまいます。外に広がってキックアウトに備えましょう。",
          },
        ],
        postAnswerActions: {
          "s4-a1": [
            {
              steps: [
                { playerId: "p3", from: { x: 90, y: 18 }, to: { x: 85, y: 68 }, duration: 0.8, type: "move" },
                { playerId: "d3", from: { x: 82, y: 35 }, to: { x: 82, y: 65 }, duration: 0.8, type: "move" },
              ],
              pauseAfter: 0.3,
            },
          ],
          "s4-a2": [{ steps: [{ playerId: "p3", from: { x: 90, y: 18 }, to: { x: 70, y: 35 }, duration: 0.7, type: "move" }], pauseAfter: 0.5 }],
          "s4-a3": [{ steps: [], pauseAfter: 0.5 }],
          "s4-a4": [{ steps: [{ playerId: "p3", from: { x: 90, y: 18 }, to: { x: 50, y: 55 }, duration: 0.7, type: "move" }], pauseAfter: 0.5 }],
        },
        feedback: "ウィングにリフト！キックアウトに備えろ！",
        explanation:
          "【リフト（Lift）】味方がドライブした時、コーナーの選手は空いたウィングの位置に上がる。これでキックアウトパスを受ける位置が確保され、オープンの3ポイントシュートが打てます。",
      },

      // Step 5: 2 kicks out to 3 at the wing. Now what should 2 do?
      {
        description:
          "2番がドライブからキックアウトパスを3番に出しました。2番はどこに動くべき？",
        targetPlayerId: "p2",
        targetPlayerLabel: "2",
        preAnimations: [
          {
            steps: [],
            ballPass: { from: "p2", to: "p3" },
            pauseAfter: 0.4,
          },
        ],
        answerSpots: [
          {
            id: "s5-a1",
            position: { x: 90, y: 18 },
            score: 100,
            explanation:
              "正解！キックアウト後、ドライブした選手はコーナーに流れます。これで3ポイントラインの外にスペーシングが維持され、もし3番がシュートを打たなかった場合に次のアクションにつながります。",
          },
          {
            id: "s5-a2",
            position: { x: 82, y: 40 },
            score: 0,
            explanation:
              "ペイントエリアに留まるのはNGです。スペーシングが崩れ、次のプレーの選択肢がなくなります。",
          },
          {
            id: "s5-a3",
            position: { x: 85, y: 68 },
            score: 50,
            explanation:
              "元のウィングに戻るのは悪くありませんが、3番がそこにいます。同じポジションに2人は不要です。空いたコーナーに流れましょう。",
          },
          {
            id: "s5-a4",
            position: { x: 50, y: 90 },
            score: 0,
            explanation:
              "トップまで走る必要はありません。最も近い空きスポット（コーナー）に入るのが効率的です。",
          },
        ],
        postAnswerActions: {
          "s5-a1": [
            {
              steps: [
                { playerId: "p2", from: { x: 82, y: 40 }, to: { x: 90, y: 18 }, duration: 0.7, type: "move" },
                { playerId: "d2", from: { x: 80, y: 42 }, to: { x: 87, y: 20 }, duration: 0.7, type: "move" },
              ],
              pauseAfter: 0.3,
            },
          ],
          "s5-a2": [{ steps: [], pauseAfter: 0.5 }],
          "s5-a3": [{ steps: [{ playerId: "p2", from: { x: 82, y: 40 }, to: { x: 85, y: 68 }, duration: 0.7, type: "move" }], pauseAfter: 0.5 }],
          "s5-a4": [{ steps: [{ playerId: "p2", from: { x: 82, y: 40 }, to: { x: 50, y: 90 }, duration: 0.9, type: "move" }], pauseAfter: 0.5 }],
        },
        feedback: "コーナーにフィル！スペーシング維持！",
        explanation:
          "【ドリフト＆フィル】キックアウトした後は空いたコーナーに流れる。ボールを離した後もスペーシングを維持するのがバスケIQの高い選手です。",
      },

      // Step 6: 3 has the ball at wing. Swings to 4 at top. Where should 3 go?
      {
        description:
          "3番がトップの4番にスウィングパスを出しました。3番はどこに動くべき？",
        targetPlayerId: "p3",
        targetPlayerLabel: "3",
        preAnimations: [
          {
            steps: [
              { playerId: "p4", from: { x: 40, y: 90 }, to: { x: 50, y: 90 }, duration: 0.4, type: "move" },
            ],
            pauseAfter: 0.2,
          },
          {
            steps: [],
            ballPass: { from: "p3", to: "p4" },
            pauseAfter: 0.4,
          },
        ],
        answerSpots: [
          {
            id: "s6-a1",
            position: { x: 65, y: 35 },
            score: 100,
            explanation:
              "正解！パス&カット。パスした方向（ここではトップの方向からゴール方向へ）にカットすることで、ディフェンスの裏を突きます。",
          },
          {
            id: "s6-a2",
            position: { x: 85, y: 68 },
            score: 0,
            explanation:
              "ウィングに留まるのはNGです。パスした後はカットするのが原則。動かないとディフェンスが楽に守れます。",
          },
          {
            id: "s6-a3",
            position: { x: 60, y: 88 },
            score: 50,
            explanation:
              "トップ方向に上がるのは一つの選択肢ですが、まずはゴール方向へのカットを狙うのが優先です。",
          },
          {
            id: "s6-a4",
            position: { x: 90, y: 18 },
            score: 0,
            explanation:
              "コーナーには2番がいます。ボールと逆方向に動いてもオフェンスの脅威になりません。",
          },
        ],
        postAnswerActions: {
          "s6-a1": [
            {
              steps: [
                { playerId: "p3", from: { x: 85, y: 68 }, to: { x: 65, y: 35 }, duration: 0.9, type: "cut" },
                { playerId: "d3", from: { x: 82, y: 65 }, to: { x: 62, y: 38 }, duration: 0.9, type: "move" },
              ],
              pauseAfter: 0.5,
            },
          ],
          "s6-a2": [{ steps: [], pauseAfter: 0.5 }],
          "s6-a3": [{ steps: [{ playerId: "p3", from: { x: 85, y: 68 }, to: { x: 60, y: 88 }, duration: 0.7, type: "move" }], pauseAfter: 0.5 }],
          "s6-a4": [{ steps: [{ playerId: "p3", from: { x: 85, y: 68 }, to: { x: 90, y: 18 }, duration: 0.8, type: "move" }], pauseAfter: 0.5 }],
        },
        feedback: "パス&ゴー！ゴールに向かってカット！",
        explanation:
          "【反復するパス&カット】何度でも同じ原則。パスしたらゴール方向にカット。モーションオフェンスではこの動きが繰り返し続きます。",
      },

      // Step 7: 3's cut didn't get pass. Where should 3 fill?
      {
        description:
          "3番のカットにパスが通りませんでした。3番はどこに抜けるべき？",
        targetPlayerId: "p3",
        targetPlayerLabel: "3",
        preAnimations: [
          {
            steps: [
              { playerId: "p3", from: { x: 65, y: 35 }, to: { x: 50, y: 15 }, duration: 0.6, type: "cut" },
              { playerId: "d3", from: { x: 62, y: 38 }, to: { x: 48, y: 18 }, duration: 0.6, type: "move" },
            ],
            pauseAfter: 0.3,
          },
        ],
        answerSpots: [
          {
            id: "s7-a1",
            position: { x: 10, y: 18 },
            score: 100,
            explanation:
              "正解！カットが通らなければ逆サイドのコーナー（左コーナー）に抜けます。1番がいるので、1番はウィングに上がるローテーションが始まります。",
          },
          {
            id: "s7-a2",
            position: { x: 50, y: 40 },
            score: 0,
            explanation:
              "ペイント内に留まるとスペーシングが崩壊します。早く外に抜けましょう。",
          },
          {
            id: "s7-a3",
            position: { x: 90, y: 18 },
            score: 50,
            explanation:
              "ボールサイドのコーナーに戻ると2番と重なります。逆サイドに流れてスペースを作りましょう。",
          },
          {
            id: "s7-a4",
            position: { x: 85, y: 68 },
            score: 0,
            explanation:
              "元のウィングにはすでに2番がローテーションで上がってくる可能性があります。空いた逆サイドコーナーに行きましょう。",
          },
        ],
        postAnswerActions: {
          "s7-a1": [
            {
              steps: [
                { playerId: "p3", from: { x: 50, y: 15 }, to: { x: 10, y: 18 }, duration: 0.8, type: "move" },
                { playerId: "d3", from: { x: 48, y: 18 }, to: { x: 13, y: 20 }, duration: 0.8, type: "move" },
                { playerId: "p1", from: { x: 10, y: 18 }, to: { x: 15, y: 68 }, duration: 0.8, type: "move" },
                { playerId: "d1", from: { x: 13, y: 20 }, to: { x: 18, y: 65 }, duration: 0.8, type: "move" },
              ],
              pauseAfter: 0.5,
            },
          ],
          "s7-a2": [{ steps: [{ playerId: "p3", from: { x: 50, y: 15 }, to: { x: 50, y: 40 }, duration: 0.5, type: "move" }], pauseAfter: 0.5 }],
          "s7-a3": [{ steps: [{ playerId: "p3", from: { x: 50, y: 15 }, to: { x: 90, y: 18 }, duration: 0.8, type: "move" }], pauseAfter: 0.5 }],
          "s7-a4": [{ steps: [{ playerId: "p3", from: { x: 50, y: 15 }, to: { x: 85, y: 68 }, duration: 0.8, type: "move" }], pauseAfter: 0.5 }],
        },
        feedback: "逆サイドコーナーにフィル！ローテーション！",
        explanation:
          "【繰り返されるローテーション】同じパターンの繰り返し。カット→逆サイドコーナー→全員上にローテーション。この規則性がモーションオフェンスの美しさです。",
      },

      // Step 8: 4 has ball at top, passes to left wing (p5 or p1). D overplays 1. What should 1 do?
      {
        description:
          "4番が左ウィングの1番にパスしようとしていますが、ディフェンスが強くディナイしています。1番はどうするべき？",
        targetPlayerId: "p1",
        targetPlayerLabel: "1",
        preAnimations: [
          {
            steps: [
              { playerId: "d1", from: { x: 18, y: 65 }, to: { x: 22, y: 72 }, duration: 0.6, type: "move" },
            ],
            pauseAfter: 0.3,
          },
        ],
        answerSpots: [
          {
            id: "s8-a1",
            position: { x: 30, y: 35 },
            score: 100,
            explanation:
              "正解！バックドアカット。ディナイが強い時はゴール方向にカットしてディフェンスの裏を突きます。4番からのバウンスパスを受けてレイアップに行けます。",
          },
          {
            id: "s8-a2",
            position: { x: 10, y: 68 },
            score: 50,
            explanation:
              "さらに外に広がるのは安全策ですが、ディナイが強い時はバックドアカットの方がチャンスが大きいです。「ディナイが強い＝裏が空く」と覚えましょう。",
          },
          {
            id: "s8-a3",
            position: { x: 30, y: 78 },
            score: 0,
            explanation:
              "ボールに向かって行くとディフェンスの思うツボです。スティールされるリスクが高くなります。",
          },
          {
            id: "s8-a4",
            position: { x: 50, y: 68 },
            score: 0,
            explanation:
              "中央に移動すると5番やトップのスペースを潰してしまいます。",
          },
        ],
        postAnswerActions: {
          "s8-a1": [
            {
              steps: [
                { playerId: "p1", from: { x: 15, y: 68 }, to: { x: 30, y: 35 }, duration: 0.7, type: "cut" },
                { playerId: "d1", from: { x: 22, y: 72 }, to: { x: 28, y: 38 }, duration: 0.7, type: "move" },
              ],
              pauseAfter: 0.2,
            },
            {
              steps: [],
              ballPass: { from: "p4", to: "p1" },
              pauseAfter: 0.3,
            },
            {
              steps: [
                { playerId: "p1", from: { x: 30, y: 35 }, to: { x: 45, y: 15 }, duration: 0.6, type: "cut", hasBall: true },
              ],
              pauseAfter: 0.5,
            },
          ],
          "s8-a2": [{ steps: [{ playerId: "p1", from: { x: 15, y: 68 }, to: { x: 10, y: 68 }, duration: 0.4, type: "move" }], pauseAfter: 0.5 }],
          "s8-a3": [{ steps: [{ playerId: "p1", from: { x: 15, y: 68 }, to: { x: 30, y: 78 }, duration: 0.6, type: "move" }], pauseAfter: 0.5 }],
          "s8-a4": [{ steps: [{ playerId: "p1", from: { x: 15, y: 68 }, to: { x: 50, y: 68 }, duration: 0.6, type: "move" }], pauseAfter: 0.5 }],
        },
        feedback: "バックドアカット！レイアップ！",
        explanation:
          "【バックドアカット】ディフェンスがパスコースをディナイしている時は、ゴール方向にカットして裏を突く。ディナイの強さを逆に利用する賢いプレーです。",
      },

      // Step 9: After backdoor layup (or miss), transition back. Where should p2 (right corner) drift on the weakside?
      {
        description:
          "ボールが左サイドに展開されています。逆サイド（右コーナー）にいる2番は何をするべき？",
        targetPlayerId: "p2",
        targetPlayerLabel: "2",
        preAnimations: [
          // Reset from backdoor - ball goes back to 5 on left wing
          {
            steps: [
              { playerId: "p1", from: { x: 45, y: 15 }, to: { x: 10, y: 18 }, duration: 0.8, type: "move" },
              { playerId: "d1", from: { x: 28, y: 38 }, to: { x: 13, y: 20 }, duration: 0.8, type: "move" },
            ],
            ballPass: { from: "p1", to: "p5" },
            pauseAfter: 0.4,
          },
        ],
        answerSpots: [
          {
            id: "s9-a1",
            position: { x: 70, y: 25 },
            score: 100,
            explanation:
              "正解！逆サイドではスタック（ローポスト付近）やミドルエリアで待機して、ヘルプポジションのディフェンスから離れます。スキップパスが来た時に備えつつ、ドライブのスペースを空けています。",
          },
          {
            id: "s9-a2",
            position: { x: 90, y: 18 },
            score: 50,
            explanation:
              "コーナーに留まるのは間違いではありませんが、逆サイドでは少しローポスト寄りに下がった方が、スキップパスやリバウンドに備えやすくなります。",
          },
          {
            id: "s9-a3",
            position: { x: 50, y: 50 },
            score: 0,
            explanation:
              "ペイントエリアに入るとドライブコースを塞ぎます。逆サイドで待機しましょう。",
          },
          {
            id: "s9-a4",
            position: { x: 50, y: 90 },
            score: 0,
            explanation:
              "トップまで上がるのは遠すぎます。スキップパスに備えて逆サイドのスペースで待機しましょう。",
          },
        ],
        postAnswerActions: {
          "s9-a1": [
            { steps: [{ playerId: "p2", from: { x: 90, y: 18 }, to: { x: 70, y: 25 }, duration: 0.6, type: "move" }, { playerId: "d2", from: { x: 87, y: 20 }, to: { x: 67, y: 28 }, duration: 0.6, type: "move" }], pauseAfter: 0.5 },
          ],
          "s9-a2": [{ steps: [], pauseAfter: 0.5 }],
          "s9-a3": [{ steps: [{ playerId: "p2", from: { x: 90, y: 18 }, to: { x: 50, y: 50 }, duration: 0.7, type: "move" }], pauseAfter: 0.5 }],
          "s9-a4": [{ steps: [{ playerId: "p2", from: { x: 90, y: 18 }, to: { x: 50, y: 90 }, duration: 0.9, type: "move" }], pauseAfter: 0.5 }],
        },
        feedback: "逆サイドで待機！スキップパスに備えろ！",
        explanation:
          "【ウィークサイドのポジショニング】ボールと逆サイドの選手は、スタックやローポスト付近で待機。ヘルプディフェンスから離れつつ、スキップパスに備えます。これが高IQのポジショニングです。",
      },

      // Step 10: Skip pass to weakside. 2 catches and shoots or drives?
      {
        description:
          "5番からスキップパスが2番に飛んできました！キャッチ&シュートか、ドライブか。2番はどうするべき？",
        targetPlayerId: "p2",
        targetPlayerLabel: "2",
        preAnimations: [
          {
            steps: [],
            ballPass: { from: "p5", to: "p2" },
            pauseAfter: 0.3,
          },
          {
            steps: [
              { playerId: "d2", from: { x: 67, y: 28 }, to: { x: 68, y: 26 }, duration: 0.3, type: "move" },
            ],
            pauseAfter: 0.2,
          },
        ],
        answerSpots: [
          {
            id: "s10-a1",
            position: { x: 70, y: 25 },
            score: 100,
            explanation:
              "正解！スキップパスでディフェンスが寄りきれていない状況。その場でキャッチ&シュートが最善です。ディフェンスのクローズアウトが間に合わないうちにシュート！",
          },
          {
            id: "s10-a2",
            position: { x: 60, y: 15 },
            score: 50,
            explanation:
              "ドライブも選択肢ですが、ディフェンスが離れている今、シュートの方がリスクが低く期待値が高いです。オープンならまず打つのがバスケの原則です。",
          },
          {
            id: "s10-a3",
            position: { x: 50, y: 50 },
            score: 0,
            explanation:
              "パスを受けた後にペイントに入るのは、せっかくのオープンシュートの機会を逃してしまいます。",
          },
          {
            id: "s10-a4",
            position: { x: 85, y: 68 },
            score: 0,
            explanation:
              "ウィングに移動してからのシュートでは、クローズアウトが間に合ってしまいます。キャッチした瞬間にシュートしましょう。",
          },
        ],
        postAnswerActions: {
          "s10-a1": [
            {
              steps: [
                { playerId: "p2", from: { x: 70, y: 25 }, to: { x: 70, y: 25 }, duration: 0.8, type: "move", hasBall: true },
              ],
              pauseAfter: 1.0,
            },
          ],
          "s10-a2": [
            {
              steps: [
                { playerId: "p2", from: { x: 70, y: 25 }, to: { x: 60, y: 15 }, duration: 0.7, type: "dribble", hasBall: true },
              ],
              pauseAfter: 0.5,
            },
          ],
          "s10-a3": [{ steps: [{ playerId: "p2", from: { x: 70, y: 25 }, to: { x: 50, y: 50 }, duration: 0.7, type: "dribble", hasBall: true }], pauseAfter: 0.5 }],
          "s10-a4": [{ steps: [{ playerId: "p2", from: { x: 70, y: 25 }, to: { x: 85, y: 68 }, duration: 0.7, type: "dribble", hasBall: true }], pauseAfter: 0.5 }],
        },
        feedback: "キャッチ&シュート！ナイスショット！",
        explanation:
          "【オープンシュートの判断】スキップパスでディフェンスが崩れた時、オープンならシュートが最善。「空いたら打つ」はバスケの大原則。ここまでの全員の動き（パス&カット→ローテーション→ドライブ→キックアウト→スウィング）がこのオープンシュートを生みました。",
      },
    ],
  },
];
