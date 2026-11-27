"""Pack local app pages into one offline HTML. No network or server needed."""
from pathlib import Path
import re, json, sys
root=Path(__file__).resolve().parents[1]
def inline(filename,practice_game=None):
    s=(root/filename).read_text()
    def js(m): return '<script>\n'+(root/m.group(1)).read_text()+'\n</script>'
    s=re.sub(r'<script src="([^"]+)"></script>',js,s)
    s=re.sub(r'<link rel="stylesheet" href="([^"]+)"\s*/?>',lambda m:'<style>\n'+(root/m.group(1)).read_text()+'\n</style>',s)
    if practice_game:s=s.replace('<script>\n/* Shared practice UI.',f'<script>window.PRACTICE_GAME={json.dumps(practice_game)};</script><script>\n/* Shared practice UI.',1)
    return s
pages={'nusfjord/learn':inline('nusfjord.html'),'race/learn':inline('race.html'),'nusfjord/practice':inline('scenario.html','nusfjord'),'race/practice':inline('scenario.html','race'),'die-macher/learn':inline('die-macher.html'),'die-macher/practice':inline('practice.html')}
for game in ['die-macher','raging-robots','euphoria','hadara']:
    for mode in ['learn','practice']:
        config=json.dumps({'game':game,'mode':mode})
        pages[f'{game}/{mode}']=inline('new-game.html').replace('<script id="newConfig" type="application/json">null</script>',f'<script id="newConfig" type="application/json">{config}</script>')
for mode in ['learn','practice']:
    config=json.dumps({'mode':mode})
    pages[f'roll/{mode}']=inline('roll.html').replace('<script id="rollConfig" type="application/json">null</script>',f'<script id="rollConfig" type="application/json">{config}</script>')
for game in ['nusfjord','race','die-macher','raging-robots','euphoria','hadara','roll']:
    config=json.dumps({'game':game})
    pages[f'{game}/quick']=inline('quick.html').replace('<script id="quickConfig" type="application/json">null</script>',f'<script id="quickConfig" type="application/json">{config}</script>')
s=inline('index.html');data=json.dumps(pages,ensure_ascii=False).replace('<','\\u003c')
s=s.replace('<script id="embeddedPages" type="application/json">null</script>','<script id="embeddedPages" type="application/json">'+data+'</script>')
out=Path(sys.argv[1]) if len(sys.argv)>1 else root/'rulemaster-standalone.html';out.write_text(s);print(out,out.stat().st_size)
