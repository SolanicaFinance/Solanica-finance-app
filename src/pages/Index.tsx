import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/Navbar';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Shield, 
  TrendingUp, 
  Brain, 
  Sparkles,
  BarChart3,
  Rocket,
  Globe,
  Users,
  Award,
  ChevronRight,
  Twitter,
  Send,
  Copy,
  ExternalLink,
  ShoppingCart,
  DollarSign,
  Gauge,
  ArrowRightLeft
} from 'lucide-react';

export default function Index() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Gauge className="w-6 h-6" />,
      title: 'Ultra-Fast Perpetuals',
      description: 'Trade perpetual futures with lightning-fast execution and minimal slippage on Solana with up to 100x leverage.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: 'Lowest Fees',
      description: 'Enjoy some the cheapest trading fees in DeFi. Trade more, pay less with our optimized fee structure.',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: 'Best-in-class liquidity',
      description: 'Shared order books are maintained by top institutional market makers, professional traders, and retail users across the globe, CeFi-grade performance. <200 ms latency for high-frequency trading,onchain orders, full transparency, and all the benefits of DeFi.',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Secure & Trustless',
      description: 'Professional-grade security, We work with renowned auditing and cybersecurity firms to protect smart contracts, backed by 24/7 monitoring. Non-custodial architecture ensures you always maintain full control of your assets.',
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  const stats = [
    { label: 'Total Volume', value: '$2.4B+', icon: <BarChart3 className="w-5 h-5" /> },
    { label: 'Active Users', value: '150K+', icon: <Users className="w-5 h-5" /> },
    { label: 'Tokens Supported', value: '500+', icon: <Globe className="w-5 h-5" /> },
    { label: 'Avg. Swap Time', value: '<2s', icon: <Zap className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-5xl mx-auto"
          >
            <Badge className="mb-6 bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-300 border-purple-500/30 px-6 py-2 text-sm">
              <Sparkles className="w-4 h-4 mr-2" />
              Next-Generation Solana DEX.
            </Badge>
            
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 leading-tight">
              Trade Smarter on
              <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mt-2">
                Solanica Finance
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-400 mb-12 leading-relaxed max-w-3xl mx-auto">
              Experience ultra-fast perpetual trading with the lowest fees on Solana. Deep liquidity, 140+ assets, and support for 17+ major chains.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-slate-800/50 bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="flex items-center justify-center mb-3 text-purple-400 group-hover:text-purple-300 transition-colors">
                  {stat.icon}
                </div>
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-sm text-slate-500 uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Why Choose Solanica?
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Built for traders who demand speed, security, and sophistication
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-all h-full group hover:shadow-xl hover:shadow-purple-500/10">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} p-3 mb-4 group-hover:scale-110 transition-transform`}>
                      {feature.icon}
                    </div>
                    <CardTitle className="text-white text-xl mb-3">{feature.title}</CardTitle>
                    <CardDescription className="text-slate-400 leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Perpetual Trading Showcase */}
      <section className="py-24 bg-gradient-to-b from-slate-950/50 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-6 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border-blue-500/30 px-6 py-2 text-sm">
              <Gauge className="w-4 h-4 mr-2" />
              Professional Trading Platform
            </Badge>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Fast & Cheap Perpetual Trading
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Experience one of the fastest perpetual futures trading on Solana with ultra-low fees and instant execution
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-sm shadow-2xl overflow-hidden">
              <CardContent className="p-0">
                <div className="relative aspect-video w-full">
                  <img 
                    src="https://assets-gen.codenut.dev/lib/abe202a7-b452-453b-bdea-268e154c4680/Screenshot_8-1-2026_13560_solanicafinance.pro.jpeg"
                    alt="Solanica Finance Perpetual Trading Platform"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <div className="grid md:grid-cols-3 gap-6 mb-6">
                      <div className="bg-black/60 backdrop-blur-sm rounded-lg p-4 border border-slate-700">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                            <Zap className="w-5 h-5 text-blue-400" />
                          </div>
                          <div>
                            <p className="text-sm text-slate-400">Execution Speed</p>
                            <p className="text-xl font-bold text-white">&lt;100ms</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-black/60 backdrop-blur-sm rounded-lg p-4 border border-slate-700">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-green-400" />
                          </div>
                          <div>
                            <p className="text-sm text-slate-400">Trading Fees</p>
                            <p className="text-xl font-bold text-white">0.03%</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-black/60 backdrop-blur-sm rounded-lg p-4 border border-slate-700">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-purple-400" />
                          </div>
                          <div>
                            <p className="text-sm text-slate-400">Max Leverage</p>
                            <p className="text-xl font-bold text-white">100x</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button
                      size="lg"
                      onClick={() => window.open('https://solanicafinance.pro', '_blank')}
                      className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold px-8 py-6 text-lg rounded-xl shadow-2xl shadow-blue-500/50 hover:shadow-blue-500/70 transition-all group"
                    >
                      Start Trading Perpetuals
                      <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-300 border-purple-500/30">
              <Rocket className="w-4 h-4 mr-2" />
              Our Vision
            </Badge>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              The Future of Solanica
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Building the most advanced AI-powered trading ecosystem on Solana
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* 2025 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border-purple-500/30 h-full">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 bg-purple-500/20 rounded-xl">
                      <Rocket className="w-6 h-6 text-purple-400" />
                    </div>
                    <CardTitle className="text-3xl text-white">2025</CardTitle>
                  </div>
                  <CardDescription className="text-purple-200 text-lg">
                    Foundation Launch
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    'Solanica Token Launch on Bonk.fun',
                    'Official Community Channels (Telegram, X, Discord)',
                    'DEX Platform with Ultra Swap & x402',
                    'Marketing Campaign (CMC & Dexscreen)'
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-black/30 rounded-lg">
                      <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-purple-400" />
                      </div>
                      <p className="text-white">{item}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* 2026 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border-blue-500/30 h-full">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 bg-blue-500/20 rounded-xl">
                      <Brain className="w-6 h-6 text-blue-400" />
                    </div>
                    <CardTitle className="text-3xl text-white">2026</CardTitle>
                  </div>
                  <CardDescription className="text-blue-200 text-lg">
                    AI & Ecosystem Expansion
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    'Fiat & Crypto Onramp Integration',
                    'Token Launchpad (Pump.fun Competitor)',
                    'AI Trading Agent Automation',
                    'Advanced AI Market Analytics'
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-black/30 rounded-lg">
                      <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-blue-400" />
                      </div>
                      <p className="text-white">{item}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-blue-900/20" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Award className="w-16 h-16 text-purple-400 mx-auto mb-6" />
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Join the Revolution
            </h2>
            <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
              Be part of the next generation of decentralized trading. Experience the power of AI-driven insights and lightning-fast execution.
            </p>
            <Button
              size="lg"
              onClick={() => navigate('/trading')}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-12 py-7 text-xl rounded-xl shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/70 transition-all group"
            >
              Start Trading Now
              <ChevronRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Token & Social Section */}
      <section className="py-20 bg-slate-950/80 border-y border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Get <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">$SOLF</span> Token
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Join the Solanica Finance ecosystem with our native token
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Token Contract */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="bg-slate-900/50 border-slate-800 hover:border-purple-500/50 transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Globe className="w-5 h-5 text-purple-400" />
                    Token Contract Address
                  </CardTitle>
                  <CardDescription>Solana Mainnet</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-black/50 rounded-lg p-4 border border-slate-800">
                    <div className="flex items-center justify-between gap-3">
                      <code className="text-sm text-purple-300 font-mono break-all">
                       CRKdGbTcFRdXqQimQbJiEjVKdMkPCE1ZXhXQYJMsbonk 
                      </code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          navigator.clipboard.writeText('Ev6Wo8e1jLgwuG2vK7cvDEYqp9vCH61s1fkf5mfbonk');
                        }}
                        className="flex-shrink-0 hover:bg-purple-500/20"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <a
                      href="https://solscan.io/token/CRKdGbTcFRdXqQimQbJiEjVKdMkPCE1ZXhXQYJMsbonk"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-2"
                    >
                      View on Solscan
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Buy Token */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="bg-slate-900/50 border-slate-800 hover:border-blue-500/50 transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <ShoppingCart className="w-5 h-5 text-blue-400" />
                    Where to Buy $SOLF
                  </CardTitle>
                  <CardDescription>Available on leading DEXs</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <a
                    href="https://jup.ag/tokens/CRKdGbTcFRdXqQimQbJiEjVKdMkPCE1ZXhXQYJMsbonk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white justify-between group">
                      <span className="flex items-center gap-2">
                        <ArrowRightLeft className="w-4 h-4" />
                        Jupiter Exchange
                      </span>
                      <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </a>
                  <a
                    href="https://raydium.io/swap/?inputCurrency=sol&outputCurrency=CRKdGbTcFRdXqQimQbJiEjVKdMkPCE1ZXhXQYJMsbonk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white justify-between group">
                      <span className="flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        Raydium
                      </span>
                      <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </a>
                  <Button
                    onClick={() => navigate('/trading')}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white justify-between group"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Trade on Solanica
                    </span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <h3 className="text-2xl font-bold text-white mb-6">Join Our Community</h3>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <a
                href="https://x.com/SolanicaFinance"
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <Button
                  size="lg"
                  className="bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-blue-500 text-white transition-all"
                >
                  <Twitter className="w-5 h-5 mr-2 group-hover:text-blue-400 transition-colors" />
                  Twitter
                </Button>
              </a>
              <a
                href="https://t.me/SolanicaFinance"
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <Button
                  size="lg"
                  className="bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-blue-500 text-white transition-all"
                >
                  <Send className="w-5 h-5 mr-2 group-hover:text-blue-400 transition-colors" />
                  Telegram
                </Button>
              </a>
              <a
                href="https://solanicafinance.app"
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <Button
                  size="lg"
                  className="bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-purple-500 text-white transition-all"
                >
                  <Globe className="w-5 h-5 mr-2 group-hover:text-purple-400 transition-colors" />
                  Website
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 py-12 bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Solanica Finance</span>
            </div>
            <p className="text-slate-500 text-sm">
              © 2025 Solanica Finance. Powered by Jupiter & x402 Protocol.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
