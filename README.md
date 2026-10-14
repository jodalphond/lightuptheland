# Light Up the Land

A mobile basketball prototype with one shared cartoon arena. Swipe upward from the ball to shoot. Every basket contributes to the room's collective score; each player also sees their personal total.

## Upload to GitHub

1. Extract the multiplayer ZIP on your computer.
2. Open the extracted `light-up-the-land` folder.
3. In your GitHub repository, choose **Add file → Upload files**.
4. Drag the **files inside the folder** into GitHub. Do not upload the ZIP or the containing folder. `package.json`, `server.mjs`, and `index.html` must be at the repository's top level.
5. Choose **Commit changes**. The included README can replace the initial empty README.

## Deploy to Render

1. Sign in at https://dashboard.render.com and choose **New → Web Service**.
2. Connect GitHub, allow access to this repository, and select it.
3. Use these settings:

| Setting | Value |
| --- | --- |
| Name | `light-up-the-land` (or another available name) |
| Language / Runtime | Node |
| Root Directory | Leave empty |
| Build Command | `npm install --ignore-scripts` |
| Start Command | `npm start` |
| Instance Type | Free |
| Health Check Path, if shown | `/health` |

4. Choose **Deploy Web Service** and wait until it is live.
5. Open Render's `https://…onrender.com` link. This is the new game link; the existing Netlify link remains a separate solo game.

The `render.yaml` also supports a Render Blueprint if you prefer automatic configuration. Use either a Web Service or a Blueprint; you do not need both.

## Test together

Open the exact same Render link on two phones. The game should say **SHARED ARENA**. Each person scores once: both phones should show a crowd total of 2 and change the crowd lighting. Updates normally arrive within about 1.5 seconds.

Milestones are **2 / 5 / 10 / 20 / 25 / 30 / 35 / 40 / 45 collective baskets**. At 10, the arena darkens with softer wristbands. At 20 a wave travels through the crowd; 25 adds a gold sweep; 30 a heartbeat; 35 alternating wine-and-gold sections; 40 an American flag; and 45 fireworks. Game settings changes the milestones for all participants in the room. Keep reduced light effects enabled if desired; lights still appear without pulsing or flashing.

For a fresh test, use Game settings to join a new room, or append `?room=test-two` to the link. Everyone must use the same room name.

## Prototype limits

- Shared totals and settings are held in one server's memory and reset on restart, redeploy, or a free-service sleep/wake cycle. Use one service instance for this test.
- Render's free service can sleep after inactivity, so the first opening can take time. This is a small-group prototype, not a full arena deployment.
- Room settings are open to participants and basket claims are client-reported. Public-event authentication, anti-cheating controls, and durable storage are future work.
- Rendering is an unofficial arena-inspired cartoon. There is no actual PixMob or arena-board integration.

## Local development

Requires Node.js 18 or newer. No third-party runtime dependencies are needed.

```sh
npm start
```

Open http://localhost:3000. The server uses Render's `PORT` when supplied and listens on all interfaces. It serves only the game, API, and health endpoint, not repository files.

```sh
npm test
```

Tests cover shared scoring, room separation, duplicate-shot retries, concurrent baskets, milestone changes, and static-hosting fallback.

Sources for deployment steps: [Render Node quickstart](https://render.com/docs/deploy-node-express-app), [Render free services](https://render.com/docs/free), and [Blueprint specification](https://render.com/docs/blueprint-spec).
