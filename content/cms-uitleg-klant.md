# Uitleg CMS voor klanten (website staat op het Netlify-account van de klant)

Vervang **[BEDRIJFSNAAM]** en **[DOMEIN]**. Deel A doe je samen met de klant (±20 minuten, bijv. via
schermdelen). Deel B is de spiekbrief die de klant houdt. Laat de klant zelf inloggen en wachtwoorden
kiezen; vraag nooit om zijn wachtwoord.

---

## Deel A: eenmalig instellen (jij en de klant samen)

**Wat de klant nodig heeft:** zijn Netlify-account (waar de website al op staat) en een gratis
GitHub-account. Op GitHub worden de teksten van de website bewaard; de klant hoeft daar daarna nooit meer
naartoe.

1. **GitHub-account** – De klant maakt een gratis account op github.com (als hij dat nog niet heeft).
2. **Website in GitHub zetten** – Jij maakt een privé repository met de website en geeft die aan de klant:
   via *Settings → Transfer ownership* naar zijn account, of je nodigt hem uit als *collaborator*.
   (Zo is de website écht van de klant.)
3. **Netlify aan GitHub koppelen** – De klant opent zijn project in Netlify →
   *Project configuration → Build & deploy → Link repository* → kiest GitHub → kiest de repository.
   Netlify neemt de instellingen zelf over uit het bestand `netlify.toml`.
4. **Inloggen aanzetten** – In Netlify: *Project configuration → Identity → Enable Identity*.
   Zet *Registration* op **Invite only** (anders kan iedereen zich aanmelden).
5. **Opslaan aanzetten** – Onder *Identity → Services* zet de klant **Git Gateway** aan.
6. **Uitnodiging sturen** – In het tabblad *Identity* van het project: *Invite users* → het e-mailadres van
   de klant (en eventueel van jou, als jij ook aanpassingen doet).
7. **Wachtwoord kiezen** – De klant opent de mail "You've been invited…", klikt op de link, kiest een
   wachtwoord en komt vanzelf in het beheerscherm.
8. **Samen één keer oefenen** – Laat de klant een kleine wijziging doen (zie deel B) en controleer samen
   dat die na 1 à 2 minuten op de website staat.

---

## Deel B: spiekbrief voor de klant

> **Uw website zelf aanpassen**
>
> **Inloggen**
> 1. Ga naar **[DOMEIN]/admin**
> 2. Klik op **Inloggen met Netlify Identity** en vul uw e-mailadres en wachtwoord in.
>
> **Iets aanpassen**
> 3. Klik links op **Website-inhoud** en kies wat u wilt wijzigen, bijvoorbeeld *Plannen en prijzen*.
> 4. Klik op het pijltje (**>**) voor een onderdeel om het open te klappen.
> 5. Pas de tekst of prijs aan. Iets toevoegen? Gebruik de knop **Voeg … toe**. Iets weghalen? Het kruisje (**×**).
>
> **Opslaan en online zetten**
> 6. Klik bovenaan op **Publiceer** en daarna op **Publiceer nu**.
> 7. Wacht 1 à 2 minuten en ververs uw website. Uw wijziging staat erop.
>
> **Handig om te weten**
> - Zie je de wijziging nog niet? Wacht nog een minuut en ververs met **Ctrl + F5** (Mac: **Cmd + Shift + R**).
> - Per ongeluk iets verkeerd gedaan? Pas het gewoon opnieuw aan. Of bel/mail mij, dan zet ik de vorige
>   versie terug: alles wordt bewaard.
> - Wachtwoord vergeten? Klik op het inlogscherm op **Forgot password?**.
> - Foto's, nieuwe pagina's of de opmaak aanpassen? Dat doe ik voor u. Bel of mail Don van Driel (dpsites):
>   0610582559 · donvandriel08@hotmail.com

---

## Goed om te weten (voor jou)

- **Netlify Identity:** in 2025 afgeschaft verklaard, maar in februari 2026 besloot Netlify het te laten
  bestaan (zonder nieuwe functies). Werkt het later niet meer, dan kan het CMS ook met inloggen via GitHub.
- **Kosten voor de klant:** elke wijziging laat Netlify de site even opnieuw bouwen. Bij een kleine site is
  dat een paar seconden; check wel de actuele limieten van het gratis Netlify-abonnement.
- **Hosting en onderhoud via jou (€20/maand)?** Dan staat alles in jouw account en sla je deel A stap 1–3
  over: jij koppelt de repository, de klant krijgt alleen de uitnodiging uit stap 6.
