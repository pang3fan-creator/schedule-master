-- Add bonus_days column to subscriptions table
-- This column stores the number of bonus days granted when upgrading from 7-Day Pass to Monthly

ALTER TABLE subscriptions
ADD COLUMN IF NOT EXISTS bonus_days INTEGER DEFAULT NULL;

-- Add comment for documentation
COMMENT ON COLUMN subscriptions.bonus_days IS 'Number of bonus days granted when user upgrades from 7-Day Pass to Monthly subscription';
