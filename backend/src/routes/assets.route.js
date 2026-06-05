import express from "express";

export const cryptoAssets = [
  {
    id: "bitcoin",
    amount: 1,
    price: 100000,
    date: new Date(),
  },
  {
    id: "ethereum",
    amount: 1.5,
    price: 2000,
    date: new Date(),
  },
];
const assets = cryptoAssets;

const router = express.Router();

router.get("/", (req, res) => {
  res.json(assets);
});

router.post("/", (req, res) => {
  const NewAsset = req.body;
  const existingAsset = assets.find((asset) => asset.id === NewAsset.id);

  if (existingAsset) {
    existingAsset.amount += NewAsset.amount;
    existingAsset.price = NewAsset.price;
    existingAsset.date = NewAsset.date;
  } else {
    assets.push(NewAsset);
  }
  res.status(201).json(NewAsset);
});

router.delete("/:id", (req, res) => {
  const assetId = req.params.id;
  const assetIndex = assets.findIndex((asset) => asset.id === assetId);
  if (assetIndex !== -1) {
    assets.splice(assetIndex, 1);
    res.status(200).json({ message: "Asset deleted successfully" });
  } else {
    res.status(404).json({ message: "Asset not found" });
  }
});

export default router;
