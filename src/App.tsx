import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "motion/react";
import { ArrowDown, ArrowUpRight, ArrowRight, ShieldCheck, Globe2, TrendingUp, X, Check } from "lucide-react";

const chapters=[
 {number:"01",label:"THE CARD",title:"AN ICON OF",accent:"POSSIBILITY.",text:"A statement in midnight blue. Crafted for every move you make.",tag:"NOVA SIGNATURE",color:"#06162e"},
 {number:"02",label:"SECURITY",title:"CONFIDENCE",accent:"IN EVERY MOVE.",text:"Smart protection that moves with you. Security should feel effortless.",tag:"PROTECTED BY DESIGN",color:"#091e37"},
 {number:"03",label:"WEALTH",title:"MAKE YOUR",accent:"NEXT MOVE.",text:"A clearer perspective on what matters. Your ambitions, in motion.",tag:"GROW ON YOUR TERMS",color:"#0a243c"},
 {number:"04",label:"WORLDWIDE",title:"THE WORLD",accent:"IS OPEN.",text:"Beyond borders. Beyond ordinary. Built for wherever life leads.",tag:"GO BEYOND BORDERS",color:"#06162e"}
];
function SignatureCard(){return <div className="signature-card"><div className="card-sheen"/><div className="card-rings"/><div className="card-top"><span>nova<span className="brand-star">✳</span></span><span className="card-tier">PRIVATE<br/>EDITION</span></div><div className="card-chip"><span>▦</span><span className="contactless">)))</span></div><div className="card-bottom"><span>THE ART OF MORE</span><div className="card-master"><i/><i/></div></div></div>}
function Story({index}:{index:number}){
 const ref=useRef<HTMLElement>(null);
 const {scrollYProgress}=useScroll({target:ref,offset:["start start","end end"]});
 const progress=useSpring(scrollYProgress,{stiffness:90,damping:26,mass:.6});
 const rotateY=useTransform(progress,[0,.28,.55,.8,1],[-35,10,175,345,380]);
 const rotateX=useTransform(progress,[0,.5,1],[14,-12,8]);
 const scale=useTransform(progress,[0,.3,.6,1],[.7,1.12,1.6,.77]);
 const x=useTransform(progress,[0,.25,.65,1],["30%","15%","-13%","-28%"]);
 const y=useTransform(progress,[0,.5,1],["20%","-2%","-12%"]);
 const textOpacity=useTransform(progress,[0,.15,.43,.7,.92,1],[0,1,1,1,.6,0]);
 const titleY=useTransform(progress,[0,.2,.8,1],[100,0,0,-80]);
 const glow=useTransform(progress,[0,.5,1],[.35,1,.4]);
 const c=chapters[index];
 return <section className="story" ref={ref} style={{background:c.color}} id={index===0?"experience":undefined}><div className="story-sticky">
  <motion.div className="ambient-glow" style={{opacity:glow}}/>
  <div className="story-grid"/><div className="story-vertical">NOVA / PRIVATE BANKING CONCEPT</div>
  <motion.div className="story-copy" style={{opacity:textOpacity,y:titleY}}><div className="story-index"><span>{c.number} / 04</span><span className="line"/><span>{c.label}</span></div><h2>{c.title}<br/><em>{c.accent}</em></h2><p>{c.text}</p><span className="story-detail"><span className="detail-dot"/> {c.tag}</span></motion.div>
  <motion.div className="card-scene" style={{x,y,scale,rotateY,rotateX}}><SignatureCard/></motion.div>
  {index===1&&<motion.div className="floating-symbol symbol-shield" style={{opacity:glow}}><ShieldCheck size={42}/><span>ENCRYPTED<br/>BY DEFAULT</span></motion.div>}
  {index===2&&<motion.div className="floating-symbol symbol-wealth" style={{opacity:glow}}><TrendingUp size={42}/><span>YOUR FUTURE<br/>IN MOTION</span></motion.div>}
  {index===3&&<motion.div className="floating-symbol symbol-globe" style={{opacity:glow}}><Globe2 size={42}/><span>NO BORDERS.<br/>NO LIMITS.</span></motion.div>}
  <div className="story-scroll">SCROLL TO EXPLORE <ArrowDown size={15}/></div><div className="chapter-count">{c.number} — 04</div>
 </div></section>;
}
export default function App(){
 const [open,setOpen]=useState(false);
 const [name,setName]=useState("");
 const [submitted,setSubmitted]=useState(false);
 return <main><header className="site-nav"><a className="logo" href="#top">nova<span>✳</span></a><div className="nav-mid"><a href="#experience">THE EXPERIENCE</a><a href="#details">THE DETAILS</a></div><button onClick={()=>setOpen(true)} className="nav-action">EXPLORE NOVA <ArrowUpRight size={16}/></button></header>
 <section className="opening" id="top"><div className="opening-glow"/><div className="opening-content"><motion.div initial={{opacity:0,y:25}} animate={{opacity:1,y:0}} transition={{duration:.8}} className="opening-eyebrow">INTRODUCING NOVA <span>—</span> A NEW STANDARD</motion.div><motion.h1 initial={{opacity:0,y:70}} animate={{opacity:1,y:0}} transition={{duration:1,delay:.15}}>THE ART<br/>OF <em>MORE.</em></motion.h1><motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.65}}>Not just a card. A different way to move through the world.</motion.p><a href="#experience" className="opening-scroll">ENTER THE EXPERIENCE <ArrowDown size={18}/></a></div><motion.div className="opening-card" initial={{opacity:0,rotate:-30,y:200}} animate={{opacity:1,rotate:-16,y:0}} transition={{duration:1.4,delay:.35,type:"spring",damping:19}}><SignatureCard/></motion.div><span className="opening-corner">N° 001 / THE PRIVATE EDITION</span></section>
 {chapters.map((_,index)=><Story key={index} index={index}/>)}
 <section className="details" id="details"><div className="details-top"><span>05 / THE FINISHING TOUCH</span><span>DESIGNED TO FEEL DIFFERENT</span></div><h2>EVERY DETAIL.<br/><em>INTENTIONAL.</em></h2><div className="details-layout"><div className="details-card"><SignatureCard/></div><div className="details-list"><div><span>01</span><h3>Midnight finish</h3><p>A deep navy surface with a subtle metallic glow.</p></div><div><span>02</span><h3>Quiet confidence</h3><p>Less noise. More of what matters.</p></div><div><span>03</span><h3>Designed for motion</h3><p>Every interaction considered, every detail refined.</p></div><button className="detail-cta" onClick={()=>setOpen(true)}>DISCOVER THE CONCEPT <ArrowUpRight/></button></div></div></section>
 <section className="finale"><div className="finale-halo"/><span>THE NEXT CHAPTER IS YOURS</span><h2>EXPECT<br/><em>EXTRAORDINARY.</em></h2><button onClick={()=>setOpen(true)}>STEP INTO NOVA <ArrowRight/></button></section>
 <footer><a className="logo" href="#top">nova<span>✳</span></a><p>FICTIONAL DIGITAL BANK CONCEPT — NO FINANCIAL SERVICES OFFERED.</p><span>© 2026 NOVA / A DESIGN EXPERIMENT</span></footer>
 <AnimatePresence>{open&&<motion.div className="modal-backdrop" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setOpen(false)}><motion.div className="modal" initial={{opacity:0,y:35,scale:.96}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:20}} onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={()=>setOpen(false)} aria-label="Close"><X/></button><span>THE NOVA EXPERIENCE</span><h2>BE PART OF<br/><em>WHAT'S NEXT.</em></h2>{submitted?<div className="modal-success"><Check size={36}/><p>Thanks, {name.trim()}! This is a design concept, so no details were submitted or stored.</p><button onClick={()=>{setSubmitted(false);setName("")}}>START AGAIN <ArrowRight size={16}/></button></div>:<form onSubmit={e=>{e.preventDefault();if(name.trim())setSubmitted(true)}}><label htmlFor="demo-name">YOUR FIRST NAME</label><input id="demo-name" value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" required maxLength={40}/><button type="submit">EXPLORE THE DEMO <ArrowUpRight size={17}/></button></form>}<small>INTERACTIVE PORTFOLIO DEMO. NOT A REAL BANK.</small></motion.div></motion.div>}</AnimatePresence>
 </main>;
}