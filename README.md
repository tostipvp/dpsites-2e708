# dpsites: website van Don van Driel

> Een nieuwe website vanaf €500.

De showcase- en verkoopsite van **dpsites** (Don van Driel, 0610582559, donvandriel08@hotmail.com),
gebouwd op de blueprint-starter. Pure HTML, één CSS-bestand met design tokens en ±11 KB vanilla
JavaScript: geen framework, geen build-stap. Elke pagina stuurt op twee acties: **Vraag offerte aan**
en **Bel nu**. De hero bevat een interactieve demo waarin een bezoeker zijn eigen branche kiest en de
website ziet veranderen; het portfolio toont voor-en-navergelijkingen.

## 1. Lokaal bekijken

```bash
python -m http.server 8080
```
Open daarna http://localhost:8080. (Of: `npx serve .` → http://localhost:3000.)

- Dubbelklikken op `index.html` werkt ook, maar dan laden de iconen niet in Chrome (beperking van `file://`).
- Formulieren draaien lokaal in **demo-modus**: na validatie ga je naar `bedankt.html`, er wordt niets verstuurd.
  Wil je die demo-modus ook op een previewlink zonder formulierdienst? Zet `data-demo` op de `<html>`-tag.
- Een klantsite in dezelfde stijl als de portfoliovoorbeelden laten bouwen? Gebruik `prompt-showcase-websites.txt`.

## 2. Aanpassen

