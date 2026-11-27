# Boardgame Tutorial / 내 보드게임 룰마스터

**Goal:** explain rules as a good in-person rulemaster would, with instant animated component demonstrations. Start with the rules, then show and optionally let learners manipulate the pieces. Build coverage for the owner's entire board-game collection.

## Quick start

Open `index.html` in a browser. For full development and navigation use a static server:

```sh
python -m http.server 8000
```

Open http://localhost:8000. No required API or account. Korean TTS uses the browser/system voice and may depend on the installed voice.

## Pilot and status

- **Nusfjord Big Box (2024)**: first validation target. `nusfjord.html` shows 22 rule-teaching chapters covering common setup, all 11 common action types, elder use, dividends, imitation, round changes and scoring. A global 2–5 player selector (default 5, remembered where local storage works) controls all player-count-dependent setup and rule examples: actual action-board capacities and imitation spaces, banquet, elder/ship/building counts, whole-table kits and turn-order tile allocation, round additions and private C cards. Count-independent actions still use representative individual examples, not one continuous game. Solo, expansion-deck specifics and physical play validation remain pending. Individual card effects are not an exhaustive teaching target; use the printed cards. Official rules: https://www.lookout-spiele.de/en/games/nusfjordbigbox.html (pp. 4–15 and elder reference pp. 18–19). No official artwork or scans distributed.
- **Die Macher**: previous v0.3.0 retained at `die-macher.html` and `practice.html`; incomplete; Korean-edition verification remains outstanding.
- Other collection entries are backlog, not implemented games.

## Cross-computer Git workflow

Proposed remote: `https://github.com/pjb3181-prog/boardgame-tutorial`. Create the empty repository (no initial README) and push existing history. On another computer clone the remote once, then pull before changes. Do not rewrite shared history. Each task should update `docs/STATUS.md` and `AGENTS.md` if decisions change.

```sh
git remote add origin https://github.com/pjb3181-prog/boardgame-tutorial.git
git push -u origin main
```

GitHub Pages can serve the static app after upload. Remote creation/upload remains pending as of this release.

## Source

- `index.html`, `games/catalog.js`: collection landing page and owned/pending game backlog.
- `nusfjord.html`: pilot UI.
- `games/nusfjord.js`: deterministic chapter initial states, narration/action frames and context panels.
- `app/rulemaster.js`: playback, SVG schematic renderer, pointer handling, TTS. Currently renderer is Nusfjord-specific; extract it as game coverage grows.
- `die-macher.html`, `practice.html`, `games/die-macher.js`, `app/engine.js`, `app/visuals.js`: preserved Die Macher prototypes.
- `AGENTS.md`, `docs/STATUS.md`: product decisions, acceptance criteria and handoff.

## Tests

```sh
node tests/core.cjs
python tests/practice.py
python tests/nusfjord.py
python tests/player_counts.py
```

The Nusfjord browser test builds an inline HTML copy for environments that block file/localhost navigation. Real cross-page navigation requires an ordinary browser. See status for known gaps.

## v0.8.0 — 레이스 포 더 갤럭시 추가

`index.html`에서 누스피요르드 또는 레이스 포 더 갤럭시(`race.html`)를 선택합니다. 누스피요르드 v0.7.0은 사용자 설명 방식 검증을 마쳤으며 기존 소스를 유지합니다. 디마허는 기존 시제품으로 남아 있습니다.

레이스 포 더 갤럭시는 구판 기본판 및 첫 확장 아크 3종(개더링 스톰, 레벨 대 임페리움, 브링크 오브 워)의 누적 구성을 지원합니다. 최초 실행은 3개 확장 포함 5인, 기본판만 선택 시 4인입니다. 허용 인원 범위 안에서 변경할 수 있으며 점령 선택, 2인 숙련 규칙도 반영됩니다. 개별 카드 설명을 전수 제공하지 않고 준비, 행동, 목표, 점령, 명성·검색, 종료와 점수의 공통 규칙을 시연합니다.

`games/race.js`는 독립 설명 장면, `app/card-rulemaster.js`는 카드형 SVG 재생 엔진입니다. `python tests/race.py`로 구성별 검증을 실행합니다. 실제 한국어판 카드·용어 일치 및 사용자 실전 설명 검토는 남아 있습니다. 공식 구판 영문 규칙서와 별도 확장 규칙서를 참조하되, 아트는 직접 그린 도식입니다. 솔로/드래프트 규칙 및 모든 개별 카드 효과는 제외합니다.

## v0.9.0 — 레이스 포 더 갤럭시 초보자용 카드 시각화 개선

