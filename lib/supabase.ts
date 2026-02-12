import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
}

// Server-side Supabase client (for API routes)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Wallet {
    id: string;
    address: string;
    allocation: number;
    base_allocation: number;
    total_score: number;
    has_activity: boolean;
    nft_bonus: number;
    defi_bonus: number;
    early_adopter_bonus: number;
    from_transactions: number;
    from_tokens: number;
    from_age: number;
    from_nfts: number;
    from_defi: number;
    scan_data: any;
    connected_wallet: string | null;
    is_verified: boolean;
    referral_code: string;
    created_at: string;
    updated_at: string;
}

export interface Referral {
    id: string;
    referrer_address: string;
    referred_address: string;
    bonus_amount: number;
    is_claimed: boolean;
    created_at: string;
}

export interface LeaderboardEntry {
    address: string;
    base_allocation: number;
    referral_count: number;
    referral_bonus: number;
    total_allocation: number;
    rank: number;
    updated_at: string;
}
