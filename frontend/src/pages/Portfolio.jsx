import AppHeader from "../components/AppHeader";
import PortfolioAssetsChart from "../components/PortfolioAssetsChart";
import PortfolioAllAssets from "../components/PortfolioAllAssets";
import { Card, Statistic } from "antd";
import { useContext } from "react";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import CryptoContext from "../context/crypto-context";

export default function Portfolio() {
  const { totalHoldingValue, totalNetProfit, totalInvestments, removeAsset } =
    useContext(CryptoContext);
  const isTotalGrowthPositive = totalNetProfit >= 0;
  return (
    <>
      <AppHeader />
      <div className="bg-backGr min-h-screen ">
        <div className="flex justify-center">
          <Card
            className="!mt-10 !rounded-2xl !mb-10 !p-3 !bg-purple-100 !border-purple-300 !border-2 !font-display !text-2xl !w-[900px] !font-normal"
            title={
              <span className="!text-2xl !font-medium !text-purple-900 !font-display">
                Overall Portfolio
              </span>
            }
          >
            <div className="flex flex-row gap-6 justify-center items-center">
              <Card className="flex !bg-purple-200 !rounded-2xl !border-purple-300  w-full h-[100px] items-center">
                <Statistic
                  className="!font-display !font-bold !leading-10"
                  title={
                    <span className="!text-xl !text-purple-900 !font-normal !font-display">
                      Total Holding
                    </span>
                  }
                  value={totalHoldingValue}
                  precision={2}
                  valueStyle={{
                    color: isTotalGrowthPositive ? "#3f8600" : "#cf1322",
                  }}
                  suffix="$"
                />
              </Card>
              <Card className="flex !flex-row !bg-purple-200 !rounded-2xl !border-purple-300   w-full h-[100px] items-center">
                <Statistic
                  className="!font-display !font-bold !leading-10"
                  title={
                    <span className="!text-xl !text-purple-900 !font-normal !font-display">
                      Total Profit/Loss
                    </span>
                  }
                  value={totalNetProfit}
                  precision={2}
                  prefix={
                    isTotalGrowthPositive ? (
                      <ArrowUpOutlined />
                    ) : (
                      <ArrowDownOutlined />
                    )
                  }
                  suffix="$"
                  valueStyle={{
                    color: isTotalGrowthPositive ? "#3f8600" : "#cf1322",
                    display: "flex",
                  }}
                />
              </Card>
              <Card className="flex !bg-purple-200 !rounded-2xl !border-purple-300   w-full h-[100px] items-center">
                <Statistic
                  className="!font-display !font-bold !leading-10"
                  title={
                    <span className="!text-xl !text-purple-900 !font-normal !font-display">
                      Investments
                    </span>
                  }
                  value={totalInvestments}
                  precision={2}
                  suffix="$"
                />
              </Card>
            </div>
          </Card>
        </div>
        <div className="flex gap-12 p-8">
          <div className="flex-1 ">
            <PortfolioAllAssets />
          </div>

          <div className="max-w-lg w-full flex justify-end">
            <div className="p-5 border-2 bg-purple-100 !border-purple-300 rounded-2xl flex justify-center items-center h-full w-[400px]">
              <div className="w-full h-full">
                <PortfolioAssetsChart />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
