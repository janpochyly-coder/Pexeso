# Rodinný rozpočet

Rodinná aplikácia na kontrolu rozpočtu pre dvoch používateľov (J a I). Statická PWA (bez build kroku) s databázou a prihlásením v Supabase.

## Štruktúra

- `index.html`, `app.css`, `app.js`: aplikácia (čistý JavaScript)
- `vendor/supabase.js`: knižnica supabase-js 2.45.4 (UMD)
- `sw.js`, `manifest.webmanifest`, `icons/`: PWA (inštalácia na plochu)
- `supabase/migrations/`: schéma databázy, zabezpečenie (RLS) a funkcie

## Supabase

- Projekt: `rodinny-rozpocet` (eu-central-1)
- URL a publishable kľúč sú v `app.js` (`SB_URL`, `SB_KEY`). Publishable kľúč je určený do prehliadača, dáta chráni Row Level Security.
- Každý zápis patrí domácnosti. Prístup má len člen domácnosti (max. dvaja: J a I).

## Prvé spustenie

1. Otvorte aplikáciu, vytvorte účet (e-mail a heslo) a potvrďte e-mail.
2. Prvý používateľ vytvorí domácnosť a vyberie, či je J alebo I.
3. V karte Plán nájde pozývací kód. Druhý používateľ si vytvorí účet a zadá ho.
4. V Prehľade nastavte očakávaný príjem (Nastaviť).

## Nasadenie

Súbory v `rozpocet/` sú statické, stačí ich vystaviť na ľubovoľnom hostingu. Workflow `.github/workflows/pages.yml` ich publikuje cez GitHub Pages (v nastaveniach repozitára Pages > Source: GitHub Actions).

V Supabase (Authentication > URL Configuration) nastavte Site URL na adresu nasadenej aplikácie, aby potvrdzovacie e-maily smerovali na ňu.
