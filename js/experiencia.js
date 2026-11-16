/* Escena compartida, sin dependencias ni peticiones externas. Funciona con file:// y HTTP. */
(() => {
  'use strict';
  const root = document.documentElement;
  const body = document.body;
  const base = body.dataset.base || '.';
  const $ = selector => document.querySelector(selector);
  const clamp = (n, a = 0, b = 1) => Math.max(a, Math.min(b, n));
  const mix = (a, b, t) => a + (b - a) * t;
  const smooth = t => { t = clamp(t); return t * t * (3 - 2 * t); };
  const reducedQuery = matchMedia('(prefers-reduced-motion: reduce)');
  const mobileQuery = matchMedia('(max-width: 760px)');
  const members = [
    {
      id: 1, name: 'Camilo Rubiano', fullName: 'Camilo Rubiano', initials: 'CR', photo: '', subtitle: 'Integrante del grupo 02',
      chapters: [
        { title: 'Quién soy', nodes: [
          ['Identidad', 'Camilo Rubiano', 'Integrante del grupo 2 de Redes de Computadoras.'],
          ['Biografía', 'Una historia por conocer', 'Su presentación personal está pendiente de completar.'],
          ['Este recorrido', 'Redes de Computadoras', 'Modelos de comunicación, direccionamiento y capa de aplicación.']
        ] },
        { title: 'Lo aprendido en el curso', nodes: [
          ['01 / Modelos', 'OSI y sus siete capas', 'La función de cada capa en la comunicación entre dispositivos.'],
          ['02 / Direccionamiento', 'IPv4 y VLAN', 'Direcciones, subredes y segmentación lógica de una red.'],
          ['03 / Aplicación', 'HTTP', 'El intercambio de solicitudes y respuestas entre un cliente y un servidor web.']
        ] },
        { title: 'El curso en contexto', nodes: [
          ['Origen', 'Un cliente hace una solicitud', 'El navegador inicia la comunicación para obtener una página.'],
          ['Recorrido', 'La red transporta los datos', 'Las capas cooperan para llevar la información a su destino.'],
          ['Destino', 'La aplicación responde', 'La respuesta permite presentar el contenido a la persona que navega.']
        ] }
      ]
    },
    {
      id: 2, name: 'Diego Vargas', fullName: 'Diego Humberto Vargas Palacios', initials: 'DV', photo: 'img/integrante2.jpg', subtitle: 'Ingeniero de Sistemas · Universidad de Ibagué',
      chapters: [
        { title: 'Quién soy', nodes: [
          ['Formación', 'Ingeniería de Sistemas', 'Soy Diego Humberto Vargas Palacios, ingeniero de sistemas de la Universidad de Ibagué, en Tolima.'],
          ['Intereses', 'Lo que hace posible una aplicación', 'Me interesan las redes de comunicaciones y la infraestructura tecnológica, desde el cableado y el direccionamiento hasta los servicios web.'],
          ['Mi objetivo', 'Diseñar. Administrar. Optimizar.', 'Mi meta es trabajar en redes y sistemas, y seguir aprendiendo nuevas tecnologías.']
        ] },
        { title: 'Lo aprendido en el curso', nodes: [
          ['01 / Fundamentos', 'OSI, TCP/IP y medios físicos', 'Modelos de comunicación, estándares de cableado estructurado y acceso al medio, cableado e inalámbrico.'],
          ['02 / Red', 'IPv4, IPv6 y enrutamiento', 'Planes de direccionamiento, rutas estáticas y protocolos dinámicos como RIPv2 y OSPFv2.'],
          ['03 / Servicios', 'TCP, UDP, DNS y HTTP', 'El transporte y los servicios que permiten a las aplicaciones comunicarse.']
        ] },
        { title: 'Cómo se conectan los conceptos', nodes: [
          ['Infraestructura', 'Del cableado al enlace', 'La conexión física y el acceso al medio sostienen la comunicación.'],
          ['Organización', 'Una ruta para cada destino', 'El direccionamiento y el enrutamiento permiten alcanzar otras redes.'],
          ['Aplicación', 'Servicios para las personas', 'DNS resuelve nombres y HTTP/HTTPS permite acceder al contenido web.']
        ] }
      ]
    },
    {
      id: 3, name: 'Julián Rubiano', fullName: 'Julián Rubiano Santofimio', initials: 'JR', photo: 'img/integrante3.jpg', photoPosition: 'center 15%', subtitle: 'Estudiante de Ingeniería · Universidad de Ibagué',
      chapters: [
        { title: 'Quién soy', nodes: [
          ['Formación', 'Ingeniería, Universidad de Ibagué', 'Soy Julián Rubiano Santofimio, estudiante de Ingeniería de la Universidad de Ibagué.'],
          ['Mentalidad', 'Aprender es desafiarse', 'Estoy comprometido con aprender y desafiarme a mí mismo. Cada problema es una oportunidad para entender algo nuevo.'],
          ['Mi recorrido', 'De la idea a la conexión', 'En Redes y Comunicaciones IP he explorado cómo se conectan los dispositivos y cómo viaja la información.']
        ] },
        { title: 'Lo aprendido en el curso', nodes: [
          ['01 / Comprender', 'OSI, TCP/IP y topologías', 'Encapsulación, protocolos y medios de transmisión: UTP, fibra óptica y redes inalámbricas.'],
          ['02 / Diseñar', 'Subnetting y segmentación', 'IPv4, IPv6, máscaras, rangos de hosts, VLAN y enlaces troncales 802.1Q.'],
          ['03 / Experimentar', 'Cisco, GNS3 y virtualización', 'Simulación de topologías y máquinas virtuales para probar configuraciones y analizar la comunicación.']
        ] },
        { title: 'Lo que llevamos a la práctica', nodes: [
          ['Direccionamiento', 'Redes /27 y enlaces /30', 'En los talleres del grupo 2 usamos subredes con 30 hosts útiles y enlaces de tránsito entre routers.'],
          ['Enrutamiento', 'Tres routers, una red conectada', 'El laboratorio OSPFv2 integró el área 0 y las VLAN 10, 20, 30 y 40. Comprobamos conectividad mediante ping.'],
          ['Diagnóstico', 'Seguir el recorrido del paquete', 'Packet Tracer permite observar la relación entre HTTP, DNS, ARP, TCP y las direcciones IP y MAC.']
        ] }
      ]
    }
  ];

  const landing = $('#landing');
  const focusScene = $('#focus-scene');
  const focusPhoto = $('#focus-photo');
  const photoSlot = $('#selected-photo');
  const callouts = $('#callouts');
  const kicker = $('#chapter-kicker');
  const infoNodes = [...document.querySelectorAll('.callout')];
  const pinPaths = [...document.querySelectorAll('.pin-line')];
  const pinRings = [...document.querySelectorAll('.pin-ring')];
  const pinCores = [...document.querySelectorAll('.pin-core')];
  const nav = $('#chapter-navigation');
  const navButtons = [...nav.querySelectorAll('button')];
  const back = $('#back');
  const motionButton = $('#motion');
  const status = $('#screen-status');
  const hint = $('#hint-text');
  const counter = $('#scene-counter');
  // Resolver una sola vez conserva los enlaces después de cambiar la ruta.
  const mediaBase = new URL(base.replace(/\/$/, '') + '/', location.href).href;
  $('.brand').href = mediaBase + 'index.html';
  let selected = null;
  let currentChapter = -1;
  let chapterChangedAt = 0;
  let progress = 0;
  let targetProgress = 0;
  let elapsed = 0;
  let lastTime = 0;
  let motionPaused = reducedQuery.matches;
  let suspended = document.hidden;
  let pointerX = 0;
  let pointerY = 0;
  let width = innerWidth;
  let height = innerHeight;
  let frame = 0;

  function photoMarkup(member) {
    const frameLabel = `<span class="frame-id">G02 / NODO_0${member.id}</span>`;
    if (member.photo) return `<div class="photo-window"><img src="${mediaBase + member.photo}" alt="Retrato de ${member.fullName}" style="object-position: ${member.photoPosition || 'center 40%'}" draggable="false">${frameLabel}</div>`;
    return `<div class="photo-window"><div class="placeholder" role="img" aria-label="Espacio reservado para la foto de ${member.fullName}"><span class="initials" aria-hidden="true">${member.initials}</span><span class="reserved">FOTOGRAFÍA PENDIENTE</span></div>${frameLabel}</div>`;
  }
  members.forEach(member => {
    const link = document.createElement('a');
    link.className = 'member';
    link.href = `${mediaBase}integrantes/integrante${member.id}.html`;
    link.setAttribute('aria-label', `Explorar a ${member.fullName}`);
    link.innerHTML = `<div class="photo-frame">${photoMarkup(member)}</div><div class="member-caption"><b>0${member.id}</b><div><strong>${member.name}</strong><span>EXPLORAR PERFIL</span></div></div>`;
    link.addEventListener('click', event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      openMember(member.id, true, true);
    });
    landing.append(link);
  });

  function showChapter(index) {
    if (!selected || index === currentChapter) return;
    currentChapter = index;
    chapterChangedAt = performance.now();
    const chapter = selected.chapters[index];
    kicker.textContent = `0${index + 1} / ${chapter.title}`;
    chapter.nodes.forEach((data, i) => {
      infoNodes[i].querySelector('.callout-label').textContent = data[0];
      infoNodes[i].querySelector('h2').textContent = data[1];
      infoNodes[i].querySelector('p').textContent = data[2];
    });
    callouts.classList.toggle('left', index === 1);
    navButtons.forEach((button, i) => {
      button.setAttribute('aria-label', `${i + 1}. ${selected.chapters[i].title}`);
      if (i === index) button.setAttribute('aria-current', 'step');
      else button.removeAttribute('aria-current');
    });
    counter.textContent = `0${index + 1} / 03`;
    status.textContent = `${selected.name}: ${chapter.title}`;
  }

  function routeTo(id) {
    const route = id ? `${mediaBase}integrantes/integrante${id}.html` : `${mediaBase}index.html`;
    // history.pushState no admite cambiar de archivo bajo file:// en algunos navegadores.
    if (location.protocol !== 'file:') history.pushState({ member: id }, '', route);
  }

  function openMember(id, updateHistory = false, moveFocus = false) {
    selected = members.find(member => member.id === Number(id));
    if (!selected) return;
    progress = 0;
    targetProgress = 0;
    currentChapter = -1;
    photoSlot.innerHTML = photoMarkup(selected);
    $('#selected-name').textContent = selected.fullName;
    $('#selected-subtitle').textContent = selected.subtitle;
    $('#selected-number').textContent = `INTEGRANTE 0${selected.id}`;
    document.title = `${selected.name} · Redes y conexiones`;
    body.classList.remove('home');
    body.classList.add('exploring');
    landing.inert = true;
    landing.setAttribute('aria-hidden', 'true');
    focusScene.inert = false;
    focusScene.removeAttribute('aria-hidden');
    back.hidden = false;
    nav.hidden = false;
    $('#reading-progress').hidden = false;
    $('#scene-identifier').hidden = false;
    hint.textContent = 'Desplázate para descubrir';
    showChapter(0);
    scrollTo({ top: 0, behavior: 'instant' });
    if (updateHistory) routeTo(selected.id);
    if (moveFocus) $('#selected-name').focus({ preventScroll: true });
    renderLayout();
  }

  function goHome(updateHistory = false) {
    selected = null;
    body.classList.remove('exploring');
    body.classList.add('home');
    landing.inert = false;
    landing.removeAttribute('aria-hidden');
    focusScene.inert = true;
    focusScene.setAttribute('aria-hidden', 'true');
    back.hidden = true;
    nav.hidden = true;
    $('#reading-progress').hidden = true;
    $('#scene-identifier').hidden = true;
    counter.textContent = '03 NODOS';
    hint.textContent = 'Selecciona un retrato para explorar';
    document.title = 'Grupo 02 · Redes y conexiones';
    status.textContent = 'Elige uno de los tres integrantes';
    scrollTo({ top: 0, behavior: 'instant' });
    if (updateHistory) routeTo(null);
  }

  back.addEventListener('click', () => {
    const memberId = selected?.id;
    goHome(true);
    if (memberId) landing.querySelectorAll('.member')[memberId - 1].focus();
  });
  $('.brand').addEventListener('click', event => { event.preventDefault(); goHome(true); });
  navButtons.forEach((button, index) => button.addEventListener('click', () => {
    const range = root.scrollHeight - innerHeight;
    scrollTo({ top: range * (index / 2), behavior: motionPaused ? 'instant' : 'smooth' });
  }));
  addEventListener('keydown', event => {
    if (event.key === 'Escape' && selected) back.click();
  });
  addEventListener('popstate', () => {
    const id = location.pathname.match(/integrante([123])\.html$/)?.[1];
    if (id) openMember(id);
    else goHome();
  });

  function applyMotion() {
    body.classList.toggle('reduced-motion', motionPaused);
    motionButton.textContent = motionPaused ? 'Animación: pausada' : 'Animación: activa';
    motionButton.setAttribute('aria-pressed', String(motionPaused));
  }
  motionButton.addEventListener('click', () => { motionPaused = !motionPaused; applyMotion(); });
  reducedQuery.addEventListener('change', () => { motionPaused = reducedQuery.matches; applyMotion(); });
  applyMotion();

  // Conectores calculados con los bordes reales de foto y texto, también en móvil.
  function drawPins(opacity) {
    const photo = photoSlot.getBoundingClientRect();
    const toLeft = currentChapter === 1;
    pinPaths.forEach((path, i) => {
      const node = infoNodes[i].getBoundingClientRect();
      const x1 = photo.left + photo.width * [0.58, 0.72, 0.43][i];
      const y1 = photo.top + photo.height * [0.25, 0.52, 0.76][i];
      const x2 = node.left;
      const y2 = node.top + 9;
      const mid = mobileQuery.matches ? (x1 + (toLeft ? -24 : 24)) : mix(x1, x2, .5);
      path.setAttribute('d', `M${x1.toFixed(1)},${y1.toFixed(1)} L${mid.toFixed(1)},${y1.toFixed(1)} L${(x2 - 25).toFixed(1)},${y2.toFixed(1)} H${x2.toFixed(1)}`);
      const reveal = motionPaused ? 1 : smooth(((performance.now() - chapterChangedAt) / 1000 - i * .12) / .55);
      path.setAttribute('pathLength', '1');
      path.style.strokeDasharray = '1';
      path.style.strokeDashoffset = 1 - reveal;
      infoNodes[i].style.opacity = reveal;
      pinRings[i].style.opacity = reveal;
      pinCores[i].style.opacity = reveal;
      pinRings[i].setAttribute('cx', x1);
      pinRings[i].setAttribute('cy', y1);
      pinCores[i].setAttribute('cx', x1);
      pinCores[i].setAttribute('cy', y1);
    });
    $('#pin-layer').style.opacity = opacity;
  }

  function renderLayout() {
    if (!selected) return;
    const p = progress * 2;
    const phase = Math.min(2, Math.floor(p));
    const t = p - phase;
    const transition = smooth((t - .2) / .65);
    const left = mobileQuery.matches ? 27 : 27;
    const right = mobileQuery.matches ? 73 : 73;
    const x = phase === 0 ? mix(left, right, transition) : phase === 1 ? mix(right, left, transition) : left;
    const contentIndex = Math.min(2, phase + (t > .53 ? 1 : 0));
    const opacity = motionPaused ? 1 : (phase < 2 ? 1 - .96 * Math.pow(Math.sin(transition * Math.PI), 4) : 1);
    showChapter(contentIndex);
    root.style.setProperty('--photo-x', x.toFixed(3));
    root.style.setProperty('--progress', progress.toFixed(4));
    focusPhoto.style.setProperty('--angle', motionPaused ? '0deg' : (mix(19, -19, (x - left) / (right - left)) + pointerX * 2).toFixed(2) + 'deg');
    focusPhoto.style.setProperty('--roll', motionPaused ? '0deg' : mix(-4, 4, (x - left) / (right - left)).toFixed(2) + 'deg');
    focusPhoto.style.setProperty('--scale', motionPaused ? 1 : 1 - Math.sin(transition * Math.PI) * .1);
    callouts.style.setProperty('--info-opacity', opacity.toFixed(3));
    callouts.style.setProperty('--info-shift', ((1 - opacity) * 12).toFixed(1) + 'px');
    drawPins(opacity);
    hint.textContent = progress > .98 ? 'Fin del recorrido · vuelve al equipo' : 'Desplázate para descubrir';
  }

  // Entorno 3D proyectado sobre Canvas: pantallas lejanas, vórtice y partículas.
  // No se utilizan vídeos, librerías ni recursos de red para la animación.
  const canvas = $('#storm');
  const ctx = canvas.getContext('2d', { alpha: false });
  let dpr = 1;
  let seed = 92;
  const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  const stars = Array.from({ length: 140 }, () => ({ x: random(), y: random(), z: random(), a: random() }));
  const panels = Array.from({ length: 28 }, (_, i) => ({
    x: (i % 2 ? 1 : -1) * (260 + random() * 850), y: (random() - .5) * 1300,
    z: 180 + random() * 1300, width: 150 + random() * 140, height: 85 + random() * 85,
    tilt: (i % 2 ? -1 : 1) * (.22 + random() * .55), phase: random() * 6.28, mode: i % 3
  })).sort((a, b) => b.z - a.z);
  const sparks = Array.from({ length: 350 }, () => ({ h: random(), angle: random() * Math.PI * 2, spread: random(), size: random() }));

  function resize() {
    width = innerWidth;
    height = innerHeight;
    dpr = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    renderLayout();
  }

  function project(x, y, z, cx = width * .52, cy = height * .47) {
    const fov = Math.min(width, height) * .95;
    const s = fov / (fov + z + 300);
    return { x: cx + (x - pointerX * 22) * s, y: cy + (y - pointerY * 14) * s, s };
  }

  function drawPanel(panel, time) {
    const drift = Math.sin(time * .18 + panel.phase) * 35;
    const corners = [[-1,-1],[1,-1],[1,1],[-1,1]].map(([x,y]) => project(
      panel.x + x * panel.width * .5 * Math.cos(panel.tilt),
      panel.y + y * panel.height * .5 + drift,
      panel.z + x * panel.width * .5 * Math.sin(panel.tilt)
    ));
    const alpha = selected ? .11 : .22;
    ctx.beginPath();
    corners.forEach((p,i) => i ? ctx.lineTo(p.x,p.y) : ctx.moveTo(p.x,p.y));
    ctx.closePath();
    ctx.fillStyle = `rgba(10,42,65,${alpha * .45})`;
    ctx.fill();
    ctx.strokeStyle = `rgba(68,166,213,${alpha})`;
    ctx.lineWidth = .7;
    ctx.stroke();
    const p = corners[0], r = corners[1], b = corners[3];
    const px = (u,v) => ({ x: mix(p.x,r.x,u) + (b.x-p.x)*v, y: mix(p.y,r.y,u) + (b.y-p.y)*v });
    const line = (x,y,x2,y2,a = 1) => {
      const s = px(x,y),e = px(x2,y2);
      ctx.strokeStyle = `rgba(85,183,222,${alpha * a})`;
      ctx.beginPath();ctx.moveTo(s.x,s.y);ctx.lineTo(e.x,e.y);ctx.stroke();
    };
    line(0,.15,1,.15,.8);
    if (panel.mode === 0) {
      for(let i=0;i<5;i++) line(.12,.29+i*.12,.32+(i%3)*.2,.29+i*.12,.6);
    } else if (panel.mode === 1) {
      const points = [[.2,.48],[.5,.3],[.78,.48],[.5,.78]];
      points.forEach((point,i) => {
        const a=px(...point),b=px(...points[(i+1)%4]);
        ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();
        ctx.fillStyle=`rgba(96,215,238,${alpha * 1.6})`;ctx.fillRect(a.x-1,a.y-1,2,2);
      });
    } else {
      ctx.beginPath();
      for(let i=0;i<25;i++) {
        const p=px(.1+i*.032,.56+Math.sin(i*.9+time*.6+panel.phase)*.14);
        i ? ctx.lineTo(p.x,p.y) : ctx.moveTo(p.x,p.y);
      }
      ctx.strokeStyle=`rgba(104,216,238,${alpha})`;ctx.stroke();
    }
  }

  function drawWorld(time) {
    if (!ctx) return;
    ctx.fillStyle = '#030910';ctx.fillRect(0,0,width,height);
    const cx = width * .52, cy = height * .47;
    const glow = ctx.createRadialGradient(cx,cy,0,cx,cy,Math.max(width,height)*.63);
    glow.addColorStop(0, selected ? '#072038' : '#08273a');
    glow.addColorStop(.43, '#041322');glow.addColorStop(1,'#02060c');
    ctx.fillStyle=glow;ctx.fillRect(0,0,width,height);
    panels.forEach(panel => drawPanel(panel,time));
    stars.forEach(star => {
      const x = (star.x * width + pointerX * star.z * -15 + width) % width;
      const y = (star.y * height + time * (2 + star.z * 4)) % height;
      ctx.fillStyle=`rgba(133,210,241,${.08+star.a*.3})`;
      ctx.fillRect(x,y,star.z>.8?1.6:1,star.z>.8?1.6:1);
    });
    const radius = Math.min(width * (mobileQuery.matches ? .43 : .245), 365);
    const towerHeight = height * .86;
    const vortexOpacity = selected ? .42 : .9;
    const yAt = h => (h - .5) * towerHeight;
    const radiusAt = h => radius * (.11 + Math.pow(1-h,1.5) * .9 + Math.sin(h*7)*.04);
    if (!selected) {
      const atmosphere = ctx.createRadialGradient(cx, cy - height * .12, 5, cx, cy - height * .12, radius * .9);
      atmosphere.addColorStop(0, 'rgba(40,161,224,.11)');
      atmosphere.addColorStop(.55, 'rgba(17,101,184,.055)');
      atmosphere.addColorStop(1, 'rgba(0,40,80,0)');
      ctx.fillStyle = atmosphere;
      ctx.fillRect(cx-radius,cy-height*.12-radius,radius*2,radius*2);
    }
    // Hélices del vórtice: la profundidad determina la intensidad del trazo.
    for(let strand=0;strand<14;strand++) {
      ctx.beginPath();
      for(let i=0;i<=100;i++) {
        const h=i/100;
        const a=h*17-time*(.45+strand*.006)+strand*.45;
        const r=radiusAt(h)*(1+Math.sin(h*15+strand)*.055);
        const p=project(Math.cos(a)*r,yAt(h),Math.sin(a)*r*.8-160);
        i ? ctx.lineTo(p.x,p.y) : ctx.moveTo(p.x,p.y);
      }
      ctx.strokeStyle=`rgba(${strand%3===0?'108,226,250':'36,132,210'},${(.12+strand%3*.035)*vortexOpacity})`;
      ctx.lineWidth=strand%4===0?1.2:.6;ctx.stroke();
    }
    // Anillos elípticos y partículas del torbellino.
    for(let band=0;band<34;band++) {
      const h=(band/34+time*.018)%1;
      const r=radiusAt(h);
      ctx.beginPath();
      for(let j=0;j<=68;j++) {
        const a=j/68*Math.PI*2+time*.08;
        const p=project(Math.cos(a)*r,yAt(h),Math.sin(a)*r*.8-160);
        j ? ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y);
      }
      ctx.strokeStyle=`rgba(55,169,234,${.11*vortexOpacity})`;ctx.lineWidth=.5;ctx.stroke();
    }
    for(let strand=0;strand<5;strand++) {
      for(let i=0;i<125;i++) {
        const h=(i/125+time*.028)%1;
        const a=h*20-time*.8+strand*1.256;
        const r=radiusAt(h)*(1+Math.sin(i*18.3+strand)*.045);
        const z=Math.sin(a)*r*.8-160;
        const p=project(Math.cos(a)*r,yAt(h),z);
        const alpha=(.2+clamp((-z+200)/600)*.65)*vortexOpacity;
        ctx.fillStyle=`rgba(${i%7===0?'195,253,255':'91,201,250'},${alpha})`;
        const size=(i%11===0?2.2:1.15)*p.s;
        ctx.fillRect(p.x,p.y,size,size);
      }
    }
    sparks.forEach((spark,i) => {
      const h=(spark.h+time*.025)%1;
      const a=spark.angle-time*(.15+spark.spread*.3);
      const r=radiusAt(h)*(1.1+spark.spread*1.3);
      const p=project(Math.cos(a)*r,yAt(h),Math.sin(a)*r-140);
      ctx.fillStyle=`rgba(100,206,246,${(.08+spark.size*.28)*vortexOpacity})`;
      ctx.fillRect(p.x,p.y,i%8===0?1.8:.8,i%8===0?1.8:.8);
    });
    // Filamentos eléctricos continuos: sin destellos ni estroboscopio.
    ctx.save();ctx.shadowColor='#28d4ff';ctx.shadowBlur=12;
    for(let branch=0;branch<3;branch++) {
      ctx.beginPath();
      for(let i=0;i<37;i++) {
        const h=i/36;
        const x=Math.sin(h*32+time*.6+branch*2)*radiusAt(h)*.18+Math.cos(h*9+time*.25+branch)*radiusAt(h)*.23;
        const p=project(x,yAt(h),-140);
        i ? ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y);
      }
      ctx.lineWidth=branch===0?1.3:.6;ctx.strokeStyle=`rgba(150,245,255,${(branch===0?.48:.2)*vortexOpacity})`;ctx.stroke();
    }
    ctx.restore();
    const floorY=height*.88;
    for(let i=0;i<5;i++) {
      ctx.beginPath();ctx.ellipse(cx,floorY,radius*(.35+i*.26),14+i*9,0,0,Math.PI*2);
      ctx.strokeStyle=`rgba(81,173,220,${(.12-i*.018)*vortexOpacity})`;ctx.lineWidth=.7;ctx.stroke();
    }
    const core=ctx.createRadialGradient(cx,floorY,0,cx,floorY,80);
    core.addColorStop(0,`rgba(98,225,255,${.22*vortexOpacity})`);core.addColorStop(1,'rgba(0,80,160,0)');
    ctx.fillStyle=core;ctx.fillRect(cx-80,floorY-80,160,160);
  }

  function tick(now) {
    const delta = lastTime ? Math.min((now-lastTime)/1000,.05) : .016;
    lastTime=now;
    if (!suspended) {
      if (!motionPaused) elapsed+=delta;
      const range=root.scrollHeight-innerHeight;
      targetProgress=selected&&range>0?clamp(scrollY/range):0;
      const previous=progress;
      progress=motionPaused?targetProgress:mix(progress,targetProgress,1-Math.exp(-delta*12));
      if (Math.abs(progress-targetProgress)<.0001) progress=targetProgress;
      if (selected && (Math.abs(previous-progress)>.00001 || frame%3===0)) renderLayout();
      if (!motionPaused || frame%30===0) drawWorld(elapsed);
      frame++;
    }
    requestAnimationFrame(tick);
  }
  addEventListener('resize',resize,{passive:true});
  addEventListener('pointermove',event => {
    if (event.pointerType!=='mouse' || motionPaused) return;
    pointerX=clamp(event.clientX/width*2-1,-1,1);
    pointerY=clamp(event.clientY/height*2-1,-1,1);
  },{passive:true});
  addEventListener('blur',()=>{ pointerX=0;pointerY=0; });
  document.addEventListener('visibilitychange',()=>{suspended=document.hidden;lastTime=0;});
  resize();
  const initial=Number(body.dataset.member);
  if (initial) openMember(initial);
  else goHome();
  // Si una imagen no está disponible, conservar el espacio reservado.
  document.addEventListener('error',event => {
    if (event.target.tagName!=='IMG') return;
    const member=members.find(person=>event.target.alt.includes(person.fullName));
    if (!member) return;
    const empty={...member,photo:''};
    event.target.closest('.photo-window').outerHTML=photoMarkup(empty);
  },true);
  requestAnimationFrame(tick);
})();
