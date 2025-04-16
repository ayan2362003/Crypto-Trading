import { useEffect, useState, useMemo, useCallback } from "react";
import ReactApexChart from "react-apexcharts";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { fetchMarketChart } from "@/Redux/Coin/Action";

const TIME_SERIES = [
  { keyword: "DIGITAL_CURRENCY_DAILY", key: "Time Series (Daily)", label: "1 Day", value: 1 },
  { keyword: "DIGITAL_CURRENCY_WEEKLY", key: "Weekly Time Series", label: "1 Week", value: 7 },
  { keyword: "DIGITAL_CURRENCY_MONTHLY", key: "Monthly Time Series", label: "1 Month", value: 30 },
  { keyword: "DIGITAL_CURRENCY_MONTHLY_3", key: "3 Month Time Series", label: "3 Months", value: 90 },
  { keyword: "DIGITAL_CURRENCY_MONTHLY_6", key: "6 Month Time Series", label: "6 Months", value: 180 },
  { keyword: "DIGITAL_CURRENCY_YEARLY", key: "Yearly Time Series", label: "1 Year", value: 365 },
];

const StockChart = ({ coinId }) => {
  const [activeType, setActiveType] = useState(TIME_SERIES[0]);
  const dispatch = useDispatch();
  const { coin, auth } = useSelector((store) => store);
  const [chartKey, setChartKey] = useState(0);

  // Memoize chart options
  const options = useMemo(() => ({
    chart: {
      id: "area-datetime",
      type: "area",
      height: 350,
      zoom: { autoScaleYaxis: true },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350
        }
      },
      background: '#1a202c', // Dark background
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true
        },
        export: {
          csv: {
            filename: `${coinId}-market-data`,
            headerCategory: 'Date',
            headerValue: 'Price'
          },
          svg: {
            filename: `${coinId}-chart`,
          },
          png: {
            filename: `${coinId}-chart`,
          }
        },
        autoSelected: 'zoom',
        // Dark mode styling for toolbar
        style: {
          background: '#1e293b', // Dark toolbar background
          color: '#e2e8f0', // Light text color
          fontSize: '12px',
          fontFamily: 'inherit',
        }
      }
    },
    theme: {
      mode: 'dark', // Use dark theme
      palette: 'palette10' // Choose a palette that works with dark mode
    },
    dataLabels: { enabled: false },
    xaxis: {
      type: "datetime",
      tickAmount: 6,
      labels: {
        format: "dd MMM",
        style: {
          colors: '#e2e8f0' // Light text color
        }
      },
      axisBorder: {
        color: '#4A5568'
      },
      axisTicks: {
        color: '#4A5568'
      }
    },
    yaxis: {
      labels: {
        formatter: (value) => value.toFixed(2),
        style: {
          colors: '#e2e8f0' // Light text color
        }
      }
    },
    colors: ["#00BFFF"],
    markers: {
      size: 0,
      discrete: [
        {
          seriesIndex: 0,
          dataPointIndex: null,
          size: 5,
        },
      ],
    },
    tooltip: {
      theme: "dark",
      y: {
        formatter: (value) => value.toFixed(2),
      },
      style: {
        fontSize: '12px',
        fontFamily: 'inherit'
      }
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        stops: [0, 100],
      },
    },
    grid: {
      borderColor: "#4A5568",
      strokeDashArray: 4,
      show: true,
    },
    legend: {
      labels: {
        colors: '#e2e8f0' // Light text color
      }
    }
  }), [coinId]);

  // Memoize series data
  const series = useMemo(() => [
    { data: coin.marketChart.data || [] }
  ], [coin.marketChart.data]);

  // Handle time period change
  const handlePeriodChange = useCallback((item) => {
    setActiveType(item);
  }, []);

  useEffect(() => {
    if (!coinId) return;

    const jwt = localStorage.getItem("jwt") || auth.jwt;
    dispatch(fetchMarketChart({ coinId, days: activeType.value, jwt }));

    // Debounced chart resizing
    const timer = setTimeout(() => setChartKey(prev => prev + 1), 300);
    return () => clearTimeout(timer);
  }, [coinId, activeType.value, dispatch, auth.jwt]);

  return (
    <div className="p-6 bg-gray-800 bg-opacity-80 backdrop-blur-lg rounded-lg shadow-lg transition-all duration-300">
      {/* Toolbar for time selection */}
      <div className="flex flex-wrap gap-2 mb-4">
        {TIME_SERIES.map((item) => (
          <Button
            key={item.label}
            onClick={() => handlePeriodChange(item)}
            className={`px-4 py-2 rounded-md transition-all duration-300 ${activeType.label === item.label
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
          >
            {item.label}
          </Button>
        ))}
      </div>

      {/* Chart */}
      {coin.marketChart.loading ? (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div key={chartKey}>
          <ReactApexChart
            options={options}
            series={series}
            type="area"
            height={450}
          />
        </div>
      )}
    </div>
  );
};

export default StockChart;