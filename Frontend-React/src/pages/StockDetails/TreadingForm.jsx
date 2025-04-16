import { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DollarSign } from "lucide-react";
import { DotIcon } from "@radix-ui/react-icons";

// UI Components
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

// Redux Actions
import { getAssetDetails } from "@/Redux/Assets/Action";
import { payOrder } from "@/Redux/Order/Action";

const TradingForm = () => {
  const dispatch = useDispatch();
  const { coin, asset, wallet } = useSelector((store) => store);

  // State
  const [quantity, setQuantity] = useState(0);
  const [amount, setAmount] = useState(0);
  const [orderType, setOrderType] = useState("BUY");

  // Memoized values
  const jwt = useMemo(() => localStorage.getItem("jwt"), []);
  const coinDetails = useMemo(() => coin.coinDetails, [coin.coinDetails]);
  const currentPrice = useMemo(() => coinDetails?.market_data?.current_price?.usd || 0, [coinDetails]);
  const assetQuantity = useMemo(() => asset.assetDetails?.quantity || 0, [asset.assetDetails]);
  const walletBalance = useMemo(() => wallet.userWallet?.balance || 0, [wallet.userWallet]);

  // Calculate buy cost with precision
  const calculateBuyCost = useCallback((amountUSD, cryptoPrice) => {
    if (!amountUSD || !cryptoPrice) return 0;

    const volume = amountUSD / cryptoPrice;
    const decimalPlaces = Math.max(2, cryptoPrice.toString().split(".")[0].length);

    return volume.toFixed(decimalPlaces);
  }, []);

  // Handle input change
  const handleAmountChange = useCallback((e) => {
    const newAmount = parseFloat(e.target.value) || 0;
    setAmount(newAmount);

    const volume = calculateBuyCost(newAmount, currentPrice);
    setQuantity(volume);
  }, [calculateBuyCost, currentPrice]);

  // Toggle order type
  const toggleOrderType = useCallback(() => {
    setOrderType(prevType => prevType === "BUY" ? "SELL" : "BUY");
    // Reset values when switching order types
    setAmount(0);
    setQuantity(0);
  }, []);

  // Handle order execution
  const handleExecuteOrder = useCallback(() => {
    dispatch(payOrder({
      jwt,
      amount,
      orderData: {
        coinId: coinDetails?.id,
        quantity,
        orderType,
      },
    }));
  }, [dispatch, jwt, amount, coinDetails?.id, quantity, orderType]);

  // Check if order is valid
  const isOrderValid = useMemo(() => {
    if (quantity <= 0) return false;

    if (orderType === "SELL") {
      if (!assetQuantity) return false;
      return assetQuantity * currentPrice >= amount;
    } else {
      return currentPrice * quantity <= walletBalance;
    }
  }, [quantity, orderType, assetQuantity, currentPrice, amount, walletBalance]);

  // Error message
  const errorMessage = useMemo(() => {
    if (quantity <= 0) return "";

    if (orderType === "SELL" && assetQuantity * currentPrice < amount) {
      return "Insufficient quantity to sell";
    } else if (orderType === "BUY" && quantity * currentPrice > walletBalance) {
      return "Insufficient wallet balance to buy";
    }
    return "";
  }, [quantity, orderType, assetQuantity, currentPrice, amount, walletBalance]);

  // Fetch asset details on mount
  useEffect(() => {
    if (coinDetails?.id) {
      dispatch(getAssetDetails({ coinId: coinDetails.id, jwt }));
    }
  }, [dispatch, coinDetails?.id, jwt]);

  // Format price change for display
  const formattedPriceChange = useMemo(() => {
    const change = coinDetails?.market_data?.market_cap_change_24h;
    const percentChange = coinDetails?.market_data?.market_cap_change_percentage_24h;

    if (change === undefined || percentChange === undefined) return "";
    return `${change} (${percentChange}%)`;
  }, [coinDetails?.market_data]);

  // Determine price change class
  const priceChangeClass = useMemo(() => {
    const change = coinDetails?.market_data?.market_cap_change_24h;
    return change < 0 ? "text-red-600" : "text-green-600";
  }, [coinDetails?.market_data?.market_cap_change_24h]);

  return (
    <div className="space-y-10 p-5">
      {/* Amount Input */}
      <div>
        <div className="flex gap-4 items-center justify-between">
          <Input
            className="py-7 focus:outline-none"
            placeholder="Enter amount..."
            onChange={handleAmountChange}
            type="number"
            min="0"
            value={amount || ""}
            aria-label="Amount in USD"
          />
          <div>
            <p className="border text-2xl flex justify-center items-center w-36 h-14 rounded-md">
              {quantity}
            </p>
          </div>
        </div>
        {errorMessage && (
          <h1 className="text-red-800 text-center pt-4">{errorMessage}</h1>
        )}
      </div>

      {/* Coin Details */}
      <div className="flex gap-5 items-center">
        <div>
          <Avatar>
            <AvatarImage src={coinDetails?.image?.large} alt={coinDetails?.name} />
          </Avatar>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p>{coinDetails?.symbol?.toUpperCase()}</p>
            <DotIcon className="text-gray-400" />
            <p className="text-gray-400">{coinDetails?.name}</p>
          </div>
          <div className="flex items-end gap-2">
            <p className="text-xl font-bold">{currentPrice}</p>
            <p className={priceChangeClass}>{formattedPriceChange}</p>
          </div>
        </div>
      </div>

      {/* Order Information */}
      <div className="flex items-center justify-between">
        <p>Order Type</p>
        <p>Market Order</p>
      </div>
      <div className="flex items-center justify-between">
        <p>{orderType === "BUY" ? "Available Cash" : "Available Quantity"}</p>
        <div>
          {orderType === "BUY" ? (
            <div className="flex items-center">
              <DollarSign />
              <span className="text-2xl font-semibold">{walletBalance}</span>
            </div>
          ) : (
            <p>{assetQuantity}</p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div>
        <DialogClose className="w-full">
          <Button
            onClick={handleExecuteOrder}
            className={`w-full py-6 ${orderType === "SELL" ? "bg-red-600 text-white" : ""}`}
            disabled={!isOrderValid}
          >
            {orderType}
          </Button>
        </DialogClose>

        <Button
          onClick={toggleOrderType}
          className="w-full mt-5 text-xl"
          variant="link"
        >
          {orderType === "BUY" ? "Or Sell" : "Or Buy"}
        </Button>
      </div>
    </div>
  );
};

export default TradingForm;