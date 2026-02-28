-- Insert Subscription Plans
DELETE FROM billing_subscription_plan;

INSERT INTO billing_subscription_plan (name, plan_type, billing_cycle, price_inr, credits_per_month, effective_rate, is_active, storage_gb, max_users, priority_support, api_access, credit_rollover, max_rollover_months, extra_storage_rate_per_gb, max_projects, annotation_discount_percent, renewal_discount_percent, storage_discount_percent, annual_bonus_months, annual_bonus_credits, description, features_json, created_at, updated_at)
VALUES 
('Starter Monthly', 'starter', 'monthly', 19999.00, 16000, 1.25, true, 10, NULL, true, true, true, 12, 25.00, 10, 0.00, 0.00, 0.00, 0, 0, '', '[]', NOW(), NOW()),
('Growth Monthly', 'growth', 'monthly', 49999.00, 43000, 1.16, true, 25, NULL, true, true, true, 12, 19.00, 20, 0.00, 0.00, 0.00, 0, 0, '', '[]', NOW(), NOW()),
('Scale Monthly', 'scale', 'monthly', 79999.00, 79999, 1.00, true, 50, NULL, true, true, true, 12, 14.00, 30, 0.00, 0.00, 0.00, 0, 0, '', '[]', NOW(), NOW()),
('Starter Annual', 'starter', 'annual', 199990.00, 18000, 0.93, true, 10, NULL, true, true, true, 12, 25.00, 10, 0.00, 0.00, 0.00, 0, 0, '', '[]', NOW(), NOW()),
('Growth Annual', 'growth', 'annual', 499990.00, 45000, 0.93, true, 25, NULL, true, true, true, 12, 19.00, 20, 0.00, 0.00, 0.00, 0, 0, '', '[]', NOW(), NOW()),
('Scale Annual', 'scale', 'annual', 799990.00, 81000, 0.82, true, 50, NULL, true, true, true, 12, 14.00, 30, 0.00, 0.00, 0.00, 0, 0, '', '[]', NOW(), NOW());

-- Insert Credit Packages
DELETE FROM billing_credit_package;

INSERT INTO billing_credit_package (name, credits, price_inr, rate_per_credit, is_active, created_at)
VALUES
('Explorer Package', 5000, 8750.00, 1.75, true, NOW()),
('Professional Package', 25000, 37500.00, 1.50, true, NOW()),
('Team Package', 100000, 135000.00, 1.35, true, NOW()),
('Enterprise PAYG', 500000, 650000.00, 1.30, true, NOW());
