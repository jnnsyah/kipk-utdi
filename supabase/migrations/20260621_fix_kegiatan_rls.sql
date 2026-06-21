-- 1. Pastikan tabel activities mengizinkan role Authenticated untuk INSERT, UPDATE, DELETE
CREATE POLICY "Allow authenticated to insert activities" ON activities
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated to update activities" ON activities
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated to delete activities" ON activities
  FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow public to select activities" ON activities
  FOR SELECT TO public USING (true);

-- 2. Pastikan tabel activity_photos mengizinkan role Authenticated untuk INSERT, UPDATE, DELETE
CREATE POLICY "Allow authenticated to insert activity_photos" ON activity_photos
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated to update activity_photos" ON activity_photos
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated to delete activity_photos" ON activity_photos
  FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow public to select activity_photos" ON activity_photos
  FOR SELECT TO public USING (true);

-- 3. Pastikan bucket 'dokumentasi-kegiatan' ada dan bersifat public
INSERT INTO storage.buckets (id, name, public) 
VALUES ('dokumentasi-kegiatan', 'dokumentasi-kegiatan', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 4. RLS untuk storage.objects bucket 'dokumentasi-kegiatan'
CREATE POLICY "Allow authenticated to upload photos" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'dokumentasi-kegiatan');

CREATE POLICY "Allow public to view photos" ON storage.objects
  FOR SELECT TO public USING (bucket_id = 'dokumentasi-kegiatan');

CREATE POLICY "Allow authenticated to delete photos" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'dokumentasi-kegiatan');
