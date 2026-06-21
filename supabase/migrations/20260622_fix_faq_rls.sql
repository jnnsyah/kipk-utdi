-- 1. Pastikan RLS diaktifkan untuk tabel faqs
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

-- 2. Kebijakan RLS untuk role Authenticated (Admin) agar bisa melakukan INSERT, UPDATE, DELETE
CREATE POLICY "Allow authenticated to insert faqs" ON faqs
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated to update faqs" ON faqs
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated to delete faqs" ON faqs
  FOR DELETE TO authenticated USING (true);

-- 3. Kebijakan RLS agar publik (anon/authenticated) bisa melakukan SELECT
CREATE POLICY "Allow public to select faqs" ON faqs
  FOR SELECT TO public USING (true);
