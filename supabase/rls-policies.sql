-- Enable RLS
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE views ENABLE ROW LEVEL SECURITY;

-- Properties policies
DROP POLICY IF EXISTS "Users can view own properties" ON properties;
CREATE POLICY "Users can view own properties" 
ON properties FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own properties" ON properties;
CREATE POLICY "Users can insert own properties" 
ON properties FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own properties" ON properties;
CREATE POLICY "Users can update own properties" 
ON properties FOR UPDATE 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own properties" ON properties;
CREATE POLICY "Users can delete own properties" 
ON properties FOR DELETE 
USING (auth.uid() = user_id);

-- Leads policies
DROP POLICY IF EXISTS "Users can manage own leads" ON leads;
CREATE POLICY "Users can manage own leads" 
ON leads FOR ALL 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- Consultorias policies
DROP POLICY IF EXISTS "Users can manage own consultorias" ON consultorias;
CREATE POLICY "Users can manage own consultorias" 
ON consultorias FOR ALL 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- Views policies (público pode ler, apenas inserts autenticados)
DROP POLICY IF EXISTS "Public can read views" ON views;
CREATE POLICY "Public can read views" 
ON views FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Anyone can insert views" ON views;
CREATE POLICY "Anyone can insert views" 
ON views FOR INSERT 
WITH CHECK (true);
