/**
 * Smart Contract Addresses and Configuration
 * 
 * IMPORTANT: Update these addresses after deploying your contracts
 * See TOKEN_DEPLOYMENT_GUIDE.md for deployment instructions
 */

// ============================================================================
// SOLANICA Token Configuration
// ============================================================================

export const SOLANICA_TOKEN = {
  // TODO: Add your SOLANICA token mint address after deployment
  // Get this from: spl-token create-token --decimals 9
  mint: 'Ev6Wo8e1jLgwuG2vK7cvDEYqp9vCH61s1fkf5mfbonk', // Example: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263'
  
  decimals: 9,
  symbol: 'SOLANICA',
  name: 'SOLANICAFINANCE',
  
  // TODO: Upload logo to IPFS/Arweave and add URL here
  logoURI: '', // Example: 'https://arweave.net/your-logo-hash'
  
  // Token metadata
  description: 'SOLANICA Finance governance and utility token',
  website: 'Solanicafinance.xyz',
  twitter: '@SolanicaFinance',
  
  // Supply information
  maxSupply: 42_000_000, // 42 million tokens
  initialSupply: 42_000_000,
};

// ============================================================================
// Staking Contract Configuration
// ============================================================================

export const STAKING_CONTRACT = {
  // TODO: Add your staking program ID after deployment
  // Get this from: anchor deploy --provider.cluster mainnet
  programId: '', // Example: 'StakeProgram11111111111111111111111111111111'
  
  // Staking pool account
  poolAccount: '', // Created during initialization
  
  // Reward vault account
  rewardVault: '', // Holds reward tokens
  
  // Configuration
  apy: 44, // 44% annual percentage yield
  monthlyRate: 13 / 12, // ~1.08% per month
  minStake: 100, // Minimum 100 SOLAN tokens
  lockPeriod: 0, // No lock period (flexible staking)
  
  // Distribution
  distributionFrequency: 'monthly',
  rewardToken: SOLANICA_TOKEN.mint, // Rewards paid in SOLAN
};

// ============================================================================
// x402 Payment Protocol Configuration
// ============================================================================

export const X402_CONFIG = {
  // Supported facilitators
  facilitators: {
    payai: {
      id: 'payai',
      name: 'PayAI',
      endpoint: 'https://facilitator.payai.io',
      verifyEndpoint: 'https://facilitator.payai.io/verify',
      settleEndpoint: 'https://facilitator.payai.io/settle',
      chains: ['solana', 'base', 'polygon', 'avalanche', 'sei', 'peaq', 'iotex'],
    },
    coinbase: {
      id: 'coinbase',
      name: 'Coinbase CDP',
      endpoint: 'https://cdp.coinbase.com/x402',
      verifyEndpoint: 'https://cdp.coinbase.com/x402/verify',
      settleEndpoint: 'https://cdp.coinbase.com/x402/settle',
      chains: ['base', 'ethereum', 'polygon', 'arbitrum', 'optimism'],
    },
    x402rs: {
      id: 'x402rs',
      name: 'x402.rs',
      endpoint: 'https://facilitator.x402.rs',
      verifyEndpoint: 'https://facilitator.x402.rs/verify',
      settleEndpoint: 'https://facilitator.x402.rs/settle',
      chains: ['solana', 'ethereum', 'base', 'polygon', 'avalanche', 'bsc', 'arbitrum', 'optimism'],
    },
  },
  
  // Supported chains
  chains: [
    { id: 'solana', name: 'Solana', nativeToken: 'SOL' },
    { id: 'ethereum', name: 'Ethereum', nativeToken: 'ETH' },
    { id: 'base', name: 'Base', nativeToken: 'ETH' },
    { id: 'polygon', name: 'Polygon', nativeToken: 'MATIC' },
    { id: 'avalanche', name: 'Avalanche', nativeToken: 'AVAX' },
    { id: 'bsc', name: 'BSC', nativeToken: 'BNB' },
    { id: 'arbitrum', name: 'Arbitrum', nativeToken: 'ETH' },
    { id: 'optimism', name: 'Optimism', nativeToken: 'ETH' },
  ],
};

