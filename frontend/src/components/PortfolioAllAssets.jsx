import React, { useState } from "react";
import { Button, Space, Table } from "antd";
import { useCrypto } from "../context/crypto-context";

export default function PortfolioAllAssets() {
  const { assets, crypto, removeAsset } = useCrypto();

  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const handleChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };

  const data = assets.map((asset, index) => {
    return {
      key: asset.id,
      name: asset.coinName,
      icon: asset.icon,

      price: asset.currentPrice,
      profit24h: asset.priceChange24h,
      total_invested: asset.totalInvested,
      avg_price: asset.avgPrice,
      current_profit: asset.totalProfit,
      holdings: asset.totalAmount,

      grow: asset.grow,
      growPercent: asset.growPercent,
    };
  });

  const columns = [
    {
      title: "Assets",
      dataIndex: "name",
      key: "name",
      filters: assets.map((a) => ({ text: a.coinName, value: a.coinName })), // создаём фильтры по существующим активам
      onFilter: (value, record) => record.name === value, // фильтрация
      render: (text, record) => (
        <div className="flex items-center">
          <img className="w-8 mr-3" src={record.icon} alt={record.name} />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (text) => `$${parseFloat(text).toFixed(2)}`,
      sorter: (a, b) => parseFloat(b.price) - parseFloat(a.price), // сортировка по убыванию
      defaultSortOrder: "descend", // по умолчанию от большего к меньшему
    },
    {
      title: "24h Profit",
      dataIndex: "profit24h",
      key: "profit24h",
      render: (text) => `${parseFloat(text).toFixed(2)}%`,
      filters: [
        { text: "Positive", value: "positive" },
        { text: "Negative", value: "negative" },
      ],
      onFilter: (value, record) => {
        if (value === "positive") return parseFloat(record.profit24h) > 0;
        if (value === "negative") return parseFloat(record.profit24h) < 0;
        return false;
      },
    },
    {
      title: "Total Invested",
      dataIndex: "total_invested",
      key: "total_invested",
      render: (text) => `$${parseFloat(text).toFixed(2)}`,
    },
    {
      title: "Avg.Price",
      dataIndex: "avg_price",
      key: "avg_price",
      render: (text) => `$${parseFloat(text).toFixed(2)}`,
    },
    {
      title: "Current profit",
      dataIndex: "current_profit",
      key: "current_profit",
      render: (text) => `$${parseFloat(text).toFixed(2)}`,
      sorter: (a, b) =>
        parseFloat(b.current_profit) - parseFloat(a.current_profit), // сортировка по убыванию
      defaultSortOrder: "descend", // по умолчанию от большего к меньшему
    },
    {
      title: "Holdings",
      dataIndex: "holdings",
      key: "holdings",
      render: (text) => `${parseFloat(text).toFixed(0)}`,
      sorter: (a, b) => parseFloat(b.holdings) - parseFloat(a.holdings), // сортировка по убыванию
      defaultSortOrder: "descend", // по умолчанию от большего к меньшему
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <button
          onClick={() => removeAsset(record.key)}
          className="text-red-600 hover:text-red-800"
        >
          Delete
        </button>
      ),
    },
  ];
  return (
    <>
      <Space style={{ marginBottom: 16 }}></Space>
      <Table columns={columns} dataSource={data} onChange={handleChange} />
    </>
  );
}
