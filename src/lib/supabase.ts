import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos do banco de dados
export interface User {
  id: string;
  email: string;
  name: string;
  birth_year: number;
  region: 'brasil' | 'portugal';
  is_premium: boolean;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  status: 'active' | 'cancelled' | 'expired';
  plan: 'monthly';
  price: number;
  currency: 'BRL' | 'EUR';
  started_at: string;
  expires_at: string;
  created_at: string;
}

export interface Drink {
  id: string;
  user_id: string;
  name: string;
  brand: string;
  type: string;
  volume: number;
  alcohol_percentage: number;
  image_url?: string;
  created_at: string;
}
