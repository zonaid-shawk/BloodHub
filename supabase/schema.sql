create table if not exists public.donors (
  id uuid default gen_random_uuid() primary key,
  donor_number text unique,
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
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz default now()
);

create table if not exists public.blood_requests (
  id text primary key,
  patientName text not null,
  email text not null,
  bloodGroup text not null,
  hospital text not null,
  city text not null,
  contactNumber text not null,
  urgency text not null,
  units text default '1',
  notes text,
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz default now()
);

alter table public.donors enable row level security;
alter table public.blood_requests enable row level security;

alter table public.donors add column if not exists status text default 'pending';
alter table public.blood_requests add column if not exists status text default 'pending';

alter table public.donors add column if not exists donor_number text;
alter table public.donors add column if not exists email text;
alter table public.donors add column if not exists age integer;
alter table public.donors add column if not exists gender text;
alter table public.donors add column if not exists city text;
alter table public.donors add column if not exists address text;
alter table public.donors add column if not exists last_donation_date date;
alter table public.donors add column if not exists availability boolean default true;
alter table public.donors add column if not exists confirmation boolean default false;

create policy "Allow public donor insert"
  on public.donors
  for insert
  with check (true);

create policy "Allow public donor read"
  on public.donors
  for select
  using (true);

create policy "Allow public donor update"
  on public.donors
  for update
  using (true)
  with check (true);

create policy "Allow public request insert"
  on public.blood_requests
  for insert
  with check (true);

create policy "Allow public request read"
  on public.blood_requests
  for select
  using (true);

create policy "Allow public request update"
  on public.blood_requests
  for update
  using (true)
  with check (true);
