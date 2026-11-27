# Development instructions

- Goal: an in-person, shared-screen board game tutorial, not a digital replacement for physical games. First game: Die Macher Korean edition, five players, four-election basic game.
- Keep the app static, offline-friendly and free of required API keys, accounts, or servers. Do not introduce paid services by default.
- Preserve original diagrams and use independently written summaries. Do not commit scans, card artwork, or entire copyrighted rulebooks.
- Rule changes must be supported by a rulebook edition and page reference. Korean-edition terminology and exception handling remain unverified. Never silently turn an assumption into a rule.
- Maintain the large shared-display UI, detailed/quick modes, manual step navigation, optional Korean TTS, and local progress persistence. Keep secret player information out of the shared screen.
- Keep game data in games/ and reusable UI in app/. Die Macher-specific branching remains in the current engine; extract it before adding a second game.
- Before commits, run node tests/core.cjs and browser smoke tests where the environment permits. Report blocked tests explicitly. Update README and docs/STATUS.md when behavior or decisions change.

## v0.3 direction
- Teach through guided actions, not only checklists. Add scenarios with an initial state, specific action, validation, board-state feedback, and short explanation. Practice must never alter the physical-game progress state.
- Use `practice.html` as the current action-first prototype; extract its scene/state/action logic into a reusable engine as game content grows. Do not claim all games or all Die Macher rules are implemented.
- Run `python tests/practice.py` in addition to the existing core tests. Use actual navigation tests in a normal browser environment; document any restrictions.

## v0.4 product direction (supersedes earlier game order and action-first emphasis)
- Primary product: personal collection rulemaster. Begin with **rules teaching**, not a quiz or a game simulator. Narrate purpose, setup, turn flow, and every action in beginner-friendly order. Show relevant pieces and animations while explaining. Manual demonstration, replay, and optional direct manipulation come after explanation. A physical rulemaster must move pieces by hand; instant, repeatable staged demos are our differentiator.
- First validation game: Nusfjord Big Box (2024), base game first; user already knows the game and can judge teaching completeness and accuracy. Preserve Die Macher v0.3, then apply the validated approach to it.
- Goal: all owned board games, not only heavy games. Keep collection entries, editions, expansions, and verification status separate from game code; distinguish owned / planned purchases. Avoid guessing titles or editions.
- Use original, recognizable piece shapes/colors and board layouts rather than redistributing copyrighted artwork/scans. Document official source and page for each rule. Exact user-owned art may be used only where rights permit; default to independent schematic assets.
- `games/nusfjord.js` contains independent teaching examples; `app/rulemaster.js` plays deterministic snapshots and optional pointer drag. Layout/shape drawing is currently Nusfjord-specific; refactor reusable scene playback from rendering before a third game.
- GitHub is the intended single source of truth across PCs. Keep one coherent commit per change; pull before edits, run tests, update status and commit before switching computers. Never overwrite upstream history.
- Prototype is deliberately incomplete. Do not represent an illustrative scene as a complete legal game simulation. Do not claim full rule coverage until the user validates the complete guide.

## v0.5 rulemaster completeness gate
- Owner found missing explanations in v0.4. A lesson must explain the rule before/with a staged movement, including conditions, costs, effects and relevant exceptions. Do not treat a short overview as a completed rule.
- All common base-game action types and end-of-round/scoring need a distinct demonstration or explicit explanation. Use `docs/NUSFJORD-COVERAGE.md` as the review checklist. Expand card-specific details only after the common explanation flow is approved.
- Keep chapter navigation non-duplicative: initial no-move narration is shown on entry; the next button advances to the following explanation. Keep shared action examples deterministic; no forced quiz before rules explanation.
- Prioritize high-fidelity visual component placement and verification with the owner; diagrams remain independent approximations. Do not claim that a passing browser test proves the rulebook was fully or correctly taught.

## v0.6 teaching priority (owner decision)
- Explain how to set up a game before discussing actions. A learner must know the required components, exact quantities, orientation, board locations, stacking order, and player-count differences. Show components being sorted, placed, flipped and stacked. Explain round-triggered additions/deals, including what stays hidden or returns to the box.
- Do not exhaustively narrate individual elder/building card effects. Explain the shared rules for acquiring, using and resolving them, and use only a representative example when needed. Players read the specific card during play. Treat detailed setup, common rules and timing as the completeness gate.
- Nusfjord setup has a 2–5 player selector for the three setup close-ups. Subsequent independent examples remain mostly 3-player; do not present them as an automatically adapted simulation.

