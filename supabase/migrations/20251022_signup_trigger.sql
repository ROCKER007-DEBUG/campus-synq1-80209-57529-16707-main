-- Trigger: create profile row when new auth user inserted
create function public.handle_new_user() returns trigger as $$
begin
  insert into public.profiles (id, username, full_name, xp, level)
  values (new.id, new.raw_user_meta_data->>'username', new.raw_user_meta_data->>'full_name', 0, 1)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
