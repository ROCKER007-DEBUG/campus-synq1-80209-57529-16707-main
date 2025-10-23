-- RPC: credit_xp - atomically increment xp and compute level
create or replace function public.credit_xp(target_user uuid, amount int)
returns void language plpgsql security definer as $$
begin
  update public.profiles
  set xp = coalesce(xp,0) + amount,
      level = greatest(coalesce(level,1), ((coalesce(xp,0) + amount) / 500)::integer + 1)
  where id = target_user;
end;
$$;
