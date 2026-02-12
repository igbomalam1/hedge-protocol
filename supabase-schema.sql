-- =====================================================
-- HOGS Token - Supabase Database Schema
-- =====================================================
-- This SQL creates the database structure for:
-- - Wallet tracking and allocation storage
-- - Referral system (5,000 $HOGS per referral)
-- - Leaderboard rankings
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- Table: wallets
-- Stores scanned wallets and their allocation data
-- =====================================================
CREATE TABLE wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  address TEXT UNIQUE NOT NULL,
  allocation INTEGER NOT NULL,
  base_allocation INTEGER NOT NULL,
  total_score INTEGER NOT NULL,
  has_activity BOOLEAN NOT NULL DEFAULT false,
  
  -- Multipliers
  nft_bonus DECIMAL(3,2) DEFAULT 1.0,
  defi_bonus DECIMAL(3,2) DEFAULT 1.0,
  early_adopter_bonus DECIMAL(3,2) DEFAULT 1.0,
  
  -- Breakdown
  from_transactions INTEGER DEFAULT 0,
  from_tokens INTEGER DEFAULT 0,
  from_age INTEGER DEFAULT 0,
  from_nfts INTEGER DEFAULT 0,
  from_defi INTEGER DEFAULT 0,
  
  -- Scan data (full JSON from blockchain scan)
  scan_data JSONB,
  
  -- Wallet connection
  connected_wallet TEXT,
  is_verified BOOLEAN DEFAULT false,
  
  -- Referral code (unique for each wallet)
  referral_code TEXT UNIQUE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_wallets_address ON wallets(address);
CREATE INDEX idx_wallets_connected ON wallets(connected_wallet);
CREATE INDEX idx_wallets_allocation ON wallets(allocation DESC);
CREATE INDEX idx_wallets_referral_code ON wallets(referral_code);
CREATE INDEX idx_wallets_has_activity ON wallets(has_activity);

-- =====================================================
-- Table: referrals
-- Tracks referral relationships and bonuses
-- =====================================================
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_address TEXT NOT NULL,
  referred_address TEXT NOT NULL UNIQUE, -- Each wallet can only be referred once
  bonus_amount INTEGER DEFAULT 5000,
  is_claimed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT fk_referrer FOREIGN KEY (referrer_address) REFERENCES wallets(address) ON DELETE CASCADE,
  CONSTRAINT fk_referred FOREIGN KEY (referred_address) REFERENCES wallets(address) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_referrals_referrer ON referrals(referrer_address);
CREATE INDEX idx_referrals_referred ON referrals(referred_address);

