/// <reference types="vite/client" />
import {createClient} from "@supabase/supabase-js";

export type NovaEventName = "visit_started"|"section_viewed"|"nav_clicked"|"modal_opened"|"modal_route_selected"|"benefit_opened"|"motion_preference_changed"|"app_tab_opened"|"demo_transfer_completed"|"demo_topup"|"card_status_changed"|"visit_ended";
export type NovaSection = "hero"|"experience"|"security"|"wealth"|"world"|"benefits"|"app"|"footer";
type NovaRecord={id:string;session_id:string;event_name:NovaEventName;section:NovaSection|null;device_type:"mobile"|"tablet"|"desktop";duration_ms:number|null;created_at:string};
const KEY="nova-analytics-consent-v1";
const LOCAL="nova-anonymous-events-v1";
const DELIVERED="nova-anonymous-delivered-v1";
const url=import.meta.env.VITE_SUPABASE_URL?.trim();
const key=import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();
const db=url&&key?createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}}):null;
const sessionId=crypto.randomUUID();
const started=performance.now();
let enabled=false;
let finished=false;
let startedSent=false;
let flushing=false;
const deviceType=()=>window.innerWidth<620?"mobile":window.innerWidth<900?"tablet":"desktop";

function storeLocally(record:NovaRecord){
 try{const old=JSON.parse(localStorage.getItem(LOCAL)||"[]") as NovaRecord[];localStorage.setItem(LOCAL,JSON.stringify([...old,record].slice(-250)))}catch{/* Optional storage unavailable */}
}
// Retry consented events retained during temporary database failures, including
// previous visits. Primary keys make retries idempotent (23505 = already sent).
async function flushPendingEvents(){
 if(!db||!enabled||flushing)return;
 flushing=true;
 try{
  const all=JSON.parse(localStorage.getItem(LOCAL)||"[]") as NovaRecord[];
  const delivered=new Set<string>(JSON.parse(localStorage.getItem(DELIVERED)||"[]") as string[]);
  let failed=false;
  for(const event of all.filter(item=>!delivered.has(item.id)).slice(0,30)){
   const {error}=await db.from("nova_events").insert(event);
   if(error&&error.code!=="23505"){
    console.warn("NOVA analytics sync pending:",error.message);
    failed=true;break;
   }
   delivered.add(event.id);
  }
  localStorage.setItem(DELIVERED,JSON.stringify([...delivered].slice(-250)));
  if(failed)return;
 }catch(error){console.warn("NOVA analytics local queue unavailable:",error)}
 finally{flushing=false}
}
export function consentValue():boolean|null{
 try{const c=localStorage.getItem(KEY);return c==="yes"?true:c==="no"?false:null}catch{return null}
}
export function setAnalyticsConsent(value:boolean){
 enabled=value;
 if(!value){startedSent=false;finished=false}
 try{localStorage.setItem(KEY,value?"yes":"no");if(!value){localStorage.removeItem(LOCAL);localStorage.removeItem(DELIVERED)}}catch{/* Storage unavailable */}
 if(value){finished=false;if(!startedSent){startedSent=true;trackNova("visit_started","hero")}void flushPendingEvents()}
}
export function initNovaTelemetry(){
 enabled=consentValue()===true;
 if(enabled&&!startedSent){startedSent=true;trackNova("visit_started","hero")}
 const finish=()=>{if(enabled&&!finished){finished=true;trackNova("visit_ended",null,performance.now()-started)}};
 const online=()=>{void flushPendingEvents()};
 const interval=window.setInterval(()=>{void flushPendingEvents()},12000);
 window.addEventListener("pagehide",finish);
 window.addEventListener("online",online);
 void flushPendingEvents();
 return ()=>{window.clearInterval(interval);window.removeEventListener("pagehide",finish);window.removeEventListener("online",online)};

}
export function trackNova(eventName:NovaEventName,section:NovaSection|null=null,durationMs:number|null=null){
 if(!enabled)return;
 const record:NovaRecord={id:crypto.randomUUID(),session_id:sessionId,event_name:eventName,section,device_type:deviceType(),
  duration_ms:durationMs===null?null:Math.max(0,Math.min(3600000,Math.round(durationMs))),created_at:new Date().toISOString()};
 storeLocally(record);
 void flushPendingEvents();
}
