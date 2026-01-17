import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { JupiterTerminal } from './JupiterTerminal';
import { AISwapOptimizer } from './AISwapOptimizer';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Info, Brain } from 'lucide-react';

interface SwapModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SwapModal = ({ open, onOpenChange }: SwapModalProps) => {
  const { connected } = useWallet();
  const [showAIOptimizer, setShowAIOptimizer] = useState(true);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[480px] p-0 gap-0 bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-2xl font-bold text-white">Swap Tokens</DialogTitle>
          <Alert className="mt-4 bg-blue-500/10 border-blue-500/20">
            <Info className="h-4 w-4 text-blue-400" />
            <AlertDescription className="text-sm text-blue-200">
              Automatic 0.5% fee applied via x402 protocol for seamless transactions
            </AlertDescription>
          </Alert>
        </DialogHeader>
        
        {!connected ? (
          <div className="p-6 pt-0 flex flex-col items-center gap-4">
            <p className="text-slate-300 text-center">Connect your wallet to start swapping</p>
            <WalletMultiButton className="!bg-gradient-to-r !from-purple-600 !to-blue-600 hover:!from-purple-700 hover:!to-blue-700" />
          </div>
        ) : (
          <div className="p-6 pt-0 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-white">Swap Interface</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAIOptimizer(!showAIOptimizer)}
                className="text-purple-400 hover:text-purple-300 h-8"
              >
                <Brain className="w-4 h-4 mr-2" />
                {showAIOptimizer ? 'Hide' : 'Show'} AI Optimizer
              </Button>
            </div>
            
            {showAIOptimizer && (
              <AISwapOptimizer fromToken="SOL" toToken="USDC" amount={1} />
            )}
            
            <JupiterTerminal mode="integrated" onClose={() => onOpenChange(false)} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
