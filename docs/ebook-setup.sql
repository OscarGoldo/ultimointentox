-- ============================================================================
-- Tienda del Ebook — instalación en el Supabase NUEVO (separado de las citas)
-- Ejecutar todo este script en:  Supabase → SQL Editor → New query → Run
-- ============================================================================

-- 1) Tabla de órdenes ---------------------------------------------------------
create table if not exists public.ebook_orders (
  id                uuid primary key default gen_random_uuid(),
  customer_name     text not null,
  customer_email    text not null,
  customer_phone    text,
  payment_method    text not null check (payment_method in ('zelle','pago_movil')),
  amount_usd        numeric(10,2) not null,
  amount_bs         numeric(14,2),
  bcv_rate          numeric(14,4),
  payment_reference text,
  proof_path        text,
  status            text not null default 'pendiente'
                       check (status in ('pendiente','confirmada','rechazada')),
  confirmed_at      timestamptz,
  created_at        timestamptz not null default now()
);

create index if not exists ebook_orders_status_idx
  on public.ebook_orders (status, created_at desc);

-- RLS: la tabla se maneja SOLO desde el servidor con service role.
-- No damos acceso al rol anónimo, así que las políticas quedan cerradas.
alter table public.ebook_orders enable row level security;

-- 2) Buckets de Storage (privados) -------------------------------------------
insert into storage.buckets (id, name, public)
values ('comprobantes', 'comprobantes', false)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('ebook-files', 'ebook-files', false)
on conflict (id) do nothing;

-- 3) Política de Storage: permitir SUBIR comprobantes desde el navegador ------
--    (solo INSERT del rol anónimo, solo en el bucket 'comprobantes').
--    La LECTURA queda cerrada: la doctora ve el comprobante vía enlace
--    firmado que genera el servidor con service role.
drop policy if exists "anon sube comprobantes" on storage.objects;
create policy "anon sube comprobantes"
  on storage.objects for insert
  to anon
  with check (bucket_id = 'comprobantes');

-- El bucket 'ebook-files' NO tiene políticas para anon: el PDF solo se
-- entrega mediante enlaces firmados generados por el servidor.

-- ============================================================================
-- Después de correr esto:
--   • Storage → ebook-files → subir el PDF como  manual-del-residente.pdf
--   • Listo. Las órdenes y descargas se manejan desde la app.
-- ============================================================================
