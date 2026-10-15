# Cheerio AI — Ask Cheerio Assistant Prototype

Interactive front-end product prototype for **Cheerio AI** and the **"Ask Cheerio"** assistant feature.

## Product Context & Scenario
- **User Persona:** Riya, 29, owner of a small jewellery D2C brand in Jaipur (*Riya Jewels*).
- **The Problem:** Riya's Diwali campaign template (`diwali_offer_2026`) is rejected by Meta with a category mismatch error.
- **The Solution:** *Ask Cheerio* diagnoses the rejection in plain human language, explains that promotional offers require the **Marketing** category rather than **Utility**, presents a one-click fix, displays a side-by-side review modal with live WhatsApp chat preview, and resubmits to Meta upon Riya's explicit approval.

## Key Feature Rules (Reflected in UI)
1. **Read-only on account:** Any change requires explicit user approval.
2. **Zero false promises:** Never promises Meta approvals or timelines.
3. **No legal advice:** Plain guidance without compliance jargon.
4. **Human handoff:** Clean escalation ticket with full context pre-filled.
5. **Verified sources:** Every assistant answer displays a `Based on: ...` verification source.

## Tech Stack
- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- Lucide React

## Local Development
```bash
npm install
npm run dev
```

Built for product case study evaluation and interactive walkthroughs.
