# Project status — v0.4.0 (2026-11-26)

## Product decisions
- Personal board-game collection rulemaster. Rules explanation FIRST; synchronized piece movement, highlights, replay, optional direct manipulation and TTS. Not a quiz-first app or full online board game.
- Pilot: Nusfjord Big Box (2024), base game, because owner already knows rules and can validate the teaching quality. Die Macher preserved and will follow.
- Cross-PC development via GitHub `pjb3181-prog/boardgame-tutorial` (planned; repository not created at inspection). Public code with independently authored art and text, no publisher scans. Offline static web; no required API cost.

## Implemented in v0.4
- Collection landing page: Nusfjord and Die Macher playable prototypes; ten additional known owned titles shown as planned. Collection is incomplete and editions still need confirmation. Race for the Galaxy pending transaction completion.
- Nusfjord: 7 independent teaching chapters, chapters 2–6 with animated movement, and first/last conceptual overviews. Purpose/scoring overview; individual setup; initial fishing; worker placement and thinning; deforestation; issuance/shares. Stable piece IDs, snapshot playback, highlighted zones, replay, pointer drag for selected moves, optional browser Korean speech, previous/next navigation.
- Standalone offline HTML generated separately for evaluation. Full source and previous Git history preserved. Original schematic artwork, not scans.
- Rules: official 2024 Big Box English rulebook pp. 5, 6, 8, 11–12, 15. Korean terminology provisional; visual locations simplified. Examples fixed at three players; not a full round simulator.
- Existing Die Macher table guide and three practice missions retained at die-macher.html and practice.html.

## Test results
- PASS: original core flow and practice tests; Nusfjord inline-browser chapter navigation, setup, real pointer drag, first fishing allocation, replay, thinning, deforestation, issuance, 390px viewport width and no JS errors. TTS audio and physical play not validated.

## Validation gaps and next work
1. Owner judges explanation order, voice/pacing, visual fidelity, clarity and whether basic concepts are covered before individual rules. Obtain real component photos or design references to improve layout without copying copyrighted art into public repository.
2. Complete central setup (player count variations, A/B/C decks, turn order and banquet), remaining common actions (reserve, serving fish, building, ships, elder recruitment/use, reforest, share purchase, imitation), fishing edge cases and round-specific changes/scoring. Expansion decks separate. Verify terminology with the user's Korean translation.
3. Build one coherent full first-round example after all foundational rules are explained, then practical shared-table mode. Keep teaching scenarios independent from physical game data.
4. Extract reusable renderer/scene schema; add game content only after pilot acceptance.
5. Create the remote repository and push existing commits; enable Pages after verifying all navigation. Remote not created or uploaded yet.

# v0.5.0 update — rule coverage expansion
- Added 12 chapters, total 19; removed the former “future work” outline. Reordered explanation around purpose/setup, catch, work actions, linked banquet/elder actions, mid-game dividend distribution, occupancy/copy, returning home and scoring.
- Added schematic cards/ship tiles/elder cards/banquet plates/other-player shares/score counters, a secondary action panel, and targeted additional scene areas. First non-movement narration appears immediately; the next button no longer repeats it. Controls moved above the board. Rulebook links now include the relevant start page.
- Verified official 2024 Big Box English base rulebook pp. 4–15, including the 7-plate banquet cost order and schooner example; specific elder effect demonstration referenced p.13. See `docs/NUSFJORD-COVERAGE.md` for per-topic coverage and remaining gaps.
- Tests: core and Die Macher practice pass; browser test now covers all 19 chapters and every narration transition, validates all patch/drag references, real pointer drag for fishing, state counts for resource moves, share purchase/issue, reforestation, ship, banquet, elder recruitment/reward/settlement, later dividends, imitation, returning home and score. Mobile width and JS runtime pass. Owner review, Korean edition names, solo, expansions, every individual card effect, physical play and remote upload remain pending.

