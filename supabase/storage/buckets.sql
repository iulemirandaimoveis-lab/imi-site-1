-- supabase/storage/buckets.sql

-- Criar bucket para imagens de imóveis
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'property-images',
  'property-images',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
);

-- Criar bucket para documentos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'property-documents',
  'property-documents',
  false,
  10485760, -- 10MB
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
);

-- Políticas de acesso (property-images - público)
CREATE POLICY "Permitir leitura pública de imagens"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'property-images');

CREATE POLICY "Permitir upload autenticado de imagens"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'property-images');

CREATE POLICY "Permitir delete autenticado de imagens"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'property-images');

-- Políticas de acesso (property-documents - privado)
CREATE POLICY "Permitir leitura autenticada de documentos"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'property-documents');

CREATE POLICY "Permitir upload autenticado de documentos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'property-documents');

CREATE POLICY "Permitir delete autenticado de documentos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'property-documents');
