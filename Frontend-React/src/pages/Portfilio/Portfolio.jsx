/* eslint-disable no-unused-vars */
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserAssets } from "@/Redux/Assets/Action";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import TreadingHistory from "./TreadingHistory";
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

const COLORS = ["#22d3ee", "#a78bfa", "#f472b6", "#facc15"]; // Teal, Purple, Pink, Yellow

const Portfolio = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentTab, setCurrentTab] = useState("portfolio");
  const { asset } = useSelector((store) => store);

  useEffect(() => {
    dispatch(getUserAssets(localStorage.getItem("jwt")));
  }, []);

  const handleTabChange = (value) => {
    setCurrentTab(value);
  };

  const portfolioData =
    asset?.userAssets && Array.isArray(asset.userAssets)
      ? asset.userAssets.map((item) => ({
          name: item?.coin?.name || "Unknown",
          value: (item?.coin?.current_price || 0) * (item?.quantity || 0),
          percentage:
            ((item?.coin?.current_price || 0) * (item?.quantity || 0)) /
            (asset.userAssets.reduce(
              (sum, a) =>
                sum + (a?.coin?.current_price || 0) * (a?.quantity || 0),
              0
            ) || 1) *
            100,
        }))
      : [];

  const totalValue =
    asset?.userAssets && Array.isArray(asset.userAssets)
      ? asset.userAssets.reduce(
          (sum, item) =>
            sum + (item?.coin?.current_price || 0) * (item?.quantity || 0),
          0
        )
      : 0;

  return (
    <div className="px-4 md:px-10 py-6 mt-6 bg-gray-900 text-gray-100 min-h-screen">
      {/* Summary Card */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-md p-6 mb-8">
        <h1 className="text-2xl font-bold mb-2">Portfolio Overview</h1>
        <p className="text-4xl font-extrabold">${totalValue.toLocaleString()}</p>
        <p className="text-sm text-gray-200 mt-1">Total Portfolio Value</p>
      </div>

      {/* Select Tab */}
      <div className="pb-6 flex items-center gap-4">
        <Select onValueChange={handleTabChange} defaultValue="portfolio">
          <SelectTrigger className="w-[200px] bg-gray-800 border border-gray-700 text-white">
            <SelectValue placeholder="Select Tab" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 text-white border border-gray-700">
            <SelectItem value="portfolio">Portfolio</SelectItem>
            <SelectItem value="history">History</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Charts */}
      {currentTab === "portfolio" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Pie Chart */}
          <div className="bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
            <h2 className="text-xl font-bold mb-4">Asset Allocation</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={portfolioData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(1)}%`
                  }
                >
                  {portfolioData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #4b5563",
                    color: "#f9fafb",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div className="bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
            <h2 className="text-xl font-bold mb-4">Value Breakdown</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={portfolioData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                <XAxis dataKey="name" stroke="#E5E7EB" />
                <YAxis stroke="#E5E7EB" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #4b5563",
                    color: "#f9fafb",
                  }}
                />
                <Legend wrapperStyle={{ color: "#E5E7EB" }} />
                <Bar dataKey="value" fill="#f472b6" barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Table */}
      {currentTab === "portfolio" ? (
        <Table className="bg-gray-800 rounded-2xl overflow-hidden shadow-md">
          <TableHeader>
            <TableRow className="bg-gray-700 text-gray-200">
              <TableHead className="py-3">Assets</TableHead>
              <TableHead>PRICE</TableHead>
              <TableHead>UNIT</TableHead>
              <TableHead>CHANGE</TableHead>
              <TableHead>CHANGE(%)</TableHead>
              <TableHead className="text-right">VALUE</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {asset.userAssets?.map((item) => (
              <TableRow
                onClick={() => navigate(`/market/${item.coin.id}`)}
                key={item.id}
                className="hover:bg-gray-700 cursor-pointer transition"
              >
                <TableCell className="flex items-center gap-2 font-medium">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={item.coin.image} alt={item.coin.symbol} />
                  </Avatar>
                  <span>{item.coin.name}</span>
                </TableCell>
                <TableCell>${item.coin.current_price}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell
                  className={
                    item.coin.price_change_percentage_24h < 0
                      ? "text-red-500"
                      : "text-green-500"
                  }
                >
                  {item.coin.price_change_24h}
                </TableCell>
                <TableCell
                  className={
                    item.coin.price_change_percentage_24h < 0
                      ? "text-red-500"
                      : "text-green-500"
                  }
                >
                  {item.coin.price_change_percentage_24h}%
                </TableCell>
                <TableCell className="text-right">
                  ${(item.coin.current_price * item.quantity).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <TreadingHistory />
      )}
    </div>
  );
};

export default Portfolio;
