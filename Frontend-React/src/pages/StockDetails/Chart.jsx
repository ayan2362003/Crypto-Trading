import { useEffect, useState, useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import fetchData, { dataType } from "../Home/fetchMarketData";
import { convertToUnixTimestamp } from "./ConvertToChartData";

const Chart = () => {
  const [stockData, setStockData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchData();
        const chartData = convertToUnixTimestamp(data[dataType]);
        setStockData(data);
      } catch (error) {
        console.error("Error fetching stock data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStockData();
  }, []);

  const chartConfig = useMemo(() => {
    if (!stockData) return null;

    const dates = Object.keys(stockData[dataType]);
    const closePrices = dates.map((date) =>
      parseFloat(stockData[dataType][date]["4. close"])
    );

    const options = {
      chart: {
        type: "area",
        stacked: false,
        height: 350,
        zoom: {
          enabled: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        type: "datetime",
        categories: dates,
        title: {},
        pan: {
          enabled: true,
        },
      },
      yaxis: {
        title: {},
      },
      title: {
        text: "IBM Stock Weekly Closing Prices",
        align: "center",
      },
      colors: ["#00BFFF"],
      markers: {
        colors: ["#00BFFF"],
        strokeColors: "#fff",
        strokeWidth: 2,
      },
      tooltip: {
        theme: "dark",
      },
      toolbar: {
        show: true,
      },
      grid: {
        borderColor: "#666666",
        strokeDashArray: 4,
        show: true,
      },
    };

    const series = [
      {
        name: "Close Prices",
        data: closePrices,
        fill: {
          type: "solid",
          color: "#00BFFF",
          opacity: 0.5,
        },
      },
    ];

    return { options, series };
  }, [stockData]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!chartConfig) {
    return <div>Failed to load chart data</div>;
  }

  return (
    <div className="stock-chart">
      <ReactApexChart
        options={chartConfig.options}
        series={chartConfig.series}
        type="line"
        height={640}
      />
    </div>
  );
};

export default Chart;