import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  Wallet, 
  ArrowRight, 
  CheckCircle2, 
  Info,
  ExternalLink,
  Zap,
  Shield,
  Globe
} from 'lucide-react';

// Fiat onramp provider configurations
const ONRAMP_PROVIDERS = {
  moonpay: {
    id: 'moonpay',
    name: 'MoonPay',
    description: 'Fast and reliable fiat onramp with global coverage',
    logo: '🌙',
    features: ['100+ countries', 'Credit/Debit cards', 'Bank transfers', 'Apple Pay'],
    baseUrl: 'https://buy.moonpay.com',
    apiKeyEnv: 'VITE_MOONPAY_API_KEY',
    supported: true,
    fees: '3.5% - 4.5%',
    limits: '$20 - $50,000',
  },
  transak: {
    id: 'transak',
    name: 'Transak',
    description: 'High customization with broad fiat/crypto support',
    logo: '🔷',
    features: ['100+ countries', '60+ cryptos', 'Multiple payment methods', 'Low fees'],
    baseUrl: 'https://global.transak.com',
    apiKeyEnv: 'VITE_TRANSAK_API_KEY',
    supported: true,
    fees: '0.99% - 5.5%',
    limits: '$30 - $10,000',
  },
  ramp: {
    id: 'ramp',
    name: 'Ramp Network',
    description: 'Developer-friendly with excellent UX',
    logo: '⚡',
    features: ['Instant purchases', 'Bank transfers', 'Open banking', 'Low fees'],
    baseUrl: 'https://buy.ramp.network',
    apiKeyEnv: 'VITE_RAMP_API_KEY',
    supported: true,
    fees: '0.49% - 2.9%',
    limits: '$50 - $20,000',
  },
};

// Supported cryptocurrencies
const SUPPORTED_CRYPTOS = [
  { symbol: 'SOL', name: 'Solana', network: 'solana' },
  { symbol: 'USDC', name: 'USD Coin', network: 'solana' },
  { symbol: 'USDT', name: 'Tether', network: 'solana' },
  { symbol: 'ETH', name: 'Ethereum', network: 'ethereum' },
  { symbol: 'MATIC', name: 'Polygon', network: 'polygon' },
  { symbol: 'AVAX', name: 'Avalanche', network: 'avalanche' },
  { symbol: 'BNB', name: 'BNB', network: 'bsc' },
];

// Supported fiat currencies
const SUPPORTED_FIATS = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
];

