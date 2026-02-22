create table if not exists processed_files (
  id uuid primary key default gen_random_uuid(),
  file_id text unique not null,
  file_name text,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table processed_files enable row level security;

-- Admin only or internal access
create policy "Allow internal access to processed_files"
  on processed_files
  for all
  using ( true );
