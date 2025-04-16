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
import { getAllOrdersForUser } from "@/Redux/Order/Action";
import { calculateProfite } from "@/Util/calculateProfite";
import { readableDate } from "@/Util/readableDate";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const TreadingHistory = () => {
  const dispatch = useDispatch();
  const [currentTab, setCurrentTab] = useState("portfolio");
  const { asset, order } = useSelector((store) => store);

  useEffect(() => {
    dispatch(getUserAssets(localStorage.getItem("jwt")));
    dispatch(getAllOrdersForUser({ jwt: localStorage.getItem("jwt") }));
  }, []);

  const handleTabChange = (value) => {
    setCurrentTab(value);
  };

  const chartData =
    order.orders?.map((item) => ({
      name: readableDate(item.timestamp).date,
      value: item.orderType === "SELL" ? calculateProfite(item) : 0,
      type: item.orderType,
    })) || [];

  return (
    <div className="px-4 md:px-10 py-6 mt-6 bg-gray-900 text-gray-100 min-h-screen">
      {/* Bar Chart */}
      {chartData.length > 0 && (
        <div className="mb-10 w-full h-[300px] flex items-center justify-center bg-gray-800 rounded-2xl shadow-lg p-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
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
              <Bar dataKey="value" fill="#22d3ee" barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Trade History Table */}
      <div className="bg-gray-800 rounded-2xl shadow-md overflow-auto">
        <Table className="w-full text-sm">
          <TableHeader className="bg-gray-700 text-gray-200">
            <TableRow>
              <TableHead className="py-3">Date & Time</TableHead>
              <TableHead>Trading Pair</TableHead>
              <TableHead>Buy Price</TableHead>
              <TableHead>Selling Price</TableHead>
              <TableHead>Order Type</TableHead>
              <TableHead>Profit / Loss</TableHead>
              <TableHead className="text-right">Total Value</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {order.orders?.map((item) => (
              <TableRow key={item.id} className="hover:bg-gray-700 transition">
                <TableCell>
                  <p>{readableDate(item.timestamp).date}</p>
                  <p className="text-gray-400 text-xs">
                    {readableDate(item.timestamp).time}
                  </p>
                </TableCell>

                <TableCell className="font-medium flex items-center gap-2">
                  <Avatar className="w-6 h-6">
                    <AvatarImage
                      src={item.orderItem.coin.image}
                      alt={item.orderItem.coin.symbol}
                    />
                  </Avatar>
                  <span>{item.orderItem.coin.name}</span>
                </TableCell>

                <TableCell>${item.orderItem.buyPrice}</TableCell>
                <TableCell>
                  {item.orderType === "SELL"
                    ? `$${item.orderItem.sellPrice}`
                    : "-"}
                </TableCell>
                <TableCell
                  className={
                    item.orderType === "SELL"
                      ? "text-green-400"
                      : "text-yellow-400"
                  }
                >
                  {item.orderType}
                </TableCell>
                <TableCell
                  className={`${
                    calculateProfite(item) < 0
                      ? "text-red-500"
                      : "text-green-500"
                  }`}
                >
                  {item.orderType === "SELL"
                    ? `$${calculateProfite(item).toFixed(2)}`
                    : "-"}
                </TableCell>
                <TableCell className="text-right">
                  ${item.price.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TreadingHistory;
