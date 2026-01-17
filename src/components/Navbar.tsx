import { useNavigate, useLocation } from 'react-router-dom';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Button } from '@/components/ui/button';
import { Rocket, ExternalLink } from 'lucide-react';

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/trading', label: 'Trading' },
    { path: '/x402', label: 'x402 Pay' },
    { path: '/onramp', label: 'Buy Crypto' },
  ];

  return (
    <nav className="border-b border-slate-800/50 backdrop-blur-sm bg-slate-950/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
          
              <span className="text-xl font-heading font-bold text-white"> Solanica Finance </span>
            </button>
            
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  variant="ghost"
                  onClick={() => navigate(item.path)}
                  className={`text-slate-300 hover:text-white hover:bg-slate-800/50 ${
                    location.pathname === item.path ? 'text-white bg-slate-800/50' : ''
                  }`}
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => window.open('https://solanicafinance.pro', '_blank')}
              className="hidden md:flex items-center gap-2 text-slate-300 hover:text-white border-slate-700 hover:border-slate-600"
            >
              Solanica Finance Pro
              <ExternalLink className="w-4 h-4" />
            </Button>
            <WalletMultiButton className="!bg-gradient-to-r !from-purple-600 !to-blue-600 hover:!from-purple-700 hover:!to-blue-700 !rounded-lg !h-10" />
          </div>
        </div>
      </div>
    </nav>
  );
}
