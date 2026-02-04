-- Enable RLS for main tables
ALTER TABLE "properties" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "leads" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "consultations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "activity_logs" ENABLE ROW LEVEL SECURITY;

-- Properties: Authenticated users can do everything for now (Admin Dashboard logic)
-- In a real multi-tenant app, we would restrict by user_id. 
-- Assuming single-tenant or shared admin for this scope:
CREATE POLICY "Allow authenticated full access properties" ON "properties"
FOR ALL USING (auth.role() = 'authenticated');

-- Leads: Authenticated users access
CREATE POLICY "Allow authenticated full access leads" ON "leads"
FOR ALL USING (auth.role() = 'authenticated');

-- Consultations: Authenticated users access
CREATE POLICY "Allow authenticated full access consultations" ON "consultations"
FOR ALL USING (auth.role() = 'authenticated');

-- Logs: Authenticated users access
CREATE POLICY "Allow authenticated full access logs" ON "activity_logs"
FOR ALL USING (auth.role() = 'authenticated');

-- Public Views (if tracking table existed, placeholder as per request)
-- CREATE POLICY "Public insert views" ON "views" FOR INSERT WITH CHECK (true);
