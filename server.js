const http=require('http'),fs=require('fs'),path=require('path');
const PORT=process.env.PORT||3000, DATA=process.env.DATA_FILE||path.join(__dirname,'game-state.json');
const prompts=[
'Nezuko','Meatball','The church next door on a Sunday morning','The L train',
'A bushwick polycules McDonald’s drive through order','A group of rejected Pokémon',
'Werner Herzog trying the Starbucks unicorn',
'Summoning Ted Kazinski back from the grave to force him to review brainrot memes',
'Fidel Castros birthday is interrupted with one of Kennedy’s lesser well known assasination attempts',
'A Ghost who’s unfinished business is having never filmed and released his YouTube video essay on how SpongeBob has changed since Hillenburg left',
'A man fully financing his burrito order into 5 easy payments with Klarna.',
'You’re starting to think this priest may have exaggerated about aspects of his resume Mid Exorcism.',
'A family politely ignoring cousins Rockos pending trial for treason at thanksgiving dinner.',
'A player on survivor that is lying about their job because they don’t want everyone to know they’re a Zookeper.',
'A movie review by a critic that had only ever seen air Bud movies before the movie they’re reviewing',
'Three buddies have taken out a large parlay on the events of their friends daily life and they’re one leg away from making it big.',
'You don’t want to be rude but your accountant seemingly doesn’t understand the concept of a marginal tax rate.',
'Good Will Hunting with a reworked ending after early screenings to make sure it passes the bechdel test'];
const initial=()=>({phase:'setup',teams:[{name:'Team 1',players:[]},{name:'Team 2',players:[]},{name:'Team 3',players:[]}],moles:[],index:0,scores:Array(18).fill(null),revision:0});
let state;try{state=JSON.parse(fs.readFileSync(DATA,'utf8'));}catch{state=initial();}
function save(){state.revision=(state.revision||0)+1;fs.writeFileSync(DATA,JSON.stringify(state,null,2));}
function publicState(){return {phase:state.phase,teams:state.teams,index:state.index,revision:state.revision,scoreboard:state.phase==='scores'?state.teams.map((t,i)=>({name:t.name,score:state.scores.reduce((sum,s,j)=>sum+(j%3===i&&s!==null?s:0),0)})):undefined,prompt:state.phase==='noise'?prompts[state.index]:undefined,activeTeam:state.phase==='noise'?state.teams[state.index%3].name:undefined};}
function json(res,code,data){res.writeHead(code,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(data));}
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript','.css':'text/css'};
http.createServer((req,res)=>{
 const url=new URL(req.url,'http://localhost');
 if(req.method==='GET'&&url.pathname==='/api/state')return json(res,200,publicState());
 if(req.method==='GET'&&url.pathname==='/api/host-state')return json(res,200,{...state,prompts});
 if(req.method==='POST'&&url.pathname==='/api/action'){
  let raw='';req.on('data',c=>{raw+=c;if(raw.length>20000)req.destroy();});req.on('end',()=>{try{
   const {type,payload}=JSON.parse(raw),p=payload||{};
   if(type==='setup'){
    if(state.phase!=='setup')throw Error('Setup is locked after Start Game');
    if(!Array.isArray(p.teams)||p.teams.length!==3)throw Error('Exactly three teams required');
    const teams=p.teams.map((t,i)=>({name:String(t.name||`Team ${i+1}`).trim().slice(0,50),players:Array.isArray(t.players)?t.players.map(x=>String(x).trim()).filter(Boolean).slice(0,30):[]}));
    const all=teams.flatMap(t=>t.players);if(new Set(all.map(x=>x.toLowerCase())).size!==all.length)throw Error('Player names must be unique');
    state.teams=teams;state.moles=Array.isArray(p.moles)?p.moles.filter(x=>all.includes(x)):[];
   }else if(type==='start'){
    if(state.phase!=='setup')throw Error('Already started');
    if(state.teams.some(t=>!t.players.length||!t.players.some(x=>state.moles.includes(x))))throw Error('Each team needs players and at least one designated mole');
    state.phase='noise';state.index=0;
   }else if(type==='score'){
    if(state.phase!=='noise')throw Error('Not in Noise Boys');
    if(!Number.isInteger(p.score)||p.score<0||p.score>5)throw Error('Score must be 0–5');
    state.scores[state.index]=p.score;
   }else if(type==='next'){
    if(state.phase!=='noise'||state.scores[state.index]===null)throw Error('Score current prompt first');
    if(state.index===17)throw Error('Last prompt; reveal scores instead');state.index++;
   }else if(type==='reveal'){
    if(state.phase!=='noise'||state.index!==17||state.scores[17]===null)throw Error('Finish all 18 prompts first');state.phase='scores';
   }else if(type==='reset'){
    if(p.confirm!=='RESET')throw Error('Reset confirmation missing');state=initial();
   }else throw Error('Unknown action');
   save();json(res,200,{ok:true,state});
  }catch(e){json(res,400,{error:e.message});}});return;
 }
 let file=url.pathname==='/'?'host.html':url.pathname.slice(1);
 if(!['host.html','tv.html','style.css'].includes(file))return json(res,404,{error:'Not found'});
 fs.readFile(path.join(__dirname,file),(err,buf)=>{if(err)return json(res,404,{error:'Not found'});res.writeHead(200,{'Content-Type':mime[path.extname(file)],'Cache-Control':'no-store'});res.end(buf);});
}).listen(PORT,'0.0.0.0',()=>console.log(`Game ready at http://localhost:${PORT}/host.html and /tv.html`));
