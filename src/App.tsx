import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, Compass, Heart, MapPin, Sparkles, X } from "lucide-react";
import Globe from "./Globe";

type Mood = "All" | "Adventure" | "Culture" | "Nature";
type Destination = { id:string; name:string; country:string; mood:Exclude<Mood,"All">; image:string; color:string; caption:string; };
const destinations:Destination[] = [
 {id:"japan",name:"Tokyo",country:"Japan",mood:"Culture",image:"https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&q=85",color:"#ffc5dc",caption:"Neon nights and endless discoveries."},
 {id:"iceland",name:"Iceland",country:"Iceland",mood:"Nature",image:"https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=1200&q=85",color:"#b8e9d3",caption:"Chase waterfalls, find your wonder."},
 {id:"italy",name:"Amalfi Coast",country:"Italy",mood:"Adventure",image:"https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1200&q=85",color:"#f9d998",caption:"Take the scenic route. Always."},
];
const moods:Mood[]=["All","Adventure","Culture","Nature"];
export default function App(){
 const [mood,setMood]=useState<Mood>("All");
 const [selected,setSelected]=useState<Destination|null>(null);
 const [saved,setSaved]=useState<string[]>([]);
 const [showSaved,setShowSaved]=useState(false);
 const visible=destinations.filter(d=>mood==="All"||d.mood===mood);
 const toggle=(id:string)=>setSaved(prev=>prev.includes(id)?prev.filter(x=>x!==id):[...prev,id]);
 return <main>
  <header className="nav"><a className="logo" href="#" aria-label="WANDR home">wandr<span>✳</span></a><span className="nav-center">THE WORLD IS YOUR PLAYGROUND</span><button className="saved-link" onClick={()=>setShowSaved(true)}><Heart size={17}/> MY LIST <span className="count">{saved.length}</span></button></header>
  <section className="hero">
   <div className="hero-copy"><motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="eyebrow"><span className="sun">✺</span> NOT ALL WHO WANDER ARE LOST</motion.div>
   <motion.h1 initial={{opacity:0,y:35}} animate={{opacity:1,y:0}} transition={{delay:0.12}}>GO<br/><span>SOMEWHERE</span><br/>WILD<span className="period">.</span></motion.h1>
   <p>Less scrolling. More exploring. Find a place that feels like <em>you.</em></p>
   <a href="#explore" className="primary">FIND YOUR NEXT ESCAPE <ArrowUpRight size={20}/></a>
   <div className="tiny-note">✳ MADE FOR THE CURIOUS ONES</div></div>
   <div className="hero-art"><div className="orbit-label orbit-top">YOUR NEXT ADVENTURE <ArrowUpRight size={15}/></div><div className="globe"><Globe/></div><div className="sticker sticker-orange">LET'S<br/>GO!</div><div className="sticker sticker-purple">EXPLORE<br/>MORE ✷</div><div className="orbit-label orbit-bottom">SPIN THE WORLD ↗</div></div>
  </section>
  <section id="explore" className="explore"><div className="section-head"><div><div className="section-kicker"><Sparkles size={17}/> YOUR VIBE, YOUR TRIP</div><h2>WHERE TO <i>NEXT?</i></h2></div><p>Pick your mood. We'll bring the inspiration.</p></div>
  <div className="filters" role="group" aria-label="Filter destinations">{moods.map(m=><button key={m} className={m===mood?"active":""} onClick={()=>setMood(m)}>{m==="All"?"✳":m==="Adventure"?"↗":m==="Culture"?"◉":"✿"} {m}</button>)}</div>
  <motion.div layout className="cards"><AnimatePresence mode="popLayout">{visible.map((d,i)=><motion.button layout key={d.id} initial={{opacity:0,scale:.92,y:24}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:.9}} transition={{delay:i*.08}} className="destination" onClick={()=>setSelected(d)} style={{background:d.color}}><div className="card-photo" style={{backgroundImage:`url("${d.image}")`}}/><span className="card-tag">{d.mood.toUpperCase()}</span><div className="card-bottom"><div><span><MapPin size={14}/>{d.country}</span><h3>{d.name}</h3></div><span className="card-arrow"><ArrowUpRight/></span></div></motion.button>)}</AnimatePresence></motion.div>
  </section>
  <footer><span>wandr✳</span><span>COLLECT MOMENTS, NOT TABS. © 2026 WANDR — CONCEPT PROJECT</span><Compass size={22}/></footer>
  <AnimatePresence>{selected&&<motion.div className="overlay" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setSelected(null)}><motion.article className="detail" initial={{scale:.85,y:70,opacity:0}} animate={{scale:1,y:0,opacity:1}} exit={{scale:.92,y:50,opacity:0}} transition={{type:"spring",damping:24}} onClick={e=>e.stopPropagation()}><button className="close" onClick={()=>setSelected(null)} aria-label="Close"><X/></button><img src={selected.image} alt={selected.name}/><div className="detail-copy"><span className="section-kicker">{selected.mood} · {selected.country}</span><h2>{selected.name}</h2><p>{selected.caption}</p><button className="primary" onClick={()=>toggle(selected.id)}><Heart size={18} fill={saved.includes(selected.id)?"currentColor":"none"}/>{saved.includes(selected.id)?"SAVED TO YOUR LIST":"ADD TO MY BUCKET LIST"}</button></div></motion.article></motion.div>}</AnimatePresence>
  <AnimatePresence>{showSaved&&<motion.div className="overlay" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setShowSaved(false)}><motion.aside className="drawer" initial={{x:"100%"}} animate={{x:0}} exit={{x:"100%"}} transition={{type:"spring",damping:30}} onClick={e=>e.stopPropagation()}><button className="close" onClick={()=>setShowSaved(false)} aria-label="Close"><X/></button><span className="section-kicker">YOUR LITTLE CORNER OF THE WORLD</span><h2>MY BUCKET LIST ✳</h2>{saved.length===0?<p>No destinations saved yet. Your next adventure is waiting!</p>:destinations.filter(d=>saved.includes(d.id)).map(d=><div className="saved-item" key={d.id}><img src={d.image} alt=""/><div><strong>{d.name}</strong><small>{d.country}</small></div><button onClick={()=>toggle(d.id)} aria-label={`Remove ${d.name}`}><X size={17}/></button></div>)}</motion.aside></motion.div>}</AnimatePresence>
 </main>;
}