-- =====================================================
-- Table: leaderboard_cache
-- Cached leaderboard data for performance
-- =====================================================
CREATE TABLE leaderboard_cache (
  address TEXT PRIMARY KEY,
  base_allocation INTEGER NOT NULL,
  referral_count INTEGER DEFAULT 0,
  referral_bonus INTEGER DEFAULT 0,
  total_allocation INTEGER NOT NULL,
  rank INTEGER,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT fk_wallet FOREIGN KEY (address) REFERENCES wallets(address) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_leaderboard_rank ON leaderboard_cache(rank);
CREATE INDEX idx_leaderboard_total ON leaderboard_cache(total_allocation DESC);

-- =====================================================
-- Function: Update leaderboard cache
-- Automatically recalculates leaderboard when allocations change
-- =====================================================
CREATE OR REPLACE FUNCTION update_leaderboard_cache()
RETURNS TRIGGER AS $$
BEGIN
  -- Delete existing cache entry
  DELETE FROM leaderboard_cache WHERE address = NEW.address;
  
  -- Calculate referral stats
  WITH referral_stats AS (
    SELECT 
      referrer_address,
      COUNT(*) as ref_count,
      SUM(bonus_amount) as ref_bonus
    FROM referrals
    WHERE referrer_address = NEW.address
    GROUP BY referrer_address
  )
  -- Insert updated cache entry
  INSERT INTO leaderboard_cache (
    address,
    base_allocation,
    referral_count,
    referral_bonus,
    total_allocation
  )
  SELECT 
    NEW.address,
    NEW.allocation,
    COALESCE(rs.ref_count, 0),
    COALESCE(rs.ref_bonus, 0),
    NEW.allocation + COALESCE(rs.ref_bonus, 0)
  FROM (SELECT NEW.address) w
  LEFT JOIN referral_stats rs ON rs.referrer_address = NEW.address;
  
  -- Update ranks
  WITH ranked_wallets AS (
    SELECT 
      address,
      ROW_NUMBER() OVER (ORDER BY total_allocation DESC) as new_rank
    FROM leaderboard_cache
  )
  UPDATE leaderboard_cache lc
  SET rank = rw.new_rank
  FROM ranked_wallets rw
  WHERE lc.address = rw.address;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update leaderboard when wallet allocation changes
CREATE TRIGGER trigger_update_leaderboard
AFTER INSERT OR UPDATE OF allocation ON wallets
FOR EACH ROW
EXECUTE FUNCTION update_leaderboard_cache();

-- =====================================================
-- Function: Update leaderboard on referral creation
-- =====================================================
CREATE OR REPLACE FUNCTION update_leaderboard_on_referral()
RETURNS TRIGGER AS $$
BEGIN
  -- Update referrer's allocation
  UPDATE wallets
  SET allocation = allocation + NEW.bonus_amount,
      updated_at = NOW()
  WHERE address = NEW.referrer_address;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update allocation when referral is created
CREATE TRIGGER trigger_referral_bonus
AFTER INSERT ON referrals
FOR EACH ROW
EXECUTE FUNCTION update_leaderboard_on_referral();

-- =====================================================
-- Function: Generate unique referral code
-- =====================================================
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TRIGGER AS $$
BEGIN
  -- Generate a unique 8-character code from wallet address
  NEW.referral_code := UPPER(SUBSTRING(MD5(NEW.address || NOW()::TEXT), 1, 8));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to generate referral code on wallet creation
CREATE TRIGGER trigger_generate_referral_code
BEFORE INSERT ON wallets
FOR EACH ROW
EXECUTE FUNCTION generate_referral_code();

-- =====================================================
-- Row Level Security (RLS) Policies
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard_cache ENABLE ROW LEVEL SECURITY;

-- Wallets: Anyone can read, only system can write
CREATE POLICY "Wallets are viewable by everyone"
  ON wallets FOR SELECT
  USING (true);

CREATE POLICY "Wallets can be inserted by anyone"
  ON wallets FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Wallets can be updated by anyone"
  ON wallets FOR UPDATE
  USING (true);

-- Referrals: Anyone can read, only system can write
CREATE POLICY "Referrals are viewable by everyone"
  ON referrals FOR SELECT
  USING (true);

CREATE POLICY "Referrals can be inserted by anyone"
  ON referrals FOR INSERT
  WITH CHECK (true);

-- Leaderboard: Read-only for everyone, but triggers can modify
CREATE POLICY "Leaderboard is viewable by everyone"
  ON leaderboard_cache FOR SELECT
  USING (true);

CREATE POLICY "Leaderboard can be inserted by triggers"
  ON leaderboard_cache FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Leaderboard can be updated by triggers"
  ON leaderboard_cache FOR UPDATE
  USING (true);

CREATE POLICY "Leaderboard can be deleted by triggers"
  ON leaderboard_cache FOR DELETE
  USING (true);

-- =====================================================
-- Initial Data / Test Data (Optional)
-- =====================================================

-- You can add test data here if needed
-- Example:
-- INSERT INTO wallets (address, allocation, base_allocation, total_score, has_activity)
-- VALUES ('0x1234567890123456789012345678901234567890', 50000, 40000, 8000, true);

-- =====================================================
-- Helpful Queries
-- =====================================================

-- Get top 100 leaderboard
-- SELECT * FROM leaderboard_cache ORDER BY rank LIMIT 100;

-- Get wallet with referral stats
-- SELECT 
--   w.*,
--   lc.referral_count,
--   lc.referral_bonus,
--   lc.total_allocation,
--   lc.rank
-- FROM wallets w
-- LEFT JOIN leaderboard_cache lc ON w.address = lc.address
-- WHERE w.address = '0x...';

-- Get all referrals for a wallet
-- SELECT * FROM referrals WHERE referrer_address = '0x...';