# v0.6.0 update — setup before card-specific detail
- Owner priority: detailed setup is essential; explaining every individual elder or building card is excessive. Keep representative examples of shared action rules.
- Added 2–5 player selection shared by three setup chapters: common components, numbered elder stacks, and A/B/C building supply. Total 21 chapters. Independent SVG close-ups animate component placement, card fronts/backs, stacked elders, counts and face-up display.
- Ordinary base setup: 2/3/4/5 players use elders 1–7/1–9/1–12/1–18; 5 players randomly put 13–18 face down beneath the six stacks. Choose one 44-card building deck, separate and shuffle A18/B12/C14, reveal A9/B6. 2p returns surplus A/B to box; other counts retain them. Round 3 A additions, round 4 private C, round 5 B additions, round 6 public C are summarized by player count. Source official 2024 Big Box rulebook pp. 2,4–5,9,18–19.
- Browser tests PASS: 21 chapters, every frame, player selector persistence within setup, all four setup counts, elder positions/face-down state, A/B/C visible and reserve counts, existing action state tests, pointer drag, mobile width, JS runtime. Korean terminology, exact physical component resemblance, TTS audio and physical play remain unverified. Other action examples remain independent and mostly 3-player. Remote creation/upload pending.

# v0.7.0 update — player count across every lesson
- Owner requested actual player-count-specific setups, otherwise a consistent 5-player guide. Implemented one persistent global 2–5 player selector, default 5. Changing count restarts current lesson with rebuilt chapter states; selector remains available in every lesson.
- Added whole-table kit/turn-order setup chapter (22 chapters total). Each count shows matching player kits (harbor/council/supply, 3 workers, 5 shares, 4 forests per person), correct number/shape of turn-order tiles, round assignments, first-player ship; schematic not exact edge artwork.
- Redesigned common setup as banquet left, action board middle, ship/elder board right; number/capacity badges and imitation tile reflect selection. Ship/elder/building counts and remaining piles from v0.6 retained. Later action panels show count-specific capacities; no copy for 2/3p, one general slot 4p, three column slots 5p. Banquet example pays according to selected initial plates. Replaced high-count-only elder sample with #7 available to all counts. Round-change example adapts A/B additions, C hand counts and public reveal, including zero A/B replenishment in 2p.
- Official English Big Box rulebook pp. 2–5,8–11,14,18 rechecked. 2–5 base multiplayer scope only. All other examples are independent, count-neutral one-player views, not a full continuous legal match. Korean terms, exact physical art, TTS and real-game validation still pending; no remote upload.
- Regression: `node tests/core.cjs`, `python tests/practice.py`, `python tests/nusfjord.py`, `python tests/player_counts.py` pass. Tested every frame in all four counts, switching counts and returning to 5, selected setup pieces/turn tiles, capacities, imitation, round-specific C visibility and A/B counts, pointer drag, mobile widths and runtime errors.

## v0.8.0 — second rulemaster game
- Owner accepted Nusfjord v0.7 as sufficient and requested Race for the Galaxy with all three owned first-arc expansions, default 5 players. Preserve Nusfjord and Die Macher files.
- Added `race.html`, `games/race.js`, and `app/card-rulemaster.js`. Collection catalog and `index.html` link the new game. Four cumulative configurations; setup is count-dependent; takeover and 2p advanced options. Default all expansions, five players, takeover off. Coverage checklist in `docs/RACE-COVERAGE.md`.
- Original rulebook cross-check. Teaching content has representative schematic cards and independent scenes, not full game simulation. User review, Korean terminology and physical-edition validation pending.
- GitHub search found no `boardgame-tutorial` repository on connected account; local Git history/bundle retained for import. No remote upload yet.
- Tests: `tests/race.py`, `tests/core.cjs`, `tests/player_counts.py`, `tests/practice.py` passed. `tests/smoke.py` was blocked by the execution environment (`ERR_BLOCKED_BY_ADMINISTRATOR` on localhost); no change was made to the Die Macher guide.

## v0.9.0 — Race visual detail for new players
- The owner has never played Race and requested more detailed pictures. Rebuilt card art and component visuals, added three beginner chapters, added a component inspector and revised setup graphics. Default five players with all three expansions remains unchanged. Existing game files outside Race, catalog landing page, and docs are untouched. Exact Korean printing and user explanation sufficiency remain unverified. No remote push has been performed.

