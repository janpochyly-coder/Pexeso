-- Rodinný rozpočet: základná schéma, RLS a funkcie na vytvorenie / pripojenie domácnosti.

create table public.households (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'Rodina',
  invite_code text not null unique default substr(replace(gen_random_uuid()::text, '-', ''), 1, 8),
  created_at timestamptz not null default now()
);

create table public.members (
  user_id uuid primary key references auth.users (id) on delete cascade,
  household_id uuid not null references public.households (id) on delete cascade,
  initial text not null check (initial in ('J', 'I')),
  created_at timestamptz not null default now(),
  unique (household_id, initial)
);

create function public.current_household()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select household_id from public.members where user_id = auth.uid()
$$;
revoke all on function public.current_household() from public, anon;
grant execute on function public.current_household() to authenticated;

create table public.months (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null default public.current_household() references public.households (id) on delete cascade,
  y int not null,
  mo int not null check (mo between 0 and 11),
  status text not null check (status in ('planned', 'active', 'closed')),
  seq int not null default 1,
  inc_j numeric(12,2) not null default 0 check (inc_j >= 0),
  inc_i numeric(12,2) not null default 0 check (inc_i >= 0),
  created_at timestamptz not null default now(),
  unique (household_id, y, mo)
);
create unique index months_one_active on public.months (household_id) where status = 'active';

create table public.month_limits (
  month_id uuid not null references public.months (id) on delete cascade,
  key text not null,
  amount numeric(12,2) check (amount is null or amount >= 0),
  primary key (month_id, key)
);

create table public.planned_payments (
  id uuid primary key default gen_random_uuid(),
  month_id uuid not null references public.months (id) on delete cascade,
  day int not null check (day between 1 and 31),
  name text not null default '',
  key text not null,
  amount numeric(12,2) check (amount is null or amount >= 0),
  sort int not null default 0
);
create index planned_payments_month_idx on public.planned_payments (month_id);

create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null default public.current_household() references public.households (id) on delete cascade,
  month_id uuid not null references public.months (id) on delete cascade,
  dt date not null,
  cat text not null,
  sub text not null default '',
  amount numeric(12,2) not null check (amount > 0),
  who text not null check (who in ('J', 'I')),
  note text not null default '',
  created_by uuid default auth.uid(),
  created_at timestamptz not null default now()
);
create index transactions_month_idx on public.transactions (month_id);
create index transactions_dt_idx on public.transactions (household_id, dt);

create table public.incomes (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null default public.current_household() references public.households (id) on delete cascade,
  month_id uuid not null references public.months (id) on delete cascade,
  dt date not null,
  amount numeric(12,2) not null check (amount > 0),
  who text not null check (who in ('J', 'I')),
  note text not null default '',
  created_by uuid default auth.uid(),
  created_at timestamptz not null default now()
);
create index incomes_month_idx on public.incomes (month_id);

create table public.debts (
  household_id uuid not null default public.current_household() references public.households (id) on delete cascade,
  sub text not null,
  name text not null,
  balance numeric(12,2) not null check (balance >= 0),
  as_of date not null default current_date,
  primary key (household_id, sub)
);

alter table public.households enable row level security;
alter table public.members enable row level security;
alter table public.months enable row level security;
alter table public.month_limits enable row level security;
alter table public.planned_payments enable row level security;
alter table public.transactions enable row level security;
alter table public.incomes enable row level security;
alter table public.debts enable row level security;

create policy households_select on public.households for select to authenticated using (id = public.current_household());
create policy households_update on public.households for update to authenticated using (id = public.current_household()) with check (id = public.current_household());
create policy members_select on public.members for select to authenticated using (household_id = public.current_household());

create policy months_all on public.months for all to authenticated
  using (household_id = public.current_household()) with check (household_id = public.current_household());
create policy transactions_all on public.transactions for all to authenticated
  using (household_id = public.current_household()) with check (household_id = public.current_household());
create policy incomes_all on public.incomes for all to authenticated
  using (household_id = public.current_household()) with check (household_id = public.current_household());
create policy debts_all on public.debts for all to authenticated
  using (household_id = public.current_household()) with check (household_id = public.current_household());

create policy month_limits_all on public.month_limits for all to authenticated
  using (exists (select 1 from public.months m where m.id = month_id and m.household_id = public.current_household()))
  with check (exists (select 1 from public.months m where m.id = month_id and m.household_id = public.current_household()));
create policy planned_payments_all on public.planned_payments for all to authenticated
  using (exists (select 1 from public.months m where m.id = month_id and m.household_id = public.current_household()))
  with check (exists (select 1 from public.months m where m.id = month_id and m.household_id = public.current_household()));

create function public.bootstrap_household(p_initial text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  hid uuid;
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  if p_initial not in ('J', 'I') then raise exception 'invalid initial'; end if;
  if exists (select 1 from members where user_id = auth.uid()) then raise exception 'already a member'; end if;
  insert into households default values returning id into hid;
  insert into members (user_id, household_id, initial) values (auth.uid(), hid, p_initial);
  insert into debts (household_id, sub, name, balance, as_of) values
    (hid, 'rodicia', 'Rodičia', 7000, current_date),
    (hid, 'blazka', 'Blažka', 750, current_date),
    (hid, 'brano', 'Braňo', 1500, current_date),
    (hid, 'h1', 'Harmanec 1', 1800, current_date),
    (hid, 'h2', 'Harmanec 2', 300, current_date),
    (hid, 'realbyt', 'Realbyt', 2000, current_date),
    (hid, 'orange', 'Orange', 200, current_date),
    (hid, 'vszp', 'VšZP', 300, current_date);
  return hid;
end;
$$;

create function public.join_household(p_code text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  hid uuid;
  free_initial text;
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  if exists (select 1 from members where user_id = auth.uid()) then raise exception 'already a member'; end if;
  select id into hid from households where invite_code = lower(trim(p_code));
  if hid is null then raise exception 'invalid code'; end if;
  select i into free_initial from unnest(array['J', 'I']) as i
    where i not in (select initial from members where household_id = hid) limit 1;
  if free_initial is null then raise exception 'household is full'; end if;
  insert into members (user_id, household_id, initial) values (auth.uid(), hid, free_initial);
  return hid;
end;
$$;

revoke all on function public.bootstrap_household(text) from public, anon;
revoke all on function public.join_household(text) from public, anon;
grant execute on function public.bootstrap_household(text) to authenticated;
grant execute on function public.join_household(text) to authenticated;

alter publication supabase_realtime add table public.months, public.month_limits, public.planned_payments, public.transactions, public.incomes, public.debts;
