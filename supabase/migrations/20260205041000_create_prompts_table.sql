-- Create prompts table
create table public.prompts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  image_url text,
  prompt_text text not null,
  is_premium boolean default false,
  category text default 'geral',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.prompts enable row level security;

-- Policies
create policy "Public prompts are viewable by everyone" on public.prompts for select to public using (true);

create policy "Admins can insert prompts" on public.prompts for insert to authenticated with check (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin') OR 
    (auth.jwt() -> 'app_metadata' ->> 'role')::text = 'admin' OR 
    auth.jwt() ->> 'role' = 'service_role'
);

create policy "Admins can update prompts" on public.prompts for update to authenticated using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin') OR 
    (auth.jwt() -> 'app_metadata' ->> 'role')::text = 'admin' OR 
    auth.jwt() ->> 'role' = 'service_role'
);

create policy "Admins can delete prompts" on public.prompts for delete to authenticated using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin') OR 
    (auth.jwt() -> 'app_metadata' ->> 'role')::text = 'admin' OR 
    auth.jwt() ->> 'role' = 'service_role'
);
