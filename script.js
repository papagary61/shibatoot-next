const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>Array.from(c.querySelectorAll(s));

const CONFIG = {
  GROWTH_ENDPOINT: '/api/lp-growth',
  GROWTH_THRESHOLD: 0.05,
  GROWTH_BONUS_PCT: 2,
  PROMO_CHECK_DAY_UTC: 5,
  PROMO_CHANCE: 0.18,
  PROMO_PCT: 1.5,
  PROMO_COOLDOWN_WEEKS: 4,
  HISTORY_ENDPOINT: '/api/rewards-history',
  HISTORY_LIMIT: 8
};

function isoWeekNumber(d=new Date()){
  const t=new Date(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate()));
  const n=(t.getUTCDay()+6)%7; t.setUTCDate(t.getUTCDate()-n+3);
  const f=new Date(Date.UTC(t.getUTCFullYear(),0,4)); return 1+Math.round((t-f)/(7*24*3600*1000));
}
function yyyymmdd(d=new Date()){const z=n=>String(n).padStart(2,'0');return `${d.getUTCFullYear()}-${z(d.getUTCMonth()+1)}-${z(d.getUTCDate())}`;}
async function fetchJSON(u,f){try{const r=await fetch(u,{cache:'no-store'});if(!r.ok)throw 0;return await r.json()}catch{return f}}

async function fetchGrowth(){
  const data = await fetchJSON(CONFIG.GROWTH_ENDPOINT, 0);
  const val = typeof data === 'number' ? data : (data?.growth ?? 0);
  return Number.isFinite(val) ? val : 0;
}
async function computeAutoBonus(){
  const ov = JSON.parse(localStorage.getItem('shbt_bonus_override')||'null');
  if (ov && typeof ov==='object'){
    const pct=Number(ov.pct)||0, active=!!ov.active&&pct>0, reason=ov.reason||'override';
    return {active,pct,reason};
  }
  const growth = await fetchGrowth();
  if (growth >= CONFIG.GROWTH_THRESHOLD) return {active:true,pct:CONFIG.GROWTH_BONUS_PCT,reason:'growth'};

  const now=new Date(), check=now.getUTCDay()===CONFIG.PROMO_CHECK_DAY_UTC, wk=isoWeekNumber(now), key='shbt_promo_meta';
  const meta=JSON.parse(localStorage.getItem(key)||'{}'); const lastW=meta.lastWeek??0, lastY=meta.lastYear??0, lastPct=meta.lastPct??0;
  const y=now.getUTCFullYear(), weeksSince=(y-lastY)*54+(wk-lastW), cool=weeksSince>=0&&weeksSince<CONFIG.PROMO_COOLDOWN_WEEKS;

  if(check && !cool){
    const seed=(y*1000+wk)%9973; const rng=((seed*9301+49297)%233280)/233280; const hit=rng<CONFIG.PROMO_CHANCE;
    if(hit){const pct=CONFIG.PROMO_PCT; localStorage.setItem(key,JSON.stringify({lastWeek:wk,lastYear:y,lastPct:pct})); return {active:true,pct,reason:'promo'};}
  }
  if(weeksSince===0 && lastPct>0) return {active:true,pct:lastPct,reason:'promo'};
  return {active:false,pct:0,reason:'none'};
}

async function applyBonusFlag(){
  const state = await computeAutoBonus();
  console.log(`[Bonus Debug] Active: ${state.active}, Reason: ${state.reason}, Pct: ${state.pct}`);
  const reasonLabel = state.reason==='growth'?'Growth 📈':state.reason==='promo'?'Promo 🎁':state.reason==='override'?'Admin ⚙️':'';
  $$('.bonus-inline').forEach(el=>{
    if(state.active){
      el.innerHTML = `<span class="dot"></span> BONUS ACTIVE: <span class="bonus-pct">+${state.pct}%</span>${reasonLabel?` <span class="bonus-reason">${reasonLabel}</span>`:''}`;
      el.style.display='inline-flex';
    }else{
      el.style.display='none';
    }
  });
  renderRewardsHistory(state);
}

async function renderRewardsHistory(current){
  const wrap = $('#rewardsHistory'); if(!wrap) return;
  const hist = await fetchJSON(CONFIG.HISTORY_ENDPOINT, []);
  const now=new Date();
  const cur = {year:now.getUTCFullYear(),week:isoWeekNumber(now),date:yyyymmdd(now),prizeUSD:extractPrizeUSD(),winner:'TBD',reason:current.reason,bonusPct:current.active?current.pct:0,tx:''};
  const rows=[cur,...hist].slice(0,CONFIG.HISTORY_LIMIT).map(r=>{
    const badge=r.reason==='growth'?'growth':r.reason==='promo'?'promo':'';
    const reason=r.reason==='growth'?'Growth 📈':r.reason==='promo'?'Promo 🎁':r.reason==='override'?'Admin ⚙️':'—';
    const b=r.bonusPct>0?`+${r.bonusPct}%`:'—', tx=r.tx?`<a href="${r.tx}" target="_blank" rel="noopener">View</a>`:'—';
    const wk=`${r.year}-W${String(r.week).padStart(2,'0')}`, prize=r.prizeUSD?`$${Number(r.prizeUSD).toLocaleString()}`:'—', win=r.winner||'—';
    return `<tr><td>${wk}</td><td>${r.date||'—'}</td><td>${prize}</td><td>${win}</td><td>${b}</td><td>${badge?`<span class="chip ${badge}">${reason}</span>`:reason}</td><td>${tx}</td></tr>`;
  }).join('');
  wrap.innerHTML = `
    <div class="card history-card">
      <strong style="display:block;margin-bottom:8px">Recent Rewards</strong>
      <table class="history-table">
        <thead><tr><th>Week</th><th>Date</th><th>Prize</th><th>Winner</th><th>Bonus</th><th>Reason</th><th>Proof</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}
function extractPrizeUSD(){const el=$('.fire-amount .value'); if(!el) return 0; const n=Number(el.textContent.replace(/[^0-9.]/g,'')); return Number.isFinite(n)?n:0;}

(function activeNav(){
  const page = (location.pathname.split('/').pop() || 'index.html');
  [...$$('.nav a')].forEach(a=>{ if (a.getAttribute('href').endsWith(page)) a.classList.add('active'); });
})();
const y=$("#year"); if(y) y.textContent=new Date().getFullYear();

/* Admin helpers */
window.forceBonus=(pct=2,reason='override')=>{localStorage.setItem('shbt_bonus_override',JSON.stringify({active:true,pct,reason}));applyBonusFlag();}
window.clearBonusOverride=()=>{localStorage.removeItem('shbt_bonus_override');applyBonusFlag();}
window.peekBonusState=async()=>{const s=await computeAutoBonus();console.log(s);return s;}

document.addEventListener('DOMContentLoaded', applyBonusFlag);