구성품 비교, 카드 한 장 확대, 상품 4종/판매 가격을 독립 설명 주제로 추가했습니다. `app/card-visuals.js`에서 카드·토큰의 실물 기호 배치와 독립 벡터 아트를 렌더링합니다. 화면의 기물을 클릭하거나 하단 이름 버튼을 누르면 확대 및 기호 설명을 볼 수 있습니다. 원본 카드의 그림이나 능력을 복제한 것이 아니라 설명용 가상 예시이며, 출판사 규칙서의 실물 사진과 기호 도판 링크를 제공했습니다. 설정 및 기존 설명 흐름, 누스피요르드/디마허는 유지됩니다. `python tests/visual_race.py`, `python tests/race_visual_matrix.py`로 확대, 실제 드래그, 모바일, 전체 설정 데이터 및 대표 설정의 모든 설명 렌더링을 검증합니다.

## v0.10.0 — 레포갤 완전 초보자 설명 개편

처음부터 순서대로 진행하면 게임의 목표, 구성품 구분, 카드의 세 가지 용도, 카드 읽기, 인원·확장별 세팅, 단계 선택을 배운 뒤 같은 손패와 제국으로 1~4라운드를 이어서 시연합니다. 행동 카드 공개, 탐사, 개발, 정착, 생산, 판매, 소비를 설명하면서 손패/제국/상품/VP 칩 수가 일치하게 움직입니다. 실제 카드가 아닌 가상 예시와 정해진 상대 선택을 쓰며, 전체 디지털 게임은 아닙니다. 확장별 기존 설명과 상세 규칙은 유지하고 마지막에 실제 게임 준비 확인을 제공합니다. 기본 5인/확장 3종/점령 OFF 설정에서 총 38개 주제입니다. `python tests/race_beginner.py`와 `python tests/race_visual_matrix.py`를 실행해 연속 상태 및 설정을 검사합니다. 실제 초보자 검증은 남아 있습니다.

## v0.11.0 — 통합 홈 및 연습게임

이제 `index.html` 하나에서 게임 선택, 룰 설명, 연습게임을 전환합니다. 한 번 열었던 화면은 앱을 닫기 전까지 유지됩니다. 인터넷/서버 없이 실행하는 단일 파일도 생성할 수 있습니다.

```sh
python scripts/build_standalone.py rulemaster-standalone.html
node tests/scenarios.cjs
python tests/hub.py
```

누스피요르드 2~5인 첫 2라운드 및 레포갤 5인 첫 4라운드 연습은 설명용 제한 시나리오입니다. 직접 행동 선택, 자원과 비용 검증, 진행 상태, 상대 행동 및 되돌리기를 지원합니다. 레포갤 확장 3종은 기존 룰 설명에서 계속 지원하지만 연습은 기본 행동만 다룹니다. 전체 범위와 생략 사항은 `docs/PRACTICE-COVERAGE.md` 참조. 디마허는 이전 시제품으로 유지하며 레이징 로봇, 유포리아, 하다라를 다음 제작 대상으로 표시합니다.

## v0.12.0 (신규 검토판)
기존 누스피요르드/레포갤을 유지하고 통합 홈에 다음 게임을 추가했다. 신규 4개는 5인으로 고정했다. 모든 화면은 설명용 자체 도식이며 실제 카드/보드 원본이나 전체 디지털 게임은 아니다.

| 게임 | 설명 주제 | 연습 범위 |
|---|---:|---|
| 디마허 2019년 4선거판 | 18 | 지역 선거의 언론·유세·여론·여론조사·표 계산 |
| Raising Robots | 13 | 에너지 카드 배정, 배터리, 조립과 설계 일부 |
| 유포리아 | 14 또는 16 | 기본판 공유 상품 생산, 회수, 지식 검사 |
| 하다라 | 12 | 시대 I A/B 카드 구매/판매, 수입, 식량, 메달 (식민지/조각상은 생략) |

`python scripts/build_standalone.py /path/to/rulemaster.html`로 여섯 게임을 하나의 오프라인 HTML로 패키징한다. 각 게임의 신규 설명 화면에 원문 규칙 링크를 붙였다. 유포리아는 확장 2가지 구성을 설명하는 선택 메뉴가 있으나 연습은 기본 규칙 일부만 다룬다. 세부 카드 효과, 한국어판 용어 및 실제 배치/판본 대조, 신규 게임 실물 플레이, 다중 인원 세팅 검증이 남아 있다. GitHub 원격은 미연결.