## v0.10.0 — Race complete novice teaching
- User explicitly challenged explanation sufficiency for a player with no prior knowledge. Reordered introductory lessons (goal, components, roles, anatomy, physical setup, round principle), clarified hand selection and setup card numbering, and added a moving-card demonstration of three game-card roles.
- Added four continuous scripted rounds: explore/develop, settle/produce, trade/produce, explore/consume x2. Visible action choices adapt to selected player count. Tracked hand/tableau/goods/VP chips persist across rounds, with explicit calculations and costs; three optional comprehension questions, final real-table readiness checklist. Standard action-selection examples (experienced 2-player variation taught separately); all cards and opponent decisions illustrative. Existing expansion-specific and detailed lessons retained. Default all three expansions, 5 players, takeover off (38 topics).
- Tests: 33 configurations, 1113 chapter instances, 4265 frame instances, representative browser scenes, tracked-state continuity and actual card counts, quiz, mobile width passed. No claim of novice acceptance or complete simulation. Actual Korean card artwork/terminology, real five-person physical play, and GitHub remote upload remain unverified/pending.

## v0.11.0 — integrated app and interactive practice
- Owner requested an integrated top-level screen, short playable scenarios for Nusfjord and Race, and next modules for Die Macher, Raising Robots, Euphoria and Hadara. Home/navigation and two new practice scenarios implemented. Other requested games are queued, not complete; prior Die Macher prototype preserved.
- Single `index.html` hub with cached lesson/practice frames, home and game switching, and direct mode navigation; in-session state is retained. `scripts/build_standalone.py` packages the app in one offline HTML. Existing lesson data and renderers remain unchanged.
- `app/scenarios.js`, `app/scenario-ui.js`, `scenario.html`: two-round Nusfjord practice (2–5 players) and four-round Race practice (5 players). Actual choices and validation, state carryover, undo/reset, feedback, scripted opposition and explicit omitted rules. Race practice is core rules only; all three expansions are still taught in the existing guide. See `docs/PRACTICE-COVERAGE.md`.
- Tests PASS: `node tests/core.cjs`, `node tests/scenarios.cjs` (320 Nusfjord and 120 Race paths), `python tests/hub.py` (standalone content in Chromium, route switching, clicks/payment, undo/reset, mobile), `python tests/player_counts.py`, `python tests/race_beginner.py` (existing lesson regression). Full physical play, actual Korean-card matching, novice approval, full AI gameplay and remote upload remain pending.

## v0.12.0 · 2026-11-27 KST
- 6개 게임 통합 홈 / 게임별 설명·연습 선택. 누스피요르드, Race 코드와 기존 연습 유지.
- 새 게임 4종 5인 규칙 설명, 프레임 기반 기물 시연·클릭 확대·브라우저 음성 읽기·연습 취소/리셋 구현. 57개 기본 주제 + Euphoria 확장 2개 주제. 신규 설명은 사용자 검토 전.
- 출처: 각 신규 설명 화면의 `규칙 출처`; Die Macher 2019 영문 규칙, Nauvoo Raising Robots 영문 규칙, Euphoria 구판 규칙 전사와 확장 규칙 PDF, Z-Man Hadara 영문 규칙. 판본/한국어 용어 대조 미완료.
- 새 연습 494개 완료 경로 (디마허 54, 로봇 200, 유포리아 120, 하다라 120; 후자 2개는 결정론적 샘플링). 신규 4종 브라우저 설명 단계, 선택/완료, 카드 확대, 실행 취소/초기화, 유포리아 모드 변경 및 모바일 폭 확인. 기존 로직 테스트 440개 경로 통과.
- 한계: 가상 카드·간략 상대 행동. 연습은 전체 게임 구현이 아님. 디마허 실제 VP 표 및 다른 지역, Raising Robots 다른 단계, Euphoria 영입/시장/확장, Hadara 식민지/조각상과 시대 II/III는 연습에서 제외. 음성 한국어 음질은 기기 TTS에 의존, 미청취. 신규 게임의 모든 세부 규칙과 실제 한국어판 기물 배치는 사용자와 함께 추가 검증 필요.

