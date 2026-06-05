import { createContext, useContext } from "react";
import { useEffect, useState } from 'react';
import { fakeFetchCrypto, fetchAssets } from '../api';
import { percentDifference } from '../utils'
const CryptoContext = createContext({
    assets: [],
    crypto: [],
    loading: false,
})

export function CryptoContextProvider({ children }) {
    const [loading, setLoading] = useState(false)

    const [crypto, setCrypto] = useState([])

    const [assets, setAssets] = useState([])

    function mapAssets(assets, result) {
        return assets.map((asset) => {
            const coin = result.find((c) => c.id == asset.id)
            return {
                grow: asset.price < coin.price, // true or flase
                growPercent: percentDifference(asset.price, coin.price),
                totalAmount: (asset.amount * coin.price).toFixed(2),
                totalProfit: (asset.amount * coin.price - asset.amount * asset.price).toFixed(2),
                coinName: coin.name,
                ...asset,
            }
        })

    }

    useEffect(() => {
        async function preload() {
            setLoading(true)
            const { result } = await fakeFetchCrypto()
            const assets = await fetchAssets()
            setAssets(mapAssets(assets, result))
            console.log(result)
            setCrypto(result)
            setLoading(false)
        }
        preload()
    }, [])
    function addAsset(newAsset) {
        setAssets((prevAssets) => {
            const existingAsset = prevAssets.find(asset => asset.id === newAsset.id);

            if (existingAsset) {
                return prevAssets.map(asset =>
                    asset.id === newAsset.id
                        ? {
                            ...asset,
                            amount: asset.amount + newAsset.amount,
                            price: newAsset.price,
                            date: newAsset.date,
                        }
                        : asset
                );
            } else {

                return [...prevAssets, newAsset];
            }
        });
    }
    return <CryptoContext.Provider value={{ loading, crypto, assets, addAsset }}>{children}</CryptoContext.Provider>
}

export default CryptoContext

export function useCrypto() {
    return useContext(CryptoContext)
}