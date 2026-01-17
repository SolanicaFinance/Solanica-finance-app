import { FC, ReactNode, useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
  LedgerWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';

// Import wallet adapter CSS
import '@solana/wallet-adapter-react-ui/styles.css';

interface WalletContextProviderProps {
  children: ReactNode;
}

export const WalletContextProvider: FC<WalletContextProviderProps> = ({ children }) => {
  // Use mainnet-beta for production
  const network = WalletAdapterNetwork.Mainnet;

  // Production RPC endpoint with Helius API key support
  const endpoint = useMemo(() => {
    const heliusKey = import.meta.env.VITE_HELIUS_API_KEY;
    
    if (heliusKey && heliusKey.trim() !== '') {
      // Check if it's already a full URL or just an API key
      if (heliusKey.startsWith('http')) {
        return heliusKey;
      }
      return `https://mainnet.helius-rpc.com/?api-key=${heliusKey}`;
    }
    
    // Fallback to public endpoint (rate limited)
    console.warn('⚠️ Using public RPC endpoint. Add VITE_HELIUS_API_KEY to .env for production');
    return clusterApiUrl(network);
  }, [network]);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new TorusWalletAdapter(),
      new LedgerWalletAdapter(),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
