# Slovo – modlitby, rémy, memory

Statická PWA (bez build kroku) s tromi hlavnými kartami:

- **Modlitby** – témy na modlitbu (skupina, poznámky, priradený verš, „pomodlil som sa dnes“, vyslyšané).
- **Rémy** – aktuálne verše (pripnutie, poznámka, porovnanie prekladov, odoslanie do Memory).
- **Memory** – učenie veršov naspamäť: Leitnerov systém (intervaly 1, 2, 4, 8, 16, 35, 70 dní) a štyri režimy podľa úrovne: čítanie → prvé písmená → vynechané slová → písanie z pamäti (porovnanie slovo po slove).

Tlačidlo s knihou otvorí čítačku (kapitoly; ťuknutím na verš sa zobrazí porovnanie všetkých prekladov).

## Preklady

| Preklad | Zdroj | Poznámka |
|---|---|---|
| Kralická (BKR), Studijní (CSP), KJV | `scrollmapper/bible_databases` (GitHub) | stiahne sa raz, potom z cache (IndexedDB), funguje offline |
| Roháčkova, Ekumenický | getBible API (`api.getbible.net`) | po kapitolách; hľadá sa podľa názvu, v Nastaveniach sa dá zadať skratka ručne |
| Strong (heb/gr) | `openscriptures/morphhb` (hebrejský OT s číslami Strong) + `openscriptures/strongs` (slovníky H a G) | ťuknutie na hebrejské slovo ukáže heslo; čísla G… sa dajú hľadať ručne |

Ekumenický a Roháčkova nie sú vo verejných dátach zbierky, preto sa načítavajú online za behu (dostupnosť a licencia závisí od getBible; názov/skratka sa neoverovali). NT so Strongovými číslami pri slovách zatiaľ nie je.

## Dáta a synchronizácia

Všetko sa ukladá lokálne (`localStorage`). Po prihlásení (Nastavenia → Účet) sa stav synchronizuje do tabuľky `biblia_state` v Supabase (jeden JSON dokument na používateľa, RLS). Migrácia: `supabase/migrations/20261008000001_biblia_state.sql`; používa sa rovnaký Supabase projekt ako v `rozpocet/`.

## Nasadenie

Workflow `.github/workflows/pages.yml` publikuje celý repozitár, appka je na `/biblia/`.
