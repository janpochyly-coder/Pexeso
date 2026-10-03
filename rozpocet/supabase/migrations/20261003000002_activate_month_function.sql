-- Atomické prepnutie aktívneho mesiaca: aktuálny sa uzavrie, vybraný plánovaný sa aktivuje.
create function public.activate_month(p_month uuid)
returns void
language plpgsql
security invoker
set search_path = public
as $$
begin
  if not exists (select 1 from public.months where id = p_month and status = 'planned') then
    raise exception 'month is not planned';
  end if;
  update public.months set status = 'closed' where status = 'active';
  update public.months set status = 'active' where id = p_month;
end;
$$;
revoke all on function public.activate_month(uuid) from public, anon;
grant execute on function public.activate_month(uuid) to authenticated;
