begin;
create function public.admin_dashboard() returns jsonb language sql stable security invoker set search_path='' as $$
 select case when public.is_admin() then jsonb_build_object(
  'total_products',(select count(*) from public.products),
  'published_products',(select count(*) from public.products where is_published),
  'total_leads',(select count(*) from public.preorders),
  'new_leads',(select count(*) from public.preorders where status='new'),
  'per_product',coalesce((select jsonb_agg(item) from (select product_id,count(*) from public.preorders group by product_id) item),'[]'::jsonb)
 ) else null end;
$$;
revoke all on function public.admin_dashboard() from public,anon;
grant execute on function public.admin_dashboard() to authenticated;
commit;
