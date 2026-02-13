import { supabase } from './supabase';

export async function uploadImageToSupabase(file: File): Promise<string | null> {
  try {
    // Vygeneruj unikátny názov súboru
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    // Nahraj súbor do Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('obrazy')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    // Získaj verejnú URL
    const { data } = supabase.storage
      .from('obrazy')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error('Chyba pri upload obrázku:', error);
    return null;
  }
}

export async function deleteImageFromSupabase(url: string): Promise<boolean> {
  try {
    // Extrahuj názov súboru z URL
    const urlParts = url.split('/');
    const fileName = urlParts[urlParts.length - 1];

    const { error } = await supabase.storage
      .from('obrazy')
      .remove([fileName]);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Chyba pri mazaní obrázku:', error);
    return false;
  }
}