-- Update FinSync to Synq Finance with comprehensive description
UPDATE features 
SET 
  feature_name = 'Synq Finance',
  description = 'Build a student-focused financial management and budget planning platform that includes: Expense tracking synced with academic calendars, Scholarship and grant discovery engine, Student loan calculators with repayment simulations, Part-time job income integration, Peer-to-peer financial tips and insights, Textbook cost-sharing marketplace, Meal plan optimizers, and Emergency fund builders.'
WHERE feature_name = 'FinSync';