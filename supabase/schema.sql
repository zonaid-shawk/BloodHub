create table if not exists public.donors (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text,
  phone text not null,
  blood_group text not null,
  age integer,
  gender text,
  city text,
  address text,
  last_donation_date date,
  availability boolean default true,
  confirmation boolean default false,
  created_at timestamptz default now()
);

alter table public.donors enable row level security;

alter table public.donors add column if not exists email text;
alter table public.donors add column if not exists age integer;
alter table public.donors add column if not exists gender text;
alter table public.donors add column if not exists city text;
alter table public.donors add column if not exists address text;
alter table public.donors add column if not exists last_donation_date date;
alter table public.donors add column if not exists availability boolean default true;
alter table public.donors add column if not exists confirmation boolean default false;

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