export default function FiatOnramp() {
  const { publicKey, connected } = useWallet();
  const [selectedProvider, setSelectedProvider] = useState<string>('moonpay');
  const [selectedCrypto, setSelectedCrypto] = useState<string>('SOL');
  const [selectedFiat, setSelectedFiat] = useState<string>('USD');
  const [amount, setAmount] = useState<string>('100');
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Update wallet address when wallet connects
  useEffect(() => {
    if (connected && publicKey) {
      setWalletAddress(publicKey.toBase58());
    }
  }, [connected, publicKey]);

  const provider = ONRAMP_PROVIDERS[selectedProvider as keyof typeof ONRAMP_PROVIDERS];

  // Build onramp URL based on provider
  const buildOnrampUrl = () => {
    const crypto = SUPPORTED_CRYPTOS.find(c => c.symbol === selectedCrypto);
    if (!crypto || !walletAddress) return null;

    const params = new URLSearchParams();

    switch (selectedProvider) {
      case 'moonpay':
        // MoonPay URL parameters
        params.append('apiKey', import.meta.env[provider.apiKeyEnv] || 'pk_test_demo');
        params.append('currencyCode', selectedCrypto.toLowerCase());
        params.append('walletAddress', walletAddress);
        params.append('baseCurrencyCode', selectedFiat.toLowerCase());
        if (amount) params.append('baseCurrencyAmount', amount);
        params.append('colorCode', '%236366f1'); // Purple theme
        return `${provider.baseUrl}?${params.toString()}`;

      case 'transak':
        // Transak URL parameters
        params.append('apiKey', import.meta.env[provider.apiKeyEnv] || 'demo-api-key');
        params.append('cryptoCurrencyCode', selectedCrypto);
        params.append('walletAddress', walletAddress);
        params.append('fiatCurrency', selectedFiat);
        if (amount) params.append('fiatAmount', amount);
        params.append('network', crypto.network);
        params.append('themeColor', '6366f1'); // Purple theme
        return `${provider.baseUrl}?${params.toString()}`;

      case 'ramp':
        // Ramp Network URL parameters
        params.append('hostApiKey', import.meta.env[provider.apiKeyEnv] || 'demo_public');
        params.append('swapAsset', `${crypto.network.toUpperCase()}_${selectedCrypto}`);
        params.append('userAddress', walletAddress);
        params.append('fiatCurrency', selectedFiat);
        if (amount) params.append('fiatValue', amount);
        return `${provider.baseUrl}?${params.toString()}`;

      default:
        return null;
    }
  };

  const handleBuyNow = () => {
    const url = buildOnrampUrl();
    if (!url) {
      alert('Please connect your wallet and enter a valid amount');
      return;
    }

    setIsLoading(true);
    // Open onramp in new window
    window.open(url, '_blank', 'width=500,height=700');
    
    // Reset loading state after a delay
    setTimeout(() => setIsLoading(false), 1000);
  };

  const isConfigured = (providerId: string) => {
    const p = ONRAMP_PROVIDERS[providerId as keyof typeof ONRAMP_PROVIDERS];
    return !!import.meta.env[p.apiKeyEnv];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-4">
            <CreditCard className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-300">Fiat to Crypto</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Buy Crypto with Fiat: Coming Soon
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Purchase cryptocurrency using credit cards, bank transfers, or other payment methods
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Provider Selection */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-purple-400" />
                  Select Provider
                </CardTitle>
                <CardDescription>Choose your preferred onramp service</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.values(ONRAMP_PROVIDERS).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProvider(p.id)}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      selectedProvider === p.id
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{p.logo}</span>
                        <div>
                          <div className="font-semibold text-white">{p.name}</div>
                          <div className="text-xs text-slate-400">{p.fees} fees</div>
                        </div>
                      </div>
                      {selectedProvider === p.id && (
                        <CheckCircle2 className="w-5 h-5 text-purple-400" />
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mb-2">{p.description}</p>
                    {!isConfigured(p.id) && (
                      <Badge variant="outline" className="text-xs border-yellow-500/50 text-yellow-400">
                        Demo Mode
                      </Badge>
                    )}
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Provider Features */}
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white text-sm">Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {provider.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Purchase Form */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-purple-400" />
                  Purchase Details
                </CardTitle>
                <CardDescription>Configure your crypto purchase</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="buy" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="buy">Buy Crypto</TabsTrigger>
                    <TabsTrigger value="info">Provider Info</TabsTrigger>
                  </TabsList>

                  <TabsContent value="buy" className="space-y-6">
                    {/* Wallet Connection Alert */}
                    {!connected && (
                      <Alert className="bg-yellow-500/10 border-yellow-500/20">
                        <Info className="h-4 w-4 text-yellow-400" />
                        <AlertDescription className="text-yellow-200">
                          Connect your wallet to auto-fill the recipient address
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Amount Input */}
                    <div className="space-y-2">
                      <Label htmlFor="amount" className="text-white">You Pay</Label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Input
                            id="amount"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="100"
                            className="bg-slate-800 border-slate-700 text-white pr-20"
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <Select value={selectedFiat} onValueChange={setSelectedFiat}>
                              <SelectTrigger className="w-20 h-8 bg-slate-700 border-slate-600 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {SUPPORTED_FIATS.map((fiat) => (
                                  <SelectItem key={fiat.code} value={fiat.code}>
                                    {fiat.code}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-slate-400">
                        Limits: {provider.limits} per transaction
                      </p>
                    </div>

                    {/* Crypto Selection */}
                    <div className="space-y-2">
                      <Label htmlFor="crypto" className="text-white">You Receive</Label>
                      <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
                        <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {SUPPORTED_CRYPTOS.map((crypto) => (
                            <SelectItem key={crypto.symbol} value={crypto.symbol}>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">{crypto.symbol}</span>
                                <span className="text-slate-400 text-sm">- {crypto.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Wallet Address */}
                    <div className="space-y-2">
                      <Label htmlFor="wallet" className="text-white">Recipient Wallet</Label>
                      <Input
                        id="wallet"
                        type="text"
                        value={walletAddress}
                        onChange={(e) => setWalletAddress(e.target.value)}
                        placeholder="Enter wallet address or connect wallet"
                        className="bg-slate-800 border-slate-700 text-white font-mono text-sm"
                      />
                      {connected && (
                        <p className="text-xs text-green-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Wallet connected
                        </p>
                      )}
                    </div>

                    {/* Fee Estimate */}
                    <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-400">Estimated Fees</span>
                        <span className="text-sm text-white">{provider.fees}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-400">Processing Time</span>
                        <span className="text-sm text-white">5-30 minutes</span>
                      </div>
                    </div>

                    {/* Buy Button */}
                    <Button
                      onClick={handleBuyNow}
                      disabled={!walletAddress || !amount || isLoading}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white h-12"
                    >
                      {isLoading ? (
                        'Opening...'
                      ) : (
                        <>
                          <Zap className="w-4 h-4 mr-2" />
                          Buy with {provider.name}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>

                    {/* Security Notice */}
                    <Alert className="bg-blue-500/10 border-blue-500/20">
                      <Shield className="h-4 w-4 text-blue-400" />
                      <AlertDescription className="text-blue-200 text-sm">
                        You'll be redirected to {provider.name}'s secure platform to complete your purchase. 
                        KYC verification may be required.
                      </AlertDescription>
                    </Alert>
                  </TabsContent>

                  <TabsContent value="info" className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-white font-semibold mb-2">About {provider.name}</h3>
                        <p className="text-slate-300 text-sm">{provider.description}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-800/50 rounded-lg">
                          <div className="text-slate-400 text-xs mb-1">Fee Range</div>
                          <div className="text-white font-semibold">{provider.fees}</div>
                        </div>
                        <div className="p-4 bg-slate-800/50 rounded-lg">
                          <div className="text-slate-400 text-xs mb-1">Limits</div>
                          <div className="text-white font-semibold">{provider.limits}</div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-white font-semibold mb-2 text-sm">Supported Features</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {provider.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm text-slate-300">
                              <CheckCircle2 className="w-4 h-4 text-green-400" />
                              {feature}
                            </div>
                          ))}
                        </div>
                      </div>

                      {!isConfigured(provider.id) && (
                        <Alert className="bg-yellow-500/10 border-yellow-500/20">
                          <Info className="h-4 w-4 text-yellow-400" />
                          <AlertDescription className="text-yellow-200 text-sm">
                            <strong>Demo Mode:</strong> Add {provider.apiKeyEnv} to your .env file for production use.
                            <a 
                              href={provider.baseUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-purple-400 hover:text-purple-300 mt-2"
                            >
                              Get API Key <ExternalLink className="w-3 h-3" />
                            </a>
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* How It Works */}
            <Card className="bg-slate-900/50 border-slate-800 mt-6">
              <CardHeader>
                <CardTitle className="text-white text-lg">How It Works</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-purple-400 font-bold">1</span>
                    </div>
                    <h4 className="text-white font-semibold mb-1 text-sm">Select Provider</h4>
                    <p className="text-slate-400 text-xs">Choose your preferred onramp service</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-purple-400 font-bold">2</span>
                    </div>
                    <h4 className="text-white font-semibold mb-1 text-sm">Enter Details</h4>
                    <p className="text-slate-400 text-xs">Configure amount and wallet address</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-purple-400 font-bold">3</span>
                    </div>
                    <h4 className="text-white font-semibold mb-1 text-sm">Complete Purchase</h4>
                    <p className="text-slate-400 text-xs">Pay securely and receive crypto</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
