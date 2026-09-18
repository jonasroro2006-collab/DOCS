-- ProDoc IA V6 : table des demandes
create table if not exists public.requests (
  id text primary key,
  payload jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.requests enable row level security;

-- ATTENTION :
-- Pour une vraie production, ne mets pas "allow all".
-- Le prototype utilise la clé anon côté navigateur.
-- Il faut ensuite remplacer les policies par des règles RLS adaptées
-- et/ou utiliser Supabase Auth + un backend/Edge Function pour l'admin.

-- Prototype pratique (à ne pas considérer comme sécurité de production) :
drop policy if exists "public insert requests" on public.requests;
drop policy if exists "public select requests" on public.requests;
drop policy if exists "public update requests" on public.requests;

create policy "public insert requests"
on public.requests for insert
to anon, authenticated
with check (true);

create policy "public select requests"
on public.requests for select
to anon, authenticated
using (true);

create policy "public update requests"
on public.requests for update
to anon, authenticated
using (true)
with check (true);

-- La suppression depuis l'interface nécessite aussi une policy DELETE.
drop policy if exists "public delete requests" on public.requests;
create policy "public delete requests"
on public.requests for delete
to anon, authenticated
using (true);
