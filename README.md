# Birthday Game — full rehearsal build

This is a full-flow **test build** for the phone host + Xbox TV setup. It extends the tested Noise Boys prototype with Trivia Bingo, Mole Hunt 1, Bowl of Nouns, Mole Hunt 2, Bonus Stars, and final standings.

## Deploy to existing Render service

1. **Keep a backup of your currently working GitHub repository.** This version changes the server and saved-game format.
2. Extract the ZIP. Upload **all files inside the `birthday-game-complete` folder** to the root of your existing GitHub repository, replacing matching files. Do not upload the ZIP itself or create a nested folder.
3. In GitHub, click **Commit changes**. Render should redeploy automatically. Confirm the service is **Live**.
4. Host: `https://birthday-game-2grx.onrender.com/host.html`; Xbox: `https://birthday-game-2grx.onrender.com/tv.html` (assuming your Render service URL has not changed).
5. Open both pages in separate browser tabs for a rehearsal. Enter teams and moles; save setup; start. The game will not expose mole identities on the TV endpoint.

`npm start` runs locally with Node 18+ and no third-party dependencies.

## Important limitations before the party

- **Render's ordinary filesystem is ephemeral**. Game state is saved in `game-state.json`, so a Render restart/redeploy may erase progress. A Supabase database migration or Render persistent disk is needed for durable production hosting. The prototype's local persistence is not a guarantee of cloud durability.
- **No authentication**: the host URL and `/api/host-state` are not access controlled. Keep the link private; this is a trusted-group rehearsal build, not a secure public game. Do not share the host URL with players.
- **Sound may be blocked** by Xbox browser autoplay policies. Test the Noise Boys cue and Bowl buzzer on the actual Xbox.
- **Undo/Redo history is in server memory** and disappears on a server restart, although game state persists if storage survives. Final scoring locks once final reveal begins.
- **Bingo is verified physically** by the host; select the winning team at End Trivia Bingo. Fake numbered Bingo cards and the guaranteed safe draw pool are supplied separately; this build uses the safe draw pool.
- **Roullette rule list** includes original rules and previously suggested candidates that were not individually approved. Edit `content.js` to remove unwanted rules before the party.
- **Noise Boys**: all 18 prompts included. **Trivia**: all 52 questions included, including three uploaded images. The host adjudicates answers verbally; no answer keys.
- **Bowl of Nouns** starts with four clues; add player-submitted clues using the host sidebar **before** starting Bowl. The clue bank locks when Bowl begins.
- **Live score updates** are on the Xbox during Bowl. Host disconnection automatically pauses the server timer after approximately 6 seconds. Reconnect, then use Pause/Resume controls as needed.
- **Testing before party is essential.** This is a complete-feature first pass, not a guarantee of flawless production operation.

## Rehearsal checklist

1. Setup: assign at least one mole to each team, start, verify Xbox rosters and 18 Noise Boys prompts; enter scores, reveal.
2. Trivia: open 2×4 board; test regular question + partial score + Right Enough; Bingo ball appears; wrong answer draws unique Roullette rule; test All Play with two simultaneous restrictions; record a violation and Undo/Redo; end with/without Bingo; reveal.
3. Mole Hunt 1: accuse a real mole and an innocent player; verify private outcome; finish three teams; reveal full Mole Team.
4. Bowl: add clues in advance; start a turn; Correct advances immediately; verify buzzer and Failed; empty bowl to freeze clock and refill into next pass; complete all three passes; Show Scores.
5. Mole Hunt 2: record Mole Team accusation, reveal twist, reveal updated scores.
6. Bonus Stars: select tied winners, award three stars, reveal standings in reverse order. Final scoring cannot be edited.

If anything breaks, note the exact phase, action, and visible error message. Keep the original tested repository commit available for rollback.
