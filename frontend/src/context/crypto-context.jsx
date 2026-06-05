import { createContext, useContext, useMemo } from "react";
import { useEffect, useState } from "react";
import { calculateAveragePrice, percentDifference } from "../utils";
import { axiosInstance } from "../lib/axios";
const CryptoContext = createContext({
  assets: [],
  crypto: [],
  loading: false,
  addAsset: () => {},
});

function groupedAssets(assetsData) {
  return assetsData.reduce((acc, asset) => {
    acc[asset.id] = acc[asset.id] || [];
    acc[asset.id].push(asset);
    return acc;
  }, {});
}

function mapAssets(assets, result, avgPriceMap) {
  const grouped = groupedAssets(assets);

  return Object.keys(grouped)
    .map((id) => {
      const group = grouped[id];
      const coin = result.find((c) => c.id === id);
      if (!coin) return null;

      const investmentData = avgPriceMap[id];

      const totalAmount = group.reduce((sum, a) => sum + a.amount, 0);
      const holdingTotalAmount = group.reduce(
        (sum, a) => sum + a.amount * coin.price,
        0
      );
      const totalInvested = group.reduce(
        (sum, a) => sum + a.amount * a.price,
        0
      );
      const totalProfit = group.reduce(
        (sum, a) => sum + (a.amount * coin.price - a.amount * a.price),
        0
      );

      return {
        id,
        coinName: coin.name,
        icon: coin.icon,
        symbol: coin.symbol,
        grow: group.some((a) => a.price < coin.price),
        growPercent: percentDifference(investmentData.avgPrice, coin.price),
        totalAmount: totalAmount.toFixed(2),
        totalProfit: totalProfit.toFixed(2),
        holdingTotalAmount: holdingTotalAmount.toFixed(2),
        avgPrice: investmentData.avgPrice.toFixed(2),
        currentPrice: coin.price,
        totalInvested: totalInvested.toFixed(2),
        priceChange24h: coin.price_change_percentage_24h,
      };
    })
    .filter(Boolean);
}

export function CryptoContextProvider({ children }) {
  const [loading, setLoading] = useState(false);

  const [crypto, setCrypto] = useState([]);

  const [assets, setAssets] = useState([]);

  const [transactions, setTransactions] = useState([]);

  const [items, setItems] = useState([]);

  const avgPriceMap = useMemo(() => {
    const grouped = groupedAssets(assets);
    const map = {};
    for (const coinId in grouped) {
      const investmentData = calculateAveragePrice(grouped[coinId]);
      map[coinId] = investmentData;
    }
    return map;
  }, [assets]);

  const enrichedAssets = useMemo(() => {
    if (assets.length === 0 || crypto.length === 0) return [];
    return mapAssets(assets, crypto, avgPriceMap);
  }, [assets, crypto, avgPriceMap]);

  const totalHoldingValue = useMemo(() => {
    return enrichedAssets.reduce((sum, asset) => {
      return (
        sum +
        parseFloat(asset.totalAmount || 0) * parseFloat(asset.currentPrice || 0)
      );
    }, 0);
  }, [enrichedAssets]);

  const totalInvestments = useMemo(() => {
    return enrichedAssets.reduce((sum, asset) => {
      return sum + parseFloat(asset.totalInvested || 0);
    }, 0);
  }, [enrichedAssets]);

  const totalNetProfit = useMemo(() => {
    return enrichedAssets.reduce((sum, asset) => {
      return sum + parseFloat(asset.totalProfit || 0);
    }, 0);
  }, [enrichedAssets]);

  useEffect(() => {
    async function preload() {
      setLoading(true);

      try {
        const [resAssets, resMarkets] = await Promise.all([
          axiosInstance.get("/assets"),
          axiosInstance.get("market/coins"),
        ]);

        const assetsData = resAssets.data;
        const priceMarkets = resMarkets.data.result;

        setAssets(assetsData);
        setCrypto(priceMarkets);
        setTransactions(assetsData);
      } catch (error) {
        console.error("Failed to load crypto", error);
      } finally {
        setLoading(false);
      }
    }
    preload();
  }, []);
  async function addAsset(newAsset) {
    try {
      const res = await axiosInstance.post("/assets", newAsset);
      const savedAsset = res.data;
      setAssets((prev) => [...prev, savedAsset]);
      setTransactions((prev) => [...prev, savedAsset]);
    } catch (error) {
      console.error("Error adding asset:", error);
    }
  }

  useEffect(() => {
    async function preload() {
      setLoading(true);

      try {
        const res = await axiosInstance.get(
          "/python-sentiment-service/news-sentiment"
        );
        const results = res.data?.results || [];
        setItems(results);
      } catch (error) {
        console.error("Failed to load news", error);
      } finally {
        setLoading(false);
      }
    }
    preload();
  }, []);
  async function refreshPrice(coinName) {
    if (!coinName) return;

    try {
      const res = await axiosInstance.get("market/coins");
      const priceMarkets = res.data.result;

      const marketCoin = priceMarkets.find(
        (coin) => coin.name.toLowerCase() === coinName.toLowerCase()
      );

      if (!marketCoin) {
        console.warn("Market coin not found for asset:", coinName);
        return;
      }

      setCrypto((prevCrypto) =>
        prevCrypto.map((c) =>
          c.name.toLowerCase() === coinName.toLowerCase()
            ? {
                ...c,
                price: marketCoin.price,
                grow: marketCoin.grow,
                growPercent: marketCoin.growPercent,
              }
            : c
        )
      );
    } catch (error) {
      console.error("Failed to refresh price", error);
    }
  }

  async function removeAsset(assetId) {
    try {
      // Отправляем запрос на сервер
      await axiosInstance.delete(`/assets/${assetId}`);

      // Обновляем локальные состояния
      setAssets((prev) => prev.filter((a) => a.id !== assetId));
      setTransactions((prev) => prev.filter((t) => t.id !== assetId));
    } catch (error) {
      console.error("Failed to remove asset", error);
    }
  }

  return (
    <CryptoContext.Provider
      value={{
        loading,
        crypto,
        assets: enrichedAssets,
        transactions,
        addAsset,
        totalNetProfit,
        totalHoldingValue,
        totalInvestments,
        setTransactions,
        setAssets,
        items,
        refreshPrice,
        removeAsset,
      }}
    >
      {children}
    </CryptoContext.Provider>
  );
}
export default CryptoContext;

export function useCrypto() {
  return useContext(CryptoContext);
}
