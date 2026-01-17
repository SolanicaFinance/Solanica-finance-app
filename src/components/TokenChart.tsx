import { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, IChartApi, CandlestickData, Time, CandlestickSeries } from 'lightweight-charts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Loader2 } from 'lucide-react';

interface TokenChartProps {
  tokenSymbol?: string;
}

// Map token symbols to CoinGecko IDs
const TOKEN_ID_MAP: Record<string, string> = {
  'SOL/USDC': 'solana',
  'SOL': 'solana',
  'BTC': 'bitcoin',
  'ETH': 'ethereum',
  'USDC': 'usd-coin',
  'USDT': 'tether',
};

export const TokenChart = ({ tokenSymbol = 'SOL/USDC' }: TokenChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const [priceChange, setPriceChange] = useState(0);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch real-time price data from CoinGecko
  const fetchPriceData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const tokenId = TOKEN_ID_MAP[tokenSymbol] || 'solana';
      
      // Fetch OHLC data (last 7 days)
      const ohlcResponse = await fetch(
        `https://api.coingecko.com/api/v3/coins/${tokenId}/ohlc?vs_currency=usd&days=7`
      );
      
      if (!ohlcResponse.ok) {
        throw new Error('Failed to fetch price data');
      }
      
      const ohlcData = await ohlcResponse.json();
      
      // Convert to candlestick format
      const candlestickData: CandlestickData[] = ohlcData.map((candle: number[]) => ({
        time: Math.floor(candle[0] / 1000) as Time,
        open: candle[1],
        high: candle[2],
        low: candle[3],
        close: candle[4],
      }));
      
      if (candlestickData.length > 0) {
        const lastCandle = candlestickData[candlestickData.length - 1];
        const firstCandle = candlestickData[0];
        setCurrentPrice(lastCandle.close);
        setPriceChange(((lastCandle.close - firstCandle.open) / firstCandle.open) * 100);
      }
      
      return candlestickData;
    } catch (err) {
      console.error('Error fetching price data:', err);
      setError('Failed to load price data');
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#9CA3AF',
      },
      grid: {
        vertLines: { color: 'rgba(42, 46, 57, 0.3)' },
        horzLines: { color: 'rgba(42, 46, 57, 0.3)' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
      crosshair: {
        mode: 1,
      },
    });

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#10B981',
      downColor: '#EF4444',
      borderVisible: false,
      wickUpColor: '#10B981',
      wickDownColor: '#EF4444',
    });

    chartRef.current = chart;

    // Load initial data
    fetchPriceData().then((data) => {
      if (data.length > 0) {
        candlestickSeries.setData(data);
      }
    });

    // Update price every 30 seconds
    const priceInterval = setInterval(async () => {
      const tokenId = TOKEN_ID_MAP[tokenSymbol] || 'solana';
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${tokenId}&vs_currencies=usd&include_24hr_change=true`
        );
        const data = await response.json();
        if (data[tokenId]) {
          setCurrentPrice(data[tokenId].usd);
          if (data[tokenId].usd_24h_change !== undefined) {
            setPriceChange(data[tokenId].usd_24h_change);
          }
        }
      } catch (err) {
        console.error('Error updating price:', err);
      }
    }, 30000);

    // Refresh chart data every 5 minutes
    const chartInterval = setInterval(async () => {
      const data = await fetchPriceData();
      if (data.length > 0) {
        candlestickSeries.setData(data);
      }
    }, 300000);

    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(priceInterval);
      clearInterval(chartInterval);
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [tokenSymbol]);

  return (
    <Card className="bg-slate-900/50 border-slate-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold text-white">{tokenSymbol}</CardTitle>
            <div className="flex items-center gap-3 mt-2">
              {loading && currentPrice === 0 ? (
                <div className="flex items-center gap-2 text-slate-400">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Loading price...</span>
                </div>
              ) : error ? (
                <span className="text-red-400 text-sm">{error}</span>
              ) : (
                <>
                  <span className="text-3xl font-bold text-white">
                    ${currentPrice.toFixed(2)}
                  </span>
                  <Badge 
                    variant={priceChange >= 0 ? 'default' : 'destructive'}
                    className={`flex items-center gap-1 ${
                      priceChange >= 0 
                        ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                        : 'bg-red-500/20 text-red-400 border-red-500/30'
                    }`}
                  >
                    {priceChange >= 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
                  </Badge>
                </>
              )}
            </div>
          </div>
          <Badge variant="outline" className="border-purple-500/30 text-purple-400">
            Live
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div ref={chartContainerRef} className="w-full" />
      </CardContent>
    </Card>
  );
};
