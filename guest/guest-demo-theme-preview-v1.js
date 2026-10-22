/* GUEST editorial preview only: honour the real five visual settings in the complete native engine. */
(()=>{'use strict';
const G=window.__GuestsProd;if(!G?.f)return;
const colors={
 nordic:{bg:'#F2EFE9',paper:'#FBF8F3',line:'#E4DED2',soft:'#EEF0E9',dark:'#525C43',accent:'#6E7A5C',muted:'#736F63'},
 blush:{bg:'#F5EEEC',paper:'#FFF9F7',line:'#E9DAD6',soft:'#F5E9E7',dark:'#825F5D',accent:'#B48683',muted:'#796461'},
 sand:{bg:'#F1EAE1',paper:'#FCF8F2',line:'#DED3C5',soft:'#F2E9DE',dark:'#725A45',accent:'#9B7F62',muted:'#756857'},
 slate:{bg:'#EEF1F3',paper:'#F8FAFB',line:'#D8DEE2',soft:'#E9EEF1',dark:'#4C5963',accent:'#73808A',muted:'#65737F'},
 editorial:{bg:'#F0ECE8',paper:'#FBF8F5',line:'#DED6D0',soft:'#EFE8E4',dark:'#443833',accent:'#6B5B52',muted:'#655A52'}
};
let old='';
function apply(){
 let d;try{d=G.f.contentDocument}catch{return}
 if(!d?.head||!d.getElementById('nav'))return;
 const choice=localStorage.getItem('weddly_personal_theme_v51')||'nordic',p=colors[choice]||colors.nordic;
 const stamp=choice;
 let style=d.getElementById('guestDemoThemeOverrides');
 if(style&&old===stamp)return;
 if(!style){style=d.createElement('style');style.id='guestDemoThemeOverrides';d.head.appendChild(style)}
 style.textContent=`:root{--guest-bg:${p.bg}!important;--guest-paper:${p.paper}!important;--guest-olive:${p.dark}!important;--guest-line:${p.line}!important;--guest-soft:${p.soft}!important;--guest-muted:${p.muted}!important}
 html,body{background:${p.bg}!important}.wrap{background:${p.paper}!important}
 #nav button.on,.nav button.on{background:${p.dark}!important;color:white!important}
 .btn:not(.soft):not(.line){background:${p.dark}!important;color:white!important}
 .btn.soft,.pill,.badge{background:${p.soft}!important;color:#2c2a26!important}
 .brand,.status,.moveNote{color:${p.dark}!important}
 .card,.stat,.step,.nav,.field,.choice{border-color:${p.line}!important}
 .planLaunch,.wsdPlanGuestHero{background:${p.dark}!important}`;
 old=stamp;
}
G.f.addEventListener('load',()=>{old='';[0,120,400].forEach(ms=>setTimeout(apply,ms))});
addEventListener('guest-demo-theme-changed',()=>{old='';apply()});
addEventListener('guests-prod-open',()=>{old='';setTimeout(apply,120)});
setInterval(apply,600);
})();