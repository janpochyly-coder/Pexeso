-- Slovo (modlitby, rémy, memory): stav aplikácie jedného používateľa ako JSON dokument.
create table public.biblia_state (
  user_id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.biblia_state enable row level security;

create policy "biblia_state own select" on public.biblia_state
  for select to authenticated using (user_id = auth.uid());
create policy "biblia_state own insert" on public.biblia_state
  for insert to authenticated with check (user_id = auth.uid());
create policy "biblia_state own update" on public.biblia_state
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "biblia_state own delete" on public.biblia_state
  for delete to authenticated using (user_id = auth.uid());
