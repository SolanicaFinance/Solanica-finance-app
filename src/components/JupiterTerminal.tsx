import { useEffect, useRef, useState, memo } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, ExternalLink } from 'lucide-react';

interface JupiterTerminalProps {
  onClose?: () => void;
  mode?: 'modal' | 'integrated' | 'widget';
}

declare global {
  interface Window {
    Jupiter: {
      init: (config: any) => Promise<void>;
      close: () => void;
      syncProps: (props: any) => void;
    };
  }
}

export const JupiterTerminal = memo(({ mode = 'integrated' }: JupiterTerminalProps) => {
  const { publicKey } = useWallet();
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const initRef = useRef(false);

  // Load Jupiter Plugin script dynamically
  useEffect(() => {
    const existingScript = document.querySelector('script[src="https://plugin.jup.ag/plugin-v1.js"]');
    
    if (existingScript) {
      setIsLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://plugin.jup.ag/plugin-v1.js';
    script.async = true;
    script.onload = () => setIsLoaded(true);
    script.onerror = () => setError('Failed to load Jupiter Plugin');
    document.head.appendChild(script);

    return () => {
      if (window.Jupiter) {
        try {
          window.Jupiter.close();
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    };
  }, []);

  // Initialize Jupiter Terminal
  useEffect(() => {
    if (!isLoaded || !publicKey || initRef.current) return;

    const initJupiter = async () => {
      try {
        initRef.current = true;
        setError(null);
        
        // Wait for Jupiter to be available
        let retries = 0;
        while ((!window.Jupiter || typeof window.Jupiter.init !== 'function') && retries < 30) {
          await new Promise(resolve => setTimeout(resolve, 200));
          retries++;
        }
        
        if (!window.Jupiter || typeof window.Jupiter.init !== 'function') {
          throw new Error('Jupiter Terminal not loaded');
        }

        const referralAccount = import.meta.env.VITE_JUPITER_REFERRAL_ACCOUNT;
        
        const config: any = {
          displayMode: mode,
          integratedTargetId: 'jupiter-terminal-container',
          endpoint: import.meta.env.VITE_HELIUS_API_KEY 
            ? `https://mainnet.helius-rpc.com/?api-key=${import.meta.env.VITE_HELIUS_API_KEY}`
            : 'https://api.mainnet-beta.solana.com',
          formProps: {
            initialInputMint:  'So11111111111111111111111111111111111111112',
            initialOutputMint: 'CRKdGbTcFRdXqQimQbJiEjVKdMkPCE1ZXhXQYJMsbonk',
            swapMode: 'ExactInOrOut',
            fixedMint: '',
            referralFee: 50,
            referralAccount: '2z936tUKKDDj4xLxu7Xppt22DPoY4iT6UPkmfiKqPe1g',
          },
          branding: {
            name: 'Solanica',
            logoUri: 'https://solanicafinance.pro/logo.webp',
          },
        };
        
        await window.Jupiter.init(config);
      } catch (err) {
        console.error('Jupiter Terminal init error:', err);
        setError('Failed to initialize Jupiter Plugin');
        initRef.current = false;
      }
    };

    initJupiter();
  }, [isLoaded, publicKey, mode]);

  if (!publicKey) {
    return (
      <Card className="bg-slate-900/50 border-slate-800">
        <CardContent className="p-6">
          <Alert className="bg-blue-500/10 border-blue-500/20">
            <Info className="h-4 w-4 text-blue-400" />
            <AlertDescription className="text-sm text-blue-200">
              Connect your wallet to start trading
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-slate-900/50 border-slate-800">
        <CardContent className="p-6">
          <Alert className="bg-yellow-500/10 border-yellow-500/20">
            <Info className="h-4 w-4 text-yellow-400" />
            <AlertDescription className="text-sm text-yellow-200">
              {error}. Try refreshing the page or use the link below.
            </AlertDescription>
          </Alert>
          <div className="mt-4 text-center">
            <a 
              href="https://jup.ag/swap/SOL-USDC" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline flex items-center justify-center gap-1"
            >
              Open Jupiter Swap
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (mode === 'integrated') {
    return (
      <div className="space-y-4">
        <div 
          id="jupiter-terminal-container" 
          className="w-full [490px] min-h-[600px] rounded-lg"
        />
      </div>
    );
  }

  return null;
});

JupiterTerminal.displayName = 'JupiterTerminal';
