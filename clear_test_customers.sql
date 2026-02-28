-- Check existing test mode customer IDs
SELECT id, organization_id, razorpay_customer_id FROM billing_organization_billing WHERE razorpay_customer_id IS NOT NULL AND razorpay_customer_id != '';

-- Clear all test mode customer IDs so new ones are created with live keys
UPDATE billing_organization_billing SET razorpay_customer_id = '' WHERE razorpay_customer_id IS NOT NULL AND razorpay_customer_id != '';

-- Verify cleared
SELECT id, organization_id, razorpay_customer_id FROM billing_organization_billing;
