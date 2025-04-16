import { useEffect, useCallback, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  depositMoney,
  getUserWallet,
  getWalletTransactions,
} from "@/Redux/Wallet/Action";
import { getPaymentDetails } from "@/Redux/Withdrawal/Action";

// UI Components
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import SpinnerBackdrop from "@/components/custome/SpinnerBackdrop";

// Icons
import {
  CopyIcon,
  DownloadIcon,
  ReloadIcon,
  ShuffleIcon,
  UpdateIcon,
  UploadIcon,
} from "@radix-ui/react-icons";
import { DollarSign, WalletIcon } from "lucide-react";

// Forms
import TopupForm from "./TopupForm";
import TransferForm from "./TransferForm";
import WithdrawForm from "./WithdrawForm";

// Custom hook for query parameters
const useQuery = () => new URLSearchParams(useLocation().search);

// Memoized wallet action components 
const ActionButton = memo(({ icon: Icon, label, onClick }) => (
  <div 
    onClick={onClick}
    className="h-24 w-24 bg-gradient-to-b from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 cursor-pointer flex flex-col items-center justify-center rounded-lg border border-gray-700 shadow-md transition-all duration-300 hover:scale-105"
  >
    <Icon className="h-6 w-6 text-blue-500" />
    <span className="text-sm font-medium mt-2 text-gray-200">{label}</span>
  </div>
));

// Transaction item component
const TransactionItem = memo(({ transaction }) => (
  <Card className="lg:w-full px-5 py-3 flex justify-between items-center bg-gradient-to-r from-gray-800 to-gray-850 border-gray-700 hover:border-gray-600 transition-all duration-300 shadow-md">
    <div className="flex items-center gap-5">
      <Avatar className="bg-gray-900 border border-gray-700 shadow-inner">
        <AvatarFallback className="bg-gradient-to-br from-gray-800 to-gray-900">
          <ShuffleIcon className="text-blue-400" />
        </AvatarFallback>
      </Avatar>
      <div className="space-y-1">
        <h1 className="text-gray-100 font-medium">{transaction.type || transaction.purpose}</h1>
        <p className="text-sm text-gray-400">{transaction.date}</p>
      </div>
    </div>
    <div>
      <p className="flex items-center">
        <span className={`${transaction.amount > 0 ? "text-green-400" : "text-red-400"} font-semibold text-lg`}>
          {transaction.amount > 0 ? "+" : ""}{transaction.amount} USD
        </span>
      </p>
    </div>
  </Card>
));