## v0.7 player-count invariant (owner decision)
- For every multiplayer game, choose player count once globally before setup (or change at any chapter). All count-dependent component quantities, placement, capacities, round schedules and examples must derive from that one value. Never display a different count's example as if it were the selected count. Default to 5 players if no saved choice; if adaptation is unavailable, teach an explicitly labelled 5-player game instead. Nusfjord implements 2–5-player base game; solo and expansions are separate.
- Keep exact setup instructions, visual placement and shared rules above exhaustive individual card effects. Full-table setup illustrates each participant's kit and round allocation; close-up lessons show one player's pieces where appropriate. The deterministic scenarios are not a full game simulator.
- Run `python tests/player_counts.py` for all counts and re-selection, in addition to the existing tests. Keep the global selector visible even during later action/scoring chapters.

## v0.8 expansion selection and validation (owner decision)
- Owner accepted Nusfjord v0.7 teaching as sufficient; preserve it while adding Race for the Galaxy as the second rulemaster game. Die Macher remains a prototype.
- Race uses the original Korean base edition and the three original first-arc expansions, The Gathering Storm, Rebel vs Imperium, The Brink of War. Explain each expansion separately and integrate setup differences before base action explanations. Support four cumulative configurations; do not treat the third expansion as a standalone add-on. Default to all three expansions and five players; base game alone defaults to four. Player counts must be constrained to the selected configuration (2–4 / 2–5 / 2–6 / 2–6). Takeover is optional, default off; show both configurations and explain old official first-game-off convention. Support experienced 2-player option when selected.
- Rulemaster must explain deck mixing and replacements, player materials, goals and extra tokens, common rules, special timing, and end scoring. Do not create a full digital game or narrate every card. Use original schematic art and page references. `app/card-rulemaster.js` implements reusable deterministic SVG scenes for card games, with optional drag, replay and TTS. `games/race.js` provides the data. Keep Nusfjord-specific renderer unchanged.
- Run `python tests/race.py` for the four configurations, valid counts, optional modules, all lesson frames and real drag. The teaching adequacy of Race is still subject to owner review.

### Race visual acceptance, v0.9.0
- Owner is a first-time Race player; make physical component identification and card anatomy visually explicit before action explanations. Use original, offline illustrative art and physically meaningful icon locations (cost/defense circle or diamond, adjacent VP hex, left phase powers, bottom notes, start-world corners, expansion marks). Do not pass off invented card examples as actual cards. Link publisher illustrations for physical verification. Show card backs and per-player action deck colors distinctly; keep setup start worlds face-up and show all four good colors and sale values. A click/keyboard or labeled control opens an enlarged, explanatory view without interfering with dragging; preserve all prior expansion/configuration behavior.

## v0.10.0 — complete-novice teaching gate (owner feedback)
- The owner rejected v0.9 as insufficient for a player who has never seen the game. More detailed art or a larger count of rule topics is not evidence of teaching adequacy. Define all terms, show physical setup and component roles, teach what everyone does vs what the selecting player receives, and demonstrate exactly how to act before discussing exceptional powers.
- For card-heavy games, include a continuous scripted play-through with a single tracked player. Preserve hand/tableau/goods/VP between rounds; keep other players' choices visible and realistic for selected count. Demonstrate choosing, revealing, paying, earning, skipping, and recovering actions. Explicitly label invented practice cards, scripted choices, and any rules deferred to detailed chapters. Quizzes are optional and follow explanation, not replace it.
- Add a final real-table readiness check. Retain separate rule and expansion references for later questions, and avoid narrating every individual card. Evaluate success by whether a completely new player can set up and start the physical game without additional explanation. Actual novice/user acceptance is required; automated state tests cannot establish this.
- `python tests/race_beginner.py` validates the four-round state continuity, actual visible counts, quiz and mobile layout in addition to `tests/race_visual_matrix.py`.

## v0.11.0 — integrated hub and practice (owner decision)
- One app entry point: collection home -> game -> rule explanation -> optional practice. Preserve each game's in-session state across navigation. Offer a single offline HTML for everyday use and retain modular source in Git.
- Teaching gate for new games: complete novice can identify pieces, set up by player count/edition/expansion, understand turn and action rules through visual examples, follow a coherent legal practice scenario with meaningful choices and state feedback, and calculate end conditions/points. Do not prioritize exhaustive individual card effects over common rules. Owner acceptance and real-table tests remain separate from automated tests.
- Practice is a limited interactive scenario after teaching, not a quiz or full AI simulation. Validate legal choices/costs/capacity, carry state into the next round, give reasons for blocked actions, and support undo/reset. Clearly label omitted mechanics, scripted opponents and illustrative assets. Keep physical-game/lesson state independent.
- Nusfjord: 2-5 players, two rounds, selected core actions. Race: 5 players, four rounds, core actions; expansion mechanics taught in existing lessons, not simulated in practice. See docs/PRACTICE-COVERAGE.md.
- Next requested games: Die Macher (upgrade old prototype), Raising Robots, Euphoria, Hadara. Queue them explicitly; verify editions and rules before implementation. Do not mark as finished without complete teaching and practice coverage.
- Run node tests/scenarios.cjs and python tests/hub.py along with existing regression suites. Rebuild standalone via python scripts/build_standalone.py <output-path>. Do not claim full game/AI simulation or physical acceptance based on these tests.

