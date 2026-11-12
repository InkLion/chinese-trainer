// js/core/supabase.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Эти данные вы найдете в настройках вашего проекта Supabase (Project Settings -> API)
const supabaseUrl = 'https://httaaetajxeuavkeddyb.supabase.co';
const supabaseAnonKey = 'sb_publishable_Z_n8Uc5UrBy1dFm1UkxawA_atNIoJ5m';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);