const Wallet = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { wallet } = useSelector((store) => store);
  const query = useQuery();
  const { order_id } = useParams();
  
  const paymentId = query.get("payment_id");
  const razorpayPaymentId = query.get("razorpay_payment_id");
  const orderId = query.get("order_id");
  
  const jwt = localStorage.getItem("jwt");

  // Memoized handlers to prevent unnecessary re-renders
  const handleFetchUserWallet = useCallback(() => {
    dispatch(getUserWallet(jwt));
  }, [dispatch, jwt]);

  const handleFetchWalletTransactions = useCallback(() => {
    dispatch(getWalletTransactions({ jwt }));
  }, [dispatch, jwt]);

  const copyToClipboard = useCallback(async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      console.log("Text copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy text: ", err);
      
      // Fallback for browsers that don't support clipboard API
      const element = document.createElement("textarea");
      element.value = text;
      document.body.appendChild(element);
      element.select();
      document.execCommand("copy");
      document.body.removeChild(element);
    }
  }, []);

  // Handle payment processing
  useEffect(() => {
    const effectiveOrderId = orderId || order_id;
    if (effectiveOrderId) {
      dispatch(
        depositMoney({
          jwt,
          orderId: effectiveOrderId,
          paymentId: razorpayPaymentId || "AuedkfeuUe",
          navigate,
        })
      );
    }
  }, [dispatch, jwt, navigate, order_id, orderId, razorpayPaymentId]);

  // Initial data loading
  useEffect(() => {
    handleFetchUserWallet();
    handleFetchWalletTransactions();
    dispatch(getPaymentDetails({ jwt }));
  }, [dispatch, handleFetchUserWallet, handleFetchWalletTransactions, jwt]);

  if (wallet.loading) {
    return <SpinnerBackdrop />;
  }

  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-950 min-h-screen text-gray-100">
      <div className="pt-10 w-full lg:w-[60%] mx-auto px-4">
        <Card className="bg-gradient-to-br from-gray-800 to-gray-850 border-gray-700 shadow-2xl rounded-xl overflow-hidden">
          <CardHeader className="pb-9 border-b border-gray-700 bg-gradient-to-r from-blue-900/10 to-indigo-900/10">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-5">
                <div className="bg-gradient-to-br from-blue-900 to-blue-800 bg-opacity-20 p-3 rounded-xl shadow-lg">
                  <WalletIcon className="h-8 w-8 text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-white font-bold">My Wallet</CardTitle>
                  <div className="flex items-center gap-2">
                    <p className="text-gray-400 text-sm">
                      #FAVHJY{wallet.userWallet?.id}
                    </p>
                    <CopyIcon
                      onClick={() => copyToClipboard(wallet.userWallet?.id)}
                      className="cursor-pointer hover:text-blue-400 h-4 w-4 transition-colors duration-300"
                    />
                  </div>
                </div>
              </div>
              <div>
                <ReloadIcon
                  onClick={handleFetchUserWallet}
                  className="w-6 h-6 cursor-pointer hover:text-blue-400 transition-colors duration-300 hover:rotate-180 transform"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex items-center bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-lg border border-gray-700 mb-6 shadow-inner">
              <DollarSign className="text-blue-500 h-7 w-7 mr-3" />
              <span className="text-3xl font-bold text-white">
                {wallet.userWallet?.balance}
              </span>
              <span className="ml-2 text-gray-400 font-medium">USD</span>
            </div>

            <div className="flex gap-7 mt-5 justify-between">
              <Dialog>
                <DialogTrigger asChild>
                  <ActionButton icon={UploadIcon} label="Add Money" />
                </DialogTrigger>
                <DialogContent className="p-10 bg-gradient-to-br from-gray-800 to-gray-850 border-gray-700 rounded-xl">
                  <DialogHeader>
                    <DialogTitle className="text-center text-2xl text-white font-bold">
                      Top Up Your Wallet
                    </DialogTitle>
                    <TopupForm />
                  </DialogHeader>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <ActionButton icon={DownloadIcon} label="Withdraw" />
                </DialogTrigger>
                <DialogContent className="p-10 bg-gradient-to-br from-gray-800 to-gray-850 border-gray-700 rounded-xl">
                  <DialogHeader>
                    <DialogTitle className="text-center text-xl text-white font-bold">
                      Request Withdrawal
                    </DialogTitle>
                    <WithdrawForm />
                  </DialogHeader>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <ActionButton icon={ShuffleIcon} label="Transfer" />
                </DialogTrigger>
                <DialogContent className="p-10 bg-gradient-to-br from-gray-800 to-gray-850 border-gray-700 rounded-xl">
                  <DialogHeader>
                    <DialogTitle className="text-center text-xl text-white font-bold">
                      Transfer To Other Wallet
                    </DialogTitle>
                    <TransferForm />
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
        
        <div className="py-5 pt-10">
          <div className="flex gap-2 items-center pb-5">
            <h1 className="text-2xl font-bold text-white">History</h1>
            <UpdateIcon
              onClick={handleFetchWalletTransactions}
              className="p-0 h-7 w-7 cursor-pointer hover:text-blue-400 transition-colors duration-300 hover:rotate-180 transform"
            />
          </div>

          <div className="space-y-3">
            {wallet.transactions?.length > 0 ? (
              wallet.transactions.map((item, index) => (
                <TransactionItem key={index} transaction={item} />
              ))
            ) : (
              <Card className="bg-gradient-to-br from-gray-800 to-gray-850 border-gray-700 p-6 text-center rounded-xl shadow-md">
                <p className="text-gray-400">No transaction history available</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;