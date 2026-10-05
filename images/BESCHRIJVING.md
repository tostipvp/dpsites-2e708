# Afbeeldingen

De site werkt **direct** zonder extra beeld: de hero en het portfolio zijn browsermockups in HTML/CSS
(altijd scherp, geen laadtijd). De bestanden hieronder zijn meegeleverd; vervang de placeholder-foto
zo snel mogelijk door een echte foto van jezelf. Een gezicht wekt meer vertrouwen dan initialen.

## Meegeleverd (gegenereerd)

| Bestand | Gebruikt in | Afmeting | Wat is het |
|---|---|---|---|
| `og-image.jpg` | alle pagina's (`og:image`) | 1200×630 | Deelafbeelding voor WhatsApp, LinkedIn en Facebook: logo, headline en belknop op bouwblauw. |
| `don-van-driel-960.webp` + `don-van-driel-480.webp` | about.html (hero), index.html (lazy) | 960×1200 en 480×600 (4:5) | **Placeholder** met initialen. Vervang door je eigen portret, zelfde namen en maten. |
| `logo.png` | schema.org (`logo`) | 512×512 | Het blauwe d/p-beeldmerk op zwart. |
| `apple-touch-icon.png` | alle pagina's | 180×180 | Icoon als iemand de site op het beginscherm van een iPhone zet. |

## Aanbevolen foto's (zelf maken of laten maken)

| Bestand (voorstel) | Waar | Afmeting | Beschrijving |
|---|---|---|---|
| `don-van-driel-960.webp` / `-480.webp` | about + home | 960×1200 | Portret van Don, schouders en hoofd, natuurlijk daglicht, rustige achtergrond (bijv. een lichte muur of werkplek). Kijk in de camera, glimlach. |
| `werk-1600.webp` / `werk-800.webp` | eventueel extra sectie of hero-variant | 1600×1000 (16:10) | Don naast een ondernemer in diens zaak (kapsalon, bakkerij), laptop of telefoon in beeld met de nieuwe website. Echt moment, geen pose. |
| `mobiel-1200.webp` / `mobiel-600.webp` | portfolio | 1200×1500 | Close-up van een hand met telefoon; op het scherm een opgeleverde klantsite, duim bij de belknop. |
| `portfolio/klant-1600.webp` / `-800.webp` | portfolio (echte klanten) | 1600×1000 | Screenshot van een opgeleverde klantsite (desktopbreedte 1440px, bovenste deel). Alleen met toestemming van de klant. |

**Hero-advies:** houd de interactieve mockup als hero; die laat direct zien wat je maakt en laadt sneller
dan een grote foto (goed voor LCP). Wil je toch een foto in de hero, kies dan voor "Don aan het werk bij
een lokale ondernemer" en zet er de mockup half overheen.

## Beeldstijl

Echte mensen, echte zaken, natuurlijk licht. Geen stockfoto's met handdrukken of headsets. Laat bij
voorkeur elektrisch blauw (#3D6BFF) of zwart ergens terugkomen: een shirt, een mok, een muur.

## Iconen

Lijniconen in de stijl van **Lucide** (lucide.dev, gratis, ISC-licentie): 24×24, lijndikte 2, afgeronde
uiteinden. Staan als sprite in `assets/icons.svg`. Nieuw icoon: kopieer de SVG-paden van lucide.dev
naar een nieuw `<symbol id="naam" viewBox="0 0 24 24">`.

## Formaten en export

- **Foto's:** WebP, kwaliteit 75–80. JPG alleen voor `og-image.jpg`.
- **Twee breedtes per foto** voor `srcset`:
  ```html
  <img src="images/werk-1600.webp"
       srcset="images/werk-800.webp 800w, images/werk-1600.webp 1600w"
       sizes="(min-width: 1024px) 50vw, 100vw" width="1600" height="1000"
       alt="Don laat een bakker de nieuwe website zien" loading="lazy" decoding="async">
  ```
- **Lazy loading:** alles onder de vouw krijgt `loading="lazy" decoding="async"`. Een foto bovenaan
  krijgt `fetchpriority="high"` en **geen** lazy.
- **Altijd `width` en `height`** meegeven, dan verspringt de pagina niet tijdens het laden.
- **Budget:** hero < 200 KB, overige foto's < 100 KB, portret < 60 KB.
- **Tools:** Squoosh (squoosh.app, in de browser) of de exportfunctie van Figma/Photoshop.
- **Vervang je een foto?** Geef hem een nieuwe naam (bijv. `-v2`), want `_headers` laat beeld 1 week cachen.
