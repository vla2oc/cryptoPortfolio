import { Layout, Typography, Card, Statistic, Tag, List } from "antd";
import { useCrypto } from "../context/crypto-context";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import PortfolioChart from "./PortfolioChart";
import MiniChart from "./MiniChart";
import { capitalize } from "../utils";

import { Link } from "react-router-dom";


export default function AppContent() {
  const { assets, refreshPrice } = useCrypto();

  const topAssets = assets.slice(0, 5);

  return (
    <Layout.Content className="bg-backGr !p-5">
      <div>
        <Card
          className="w-full !mt-10 !mb-10 !p-2 !bg-purple-100 !border-2 !border-purple-300 !rounded-2xl  !font-display !text-lg !font-normal"
          type="inner"
          title={
            <span className="!text-3xl  !text-purple-950 !font-normal ">
              My Portfolio
            </span>
          }
          extra={
            <Link to="/portfolio" className="!text-xl !text-purple-950">
              See all
            </Link>
          }
        >
          <div className="flex gap-10">
            {topAssets.map((asset) => (
              <Card key={asset.id} className="mb-1  !rounded-2xl ">
                <Statistic
                  title={
                    <div className="flex items-center justify-between w-full">
                      <span style={{ display: "flex", alignItems: "center" }}>
                        {asset.icon && (
                          <img
                            src={asset.icon}
                            alt={asset.id}
                            style={{ width: 30, marginRight: 8 }}
                          />
                        )}
                        <span className="!text-xl !text-purple-950 font-display !font-normal">
                          {capitalize(asset.coinName)}
                        </span>
                      </span>
                      {/* Правая часть: кнопка обновления */}
                      <button
                        onClick={() => asset.coinName && refreshPrice(asset.coinName)}
                        disabled={!asset.coinName}
                        className="text-black-700 hover:text-purple-900"
                      >
                        <ReloadOutlined />
                      </button>
                    </div>
                  }
                  value={asset.holdingTotalAmount}
                  precision={2}
                  valueStyle={{ color: asset.grow ? "#3f8600" : "#cf1322" }}
                  prefix={
                    asset.grow ? <ArrowUpOutlined /> : <ArrowDownOutlined />
                  }
                  suffix="$"
                />

                <List
                  className="flex items-start"
                  size="small"
                  dataSource={[{ value: asset.totalProfit, withTag: true }]}
                  renderItem={(item) => (
                    <List.Item>
                      <span>{item.title}</span>
                      <span>
                        {item.withTag && (
                          <Tag color={asset.grow ? "green" : "red"}>
                            {asset.growPercent}%
                          </Tag>
                        )}

                        {item.isPlain && item.value}

                        {!item.isPlain && (
                          <Typography.Text
                            type={asset.grow ? "success" : "danger"}
                          >
                            {item.value ? parseFloat(item.value).toFixed(2) : 0}
                            {item.unit}$
                          </Typography.Text>
                        )}
                      </span>
                    </List.Item>
                  )}
                />
              </Card>
            ))}
          </div>
        </Card>
      </div>
      <PortfolioChart />
    </Layout.Content>
  );
}
