import { useEffect, useCallback, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getWithdrawalHistory } from "@/Redux/Withdrawal/Action";
import { readableTimestamp } from "@/Util/readbaleTimestamp";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Memoized status badge component
const StatusBadge = memo(({ status }) => (
  <Badge 
    className={`text-white ${
      status === "PENDING" ? "bg-red-500" : "bg-green-500"
    }`}
  >
    {status}
  </Badge>
));

// Memoized table row component
const WithdrawalRow = memo(({ item }) => (
  <TableRow key={item.id}>
    <TableCell className="font-medium py-5">
      {readableTimestamp(item?.date)}
    </TableCell>
    <TableCell>{"Bank Account"}</TableCell>
    <TableCell>₹{item.amount}</TableCell>
    <TableCell className="text-right">
      <StatusBadge status={item.status} />
    </TableCell>
  </TableRow>
));

const Withdrawal = () => {
  const dispatch = useDispatch();
  const { withdrawal } = useSelector((store) => store);

  // Memoized fetch function
  const fetchWithdrawalHistory = useCallback(() => {
    const jwt = localStorage.getItem("jwt");
    dispatch(getWithdrawalHistory(jwt));
  }, [dispatch]);

  useEffect(() => {
    fetchWithdrawalHistory();
  }, [fetchWithdrawalHistory]);

  return (
    <div className="px-20">
      <h1 className="text-3xl font-bold py-10">Withdrawal</h1>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="py-5">Date</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {withdrawal.history.map((item) => (
              <WithdrawalRow key={item.id} item={item} />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Withdrawal;