## v0.12.0 신규 게임 검토판
- 디마허(2019 4선거), Raising Robots, Euphoria(기본/무지는 행복), Hadara 4개는 공통 `new-game.html` / `games/expanded.js` / `app/expanded-practice.js` / `app/expanded-ui.js`로 연결. 5인 고정은 사용자가 허용한 초기 기준이며 다른 인원은 미지원.
- 설명은 먼저 목표·세팅, 이후 턴과 주요 행동, 종료·점수. 실제 카드 인쇄 문구 우선. 독립 예시의 가상 카드를 실제 카드로 오인시키지 않는다. 기물 이동 애니메이션은 동일 ID에 연결하며, 원래 카드 이미지 복제 대신 자체 도식 사용.
- 연습은 본게임 전체 시뮬레이터가 아니다. 생략된 단계/상대/확장/임의 카드 구성은 화면에 명시. 기존 두 게임의 사용자 승인/상태를 신규 검토판에 상속하지 않는다.
- Euphoria 확장 새 시장/영입, 기존 시장/영입 모드 분리. 확장 보유 및 한국어판 실제 판본은 사용자 확인 필요. 연습은 기본 규칙 일부만 적용.
- 테스트: `node tests/expanded.cjs`; `python tests/expanded_browser.py` (standalone 위치는 환경변수 RULEMASTER_HTML), 기존 `node tests/core.cjs`, `node tests/scenarios.cjs`, `python tests/hub.py`.

## v0.13.0 — Roll for the Galaxy (owner confirms Ambition only)
- Seven games in integrated hub. Roll: original base + owned Ambition (끝없는 야망), no Rivalry. 2–5 players, default five with Ambition on; optional objectives off initially per publisher recommendation. Settings shared between Roll learning and practice frames during the session.
- `games/roll.js` supplies beginner lessons and pure practice state transitions. `roll.html` / `app/roll-ui.js` / `app/roll-style.css` supply original square-tile, phase icon, custom dice-face and cup visuals. Draw the phase strip, starting faction as two tile squares, world as one, construction stacks, Citizenry and credits. Teach phase selection vs assignment vs Dictate before reveal, and economic cycle before end scoring. Verify physical Korean wording/art with the owner before calling it accepted.
- Rules references: Rio Grande Games base rulebook pp. 1–12 and Ambition pp. 1–3 (page links within lessons). Ambition changes: black leader instead of one initial white cup die, two-phase fallback, dollar matching task completion, black/orange consumption color, optional objectives and talents, zero credits restoration. Objective component count varies by rulebook revision; follow physical box. No individual tile catalogue.
- Practice: three rounds, actual die colors/faces, scripted rolls and opponent phase choices, legal assignment/selection/Dictate, mandatory feasible jobs, construction accumulation, stock/scout (no abandon), production/trade/consume, mandatory recruitment and free recall, state/undo/reset. Special tile abilities and optional objective/talent acquisition/use are taught but not simulated. No full game opponent engine. Run `node tests/roll.cjs` and `python tests/roll_browser.py` (RULEMASTER_HTML) in addition to existing tests. Remote push still pending.

## v0.14.0 — teaching vs. table-side reminder / physical fidelity (owner decision)
- Always offer two rule-explanation paths: **처음 배우기** (assume no prior knowledge; full sequential rulemaster, moving components and representative examples) and **빠른 룰 확인** (previous players; select edition/player count/expansions, compact setup checklist, round order, common ambiguities, ending and scoring; searchable; link directly to the relevant detailed animation). Practice remains a separate optional mode. Do not force returning players to replay novice lessons.
- Share supported player/expansion settings between reminder and lesson. Never imply a 5-player-only or core-only practice supports all lesson settings. Preserve checklists per configuration and session; persist when browser storage permits.
- Owner explicitly prioritizes visual fidelity to physical components above decorative abstraction. Reference the exact owned edition and official component/board images. Match shape, aspect ratio, color, orientation, icons, layout, counts, and front/back; preserve legible explanations and deterministic moving-piece coordinates. Verify side-by-side against real photos. Use original reference links or appropriately licensed images; do not misrepresent drawn placeholders or distribute unverified third-party art. Photo assets privately uploaded by the owner stay local; allow export/import between PCs, not automatic Git upload.
- Current v0.14 implementation: all seven games have a reminder. Nusfjord gets initial component-inspired visual refinements and optional cropped fish, wood, coin, forest, unissued-share photo replacement in animated lessons; other game photos are comparison-only. Physical match of all seven games is **not complete**. Official Nusfjord component photo is online only, not embedded. Real Korean edition and exact physical art verification remain required. Existing learning and practice remain available.
- Run `python tests/quick_browser.py` (RULEMASTER_HTML), existing pure state tests and relevant browser regressions; rebuild standalone. Record concrete visual and rules coverage limits in docs/STATUS.md.

