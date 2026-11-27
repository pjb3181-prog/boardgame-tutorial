# 태블릿 사용 및 GitHub 배포 (v0.16.0)

## 현재
- 이 대화에서 제공하는 단일 HTML은 인터넷/설치 없이 실행할 수 있다. Android는 Chrome 또는 Samsung Internet 등 HTML 실행을 지원하는 브라우저로 열기. iPad의 파일 미리보기는 스크립트를 실행하지 못할 수 있다.
- 원격 저장소 `pjb3181-prog/boardgame-tutorial`의 생성 및 쓰기 권한은 확인되었다. 실제 업로드 및 Pages 상태는 GitHub에서 확인한다. Git bundle에는 모든 기존 이력과 최신 커밋이 들어 있다. 소스 ZIP은 Git 이력이 없는 배포용 소스 스냅샷이다.

## 권장: GitHub + 고정 주소 + PWA
1. GitHub 계정에 빈 `boardgame-tutorial` 저장소를 생성한다. 개인 자료나 사진은 커밋하지 않는다. GitHub Free로 Pages를 사용하려면 공개 저장소가 필요하고, 유료 플랜의 비공개 저장소에서 Pages를 사용하더라도 사이트가 공개일 수 있다. 공개 여부 및 이미지 권리를 먼저 판단한다. 비공개가 우선이라면 별도의 접근 제한 호스팅 또는 단일 HTML 사용을 권장한다.
2. 최신 bundle을 다운로드해 이력을 복원한다. (기존 저장소에 강제 덮어쓰기 금지.)

```sh
git clone -b main boardgame-tutorial-v0.16.0.bundle boardgame-tutorial
cd boardgame-tutorial
git remote set-url origin https://github.com/pjb3181-prog/boardgame-tutorial.git
git push -u origin main
```

3. GitHub 저장소 Settings → Pages → Source: GitHub Actions. 포함된 workflow가 `main`의 변경으로 PWA 배포 폴더를 빌드한다. 최초 푸시 이후 Actions의 Publish Rulemaster to Pages에서 직접 Run workflow도 가능하다. 배포 성공 후 Pages에 표시된 URL을 사용한다. 예상 주소는 `https://pjb3181-prog.github.io/boardgame-tutorial/`이며 배포 전에는 접속할 수 없다.
4. 태블릿에서 주소 접속 후 홈 화면에 추가. HTTPS에서 초기 앱 설치/캐시가 완료되면 기본 시연과 연습은 오프라인에서도 실행된다. 외부 사진 및 PDF는 별도 인터넷 연결이 필요하다.

## 로컬 PWA 빌드
`python -m pip install pillow` 후 `python scripts/build_site.py dist`. 결과는 완전한 정적 웹 앱 (index.html, manifest, sw, 2개 아이콘). HTTP(S) 서버로 제공해야 PWA 설치가 된다. 파일 하나 실행 시 기존 standalone HTML 사용. 실제 태블릿 브라우저의 설치와 오프라인 정책은 기기별로 다르므로 별도 실기기 검사 필요.

## 무엇이 저장되는가
- 앱 소스/룰 데이터: 원격 연결 후 GitHub. PC마다 clone/pull/commit/push. 태블릿은 설치된 웹앱에서 온라인 최신판 확인.
- 인원/확장/등록 사진/세팅 체크리스트: 브라우저 로컬 저장소. 다른 PC와 자동 동기화되지 않는다. 새 기기에서는 상단 `저장·백업` → 전체 설정·사진 백업 JSON을 가져오기. 이 JSON은 개인 자료이므로 공개 저장소에 넣지 않는다.
- 연습게임과 설명의 진행 단계: 열린 세션에서 유지. 새로고침/재접속/백업 복원 때 재시작 가능. 백업에 포함하지 않는다.
- 저장 실패 시 (로컬 파일 제한, 저장 용량 초과 등) 가능한 현재 세션 데이터로 백업. 브라우저 데이터 삭제에 대비해 백업 파일을 별도 보관.
- 온라인에서 제공하는 실제 제품 사진과 공식 PDF는 출처 링크를 관리하며 다운로드/재배포 권한 확인 전 파일에 포함하지 않는다.

GitHub Pages 참고: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
