import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Filler } from "chart.js";
import { useCrypto } from "../context/crypto-context";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
);

export default function PortfolioChart() {
  const { assets, transactions } = useCrypto();

  const sortedTransactions = transactions.sort(
    (a, b) => new Date(a.date) - new Date(b.date),
  );

  let cumulativeCost = 0;
  const historicalData = sortedTransactions.map((transaction) => {
    const transactionCost = transaction.amount * transaction.price_bought;

    cumulativeCost += transactionCost;

    return {
      date: transaction.date,

      value: cumulativeCost,
    };
  });

  const currentHoldings = {};

  const holdingValueOverTime = transactions.map((transaction) => {
    currentHoldings[transaction.id] =
      (currentHoldings[transaction.id] || 0) + transaction.amount;

    const currentValue = Object.keys(currentHoldings).reduce((sum, id) => {
      const coin = assets.find((a) => a.id === id);
      if (coin) {
        return sum + currentHoldings[id] * coin.currentPrice;
      }
      return sum;
    }, 0);

    return currentValue;
  });

  const data = {
    labels: transactions.map((asset) =>
      new Date(asset.date).toLocaleDateString(),
    ),
    datasets: [
      {
        label: "Portfolio Value",
        data: holdingValueOverTime,
        fill: true,
        backgroundColor: "rgba(120, 109, 113, 0.5)",
        borderColor: "#786D71",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
        labels: {
          display: false,
          color: "",
        },
      },
      tooltip: {
        bodyColor: "white",
        titleColor: "white",
      },
    },
    scales: {
      x: {
        type: "category",
        ticks: {
          color: "black",
        },
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: false,
        ticks: {
          color: "black",
          callback: function (value) {
            return "$" + value.toLocaleString();
          },
        },
      },
    },
  };

  return (
    <div className="p-10 bg-purple-100 rounded-2xl">
      <div className="flex justify-center h-[400px]">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
