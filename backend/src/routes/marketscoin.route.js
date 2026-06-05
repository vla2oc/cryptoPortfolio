import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.get("/coins", async (req, res) => {
    try {
        const currency = req.query.currency || 'usd';
        const price_change_percentage = req.query.price_change_percentage || '24h';
        const page = req.query.page || '1';
        const per_page = req.query.per_page || '10';

        const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&price_change_percentage=${price_change_percentage}&page=${page}&per_page=${per_page}`;
const crypto = {
  method: 'GET',
  headers: {'x-cg-demo-api-key': 'CG-tnTfkf1xC61FgXU8afusREJk'},
  body: undefined
};

        const response = await fetch(url, crypto);

        const data = await response.json();

        const result = data.map(coin => ({
            id: coin.id,
            price: coin.current_price,
            name: coin.name,
            symbol: coin.symbol.toUpperCase(),
            icon: coin.image,
            usd_24h_change: coin.price_change_percentage_24h_in_currency,
            price_change_percentage_24h: coin.price_change_percentage_24h
            
        }))
        res.json({ result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ result: [] });
    }
});

export default router;
