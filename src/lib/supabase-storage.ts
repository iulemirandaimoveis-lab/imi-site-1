import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export class StorageService {

    /**
     * Upload de imagem de imóvel
     */
    async uploadPropertyImage(
        file: File,
        propertyId: string
    ): Promise<string> {
        try {
            // Gerar nome único
            const timestamp = Date.now();
            const extension = file.name.split('.').pop();
            const filename = `${propertyId}/${timestamp}.${extension}`;

            // Upload para Supabase Storage
            const { data, error } = await supabase.storage
                .from('property-images')
                .upload(filename, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (error) {
                throw new Error(`Upload failed: ${error.message}`);
            }

            // Obter URL pública
            const { data: urlData } = supabase.storage
                .from('property-images')
                .getPublicUrl(filename);

            return urlData.publicUrl;

        } catch (error) {
            console.error('Upload error:', error);
            throw error;
        }
    }

    /**
     * Upload múltiplo de imagens
     */
    async uploadPropertyImages(
        files: File[],
        propertyId: string
    ): Promise<string[]> {
        const uploadPromises = files.map(file =>
            this.uploadPropertyImage(file, propertyId)
        );

        return await Promise.all(uploadPromises);
    }

    /**
     * Deletar imagem
     */
    async deletePropertyImage(url: string): Promise<void> {
        try {
            // Extrair path da URL
            const urlObj = new URL(url);
            const path = urlObj.pathname.split('/property-images/')[1];

            const { error } = await supabase.storage
                .from('property-images')
                .remove([path]);

            if (error) {
                throw new Error(`Delete failed: ${error.message}`);
            }

        } catch (error) {
            console.error('Delete error:', error);
            throw error;
        }
    }

    /**
     * Upload de documento
     */
    async uploadPropertyDocument(
        file: File,
        propertyId: string
    ): Promise<string> {
        try {
            const timestamp = Date.now();
            const extension = file.name.split('.').pop();
            const filename = `${propertyId}/docs/${timestamp}.${extension}`;

            const { data, error } = await supabase.storage
                .from('property-documents')
                .upload(filename, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (error) {
                throw new Error(`Upload failed: ${error.message}`);
            }

            // Para documentos privados, gerar signed URL (válida por 1 ano)
            const { data: signedUrlData, error: signedError } = await supabase.storage
                .from('property-documents')
                .createSignedUrl(filename, 31536000); // 1 ano

            if (signedError) {
                throw new Error(`Signed URL failed: ${signedError.message}`);
            }

            return signedUrlData.signedUrl;

        } catch (error) {
            console.error('Document upload error:', error);
            throw error;
        }
    }
}

export const storageService = new StorageService();
