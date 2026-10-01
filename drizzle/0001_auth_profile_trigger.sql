-- Auto-create a public.profiles row whenever a Supabase auth user signs up.
-- Standard Supabase pattern; security definer so it can insert past RLS.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, email, phone)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.email,
    new.phone
  )
  on conflict (id) do nothing;
  return new;
end;
$$;
--> statement-breakpoint
drop trigger if exists on_auth_user_created on auth.users;
--> statement-breakpoint
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
