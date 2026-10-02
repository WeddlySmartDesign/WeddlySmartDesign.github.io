(()=>{
  const qs=new URLSearchParams(location.search);
  const key=(qs.get('demo')==='2'||qs.get('pair')==='b')?'b':'a';
  const DATA={
    a:{
      p1:'Clara',p2:'Mateo',initials:'C·M',
      dateISO:'2027-09-18T17:30:00+02:00',dateHuman:'18 · 09 · 2027',dateCompact:'18.09.27',
      day:'18',month:'Septiembre',year:'2027',time:'17:30',city:'Madrid',
      venue:'Finca El Olivar',address:'Carretera de Colmenar, Madrid',
      map:'https://www.google.com/maps/search/?api=1&query=Colmenar+Madrid',
      accent:'#6e3036',paper:'#f2ede5',paper2:'#ddd2c6',
      hero:'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1400&q=88',
      story:'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1400&q=86',
      countTitle:'Hay días que empiezan mucho antes de llegar.',
      countCopy:'Nos encantaría compartir con vosotros el día en que empieza oficialmente nuestra siguiente historia.',
      venueTitle:'Un lugar con historia para empezar la nuestra.',
      venueCopy:'La ceremonia y la celebración tendrán lugar en el mismo espacio. Llegad con tiempo: queremos que la tarde empiece sin prisas.',
      storyLine:'No queremos llenar la invitación. Queremos que cada momento tenga aire.',
      finalText:'Nos vemos en septiembre.',
      events:[
        ['17:30','Ceremonia','Jardín norte · Finca El Olivar'],
        ['19:00','Cóctel','Patio de los olivos'],
        ['21:00','Cena & fiesta','Salón principal']
      ],
      endISO:'2027-09-19T02:00:00+02:00'
    },
    b:{
      p1:'Alejandra',p2:'Guillermo',initials:'A·G',
      dateISO:'2028-05-27T18:00:00+02:00',dateHuman:'27 · 05 · 2028',dateCompact:'27.05.28',
      day:'27',month:'Mayo',year:'2028',time:'18:00',city:'Valencia',
      venue:'Masía de la Luz',address:'Bétera, Valencia',
      map:'https://www.google.com/maps/search/?api=1&query=Betera+Valencia',
      accent:'#35584e',paper:'#f0eee6',paper2:'#d6d9cc',
      hero:'https://images.unsplash.com/photo-1777353245032-6b9286800d62?auto=format&fit=crop&w=1400&q=86',
      story:'https://images.unsplash.com/photo-1507501336603-6e31db2be093?auto=format&fit=crop&w=1400&q=84',
      countTitle:'Un día para celebrar todo lo que nos trajo hasta aquí.',
      countCopy:'Queremos reunir a nuestra gente favorita y vivirlo sin prisa, desde la primera copa hasta la última canción.',
      venueTitle:'Luz, piedra y naranjos para una tarde muy nuestra.',
      venueCopy:'Ceremonia, cena y fiesta suceden en la misma masía. Todo está pensado para que solo tengáis que llegar y disfrutar.',
      storyLine:'Otra pareja, otra atmósfera. La estructura no cambia; la identidad sí.',
      finalText:'Nos vemos bajo los naranjos.',
      events:[
        ['18:00','Ceremonia','Patio de naranjos'],
        ['19:15','Aperitivo','Jardín de la masía'],
        ['21:15','Cena','Patio central'],
        ['23:30','Fiesta','La antigua almazara']
      ],
      endISO:'2028-05-28T03:00:00+02:00'
    }
  };
  const d=DATA[key],root=document.documentElement;
  root.style.setProperty('--gate-accent',d.accent);
  root.style.setProperty('--gate-paper',d.paper);
  root.style.setProperty('--gate-paper2',d.paper2);
  root.style.setProperty('--gate-hero',`url("${d.hero}")`);
  root.style.setProperty('--gate-story',`url("${d.story}")`);
  document.title=`GUEST GOLD 01 · ${d.p1} & ${d.p2}`;

  const intro=document.getElementById('intro');
  const main=document.getElementById('invitation');
  if(!intro||!main)return;

  const left=intro.querySelector('.intro-panel.left');
  if(left&&!intro.querySelector('.intro-panel.mid')){
    const mid=document.createElement('div');mid.className='intro-panel mid';left.after(mid);
  }
  if(!intro.querySelector('.gate-intro-photo')){
    const photo=document.createElement('div');photo.className='gate-intro-photo';intro.prepend(photo);
    const line=document.createElement('div');line.className='gate-intro-line';intro.append(line);
  }

  const introK=intro.querySelector('.intro-kicker');
  const introM=intro.querySelector('.intro-mark');
  const introD=intro.querySelector('.intro-date');
  if(introK)introK.textContent=`Una invitación de ${d.p1} & ${d.p2}`;
  if(introM)introM.textContent=d.initials;
  if(introD)introD.textContent=d.dateHuman;
  intro.setAttribute('aria-label',`Abrir la invitación de ${d.p1} y ${d.p2}`);

  const heroNames=document.querySelector('.hero-names');
  const heroMeta=document.querySelector('.hero-meta');
  const heroSide=document.querySelector('.hero-side');
  if(heroNames)heroNames.innerHTML=`${d.p1}<br>& ${d.p2}`;
  if(heroMeta)heroMeta.innerHTML=`<span>${d.dateCompact}</span><span>${d.time} · ${d.city}</span>`;
  if(heroSide)heroSide.textContent=`${d.city} · ${d.month} ${d.year}`;

  const count=document.querySelector('.count');
  if(count){
    const title=count.querySelector('.h2'),copy=count.querySelector('.copy'),big=count.querySelector('.date-big'),label=count.querySelector('.date-label');
    if(title)title.textContent=d.countTitle;if(copy)copy.textContent=d.countCopy;if(big)big.textContent=d.day;
    if(label)label.innerHTML=`${d.month}<br>${d.year} · ${d.city}`;
    if(!document.querySelector('.gate-interlude')){
      const inter=document.createElement('section');
      inter.className='gate-interlude reveal';
      inter.innerHTML=`<div class="gate-interlude-bg" aria-hidden="true"></div><div class="gate-interlude-rule"></div><div class="gate-interlude-copy"><div class="gate-interlude-no">02</div><div class="gate-interlude-text">${d.storyLine}</div></div>`;
      count.after(inter);
      const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.16});
      io.observe(inter);
    }
  }

  const venue=document.querySelector('.venue');
  if(venue){
    const title=venue.querySelector('.h2'),copy=venue.querySelector('.copy'),card=venue.querySelector('.venue-card');
    if(title)title.textContent=d.venueTitle;if(copy)copy.textContent=d.venueCopy;
    const art=venue.querySelector('.venue-art svg');
    if(art)art.innerHTML=`
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#ded6cc"/><stop offset="1" stop-color="#c5b9ac"/></linearGradient>
        <filter id="soft"><feGaussianBlur stdDeviation="6"/></filter>
      </defs>
      <rect width="520" height="360" fill="url(#sky)"/>
      <circle cx="390" cy="82" r="42" fill="#f3eee6" opacity=".72" filter="url(#soft)"/>
      <g fill="none" stroke="#4c4540" stroke-width="1.15" opacity=".82">
        <path d="M28 282 C96 248 132 258 182 244 S285 250 344 234 S429 239 498 206"/>
        <path d="M111 263 C121 214 137 177 158 145 M409 258 C400 209 385 176 362 142"/>
        <path d="M151 244 V137 H371 V244 M174 244 V161 H348 V244"/>
        <path d="M262 161 V111 L337 161 M262 111 L187 161"/>
        <path d="M205 244 V190 H240 V244 M282 244 V190 H318 V244"/>
        <path d="M188 178 H238 M285 178 H335"/>
        <path d="M78 281 C92 252 108 246 126 281 M390 278 C407 248 429 246 450 278"/>
        <path d="M94 262 q12-29 25 0 q12-32 27 0 M379 260 q12-30 25 0 q14-31 29 0"/>
        <path d="M57 300 H468"/>
      </g>
      <g fill="#756b62" opacity=".24"><circle cx="120" cy="218" r="32"/><circle cx="405" cy="215" r="36"/><circle cx="77" cy="250" r="22"/><circle cx="455" cy="247" r="24"/></g>`;
    if(card){
      const name=card.querySelector('b'),p=card.querySelector('p'),map=card.querySelector('.chip');
      if(name)name.textContent=d.venue;if(p)p.textContent=`${d.address} · ${d.time}`;
      if(map){map.href=d.map;map.textContent='Ver zona en el mapa'}
    }
  }

  const timeline=document.querySelector('.timeline');
  if(timeline){
    timeline.innerHTML=d.events.map(e=>`<div class="event reveal in"><div class="event-time">${e[0]}</div><div><div class="event-title">${e[1]}</div><div class="event-place">${e[2]}</div></div></div>`).join('');
  }

  const rsvp=document.querySelector('.rsvp');
  const form=document.getElementById('rsvp-form');
  if(rsvp&&form&&!rsvp.querySelector('.gate-progress')){
    const progress=document.createElement('div');progress.className='gate-progress';form.before(progress);
    form.addEventListener('submit',()=>{
      rsvp.classList.add('gate-complete');
      const cta=document.querySelector('.gate-closing-cta');if(cta)cta.hidden=true;
    });
  }

  const closing=document.querySelector('.closing');
  if(closing){
    if(!closing.querySelector('.gate-closing-bg')){
      const bg=document.createElement('div');bg.className='gate-closing-bg';closing.prepend(bg);
      const shutters=document.createElement('div');shutters.className='gate-closing-shutters';shutters.setAttribute('aria-hidden','true');shutters.innerHTML='<i></i><i></i><i></i>';bg.after(shutters);
    }
    const mark=closing.querySelector('.final-mark'),text=closing.querySelector('.final-text'),foot=closing.querySelector('.final-foot'),card=closing.querySelector('.final-card');
    if(mark)mark.textContent=d.initials;if(text)text.textContent=d.finalText;if(foot)foot.textContent=`${d.p1} & ${d.p2} · ${d.dateCompact}`;
    if(card&&!card.querySelector('.gate-closing-cta')){
      const a=document.createElement('a');a.className='gate-closing-cta';a.href='#rsvp-form';a.textContent='Confirmar asistencia';card.append(a);
    }
  }

  const calendar=document.getElementById('calendar');
  if(calendar){
    calendar.addEventListener('click',e=>{
      e.preventDefault();e.stopImmediatePropagation();
      const fmt=x=>new Date(x).toISOString().replace(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z');
      const safe=s=>String(s).replace(/[\\,;]/g,m=>'\\'+m).replace(/\n/g,'\\n');
      const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//GUEST//GOLD01//ES','BEGIN:VEVENT',
        `UID:gold01-${key}@weddlysmartdesign`,`DTSTAMP:${fmt(new Date())}`,`DTSTART:${fmt(d.dateISO)}`,`DTEND:${fmt(d.endISO)}`,
        `SUMMARY:${safe(`Boda de ${d.p1} y ${d.p2}`)}`,`LOCATION:${safe(d.address)}`,'END:VEVENT','END:VCALENDAR'];
      const url=URL.createObjectURL(new Blob([lines.join('\r\n')],{type:'text/calendar;charset=utf-8'}));
      const a=document.createElement('a');a.href=url;a.download=`${d.p1.toLowerCase()}-${d.p2.toLowerCase()}.ics`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1200);
    },true);
  }

  const target=new Date(d.dateISO).getTime();
  const refreshCountdown=()=>{
    let n=Math.max(0,target-Date.now());
    for(const [id,unit] of [['dd',86400000],['hh',3600000],['mm',60000],['ss',1000]]){
      const el=document.getElementById(id),v=Math.floor(n/unit);n-=v*unit;if(el)el.textContent=String(v).padStart(id==='dd'?3:2,'0');
    }
  };
  refreshCountdown();setInterval(refreshCountdown,400);

  window.__GOLD01_GATE={variant:key,data:{...d,hero:'[asset]',story:'[asset]'}};
})();