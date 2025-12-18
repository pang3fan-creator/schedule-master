-- Add creem_subscription_id column to subscriptions table
-- This is needed to cancel Monthly subscriptions when users upgrade to Lifetime

ALTER TABLE subscriptions
ADD COLUMN IF NOT EXISTS creem_subscription_id TEXT DEFAULT NULL;

-- Add comment for documentation
COMMENT ON COLUMN subscriptions.creem_subscription_id IS 'Creem subscription ID for Monthly subscriptions, used for cancellation when upgrading to Lifetime';
