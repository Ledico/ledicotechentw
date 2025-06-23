import { createClient } from '@supabase/supabase-js';

// Supabase-Konfiguration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Supabase-Client erstellen
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Funktion zum Abrufen einer öffentlichen URL für eine Datei
export async function getPublicUrl(bucket: string, path: string): Promise<string | null> {
  try {
    const { data } = await supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  } catch (error) {
    console.error('Fehler beim Abrufen der öffentlichen URL:', error);
    return null;
  }
}

// Funktion zum Herunterladen einer Datei
export async function downloadFile(bucket: string, path: string, fileName: string): Promise<void> {
  try {
    const { data, error } = await supabase.storage.from(bucket).download(path);
    
    if (error) {
      throw error;
    }
    
    if (data) {
      // Blob-URL erstellen und Download auslösen
      const url = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  } catch (error) {
    console.error('Fehler beim Herunterladen der Datei:', error);
    alert('Beim Herunterladen der Datei ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.');
  }
}