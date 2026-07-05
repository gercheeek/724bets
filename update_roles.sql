-- Drop existing constraint (assuming the constraint name is members_role_check)
ALTER TABLE members DROP CONSTRAINT IF EXISTS members_role_check;

-- Add new constraint with all required roles
ALTER TABLE members ADD CONSTRAINT members_role_check 
CHECK (role IN ('KRAL', 'PATRON', 'ADMIN', 'MODERATOR', 'UYE', 'BOT', 'admin', 'editor', 'author', 'member'));

-- Update any existing basic users to 'UYE' if you want a clean migration (optional)
-- UPDATE members SET role = 'UYE' WHERE role = 'member';
-- UPDATE members SET role = 'ADMIN' WHERE role = 'admin';
