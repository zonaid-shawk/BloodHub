create table if not exists public.donors (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  phone text not null,
  blood_group text not null,
  district text not null,
  availability text default 'Available'::text,
  created_at timestamptz default now()
);

alter table public.donors enable row level security;

drop policy if exists "Allow public insert" on public.donors;
drop policy if exists "Allow public read" on public.donors;

create policy "Allow public insert"
  on public.donors
  for insert
  with check (true);

create policy "Allow public read"
  on public.donors
  for select
  using (true);
