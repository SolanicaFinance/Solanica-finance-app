import { useState } from 'react';
import { motion } from 'framer-motion';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/Navbar';
import { TokenChart } from '@/components/TokenChart';
import { AISwapOptimizer } from '@/components/AISwapOptimizer';
import { JupiterTerminal } from '@/components/JupiterTerminal';
import { TrendingUp, Zap, Shield, Brain } from 'lucide-react';

export default function Trading() {
  const { connected } = useWallet();
  const [showAIOptimizer, setShowAIOptimizer] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Features Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 border-purple-500/30">
            <CardContent className="p-4 flex items-center gap-3">
              <Brain className="w-8 h-8 text-purple-400" />
              <div>
                <p className="text-sm font-semibold text-white">AI Optimization</p>
                <p className="text-xs text-slate-400">Smart routing</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 border-blue-500/30">
            <CardContent className="p-4 flex items-center gap-3">
              <Zap className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-sm font-semibold text-white">Instant Swaps</p>
                <p className="text-xs text-slate-400">Lightning fast</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-900/20 to-green-800/20 border-green-500/30">
            <CardContent className="p-4 flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-sm font-semibold text-white">Best Rates</p>
                <p className="text-xs text-slate-400">Aggregated</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-900/20 to-orange-800/20 border-orange-500/30">
            <CardContent className="p-4 flex items-center gap-3">
              <Shield className="w-8 h-8 text-orange-400" />
              <div>
                <p className="text-sm font-semibold text-white">Secure</p>
                <p className="text-xs text-slate-400">Audited</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Chart & Stats */}
          <div className="space-y-6">
            <TokenChart tokenSymbol="SOL/USDC" />
            
            {/* Trading Stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="bg-slate-900/50 border-slate-800">
                <CardContent className="p-4">
                  <p className="text-xs text-slate-400 mb-1">24h Volume</p>
                  <p className="text-xl font-bold text-white">$2.4M</p>
                  <p className="text-xs text-green-400">+12.5%</p>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-900/50 border-slate-800">
                <CardContent className="p-4">
                  <p className="text-xs text-slate-400 mb-1">Liquidity</p>
                  <p className="text-xl font-bold text-white">$8.7M</p>
                  <p className="text-xs text-blue-400">Deep</p>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-900/50 border-slate-800">
                <CardContent className="p-4">
                  <p className="text-xs text-slate-400 mb-1">Avg. Slippage</p>
                  <p className="text-xl font-bold text-white">0.12%</p>
                  <p className="text-xs text-green-400">Low</p>
                </CardContent>
              </Card>
            </div>

          </div>

          {/* Right Column - Trading Interface */}
          <div className="space-y-6">
            {/* Jupiter Terminal */}
            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-6">
                {!connected ? (
                  <div className="flex flex-col items-center gap-4 py-12">
                    <Shield className="w-16 h-16 text-slate-600" />
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-white mb-2">Connect Wallet</h3>
                      <p className="text-sm text-slate-400 mb-4">
                        Connect your wallet to start trading
                      </p>
                      <WalletMultiButton className="!bg-gradient-to-r !from-purple-600 !to-blue-600 hover:!from-purple-700 hover:!to-blue-700" />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white">Swap Tokens</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAIOptimizer(!showAIOptimizer)}
                        className="text-purple-400 hover:text-purple-300"
                      >
                        <Brain className="w-4 h-4 mr-2" />
                        {showAIOptimizer ? 'Hide' : 'Show'} AI
                      </Button>
                    </div>
                    
                    <JupiterTerminal mode="integrated" />

                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Zap className="w-5 h-5 text-blue-400 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-blue-200 mb-1">
                            x402 Protocol Active
                          </p>
                          <p className="text-xs text-blue-300">
                            Automatic 0.5% fee applied for seamless transactions
                          </p>
                        </div>
                       </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* AI Optimizer */}
            {showAIOptimizer && connected && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <AISwapOptimizer fromToken="SOL" toToken="USDC" amount={1} />
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