**Kleuren en fonts:** open `styles/styles.css` en wijzig alleen sectie 1 (`:root`). Belangrijkste tokens:
`--color-black` (#0B0B0C), `--color-accent` (elektrisch blauw #3D6BFF), `--color-primary` (linkblauw #2952E6),
`--font-heading` (Bricolage Grotesque) en `--font-body` (Figtree). Check na een wijziging het contrast
(≥ 4,5:1) met webaim.org/resources/contrastchecker. Nieuwe fonts? Pas ook de Bunny Fonts-link in de
`<head>` van elke pagina aan.

**Logo:** het logo is HTML (`<span class="logo-mark">dp</span>` + "websites") in header en footer. Eigen
SVG-logo? Vervang die twee spans door een inline `<svg>` van 32–40px hoog. Werk ook `favicon.svg`,
`images/logo.png` en `images/apple-touch-icon.png` bij.

**Teksten:** staan direct in de HTML. Omdat er geen build-stap is, staan header en footer uitgeschreven
in elke pagina; de bronversies staan in `components/`. Wijzig je de header, pas hem dan in alle pagina's aan
(zoek-en-vervang in je editor).

**Prijzen (exclusief btw):** Nieuwe website vanaf €500, Website vernieuwen vanaf €500, Hosting en onderhoud €20 per
maand; Maatwerk op aanvraag. Ze staan in `index.html`, `services.html`, `pricing.html`,
de meta descriptions van die pagina's, `priceRange` in de JSON-LD van `index.html` en in
`content/demo-pitch.md`. Gebruik je de kleineondernemersregeling (KOR)? Vervang dan "excl. btw" door "geen btw".

**Reviews:** de drie reviews op de homepage zijn **voorbeeldreviews** en zo gelabeld. Vervang ze door echte
reviews (met toestemming) en haal dan het label weg. Gebruik nooit verzonnen reviews als echte: dat is
misleidend en in de EU verboden.

**Portfolio:** de vier projecten zijn voorbeeldontwerpen met verzonnen namen (dat staat ook op de site).
Vervang ze door echte klantprojecten zodra je die hebt; zie `components/showcase-card.html` voor de
variant met een echte screenshot (`srcset` + `loading="lazy"`).

**Branche toevoegen aan de hero-demo:** knop in de `.switcher` (index.html) + regel in `THEMES`
(scripts/main.js) + `.demo[data-theme="…"]` met kleuren (styles.css) + icoon `b-…` (assets/icons.svg).

## 3. Vervangtabel

| Placeholder | Nu ingevuld als | Waar het staat |
|---|---|---|
| **[BEDRIJFSNAAM]** | `dpsites` | Alle HTML: `<title>`, `og:site_name`, logo-`aria-label`, footer, JSON-LD `name`; README, LICENSE, manifest, templates, `og-image.jpg` (in beeld) |
| **[TELEFOON]** | `0610582559` (in JSON-LD: `+31610582559`) | Alle `tel:`-links: header (2×), hero, belkaart, CTA-banden, vaste CTA-balk, footer; meta descriptions; `scripts/main.js` (foutmelding `MSG.error`); privacy, bedankt, 404; templates; `og-image.jpg` (in beeld) |
| **[EMAIL]** | `donvandriel08@hotmail.com` | Alle `mailto:`-links: footer, belkaart, review-verzoek; JSON-LD; `scripts/main.js` (`MSG.error`); privacy, bedankt; templates; `api/contact.js` |
| **[PRIMAIRE_CTA]** | `Vraag offerte aan` | Blauwe knoppen: header, hero, vaste CTA-balk, CTA-banden, pakketten, modals, 404 |

**Nog in te vullen vóór livegang:** `[DOMEIN]` (canonical, og:url, og:image, JSON-LD, robots.txt,
sitemap.xml), `[PLAATS]`, `[POSTCODE]`, `[PROVINCIE]`, `[STRAAT_HUISNUMMER]`, `[REGIO]` (JSON-LD in
index.html) en `[KVK]` (uitgecommentarieerd in de footer en privacy.html). Werk je vanuit huis en wil je
je straat niet tonen? Verwijder dan de regel `streetAddress`.

Placeholders vinden en in één keer vervangen (voorbeeld voor `[DOMEIN]`):

```powershell
Select-String -Path *.html,*.xml,*.txt -Pattern '\[[A-Z_]+\]' | Select-Object Filename, LineNumber, Line
Get-ChildItem -Recurse -File -Include *.html,*.xml,*.txt,*.js | ForEach-Object { $t = [IO.File]::ReadAllText($_.FullName); [IO.File]::WriteAllText($_.FullName, $t.Replace('[DOMEIN]', 'dpsites.nl')) }
```
```bash
grep -rnE --include=*.html --include=*.xml --include=*.txt "\[[A-Z_]+\]" .
grep -rl "\[DOMEIN\]" --include=*.html --include=*.xml --include=*.txt . | xargs sed -i 's/\[DOMEIN\]/dpsites.nl/g'   # macOS: sed -i ''
```
Verander je telefoonnummer? Vervang zowel `0610582559` als `+31610582559`, en maak een nieuwe `og-image.jpg`
(1200×630, bijv. in Canva): het nummer staat in het plaatje.

## 4. Formulieren beheren (Netlify Forms)

1. Na de eerste deploy: **Site configuration → Forms → Enable form detection** (in nieuwere Netlify-versies
   heet een site een *project*). Deploy daarna opnieuw; Netlify vindt dan de formulieren `offerte`
   (contact.html) en `offerte-home` (index.html).
2. **Meldingen:** Site configuration → Notifications → Emails and webhooks → *Form submission notifications*
   → Add notification → e-mail naar donvandriel08@hotmail.com.
3. **Inzendingen bekijken/exporteren:** tabblad *Forms* → kies het formulier → *Download as CSV*.
4. **Spam:** er zit een honeypot (`website`) en een tijdval van 3 seconden in; Netlify filtert daarnaast zelf.
   Kijk af en toe in de spam-lijst van het formulier.
5. **Bevestigingsmail aan de klant:** Netlify verstuurt die niet zelf. Gebruik de tekst uit
   `templates/email-notificatie.txt` (deel 2) in Zapier of Make: trigger "nieuwe Netlify-inzending" → e-mail.
6. **Testen:** vul na elke deploy het formulier op de live site in en controleer of de melding binnenkomt.

**Alternatief zonder Netlify:** Formspree. Maak een formulier aan op formspree.io, zet
`data-endpoint="https://formspree.io/f/JOUW_ID"` op beide `<form>`-tags en verwijder `data-netlify` en
`netlify-honeypot`. Op Vercel: `data-endpoint="/api/contact"` + de environment variables uit `api/contact.js`.

Handige links om te versturen: `contact.html?type=nieuw` (type voorgeselecteerd) en
`contact.html?aanvraag=gratis-voorbeeld` (gratis voorbeeld aangevinkt). Types: `nieuw`, `vernieuwen`,
`hosting`, `maatwerk`, `weet-niet`.

## 5. Plugins en integraties

**Gebruikt bij het bouwen (Claude Code):** de plugin **frontend-design** voor de ontwerprichting (tokens,
typografie, bewust afwijken van template-looks) en de ingebouwde **browser** van de Claude-app om elke pagina
op desktop- en mobielbreedte te testen. De ook geïnstalleerde **base44**-plugin is niet gebruikt: die zet
een site op het Base44-platform, en deze site is bewust statisch zodat je hem overal kunt hosten.

**Op de site** (een statische site heeft geen WordPress-plugins; dit zijn de diensten die dezelfde taak doen):

| Functie | Gebruikt | Zo stel je het in | Alternatief |
|---|---|---|---|
| Formulieren | Netlify Forms | `data-netlify="true"` staat al in de HTML; zie §4 | Formspree (`data-endpoint`), WordPress: WPForms Lite of Contact Form 7 |
| SEO | Handmatig: titles, meta, JSON-LD, OG, `sitemap.xml`, `robots.txt` | Vul `[DOMEIN]` e.d. in (§3), meld de sitemap aan in Google Search Console | WordPress: Yoast SEO of Rank Math |
| Caching | Netlify-CDN + `_headers` | Werkt automatisch; beeld 1 week gecachet, HTML/CSS/JS altijd vers na een deploy | WordPress: WP Super Cache of LiteSpeed Cache |
| Beeldoptimalisatie | Handmatig WebP + `srcset` + lazy loading | Exporteer via squoosh.app (zie `images/BESCHRIJVING.md`) | Netlify Image CDN (`/.netlify/images?url=…&w=800`); WordPress: ShortPixel of EWWW |
| Kwaliteitscontrole | Lighthouse | Chrome DevTools → Lighthouse; of de build plugin `@netlify/plugin-lighthouse` (staat klaar in `netlify.toml`, werkt alleen bij Git-/CLI-deploys) | pagespeed.web.dev |
| Statistieken (optioneel) | Niets (dus geen cookiebanner nodig) | Plausible: script in `<head>`; `main.js` meet al "Lead", "Bellen" en "Mailen" | GA4 met Consent Mode + cookiebanner |
| Lettertypen | Bunny Fonts (EU, zonder tracking) | Link staat in elke `<head>` | Zelf hosten via gwfh.mranftl.com (google-webfonts-helper) |

## 6. Staging-preview en testlink (vóór livegang of vóór je een zip stuurt)

**A. Snelst: Netlify Drop**
1. Log in op app.netlify.com (gratis account) en ga naar app.netlify.com/drop.
2. Sleep de hele projectmap in het vak. Na een paar seconden krijg je een link als `https://naam-1234.netlify.app`.
3. Hernoem de site onder *Site configuration → Site details → Change site name*, bijv. `dpsites-preview`.
4. Nieuwe versie? Tabblad *Deploys* → sleep de map opnieuw in het vak onderaan.

**B. Netter: Netlify CLI met een draft-link** (je live site blijft ongewijzigd)
```bash
npm install -g netlify-cli
netlify login
netlify deploy --dir .          # 1e keer: kies/maak een site. Geeft een "draft URL": je privé-testlink
netlify deploy --dir . --prod   # pas als de klant akkoord is: live
```

**C. Met Git (GitHub):** koppel de repository in Netlify; elke branch of pull request krijgt automatisch een
*Deploy Preview* met een eigen link. Hierbij draait ook de Lighthouse-plugin.

**Testlink geven:** stuur de link met sjabloon 3 uit `templates/email-notificatie.txt`. Vraag de klant om op
telefoon én computer te kijken en plan direct een terugbelmoment. Een wachtwoord op de preview kan bij Netlify
alleen in een betaald abonnement; deel de link anders alleen privé. Voor een voorbeeldsite van een klant maak je
een aparte Netlify-site, bijv. `kapsalon-x-voorbeeld.netlify.app`.

**Vercel (alternatief):** `npx vercel` geeft een preview-link, `npx vercel --prod` zet hem live. Kopieer eerst
`deploy/vercel.json` naar de root. Let op: Vercels gratis Hobby-plan is alleen voor niet-commercieel gebruik.

## 7. Live gaan

1. Netlify: *Domain management → Add a domain* en volg de DNS-instructies bij je domeinaanbieder. HTTPS gaat automatisch.
2. Vervang `[DOMEIN]` en de adres-placeholders (§3) en deploy opnieuw.
3. Google Search Console: voeg het domein toe en dien `https://[DOMEIN]/sitemap.xml` in.
4. Maak of claim je **Google Bedrijfsprofiel** (business.google.com) met dezelfde naam, telefoon en website.
5. Test de JSON-LD met search.google.com/test/rich-results en een deelpreview via WhatsApp of LinkedIn.

Interne bestanden (README, belscript, `content/`, `templates/`, `components/`) worden door `_redirects` afgeschermd
met een 404, ook al staan ze in de map.

## 8. SEO en lokaal

| Pagina | Title-patroon (≤ 60 tekens) | Description-patroon (≤ 155 tekens) |
|---|---|---|
| Home | `Website laten maken in [PLAATS] \| dpsites` | Wat + voor wie + onderscheidend + CTA + telefoon |
| Diensten | `[Dienst] in [PLAATS] \| dpsites` | Diensten + prijs + CTA |
| Portfolio | `Portfolio: websites voor en na \| dpsites` | Branches + wat je ziet |
| Prijzen | `Prijzen: nieuwe website vanaf €500 \| dpsites` | Pakketten + betaalvoorwaarden |
| Contact | `Offerte aanvragen of bellen \| dpsites` | Telefoon + e-mail + reactietijd |

- **LocalBusiness-schema** staat in `index.html` (telefoon in internationaal formaat, zoals Google aanraadt).
  Voeg `"sameAs": ["https://…"]` toe met je Google Bedrijfsprofiel en socials zodra je die hebt.
- **Open Graph** staat op elke pagina, met `images/og-image.jpg`.
- **Geen FAQPage-schema:** Google toont FAQ-resultaten sinds 2023 alleen nog voor overheids- en zorgsites.
- Zet je plaatsnaam in de title en de H1 van de homepage zodra je je werkgebied kiest.

## 9. Toegankelijkheid en performance

Ingebouwd: skip-link, één `<h1>` per pagina, `aria-label`/`aria-labelledby` op navigatie en secties,
`aria-pressed` op de wisselknoppen, `role="img"` met beschrijving op de mockups, native `<dialog>` voor modals
(focus en Esc), foutmeldingen via `aria-describedby` en `role="status"`, zichtbare focus, `prefers-reduced-motion`,
lazy loading en `srcset` op foto's, vaste `width`/`height` tegen verspringen.

**Lighthouse-checklist**
- [ ] Chrome DevTools → Lighthouse → *Mobile*: Performance, Accessibility, Best Practices en SEO ≥ 90 op alle pagina's.
- [ ] Na livegang op pagespeed.web.dev: LCP < 2,5 s, CLS < 0,1, INP < 200 ms.
- [ ] Alle `<img>` hebben `width`, `height` en `alt`; onder de vouw `loading="lazy"`.
- [ ] Foto's zijn WebP en binnen budget (`images/BESCHRIJVING.md`).
- [ ] Alleen met toetsenbord (Tab/Enter/Esc) is alles bereikbaar; de skip-link verschijnt bij de eerste Tab.
- [ ] axe DevTools: 0 kritieke of ernstige meldingen; contrast ≥ 4,5:1 (ook na het wijzigen van tokens).
- [ ] Geen placeholders meer in de HTML (zie §3) en de JSON-LD is gevalideerd.

## 10. WordPress of Next.js (optioneel)

**WordPress:** kies een licht thema (bijv. GeneratePress of Kadence), zet de tokens uit sectie 1 van
`styles.css` in *Customizer → Extra CSS*, bouw header/footer na als template-parts en de hero-demo als
"Custom HTML"-blok (plus `main.js` via een snippet-plugin). Plugins: WPForms Lite of Contact Form 7
(formulieren), Yoast SEO of Rank Math (SEO), WP Super Cache of LiteSpeed Cache (caching), ShortPixel of EWWW
(beeld, WebP), Akismet of Cloudflare Turnstile (spam).

**Next.js (App Router):** maak `app/layout.tsx` met `<Header/>` en `<Footer/>` (uit `components/`), importeer
`styles.css` daar, en elke pagina als `app/<pagina>/page.tsx`. Gebruik de `metadata`-export voor title/description/OG,
`next/image` voor automatische `srcset` en lazy loading, `next/font` (host de fonts zelf, AVG-vriendelijk) en een
Route Handler `app/api/contact/route.ts` als vervanging van `api/contact.js`. De JSON-LD zet je in een
`<script type="application/ld+json">` in de layout.

## 11. Zip maken

```bash
zip -r dpsites-starter.zip . -x ".claude/*" "*.DS_Store"
```
Windows (PowerShell, vanuit de map erboven): `tar -a -c -f dpsites-starter.zip -C blueprint-starter .`
Controleer de inhoud met `unzip -l dpsites-starter.zip` of `tar -tf dpsites-starter.zip`.

## 12. CMS: teksten en prijzen aanpassen zonder code (Decap CMS)

Bewerkbaar via `/admin`: de kop en tekst bovenaan de homepage, de vinkjes, de drie plannen (naam, prijs,
omschrijvingen, kenmerken) en de reviews. Een prijs aanpassen verandert hem overal tegelijk: homepage,
prijzen, diensten en de keuzelijst in de formulieren.

**Hoe het werkt:** de inhoud staat in `content/*.json`. In de HTML staan markeringen zoals
`<!--cms:text home.hero_titel-->…<!--/cms-->` en `<!--cms:list plannen.items-->…<!--/cms-->`.
`node cms/build.mjs` zet de inhoud daarin en schrijft de site naar `dist/`. Zonder build blijft de HTML gewoon
werken met de huidige teksten. Netlify draait de build zelf (zie `netlify.toml`).

Wat (nog) niet via het CMS gaat: paginatitels en meta-omschrijvingen, het telefoonnummer en e-mailadres,
en de teksten op de diensten- en over-mij-pagina. Die pas je in de HTML aan.

**Lokaal proberen** (twee terminals in deze map):
```bash
npx decap-server
```
```bash
node cms/build.mjs --watch
```
Serveer daarna de map `dist/` (bijv. `python -m http.server 8082 --directory dist`) en open
http://localhost:8082/admin/. Klik op Inloggen: lokaal is dat zonder wachtwoord. Na **Publiceer → Publiceer nu**
staat de wijziging in `content/*.json` en wordt `dist/` vanzelf opnieuw gebouwd.

**Live zetten (eenmalig):**
1. Maak op github.com een **privé** repository, bijv. `dpsites`, en zet deze map erin (`git init`, `git add .`,
   `git commit`, `git push`). `dist/` staat in `.gitignore`.
2. Netlify: open je project → *Project configuration → Build & deploy → Link repository* en kies de repository.
   Build command en publish-map komen uit `netlify.toml`.
3. Netlify: *Project configuration → Identity → Enable Identity*. Zet *Registration* op **Invite only**.
4. Onder *Identity → Services* zet je **Git Gateway** aan.
5. *Identity → Invite users*: nodig jezelf (en later een klant) uit. Via de link in de mail kies je een wachtwoord;
   daarna kom je vanzelf in `/admin`.

Let op: Netlify heeft Identity in 2025 afgeschaft verklaard, maar in februari 2026 besloten het te laten bestaan,
wel zonder nieuwe functies. Werkt het ooit niet meer, dan kan het CMS ook met `backend: name: github` (inloggen
met een GitHub-account) of via een andere loginvoorziening.

**Voor klantsites:** kopieer `cms/`, `admin/`, `.gitignore` en de build-regels uit `netlify.toml`, zet markeringen
in de HTML, maak per klant `content/*.json` en pas `admin/config.yml` aan (velden, `site_url`). Elke klant krijgt
een eigen repository en een eigen uitnodiging.

## Licentie

MIT voor de code, zie `LICENSE`. Teksten, logo en merknaam blijven van Don van Driel.
