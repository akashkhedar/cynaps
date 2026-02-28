-- Add Rs 1 Test Subscription Plan with 10000 credits
INSERT INTO billing_subscription_plan (
    name, plan_type, billing_cycle, price_inr, credits_per_month, 
    effective_rate, is_active, storage_gb, max_users, priority_support, 
    api_access, credit_rollover, max_rollover_months, extra_storage_rate_per_gb, 
    max_projects, annotation_discount_percent, renewal_discount_percent, 
    storage_discount_percent, annual_bonus_months, annual_bonus_credits, 
    description, features_json, created_at, updated_at
) VALUES (
    'Test Plan', 'starter', 'monthly', 1.00, 10000, 
    0.0001, true, 10, NULL, true, 
    true, true, 12, 25.00, 
    10, 0.00, 0.00, 
    0.00, 0, 0, 
    'Test subscription plan for development', '[]', NOW(), NOW()
);

-- Verify
SELECT id, name, price_inr, credits_per_month FROM billing_subscription_plan WHERE name = 'Test Plan';
