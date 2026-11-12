begin;
create extension if not exists pgcrypto;
create table public.collections (
 id uuid primary key default gen_random_uuid(), name text not null, slug text unique not null,
 description text not null default '',cover_image text,status text not null default 'draft' check(status in ('draft','active')),
 created_at timestamptz not null default now(),updated_at timestamptz not null default now()
);
create table public.products (
 id uuid primary key default gen_random_uuid(),collection_id uuid not null references public.collections(id),
 name text not null,slug text unique not null check(slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
 description text not null default '',short_description text not null default '',dimensions text not null default '',materials text not null default '',
 design_story text not null default '',care text not null default '',usage text not null default '',
 status text not null default 'concept' check(status in ('concept','coming_soon','open','available','sold_out')),
 is_featured boolean not null default false,is_published boolean not null default false,
 price numeric(12,2) check(price>=0),currency text not null default 'TRY',
 created_at timestamptz not null default now(),updated_at timestamptz not null default now()
);
create table public.product_images (
 id uuid primary key default gen_random_uuid(),product_id uuid not null references public.products(id) on delete cascade,
 image_url text not null,alt_text text not null,sort_order integer not null default 0
);
create table public.preorders (
 id uuid primary key default gen_random_uuid(),product_id uuid references public.products(id) on delete restrict,
 full_name text not null check(length(full_name) between 3 and 100),email text not null check(length(email)<=254),phone text check(length(phone)<=30),message text check(length(message)<=2000),
 marketing_consent boolean not null default false,privacy_notice_version text not null,
 status text not null default 'new' check(status in ('new','reviewing','contacted','completed','cancelled')),
 created_at timestamptz not null default now()
);
create table public.site_settings (id uuid primary key default gen_random_uuid(),key text unique not null,value jsonb not null,updated_at timestamptz not null default now());
create table public.admin_users (id uuid primary key references auth.users(id) on delete cascade,display_name text not null default '',created_at timestamptz not null default now());
create table public.lead_rate_limits (id bigint generated always as identity primary key,fingerprint text not null,created_at timestamptz not null default now());
create index products_collection_idx on public.products(collection_id);
create index products_published_idx on public.products(is_published,is_featured,created_at desc);
create index product_images_sort_idx on public.product_images(product_id,sort_order);
create index preorders_product_idx on public.preorders(product_id);
create index preorders_status_idx on public.preorders(status,created_at desc);
create index preorders_duplicate_idx on public.preorders(lower(email),product_id,created_at desc);
create index lead_rate_fingerprint_idx on public.lead_rate_limits(fingerprint,created_at);
create index lead_rate_created_idx on public.lead_rate_limits(created_at);
create function public.touch_updated_at() returns trigger language plpgsql set search_path='' as $$begin new.updated_at=now();return new;end;$$;
create trigger update_products_time before update on public.products for each row execute function public.touch_updated_at();
create trigger update_collections_time before update on public.collections for each row execute function public.touch_updated_at();
create trigger update_settings_time before update on public.site_settings for each row execute function public.touch_updated_at();
create function public.is_admin() returns boolean language sql stable security definer set search_path='' as $$ select exists(select 1 from public.admin_users where id=(select auth.uid())); $$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated,anon;
alter table public.collections enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.preorders enable row level security;
alter table public.site_settings enable row level security;
alter table public.admin_users enable row level security;
alter table public.lead_rate_limits enable row level security;
revoke all on public.preorders,public.lead_rate_limits,public.admin_users from anon,authenticated;
grant select,update on public.preorders to authenticated;
grant select on public.admin_users to authenticated;
grant select on public.products,public.product_images,public.collections,public.site_settings to anon,authenticated;
grant insert,update,delete on public.products,public.product_images,public.collections,public.site_settings to authenticated;
create policy public_collections on public.collections for select using(status='active' or public.is_admin());
create policy admin_collections on public.collections for all to authenticated using(public.is_admin()) with check(public.is_admin());
create policy public_products on public.products for select using(is_published or public.is_admin());
create policy admin_products on public.products for all to authenticated using(public.is_admin()) with check(public.is_admin());
create policy public_images on public.product_images for select using(exists(select 1 from public.products p where p.id=product_id and (p.is_published or public.is_admin())));
create policy admin_images on public.product_images for all to authenticated using(public.is_admin()) with check(public.is_admin());
create policy admin_lead_select on public.preorders for select to authenticated using(public.is_admin());
create policy admin_lead_update on public.preorders for update to authenticated using(public.is_admin()) with check(public.is_admin());
create policy public_settings on public.site_settings for select using(true);
create policy admin_settings on public.site_settings for all to authenticated using(public.is_admin()) with check(public.is_admin());
create policy own_admin_profile on public.admin_users for select to authenticated using(id=(select auth.uid()));
-- No client INSERT policy exists for personal data or rate-limit records.
create function public.submit_preorder(p_product_id uuid,p_full_name text,p_email text,p_phone text,p_message text,p_marketing_consent boolean,p_privacy_version text,p_fingerprint text)
returns uuid language plpgsql security definer set search_path='' as $$
declare new_id uuid;
begin
 if p_product_id is not null and not exists(select 1 from public.products where id=p_product_id and is_published and status<>'sold_out') then raise exception 'PRODUCT_UNAVAILABLE';end if;
 if length(p_fingerprint)<>64 or length(p_full_name) not between 3 and 100 or length(p_email)>254 or p_email not like '%@%' or length(p_message)>2000 then raise exception 'INVALID_INPUT';end if;
 perform pg_advisory_xact_lock(hashtextextended(p_fingerprint,0));
 perform pg_advisory_xact_lock(hashtextextended(lower(p_email)||coalesce(p_product_id::text,'collection'),1));
 delete from public.lead_rate_limits where created_at<now()-interval '24 hours';
 if (select count(*) from public.lead_rate_limits where fingerprint=p_fingerprint and created_at>now()-interval '15 minutes')>=3 then raise exception 'RATE_LIMIT';end if;
 if exists(select 1 from public.preorders where lower(email)=lower(p_email) and product_id is not distinct from p_product_id and created_at>now()-interval '24 hours') then raise exception 'DUPLICATE';end if;
 insert into public.lead_rate_limits(fingerprint) values(p_fingerprint);
 insert into public.preorders(product_id,full_name,email,phone,message,marketing_consent,privacy_notice_version)
 values(p_product_id,p_full_name,lower(p_email),p_phone,p_message,p_marketing_consent,p_privacy_version) returning id into new_id;
 return new_id;
end;$$;
revoke all on function public.submit_preorder(uuid,text,text,text,text,boolean,text,text) from public,anon,authenticated;
grant execute on function public.submit_preorder(uuid,text,text,text,text,boolean,text,text) to service_role;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('product-images','product-images',true,5242880,array['image/webp']) on conflict(id) do nothing;
create policy product_image_public_read on storage.objects for select using(bucket_id='product-images');
create policy admin_storage_insert on storage.objects for insert to authenticated with check(bucket_id='product-images' and public.is_admin());
create policy admin_storage_update on storage.objects for update to authenticated using(bucket_id='product-images' and public.is_admin()) with check(bucket_id='product-images' and public.is_admin());
create policy admin_storage_delete on storage.objects for delete to authenticated using(bucket_id='product-images' and public.is_admin());
commit;
