/* Decraye Développement — animations, navigation et formulaire */
(() => {
  const $ = s => document.querySelector(s),
    $$ = s => [...document.querySelectorAll(s)];
  const rm = matchMedia('(prefers-reduced-motion:reduce)').matches;
  $('#y').textContent = new Date().getFullYear();
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target)
    }
  }), {
    threshold: .15
  });
  $$('[data-r]').forEach(el => io.observe(el));
  const steps = $$('.step'),
    box = $('#steps'),
    hd = $('#top'),
    bar = $('#bar'),
    pt = $('#portrait'),
    secs = $$('main section[id]'),
    links = $$('nav a[href^="#"]:not(.btn)');
  let ly = 0,
    tick = false;

  function onScroll() {
    const y = scrollY,
      h = document.documentElement.scrollHeight - innerHeight;
    bar.style.setProperty('--sp', h ? y / h : 0);
    hd.classList.toggle('solid', y > 20);
    hd.classList.toggle('hide', y > ly && y > 300 && !$('#nav').classList.contains('open'));
    ly = y;
    if (!rm && pt && y < innerHeight) pt.style.setProperty('--py', (y * -.06) + 'px');
    const r = box.getBoundingClientRect(),
      mid = innerHeight * .55;
    box.style.setProperty('--mp', Math.min(1, Math.max(0, (mid - r.top) / r.height)));
    steps.forEach(s => s.classList.toggle('on', s.getBoundingClientRect().top < mid));
    let cur = '';
    secs.forEach(s => {
      if (s.getBoundingClientRect().top < innerHeight * .4) cur = s.id
    });
    links.forEach(a => a.classList.toggle('act', a.getAttribute('href') === '#' + cur));
    tick = false
  }
  addEventListener('scroll', () => {
    if (!tick) {
      tick = true;
      requestAnimationFrame(onScroll)
    }
  }, {
    passive: true
  });
  onScroll();
  $$('.row').forEach(r => r.addEventListener('pointermove', e => {
    const b = r.getBoundingClientRect();
    r.style.setProperty('--x', e.clientX - b.left + 'px');
    r.style.setProperty('--y', e.clientY - b.top + 'px')
  }));
  if (!rm) $$('.btn').forEach(b => {
    b.addEventListener('pointermove', e => {
      const r = b.getBoundingClientRect();
      b.style.transform = `translate(${(e.clientX-r.left-r.width/2)*.12}px,${(e.clientY-r.top-r.height/2)*.2}px)`
    });
    b.addEventListener('pointerleave', () => b.style.transform = '')
  });
  const bg = $('#burger'),
    nv = $('#nav');
  bg.onclick = () => {
    const o = nv.classList.toggle('open');
    bg.setAttribute('aria-expanded', o)
  };
  $$('nav a').forEach(a => a.addEventListener('click', () => {
    nv.classList.remove('open');
    bg.setAttribute('aria-expanded', false)
  }));
  $('#form').addEventListener('submit', e => {
    e.preventDefault();
    const f = e.target,
      m = $('#msg');
    if (!f.checkValidity() || !f.email.value.includes('@')) {
      m.textContent = 'Merci de renseigner votre prénom, nom, e-mail et message.';
      f.reportValidity();
      return
    }
    const body = `Nom : ${f.prenom.value} ${f.nom.value}\nE-mail : ${f.email.value}\nActivité : ${f.activite.value}\n\n${f.message.value}`;
    location.href = 'mailto:nathan@decrayedeveloppement.be?subject=' + encodeURIComponent('Demande de contact — ' + f.prenom.value + ' ' + f.nom.value) + '&body=' + encodeURIComponent(body);
    m.textContent = 'Votre messagerie s’ouvre avec le message prêt à envoyer à nathan@decrayedeveloppement.be.'
  });
})();