## v0.13.0 — Roll for the Galaxy + Ambition
- Added seventh game with base, Ambition without objectives and Ambition with objectives. Owner confirmed only Ambition (no Rivalry). 2–5 players, default 5 / Ambition / objectives off; 17/19/21 lessons. Hub and offline build include both modes, session configuration transfers.
- Official RGG rulebooks and smaller PDF mirror illustrations (base pp. 2, 3, 12; Ambition pp. 2–3) checked. New scenes use original graphics, not scans. In-person terminology, real printed tiles and novice acceptance are pending.
- Tests: 12 configurations, 616 lesson frame instances rendered in Chromium; 160 sampled completed scenarios, 5573 validated actions plus targeted checks of dual faces, matching $ faces, delayed goods return, color bonuses, mandatory recruiting. Browser checks complete 3-round scenario, error, undo/reset, inspector, settings transfer, 390 px width. Old core/scenarios/expanded node tests pass. Existing game source retained. Remote not uploaded.
- Limits: scripted opponents and face rolls; illustrated fictional tiles; no individual powers, abandoned tile selection in practice, optional objectives/talents practice, or full game simulation. Objective/talent rules are explained and illustrated in lessons when enabled.

## v0.14.0 — beginner and table-side reminder
- Owner requests separate novice and returning-player rule explanation plus close visual fidelity to actual components. All seven games have three paths in one hub: novice learning, quick reference, and optional practice. Quick includes current supported player/expansion selectors, setup counts/checklist, sequence, common questions, ending/scoring, keyword search, and direct jump to an existing teaching scene. Four newer modules still target five players. Rule summaries are derived from existing English references; Korean-edition and user validation pending.
- Quick/lesson setting bridge and per-configuration checklists, local browser persistence when permitted, session fallback. Photo import/comparison and JSON export/import for seven games. For Nusfjord, five cropped component types may replace animated teaching graphics; private images stay in the browser. Official Lookout Big Box component photo is linked and loaded online only. No scans bundled. New forest/wood/plate/board/fish/coin styling is original schematic art based on the reference, not exact reproduction. Remaining six games' animated art is unchanged; real physical fidelity is not complete.
- Full quick browser run passed all 106 reminder-to-lesson links across seven games, checklist/search/config changes, photo injection/removal and mobile width, zero runtime errors. Core/scenarios/expanded/roll node tests, standalone hub and Nusfjord player-count regressions pass. Sandbox blocks actual file:// navigation; packed HTML exercised with Chromium set_content. Browser persistence across restarts and fetching the official remote photo could not be verified in this environment. Existing practice scope limitations and pending GitHub remote remain unchanged.

### v0.15.0
7개 게임의 기존 설명·빠른 확인·연습 유지. 판본별 실물 참고 사진 및 출처 관리, 앱 전체 설정/개인 사진/체크리스트 JSON 이동, PWA 웹 배포 빌드 추가. 보유판 한국어 인쇄 세부 대조와 실제 이동 기물 원본 적용은 미완료. 인터넷 원본 다운로드 제한으로 온라인 이미지 URL 및 도판 링크만 사용. GitHub 원격 생성/푸시/Pages 활성화 전.

누스피요르드 설명 화면의 `실물 질감 적용` 버튼은 2024 빅박스 공식 사진에서 숲과 목제 1금화 영역을 잘라 움직이는 기물의 질감으로 표시하도록 시도한다. 사진 비율 검사와 로딩 실패 시 도식 복귀, 사용자 등록 사진 우선 적용을 지원한다. 실제 원본 서버 접근은 이 환경에서 확인하지 못했으므로 온라인 질감 동작은 실기기 검증 대상이다. 정밀 원본 기물의 전수 교체는 아직 미완료이다.

## v0.16.0 — teaching motion
- User created public `pjb3181-prog/boardgame-tutorial` and asked for more animation. Shared motion helpers added to all seven learn/practice routes. SVG travel paths/arrival marks, card reveal, HTML keyed piece movement/appearance/departure, Roll practice dice rotation. Shared four-speed selector, OS reduced motion, cross-game session/storage sync. Rules/state engines unchanged; prior rendering, edition references and quick mode retained.
- Browser checks: actual SVG trails, speed/off and cross-game sync, actual dice animation keyframes, undo, all seven learn/practice routes, Race payment, Nusfjord token update, 768px viewport. Browser runtime verified with packed HTML injected into Chromium, not physical tablet. Animation coverage is representative, not a guarantee every component is physically exact or every transition has a custom animation. Repository creation confirmed; Pages setup and remote state must be verified separately.
