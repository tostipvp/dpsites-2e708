// =========================================================================
// api/contact.js — OPTIONEEL: formulierafhandeling als serverless functie op Vercel.
// Alleen nodig als je NIET via Netlify Forms werkt. Zet dan op elk formulier
//   data-endpoint="/api/contact"  en verwijder data-netlify / netlify-honeypot.
// Environment variables (Vercel → Settings → Environment Variables):
//   NOTIFY_EMAIL    = donvandriel08@hotmail.com
//   RESEND_API_KEY  = sleutel van resend.com (of vervang door Postmark/Brevo)
//   FROM_EMAIL      = bijv. "dpsites <noreply@dpsites.nl>" (domein eerst verifiëren bij Resend)
//   CRM_WEBHOOK_URL = optioneel: webhook van je CRM of Zapier/Make
// Rate limiting: stel een regel in via Vercel Firewall (bijv. 5 POSTs / 10 min per IP).
// =========================================================================
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false });

  const body = typeof req.body === 'string' ? Object.fromEntries(new URLSearchParams(req.body)) : req.body || {};
  const { name = '', phone = '', email = '', type = '', aanvraag = '', message = '', website = '' } = body;

  // Honeypot gevuld → doen alsof het gelukt is, zodat bots niets leren
  if (website) return res.status(200).json({ ok: true });

  // Validatie op de server (client-side validatie is alleen gebruiksgemak)
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  const phoneOk = /^[+0-9 ()-]{10,20}$/.test(phone);
  const links = (message.match(/https?:\/\//g) || []).length;
  if (name.trim().length < 2 || !emailOk || !phoneOk || !type || message.length > 1000 || links > 3) {
    return res.status(422).json({ ok: false });
  }

  const text = `Aanvraag: ${aanvraag || 'offerte'}\nNaam: ${name}\nTelefoon: ${phone}\nE-mail: ${email}\nType website: ${type}\n\n` +
    `Omschrijving:\n${message || '-'}\n\nPagina: ${body.page_url || '-'}\nBron: ${body.utm_source || '-'} / ${body.utm_medium || '-'} / ${body.utm_campaign || '-'}`;

  try {
    // 1. Notificatie aan Don (tekst: templates/email-notificatie.txt, deel 1)
    const mail = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.FROM_EMAIL, to: process.env.NOTIFY_EMAIL, reply_to: email,
        subject: `Nieuwe aanvraag (${aanvraag || 'offerte'}): ${type} van ${name}`, text,
      }),
    });
    if (!mail.ok) throw new Error(`Resend antwoordde ${mail.status}`);
    // 2. CRM (optioneel)
    if (process.env.CRM_WEBHOOK_URL) {
      await fetch(process.env.CRM_WEBHOOK_URL, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, email, type, aanvraag, message, source: body.utm_source, page: body.page_url }),
      });
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Formulier verwerken mislukt', err); // zichtbaar in de Vercel-logs
    return res.status(500).json({ ok: false });
  }
}
