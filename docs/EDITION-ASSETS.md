# 구성품 이미지 판본 관리 — v0.15.0

원칙: 한국어판과 같은 판본의 외국어 이미지 사용 허용. 판본은 출시 연도만으로 확정하지 않고 카드 프레임, 보드 위치, 기물, 확장 구성, 규칙 구조를 대조한다. 판본이 다르면 이미지도 별도 관리. 이름이 같아도 리테마/리뉴얼/합본을 혼용하지 않는다.

`app/edition-data.js`에 게임별 기준 판본, 상태, 제외 판본, 실제 원본 사진 주소와 출처, 비교할 항목, 관련 규칙서 도판을 기록했다. 모든 모드 상단의 실물 이미지 버튼을 통해 실제 사진을 확인하고 확대할 수 있다. 사진은 실제 플레이 중인 상태와 일치하지 않는 참고 예시다. 온라인 사진은 원본 서버가 허용하는 경우에만 표시되며, 원문 링크로 대체할 수 있다. 이 작업 환경에서는 원본 파일 내려받기가 제한되어 번들에 원본 이미지 바이트를 넣지 않았다. 공개 배포 시 그림의 사용 조건도 확인해야 한다.

| 게임 | 적용 대상 | 구분할 판본 | 이미지 적용 현황 |
|---|---|---|---|
| 누스피요르드 | 2024 Big Box | 2017 본판 | 출판사 사진 3개, 공식 도판 링크 |
| 레이스 포 더 갤럭시 | 2007 구판 + 개별 확장 3종 | 시작 행성 11장 신판, 2022 합본 | 2017 구판 사진 3개, 개별 규칙서 링크 |
| 롤 포 더 갤럭시 | 2014 본판 + 2015 Ambition | Rivalry | Ambition 실물 자료 1개, 원본 규칙서 링크 |
| 디마허 | 2019 개정 규칙 4선거 | 이전 판 및 기타 판본 | 규칙서와 판본 정보, 보유판 미확정 |
| 레이징 로봇 | Raising Robots 본판 | 기타 인쇄/확장 | 독일어판 후보 사진 1개, 공식 규칙서 링크 |
| 유포리아 | 구판 + 무지는 행복 | Essential Edition | 구판/확장 원문 링크, 정확한 보유판 대조 필요 |
| 하다라 | 2019 기본판 계열 | 다른 아트 인쇄 | 공식 구성품 사진 3개, 원문 링크 |

한국어판 실물과의 완전 일치는 별도 검증 대상. 출판사 사진에 나온 예시 자원이나 카드 배치를 게임 상태 위에 겹쳐서 실제 현재 상태인 것처럼 표시하지 않는다. 시연의 이동 기물은 아직 기존 도식이며, 누스피요르드의 기존 사용자 등록 이미지 교체 기능은 유지한다. 추후 판본 확인 및 적법한 원본 확보 시 기물별 자산 파일로 적용하고 크기와 투명 배경을 확인한다.

누스피요르드 설명 화면의 `실물 질감 적용` 버튼은 2024 빅박스 공식 사진에서 숲과 목제 1금화 영역을 잘라 움직이는 기물의 질감으로 표시하도록 시도한다. 사진 비율 검사와 로딩 실패 시 도식 복귀, 사용자 등록 사진 우선 적용을 지원한다. 실제 원본 서버 접근은 이 환경에서 확인하지 못했으므로 온라인 질감 동작은 실기기 검증 대상이다. 정밀 원본 기물의 전수 교체는 아직 미완료이다.

### v0.17 scene-linked visual references
- Nusfjord Big Box, Lookout/Asmodee 2024 product page and official components pp.2–4; https://store.asmodee.com/products/nusfjord-big-box ; https://www.gamesmen.com.au/nusfjord-big-box-edition-board-game (reserve/forest detail). The 2024 component photo, not the 2017 edition, is used as a visual reference.
- Race for the Galaxy 2007-family: 2017 Moth Meeple unboxing, 0–4 starting worlds at https://www.bigcream.it/it/Giochi/race-for-the-galaxy.html ; 2017 action cards at https://martinfowler.com/articles/race-san-juan.html . Actual face designs used as reference, not substitute for fictional lesson cards or licensed artwork.
- Roll base 2014: https://gamers-hq.de/en/board-and-cardgames/games-by-publisher/rio-grande-games/roll-for-the-galaxy/roll-for-the-galaxy-en (product components); https://www.ludonauta.es/juegos-mesas/roll-for-the-galaxy-2014 (phase strip photo); https://www.gamenerdz.com/roll-for-the-galaxy-ambition-expansion (Ambition specific). No Rivalry reference photos. External image links may fail; show a schematic thumbnail and source link in that case. All image rights stay with owners; do not re-host unlicensed original artwork in public repo.
