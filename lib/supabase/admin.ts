import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * 创建用于 Webhook 的 Supabase Admin 客户端
 * 不依赖 cookies，使用 Service Role Key 直接访问
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
