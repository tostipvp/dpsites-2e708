/* =========================================================================
   dpsites — scripts/main.js  (geen dependencies, geladen met `defer`)
   1 menu · 2 header + vaste CTA · 3 actieve link · 4 branche-demo (hero)
   5 voor/na · 6 "meer info"-modals · 7 formulieren · 8 klik-meting · 9 bedankpagina + jaartal
   ========================================================================= */
document.documentElement.classList.add('js');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* 1. Mobiel menu ---------------------------------------------------------- */
const toggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('hoofdmenu');
if (toggle && nav) {
  const setOpen = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) { setOpen(false); toggle.focus(); }
  });
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
  matchMedia('(min-width: 1024px)').addEventListener('change', () => setOpen(false));
}

/* 2. Headerrand na scrollen + vaste offerteknop na 400px ------------------- */
const header = document.querySelector('.site-header');
const stickyCta = document.querySelector('.sticky-cta');
const onScroll = () => {
  header?.classList.toggle('is-scrolled', scrollY > 8);
  stickyCta?.setAttribute('data-hidden', String(scrollY < 400));
};
addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* 3. Actieve pagina markeren (werkt ook met nette URL's zonder .html) ------ */
const norm = (path) => path.replace(/(index)?(\.html)?$/, '');
const here = norm(location.pathname);
document.querySelectorAll('.primary-nav ul a').forEach((a) => {
  if (norm(new URL(a.href).pathname) === here) a.setAttribute('aria-current', 'page');
});

/* 4. Branche-demo in de hero: teksten en kleuren wisselen ------------------ */
const THEMES = {
  kapsalon: { label: 'een kapsalon', naam: 'Kapsalon Knipperlicht', url: 'knipperlicht.nl', kop: 'Knippen zonder wachttijd.',
    tekst: 'Plan online je afspraak, ook ’s avonds.', cta: 'Maak een afspraak', uren: 'Di–za 9:00–18:00', kaarten: ['Knippen', 'Kleuren', 'Baard'] },
  installateur: { label: 'een installatiebedrijf', naam: 'Droogstra Installatie', url: 'droogstra.nl', kop: 'Lekkage? Wij komen vandaag nog.',
    tekst: 'Loodgieter en cv-monteur in de regio.', cta: 'Bel voor spoed', uren: '24/7 bereikbaar', kaarten: ['Lekkage', 'Cv-ketel', 'Badkamer'] },
  restaurant: { label: 'een restaurant', naam: 'Eetcafé De Vork', url: 'eetcafedevork.nl', kop: 'Eerlijk eten, midden in de stad.',
    tekst: 'Lunch, diner en een goed glas wijn.', cta: 'Reserveer een tafel', uren: 'Wo–zo vanaf 11:00', kaarten: ['Lunch', 'Diner', 'Borrel'] },
  bakkerij: { label: 'een bakkerij', naam: 'Bakkerij Meelwerk', url: 'bakkerijmeelwerk.nl', kop: 'Elke ochtend vers uit eigen oven.',
    tekst: 'Bestel vandaag, haal morgen op.', cta: 'Bestel voor morgen', uren: 'Di–za vanaf 7:00', kaarten: ['Brood', 'Taart', 'Koffie'] },
};
document.querySelectorAll('[data-switcher]').forEach((group) => {
  const demo = document.getElementById(group.dataset.switcher);
  if (!demo) return;
  const slot = (name) => demo.querySelector(`[data-slot="${name}"]`);
  group.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-theme-btn]');
    const key = btn?.dataset.themeBtn;
    const t = THEMES[key];
    if (!t) return;
    demo.dataset.theme = key;
    ['naam', 'url', 'kop', 'tekst', 'cta', 'uren'].forEach((k) => { const el = slot(k); if (el) el.textContent = t[k]; });
    t.kaarten.forEach((txt, i) => { const el = slot(`k${i + 1}`); if (el) el.textContent = txt; });
    slot('icoon')?.setAttribute('href', `assets/icons.svg#b-${key}`);
    slot('label')?.setAttribute('aria-label', `Voorbeeld van een website voor ${t.label}`);
    group.querySelectorAll('[data-theme-btn]').forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
    if (!reduce) demo.querySelector('.demo-page')?.animate([{ opacity: .35 }, { opacity: 1 }], { duration: 350, easing: 'ease-out' });
  });
});

/* 5. Voor/na-vergelijking (portfolio) -------------------------------------- */
document.querySelectorAll('[data-compare]').forEach((btn) => btn.addEventListener('click', () => {
  document.getElementById(btn.dataset.compare)?.classList.toggle('is-before', btn.dataset.state === 'voor');
  btn.parentElement.querySelectorAll('[data-compare]').forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
}));

/* 6. "Meer info"-modals (native <dialog>: focus en Esc regelt de browser) --- */
document.querySelectorAll('[data-modal]').forEach((btn) => {
  const dialog = document.getElementById(btn.dataset.modal);
  if (typeof dialog?.showModal === 'function') btn.addEventListener('click', () => dialog.showModal());
});
document.querySelectorAll('dialog.modal').forEach((dialog) => {
  dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); }); // klik op de achtergrond sluit
});

