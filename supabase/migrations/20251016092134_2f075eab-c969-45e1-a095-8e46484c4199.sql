-- Deactivate features to be removed
UPDATE features 
SET is_active = false 
WHERE feature_name IN ('Student Support Hub', 'Financial Management', 'Wellness Platform', 'WellSync');

-- Update Synq Finance with comprehensive description and emoji
UPDATE features 
SET 
  feature_name = '💰 SYNQ FINANCE',
  description = 'Complete student financial management platform with 8 core features: 1) Expense Tracking synced with academic calendars 2) Scholarship & Grant Discovery Engine with 50,000+ opportunities 3) Student Loan Calculators with repayment simulations 4) Part-time Job Income Integration 5) Peer-to-Peer Financial Tips & Insights 6) Textbook Cost-Sharing Marketplace 7) Meal Plan Optimizers 8) Emergency Fund Builders. Track expenses, discover scholarships, manage loans, integrate income, share tips, save on textbooks, optimize meal plans, and build emergency funds—all in one comprehensive platform.',
  icon_name = 'DollarSign',
  gradient_start = '#10b981',
  gradient_end = '#3b82f6'
WHERE feature_name = 'Synq Finance' OR id = '75874969-5028-4fc5-bde9-2c7cf6c87ef9';