// ============================================================================
// Network Configuration
// ============================================================================

export const NETWORK_CONFIG = {
  solana: {
    network: 'mainnet-beta',
    rpcEndpoint: import.meta.env.VITE_HELIUS_API_KEY
      ? `https://mainnet.helius-rpc.com/?api-key=${import.meta.env.VITE_HELIUS_API_KEY}`
      : 'https://api.mainnet-beta.solana.com',
    
    // Explorer URLs
    explorerUrl: 'https://solscan.io',
    
    // Well-known token addresses
    tokens: {
      USDC: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
      USDT: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
      BONK: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
      SOLANICA: 'Ev6Wo8e1jLgwuG2vK7cvDEYqp9vCH61s1fkf5mfbonk',
    },
  },
};

// ============================================================================
// Deployment Checklist
// ============================================================================

/**
 * Before going to production, ensure:
 * 
 * 1. SOLANICA Token Deployed
 *    - [ ] Token mint created on Solana mainnet
 *    - [ ] Metadata uploaded (name, symbol, logo)
 *    - [ ] Initial supply minted
 *    - [ ] Mint authority disabled (optional, for fixed supply)
 *    - [ ] Token listed on Jupiter/Raydium
 * 
 * 2. Staking Contract Deployed
 *    - [ ] Anchor program deployed to mainnet
 *    - [ ] Staking pool initialized
 *    - [ ] Reward vault funded
 *    - [ ] Admin authority configured
 *    - [ ] Emergency pause mechanism tested
 * 
 * 3. Configuration Updated
 *    - [ ] All contract addresses added to this file
 *    - [ ] RPC endpoint configured with API key
 *    - [ ] Logo URLs updated
 *    - [ ] Social links added
 * 
 * 4. Testing Completed
 *    - [ ] Token transfers work
 *    - [ ] Staking/unstaking tested
 *    - [ ] Reward calculations verified
 *    - [ ] x402 payments tested
 *    - [ ] All error cases handled
 * 
 * 5. Security Audit
 *    - [ ] Smart contracts audited
 *    - [ ] Frontend security review
 *    - [ ] Rate limiting implemented
 *    - [ ] Input validation complete
 * 
 * See TOKEN_DEPLOYMENT_GUIDE.md for detailed instructions
 */

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Check if contracts are configured
 */
export function isProductionReady(): boolean {
  return !!(
    SOLANICA_TOKEN.mint &&
    STAKING_CONTRACT.programId &&
    import.meta.env.VITE_HELIUS_API_KEY
  );
}

/**
 * Get configuration status
 */
export function getConfigStatus() {
  return {
    tokenDeployed: !!SOLANICA_TOKEN.mint,
    stakingDeployed: !!STAKING_CONTRACT.programId,
    rpcConfigured: !!import.meta.env.VITE_HELIUS_API_KEY,
    logoUploaded: !!SOLANICA_TOKEN.logoURI,
    productionReady: isProductionReady(),
  };
}

/**
 * Log configuration warnings
 */
export function logConfigWarnings() {
  const status = getConfigStatus();
  
  if (!status.tokenDeployed) {
    console.warn('⚠️ SOLANICA token not deployed. Add mint address to src/config/contracts.ts');
  }
  
  if (!status.stakingDeployed) {
    console.warn('⚠️ Staking contract not deployed. Add program ID to src/config/contracts.ts');
  }
  
  if (!status.rpcConfigured) {
    console.warn('⚠️ RPC API key not configured. Add VITE_HELIUS_API_KEY to .env');
  }
  
  if (!status.logoUploaded) {
    console.warn('⚠️ Token logo not uploaded. Add logoURI to src/config/contracts.ts');
  }
  
  if (status.productionReady) {
    console.log('✅ All contracts configured and ready for production');
  } else {
    console.warn('⚠️ App running in demo mode. See TOKEN_DEPLOYMENT_GUIDE.md for setup instructions');
  }
}

// Log warnings on import
if (typeof window !== 'undefined') {
  logConfigWarnings();
}
