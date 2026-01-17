import { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { 
  X402_FACILITATORS, 
  sendSolanaX402Payment,
  verifyX402Payment,
  settleX402Payment,
  createX402PaymentRequest,
  parseX402PaymentLink,
  validateAddress,
  formatX402Amount,
  type X402Facilitator
} from '@/utils/x402';
import { SOLANICA_TOKEN } from '@/config/contracts';
import { Send, QrCode, Copy, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

// Supported chains and tokens
const CHAINS = [
  { id: 'solana', name: 'Solana', rpc: import.meta.env.VITE_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com' },
  { id: 'base', name: 'Base' },
  { id: 'polygon', name: 'Polygon' },
  { id: 'avalanche', name: 'Avalanche' },
  { id: 'ethereum', name: 'Ethereum' },
  { id: 'bsc', name: 'BSC' },
  { id: 'arbitrum', name: 'Arbitrum' },
  { id: 'optimism', name: 'Optimism' },
];

// Token configuration - SOLANICA token automatically included when deployed
// Update token mint in src/config/contracts.ts after deployment
const TOKENS: Record<string, Array<{ symbol: string; address?: string; decimals: number }>> = {
  solana: [
    { symbol: 'SOL', decimals: 9 },
    { symbol: 'USDC', address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', decimals: 6 },
    { symbol: 'USDT', address: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', decimals: 6 },
    // SOLANICA token automatically included when deployed
    ...(SOLANICA_TOKEN.mint ? [{ symbol: SOLANICA_TOKEN.symbol, address: SOLANICA_TOKEN.mint, decimals: SOLANICA_TOKEN.decimals }] : []),
  ],
  base: [
    { symbol: 'ETH', decimals: 18 },
    { symbol: 'USDC', address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', decimals: 6 },
  ],
  polygon: [
    { symbol: 'MATIC', decimals: 18 },
    { symbol: 'USDC', address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', decimals: 6 },
  ],
  avalanche: [
    { symbol: 'AVAX', decimals: 18 },
    { symbol: 'USDC', address: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E', decimals: 6 },
  ],
  ethereum: [
    { symbol: 'ETH', decimals: 18 },
    { symbol: 'USDC', address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', decimals: 6 },
  ],
  bsc: [
    { symbol: 'BNB', decimals: 18 },
    { symbol: 'USDT', address: '0x55d398326f99059fF775485246999027B3197955', decimals: 18 },
  ],
  arbitrum: [
    { symbol: 'ETH', decimals: 18 },
    { symbol: 'USDC', address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', decimals: 6 },
  ],
  optimism: [
    { symbol: 'ETH', decimals: 18 },
    { symbol: 'USDC', address: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607', decimals: 6 },
  ],
};

export default function X402Payment() {
  const { publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();
  const { toast } = useToast();

  // Send tab state
  const [sendChain, setSendChain] = useState('solana');
  const [sendFacilitator, setSendFacilitator] = useState('payai');
  const [sendToken, setSendToken] = useState('SOL');
  const [sendAmount, setSendAmount] = useState('');
  const [sendRecipient, setSendRecipient] = useState('');
  const [customTokenAddress, setCustomTokenAddress] = useState('');
  const [useCustomToken, setUseCustomToken] = useState(false);
  const [sendLoading, setSendLoading] = useState(false);
  const [sendResult, setSendResult] = useState<{ txHash?: string; paymentId?: string } | null>(null);

  // Receive tab state
  const [receiveChain, setReceiveChain] = useState('solana');
  const [receiveFacilitator, setReceiveFacilitator] = useState('payai');
  const [receiveToken, setReceiveToken] = useState('SOL');
  const [receiveAmount, setReceiveAmount] = useState('');
  const [paymentLink, setPaymentLink] = useState('');

  // Get facilitators for selected chain
  const getAvailableFacilitators = (chain: string): X402Facilitator[] => {
    return Object.values(X402_FACILITATORS).filter(f => f.chains.includes(chain));
  };

  // Handle send payment
  const handleSendPayment = async () => {
    if (!publicKey) {
      toast({
        title: 'Wallet not connected',
        description: 'Please connect your wallet to send payments',
        variant: 'destructive',
      });
      return;
    }

    if (!sendRecipient || !sendAmount) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    // Validate recipient address
    if (!validateAddress(sendRecipient, sendChain)) {
      toast({
        title: 'Invalid address',
        description: `Please enter a valid ${sendChain} address`,
        variant: 'destructive',
      });
      return;
    }

    setSendLoading(true);
    setSendResult(null);

    try {
      const tokenAddress = useCustomToken ? customTokenAddress : 
        TOKENS[sendChain]?.find(t => t.symbol === sendToken)?.address;

      if (sendChain === 'solana') {
        // Send Solana payment
        const result = await sendSolanaX402Payment(
          connection,
          publicKey,
          sendRecipient,
          parseFloat(sendAmount),
          tokenAddress,
          signTransaction
        );

        if (result.success && result.txHash) {
          setSendResult({ txHash: result.txHash, paymentId: result.paymentId });

          // Verify payment with facilitator
          const verification = await verifyX402Payment(
            sendFacilitator,
            result.paymentId!,
            result.txHash,
            sendChain
          );

          if (verification.verified) {
            // Settle payment
            await settleX402Payment(sendFacilitator, result.paymentId!, result.txHash);
          }

          toast({
            title: 'Payment sent successfully',
            description: `Transaction: ${result.txHash.substring(0, 8)}...`,
          });
        } else {
          throw new Error(result.error || 'Payment failed');
        }
      } else {
        // For other chains, show not implemented message
        toast({
          title: 'Chain not yet supported',
          description: `${sendChain} payments will be available soon. Currently only Solana is supported.`,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: 'Payment failed',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setSendLoading(false);
    }
  };

  // Handle generate payment link
  const handleGeneratePaymentLink = async () => {
    if (!publicKey) {
      toast({
        title: 'Wallet not connected',
        description: 'Please connect your wallet to generate payment links',
        variant: 'destructive',
      });
      return;
    }

    if (!receiveAmount) {
      toast({
        title: 'Missing amount',
        description: 'Please enter the amount to receive',
        variant: 'destructive',
      });
      return;
    }

    try {
      const tokenAddress = TOKENS[receiveChain]?.find(t => t.symbol === receiveToken)?.address;

      const { paymentUrl } = await createX402PaymentRequest({
        chain: receiveChain,
        token: receiveToken,
        amount: receiveAmount,
        recipient: publicKey.toBase58(),
        facilitator: receiveFacilitator,
        customTokenAddress: tokenAddress,
      });

      setPaymentLink(paymentUrl);

      toast({
        title: 'Payment link generated',
        description: 'Share this link to receive payment',
      });
    } catch (error) {
      console.error('Link generation error:', error);
      toast({
        title: 'Failed to generate link',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
    }
  };

  // Copy to clipboard
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to clipboard',
      description: `${label} copied successfully`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">x402 Payments</h1>
          <p className="text-slate-400">Multi-chain payment protocol with multiple facilitators</p>
        </div>

        <Tabs defaultValue="send" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-900/50">
            <TabsTrigger value="send">Send Payment</TabsTrigger>
            <TabsTrigger value="receive">Receive Payment</TabsTrigger>
          </TabsList>

          {/* Send Payment Tab */}
          <TabsContent value="send">
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Send className="w-5 h-5" />
                  Send x402 Payment
                </CardTitle>
                <CardDescription>Send payments across multiple chains using x402 protocol</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Chain Selection */}
                <div className="space-y-2">
                  <Label htmlFor="send-chain" className="text-white">Blockchain</Label>
                  <Select value={sendChain} onValueChange={(value) => {
                    setSendChain(value);
                    const availableFacilitators = getAvailableFacilitators(value);
                    if (availableFacilitators.length > 0 && !availableFacilitators.find(f => f.id === sendFacilitator)) {
                      setSendFacilitator(availableFacilitators[0].id);
                    }
                    setSendToken(TOKENS[value]?.[0]?.symbol || '');
                  }}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {CHAINS.map(chain => (
                        <SelectItem key={chain.id} value={chain.id} className="text-white">
                          {chain.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Facilitator Selection */}
                <div className="space-y-2">
                  <Label htmlFor="send-facilitator" className="text-white">Facilitator</Label>
                  <Select value={sendFacilitator} onValueChange={setSendFacilitator}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {getAvailableFacilitators(sendChain).map(facilitator => (
                        <SelectItem key={facilitator.id} value={facilitator.id} className="text-white">
                          {facilitator.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Token Selection */}
                <div className="space-y-2">
                  <Label className="text-white">Token</Label>
                  <div className="flex gap-2">
                    <Select 
                      value={useCustomToken ? 'custom' : sendToken} 
                      onValueChange={(value) => {
                        if (value === 'custom') {
                          setUseCustomToken(true);
                        } else {
                          setUseCustomToken(false);
                          setSendToken(value);
                        }
                      }}
                      disabled={useCustomToken}
                    >
                      <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        {TOKENS[sendChain]?.map(token => (
                          <SelectItem key={token.symbol} value={token.symbol} className="text-white">
                            {token.symbol}
                          </SelectItem>
                        ))}
                        <SelectItem value="custom" className="text-white">Custom Token</SelectItem>
                      </SelectContent>
                    </Select>
                    {useCustomToken && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setUseCustomToken(false);
                          setSendToken(TOKENS[sendChain]?.[0]?.symbol || '');
                          setCustomTokenAddress('');
                        }}
                        className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
                      >
                        Clear
                      </Button>
                    )}
                  </div>
                  {useCustomToken && (
                    <Input
                      placeholder="Enter token address"
                      value={customTokenAddress}
                      onChange={(e) => setCustomTokenAddress(e.target.value)}
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  )}
                </div>

                {/* Amount */}
                <div className="space-y-2">
                  <Label htmlFor="send-amount" className="text-white">Amount</Label>
                  <Input
                    id="send-amount"
                    type="number"
                    step="0.000001"
                    placeholder="0.00"
                    value={sendAmount}
                    onChange={(e) => setSendAmount(e.target.value)}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>

                {/* Recipient */}
                <div className="space-y-2">
                  <Label htmlFor="send-recipient" className="text-white">Recipient Address</Label>
                  <Input
                    id="send-recipient"
                    placeholder={sendChain === 'solana' ? 'Solana address' : 'EVM address (0x...)'}
                    value={sendRecipient}
                    onChange={(e) => setSendRecipient(e.target.value)}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>

                {/* Send Button */}
                <Button
                  onClick={handleSendPayment}
                  disabled={sendLoading || !publicKey}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  {sendLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Payment
                    </>
                  )}
                </Button>

                {/* Result */}
                {sendResult && (
                  <Alert className="bg-green-900/20 border-green-700">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <AlertDescription className="text-white">
                      <div className="space-y-2">
                        <p className="font-semibold">Payment Successful!</p>
                        {sendResult.txHash && (
                          <div className="flex items-center gap-2">
                            <code className="text-xs bg-slate-800 px-2 py-1 rounded">
                              {sendResult.txHash.substring(0, 16)}...
                            </code>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(sendResult.txHash!, 'Transaction hash')}
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Receive Payment Tab */}
          <TabsContent value="receive">
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <QrCode className="w-5 h-5" />
                  Receive x402 Payment
                </CardTitle>
                <CardDescription>Generate payment link to receive funds</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Chain Selection */}
                <div className="space-y-2">
                  <Label htmlFor="receive-chain" className="text-white">Blockchain</Label>
                  <Select value={receiveChain} onValueChange={(value) => {
                    setReceiveChain(value);
                    const availableFacilitators = getAvailableFacilitators(value);
                    if (availableFacilitators.length > 0 && !availableFacilitators.find(f => f.id === receiveFacilitator)) {
                      setReceiveFacilitator(availableFacilitators[0].id);
                    }
                    setReceiveToken(TOKENS[value]?.[0]?.symbol || '');
                  }}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {CHAINS.map(chain => (
                        <SelectItem key={chain.id} value={chain.id} className="text-white">
                          {chain.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Facilitator Selection */}
                <div className="space-y-2">
                  <Label htmlFor="receive-facilitator" className="text-white">Facilitator</Label>
                  <Select value={receiveFacilitator} onValueChange={setReceiveFacilitator}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {getAvailableFacilitators(receiveChain).map(facilitator => (
                        <SelectItem key={facilitator.id} value={facilitator.id} className="text-white">
                          {facilitator.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Token Selection */}
                <div className="space-y-2">
                  <Label htmlFor="receive-token" className="text-white">Token</Label>
                  <Select value={receiveToken} onValueChange={setReceiveToken}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {TOKENS[receiveChain]?.map(token => (
                        <SelectItem key={token.symbol} value={token.symbol} className="text-white">
                          {token.symbol}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Amount */}
                <div className="space-y-2">
                  <Label htmlFor="receive-amount" className="text-white">Amount</Label>
                  <Input
                    id="receive-amount"
                    type="number"
                    step="0.000001"
                    placeholder="0.00"
                    value={receiveAmount}
                    onChange={(e) => setReceiveAmount(e.target.value)}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>

                {/* Generate Button */}
                <Button
                  onClick={handleGeneratePaymentLink}
                  disabled={!publicKey}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  Generate Payment Link
                </Button>

                {/* Payment Link */}
                {paymentLink && (
                  <Alert className="bg-blue-900/20 border-blue-700">
                    <AlertDescription className="text-white">
                      <div className="space-y-2">
                        <p className="font-semibold">Payment Link Generated</p>
                        <div className="flex items-center gap-2">
                          <code className="text-xs bg-slate-800 px-2 py-1 rounded flex-1 overflow-x-auto">
                            {paymentLink}
                          </code>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(paymentLink, 'Payment link')}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Info Card */}
        <Card className="mt-6 bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white text-sm">About x402 Protocol</CardTitle>
          </CardHeader>
          <CardContent className="text-slate-400 text-sm space-y-2">
            <p>x402 is a multi-chain payment protocol supporting multiple facilitators:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li><strong className="text-white">PayAI</strong> - Supports Solana, Base, Polygon, Avalanche, Sei, Peaq, IoTeX</li>
              <li><strong className="text-white">Coinbase CDP</strong> - Supports Base</li>
              <li><strong className="text-white">x402.rs</strong> - Supports Base, XDC</li>
            </ul>
            <p className="mt-4">Currently, Solana payments are fully functional. Other chains will be available soon.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
