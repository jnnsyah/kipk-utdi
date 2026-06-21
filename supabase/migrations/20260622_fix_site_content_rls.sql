-- 1. Pastikan tabel site_content mengizinkan role Authenticated untuk INSERT, UPDATE, DELETE
CREATE POLICY "Allow authenticated to insert site_content" ON site_content
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated to update site_content" ON site_content
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated to delete site_content" ON site_content
  FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow public to select site_content" ON site_content
  FOR SELECT TO public USING (true);
