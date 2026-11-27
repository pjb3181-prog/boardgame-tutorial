/* Backlog based on confirmed collection records; incomplete until owner review. */
const COLLECTION = [
 {id:'nusfjord',name:'누스피요르드',edition:'Big Box (2024)',ownership:'owned',status:'owner-accepted',entry:'nusfjord.html'},
 {id:'die-macher',name:'디마허',edition:'한국어판',ownership:'owned',status:'review',entry:'new-game.html?game=die-macher'},
 ...[['terra-mystica','테라 미스티카'],['power-grid','파워그리드'],['blood-rage','블러드 레이지'],['faiyum','파이윰'],['celestia','셀레스티아'],['strike','스트라이크'],['schrodingers-cat','슈뢰딩거의 고양이'],['qe','양적완화'],['raging-robots','레이징 로봇'],['euphoria','유포리아']].map(([id,name])=>({id,name,edition:null,ownership:'owned',status:['raging-robots','euphoria'].includes(id)?'review':'backlog'})),
 {id:'hadara',name:'하다라',edition:null,ownership:'requested',status:'review'},
 {id:'race-for-the-galaxy',name:'레이스 포 더 갤럭시',edition:'한국어판 구판 + 첫 번째 확장 아크 3종',ownership:'owned',status:'pilot',entry:'race.html',expansions:['The Gathering Storm','Rebel vs Imperium','The Brink of War']},
 {id:'roll',name:'롤 포 더 갤럭시',edition:'한국어판 명칭 대조 전',ownership:'owned',status:'review',entry:'roll.html',expansions:['끝없는 야망 (Ambition)']}
];
