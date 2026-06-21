-- Menghapus constraint (pembatasan) pada kolom section_name 
-- agar admin bisa memasukkan nama bagian secara bebas/general.
ALTER TABLE site_content DROP CONSTRAINT site_content_section_name_check;
