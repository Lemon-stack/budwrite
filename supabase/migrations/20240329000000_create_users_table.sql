-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT NOT NULL,
    userName TEXT NOT NULL,
    userType TEXT NOT NULL,
    createdAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    credits INT NOT NULL DEFAULT 2
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable insert for service role" ON users
    FOR INSERT
    TO service_role
    WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON users
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Enable read access for authenticated users" ON users
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable update for users based on id" ON users
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id); 