### v0.13.0: 롤 포 더 갤럭시
- 통합 홈에서 일곱 번째 게임 선택. 기본판/끝없는 야망 및 목표 ON/OFF, 2~5인(기본 5인) 지원. Rivalry 미포함.
- 17/19/21개 설명 주제, 주사위 6면 확대, 행동 배정과 선택, 명령, 공개, 5가지 행동, 시민 구역/모집/회수, 확장 두 기호/$/목표, 종료와 점수.
- 3라운드 연습은 실제 규칙 일부와 가상 타일/고정 굴림/상대 행동을 사용. 목표·재능은 룰 설명에서 제공하나 연습에서는 미구현. 한국어 실물 대조 및 사용자 검토 전.
- `node tests/roll.cjs`; `RULEMASTER_HTML=/path/to/standalone.html python tests/roll_browser.py`; `python scripts/build_standalone.py /path/to/standalone.html`.

## v0.14.0 — two ways to learn + physical-reference photos

Choose **처음 배우기** for full illustrated rules or **빠른 룰 확인** for a searchable table-side reference (setup checklist, round order, common confusions, end/scoring). All seven games support both, with direct links from quick entries to detailed lesson scenes. **연습게임** stays separate. Supported setup/expansion selections transfer between lesson and quick reference. Nusfjord/Race/Roll have count options; the other four retain the five-player review scope.

The new **실물 사진** tab links reference rules, lets you compare private photos, and exports/imports per-game photo JSON for use on another PC. For Nusfjord, cropped fish/wood/1-coin/forest/unissued-share images can replace animated component shapes. Nusfjord's redrawn tokens and boards are approximate, original-inspired teaching graphics, not scans. The publisher photo is loaded only on request online; all ordinary teaching and reminder content remains offline. Photo replacement in other games and exact Korean artwork matching remain incomplete. No images are automatically sent to GitHub.

## v0.15.0 — 판본별 원본 자료와 태블릿 배포 준비
- `실물 이미지` 버튼에서 보유판 기준/비교 항목, 원본 구성품 사진 확대 및 규칙서 도판을 확인한다. 한국어판과 동일 판본이면 외국어 사진 사용 가능. 다른 인쇄의 자료는 후보로 표시하고 자동 대체하지 않는다. 외부 사진은 온라인 링크로 제공되며 실제 시연 기물의 원본 교체는 별도 작업이다.
- `저장·백업`은 모든 게임의 설정, 개인 사진, 세팅 체크리스트를 JSON으로 내보내고 다른 기기에 가져온다. 브라우저 로컬 저장이며 자동 기기 간 동기화는 없다. 열린 연습이나 현재 시연 단계는 백업하지 않는다.
- `python scripts/build_site.py dist`로 PWA 배포 파일을 만든다. GitHub Actions Pages 배포 workflow 추가. GitHub 저장소 생성/업로드/Pages 설정 및 실제 태블릿 검증은 남아 있다. `docs/DEPLOYMENT.md`, `docs/EDITION-ASSETS.md` 참조.

누스피요르드 설명 화면의 `실물 질감 적용` 버튼은 2024 빅박스 공식 사진에서 숲과 목제 1금화 영역을 잘라 움직이는 기물의 질감으로 표시하도록 시도한다. 사진 비율 검사와 로딩 실패 시 도식 복귀, 사용자 등록 사진 우선 적용을 지원한다. 실제 원본 서버 접근은 이 환경에서 확인하지 못했으므로 온라인 질감 동작은 실기기 검증 대상이다. 정밀 원본 기물의 전수 교체는 아직 미완료이다.

## v0.16.0 — 시연 애니메이션 강화
일곱 게임의 룰 설명과 연습게임에 공통 애니메이션을 적용한다. 누스피요르드 및 Race SVG 시연은 주요 기물의 출발·도착 경로를 표시하고, 카드 공개는 펼쳐지는 모션을 적용한다. Roll 연습의 실제 굴림 동작은 컵에서 배정되는 주사위의 회전과 이동을 보여 준다(결과는 기존 결정론적 연습 규칙 그대로). 다른 게임의 기물 이동, 추가/삭제 및 카드 등장도 보강한다. `시연 속도`에서 천천히/보통/빠르게/끄기를 선택한다. 시스템의 동작 줄이기 설정도 준수하며 시연은 기존 게임 상태를 변경하지 않는다. 설정은 동일 브라우저에서 가능한 경우 유지된다.

`python scripts/build_standalone.py /path/to/rulemaster.html` (파일 실행), `python scripts/build_site.py dist` (웹/PWA), `python tests/motion_browser.py` (Chromium 테스트). 실제 출판사 원본 이미지 전수 교체, 초보자의 실제 게임 검증, 확장 연습 및 태블릿 실기기 검증은 별도 과제다.
