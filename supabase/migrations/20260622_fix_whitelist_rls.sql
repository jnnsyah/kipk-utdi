-- 1. Pastikan RLS diaktifkan untuk tabel admin_whitelist
ALTER TABLE admin_whitelist ENABLE ROW LEVEL SECURITY;

-- 2. Kebijakan RLS untuk role Authenticated (Admin) agar bisa melakukan INSERT dan DELETE
CREATE POLICY "Allow authenticated to insert admin_whitelist" ON admin_whitelist
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated to delete admin_whitelist" ON admin_whitelist
  FOR DELETE TO authenticated USING (true);

-- 3. Kebijakan RLS agar publik (anon/authenticated) bisa melakukan SELECT
CREATE POLICY "Allow public to select admin_whitelist" ON admin_whitelist
  FOR SELECT TO public USING (true);
