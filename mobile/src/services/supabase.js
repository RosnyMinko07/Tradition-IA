/**
 * TRADITION IA - SERVICE SUPABASE MOBILE
 * Client Supabase officiel pour authentification et synchronisation cloud
 */

import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Clés par défaut (ou à renseigner par l'utilisateur)
const SUPABASE_URL = 'https://default-traditionia.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.default_key';

let supabaseClient = null;

export function getSupabase() {
  if (!supabaseClient) {
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false
      }
    });
  }
  return supabaseClient;
}

export const SupabaseService = {
  async saveFavorite(wordFr, translation, dialect) {
    try {
      const sb = getSupabase();
      return await sb.from('favoris_mobiles').insert([{
        mot_francais: wordFr,
        traduction: translation,
        dialecte: dialect,
        created_at: new Date().toISOString()
      }]);
    } catch (e) {
      console.log('[Supabase] Mode local actif (sauvegarde hors ligne)');
      return null;
    }
  }
};
