import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

router.get("/coin", async (req, res) => {
  try {
    const ids = req.query.ids || "bitcoin,ethereum";

    const url = `https://api.coingecko.com/api/v3/simple/price?vs_currencies=usd&ids=${ids}`;
    const options = {
      method: "GET",
      headers: {
        "x-cg-demo-api-key": process.env.VITE_COINGECKO_API_KEY || "",
      },
      body: undefined,
    };

    const response = await fetch(url, options);

    const data = await response.json();

    const result = Object.entries(data).map(([id, values]) => ({
      id,
      price: values.usd,
      name: id.charAt(0).toUpperCase() + id.slice(1),
      icon: `https://assets.coingecko.com/coins/images/1/large/${id}.png`,
    }));
    res.json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ result: [] });
  }
});

export default router;
