import { Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Trading from './pages/Trading';
import X402Payment from './pages/X402Payment';
import FiatOnramp from './pages/FiatOnramp';
import { Toaster } from '@/components/ui/toaster';
import { withErrorOverlay } from '@/components/with-error-overlay';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/trading" element={<Trading />} />
        <Route path="/x402" element={<X402Payment />} />
        <Route path="/onramp" element={<FiatOnramp />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default withErrorOverlay(App);