/* 7. Formulieren: validatie + verzenden ------------------------------------ */
const MSG = {
  valueMissing: (label) => `Vul je ${label} in.`,
  typeMismatch: () => 'Vul een geldig e-mailadres in, bijvoorbeeld naam@bedrijf.nl.',
  tooShort: (label, el) => `Je ${label} is nog wat kort. Gebruik minimaal ${el.minLength} tekens.`,
  patternMismatch: () => 'Vul een geldig telefoonnummer in, bijvoorbeeld 06 12345678.',
  tooFast: 'Dat ging wel erg snel. Wacht een paar seconden en verstuur opnieuw.',
  error: 'Versturen is niet gelukt. Probeer het opnieuw, bel 0610582559 of mail donvandriel08@hotmail.com.',
};
const labelOf = (el) => (el.dataset.label || el.labels?.[0]?.textContent || 'gegevens').replace(/\(verplicht\)/i, '').trim().toLowerCase();

function validate(el) {
  const err = document.getElementById(`${el.id}-error`);
  if (!el.id || !err) return true;
  const v = el.validity;
  const msg = v.valueMissing ? (el.dataset.msg || MSG.valueMissing(labelOf(el)))
    : v.typeMismatch ? MSG.typeMismatch()
    : v.tooShort ? MSG.tooShort(labelOf(el), el)
    : v.patternMismatch ? MSG.patternMismatch() : '';
  el.setAttribute('aria-invalid', String(Boolean(msg)));
  err.textContent = msg;
  err.hidden = !msg;
  return !msg;
}

// Demo-modus (er wordt niets verstuurd): lokaal (file:// of localhost) of met <html data-demo> op een previewlink.
// Live op Netlify gaat de POST naar Netlify Forms; met data-endpoint="https://formspree.io/f/…" naar Formspree.
async function send(form) {
  const local = location.protocol === 'file:' || ['localhost', '127.0.0.1'].includes(location.hostname)
    || 'demo' in document.documentElement.dataset;
  if (local) { await new Promise((r) => setTimeout(r, 600)); return true; }
  const res = await fetch(form.dataset.endpoint || '/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
    body: new URLSearchParams(new FormData(form)).toString(),
  });
  return res.ok;
}

const params = new URLSearchParams(location.search);
document.querySelectorAll('form[data-validate]').forEach((form) => {
  const loadedAt = Date.now();
  const fields = [...form.querySelectorAll('input:not([type="hidden"]):not([tabindex="-1"]), textarea, select')];
  const status = form.querySelector('.form-status');
  const counter = form.querySelector('[data-counter]');
  const msgField = form.querySelector('textarea[maxlength]');
  msgField?.addEventListener('input', () => { if (counter) counter.textContent = `${msgField.value.length} / ${msgField.maxLength} tekens`; });

  // Voorselectie via de link, bijv. contact.html?type=nieuw&aanvraag=gratis-voorbeeld
  const type = form.querySelector('select[name="type"]');
  if (type && [...type.options].some((o) => o.value === params.get('type'))) type.value = params.get('type');
  form.querySelectorAll('input[name="aanvraag"]').forEach((r) => { if (r.value === params.get('aanvraag')) r.checked = true; });

  // Verborgen velden voor bronvermelding (alleen uit de URL, er wordt niets opgeslagen)
  const setHidden = (name, value) => { const f = form.querySelector(`[name="${name}"]`); if (f && value) f.value = value; };
  setHidden('page_url', location.origin + location.pathname);
  ['utm_source', 'utm_medium', 'utm_campaign'].forEach((k) => setHidden(k, params.get(k)));

  fields.forEach((el) => {
    el.addEventListener('blur', () => { if (el.required || el.value) validate(el); });
    el.addEventListener('input', () => { if (el.getAttribute('aria-invalid') === 'true') validate(el); });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (status) status.textContent = '';
    const results = fields.map(validate);
    if (results.includes(false)) { fields[results.indexOf(false)].focus(); return; }
    if (form.querySelector('[name="website"]')?.value) return;          // honeypot gevuld: stil negeren
    if (Date.now() - loadedAt < 3000) { status.textContent = MSG.tooFast; status.focus(); return; }

    const btn = form.querySelector('[type="submit"]');
    const label = btn.textContent;
    btn.disabled = true; btn.textContent = 'Bezig met versturen…';
    try {
      if (!(await send(form))) throw new Error('Verzenden mislukt');
      window.plausible?.('Lead', { props: { formulier: form.name } });   // Plausible-doel (optioneel)
      window.gtag?.('event', 'generate_lead', { form_name: form.name });  // GA4-event (optioneel)
      // Voornaam via sessionStorage (nooit persoonsgegevens in de URL); verdwijnt bij sluiten tabblad
      try { sessionStorage.setItem('lead_naam', form.querySelector('[name="name"]')?.value.trim().split(' ')[0] || ''); } catch {}
      location.href = form.dataset.success || 'bedankt.html';
    } catch {
      status.textContent = MSG.error; status.focus();
      btn.disabled = false; btn.textContent = label;
    }
  });
});

/* 8. Klik-meting voor bellen en mailen (alleen als Plausible/GA4 actief is) - */
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href^="tel:"], a[href^="mailto:"]');
  if (!link) return;
  const bellen = link.href.startsWith('tel:');
  window.plausible?.(bellen ? 'Bellen' : 'Mailen');
  window.gtag?.('event', bellen ? 'click_to_call' : 'click_email');
});

/* 9. Bedankpagina: voornaam tonen + jaartal in footer ---------------------- */
const thanks = document.querySelector('[data-thanks-name]');
try {
  const naam = sessionStorage.getItem('lead_naam');
  if (thanks && naam) thanks.textContent = `, ${naam}`;
} catch {}
document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