## v0.15.0 판본 및 태블릿 저장 정책
- 보유한 한국어판과 같은 판본이면 영문·독문 등 외국어판의 실물 구성품 이미지 사용 가능. 판본·확장·인쇄 구조가 다르면 혼용 금지. `app/edition-data.js`와 `docs/EDITION-ASSETS.md`에 출처와 확인 상태를 남길 것. 실물 사진과 현재 시연의 가상 게임 상태를 구분한다.
- 상단 실물 이미지 패널은 어느 게임/모드에서도 접근 가능. 원본은 네트워크에서 불러오며, 접근 실패 시 출처 링크 사용. 온라인 원본은 자동으로 오프라인 캐시에 포함되지 않는다. 한국어판 미확정 자료를 검증 완료로 표시하지 말 것.
- 태블릿 배포는 정적 PWA(`scripts/build_site.py`, Pages workflow)와 단일 HTML을 병행한다. GitHub를 소스 기준으로 하되 원격 배포 전에는 실제 URL을 제공한 것처럼 쓰지 말 것. 개인 사진/백업 데이터는 커밋 금지. 브라우저별 설정, 사진, 체크리스트만 백업 지원하며 연습 및 현재 단계는 세션 전용.

## v0.16.0 — animated table demonstrations (owner request)
- Visual motion is a teaching aid: keep the rules/state reducers authoritative. Show meaningful start/end positions, movement trails, card appearance/reveal, and rolled dice movement rather than purely ornamental transitions. Keep deterministic training dice results and scripted opponents labeled as such. No state mutation inside animation functions.
- All seven games use shared `app/motion.js` and `app/motion.css` in learn/practice screens. Allow slow/normal/fast/off and honor OS reduced-motion; speed follows game switches and persists where storage is available. A skipped animation never changes a rule result. Keep replay and undo working, and don't animate initial hidden/reset state as if it were a completed legal action.
- New remote repository confirmed by owner: `pjb3181-prog/boardgame-tutorial`. Publish only source and independently authored visuals, not private backup photos. Preserve the prior complete Git bundle separately if the initial remote import must use a source snapshot. Pages must be explicitly verified before reporting a live site.

## v0.17 — recognizable physical components
- User explicitly requires physical-component likeness, matching the Korean print's edition; same-design foreign-language photographs are acceptable. Reference the *same* component in the lesson itself rather than requiring a separate gallery search. Identify every visible major component with its recognizable silhouette, color, Korean label, and source-backed original example when available. Do not substitute a reference photo containing arbitrary card powers, resources, or a different action-board side for the live rule state. Label remote image failures and retain offline diagrams. No claim of exact Korean printing without a side-by-side check. Preserve game rules and animation keys.

## v0.18 visual asset standard
- Prefer newly illustrated, reusable component sprites over fetching source photos. Match edition, shape, color and printed layout; render rule-bearing text, numbers and icons in code. Do not pass invented illustrations off as scans or actual card art. Use transparent, independently movable sprites and offline embeds. User photos/explicit reference comparison remain optional.

## v0.19 galaxy graphics
- Continue the generated-art workflow for the two Galaxy games. Use offline reusable, independently generated illustrations with edition-aware vector frames, symbols and values; never trust AI art for rule-bearing text or dice faces. Preserve distinct physical roles of game cards, action cards and goods in Race, and cups, dice, construction tiles and phase strips in Roll. The same renderer/assets must be used by learning and practice. Do not describe invented examples as actual published cards.

## v0.20.0 — table first
- Always open learn mode with a complete whole-table placement view for the selected player count and expansions. Give one short purpose sentence in that view, then actual setup steps, then mechanics and examples. Keep quick mode and rule/practice state engines intact. Do not present a schematic as a verified exact reproduction.

## v0.21.0 — reuse illustration, not invented rules
- Generated whole-screen concepts are visual direction only. Crop decorative illustrations, redraw board silhouettes and independently render component layout, state, labels and quantities. Do not paste an AI-generated fictitious map, track, card cost or setup into a live lesson. Use the same asset renderer in practice and explanation. Keep edition uncertainty explicit, especially Die Macher 2019 vs older prints and Euphoria original vs Essential Edition.
