-- Remove userType column
ALTER TABLE users DROP COLUMN userType;

-- Add isOnboarded column
ALTER TABLE users ADD COLUMN isOnboarded BOOLEAN NOT NULL DEFAULT false; 