LIGHT UP THE LAND — PLAYABLE CONCEPT PROTOTYPE

QUICK PREVIEW
Open index.html in a desktop browser. Swipe upward from the ball, click
"Shoot a basket", or press Space while the court is focused.
Opening the file directly runs clearly labeled solo play.
Static hosting (including Netlify Drop) automatically uses solo scoring
when no shared API is installed; lighting and settings work on mobile.

SHARED ARENA
Install Node.js 18 or newer, open a terminal in this folder, and run:
  npm start
Open http://localhost:3000 on that computer.
For phones on the same Wi-Fi, open http://YOUR-COMPUTER-LAN-IP:3000
and allow local network access through the computer's firewall if needed.
Everyone using the same server and room sees one combined basket score.
The default room is cavs. Copy room link includes the room name.
For remote fans, this server must be deployed to an internet-accessible host.
There is no published URL bundled with this prototype.

ADJUSTING MILESTONES
Click Game settings. Defaults are 2 / 5 / 10. Enter any three increasing
positive whole numbers. Changes apply to everyone in the same shared room.
The final milestone triggers a brief celebration; subsequent multiples
trigger another celebration. More baskets continue changing the palette.
Reduced light effects disables pulsing and flashing. System reduced-motion
preferences are respected by default.

PROTOTYPE LIMITS
Shared score and settings live in server memory and reset on restart.
The server is for a small prototype: settings are open to room participants,
scores are client-reported, and public-event security is not implemented.
No real PixMob or arena-board control is included.
All arena art is drawn in the browser; no external assets are required.
This is an unofficial Cleveland fan concept.

VALIDATION
Run npm test for shared scoring, duplicate-shot handling, room isolation,
simultaneous scoring, and adjustable milestone validation.
