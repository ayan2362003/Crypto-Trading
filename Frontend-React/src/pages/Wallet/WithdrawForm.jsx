import { useState, useCallback, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { withdrawalRequest } from "@/Redux/Withdrawal/Action";
import { maskAccountNumber } from "@/Util/maskAccountNumber";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DialogClose } from "@/components/ui/dialog";
import "./WithdrawForm.css";

// Memoized bank detail component
const BankDetails = memo(({ bankName, accountNumber }) => (
  <div className="flex items-center gap-5 border px-5 py-2 rounded-md">
    <img
      className="h-8 w-8"
      src="https://cdn.pixabay.com/photo/2020/02/18/11/03/bank-4859142_1280.png"
      alt="Bank icon"
    />
    <div>
      <p className="text-xl font-bold">{bankName}</p>
      <p className="text-xs">{maskAccountNumber(accountNumber)}</p>
    </div>
  </div>
));

// Memoized balance display component
const BalanceDisplay = memo(({ balance }) => (
  <div className="flex justify-between items-center rounded-md bg-slate-900 text-xl font-bold px-5 py-4">
    <p>Available balance</p>
    <p>${balance}</p>
  </div>
));

// No payment details component
const NoPaymentDetails = memo(({ onNavigate }) => (
  <div className="h-[20rem] flex gap-5 flex-col justify-center items-center">
    <p className="text-2xl font-bold">Add payment method</p>
    <Button onClick={onNavigate}>Add Payment Details</Button>
  </div>
));

const WithdrawForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const { wallet, withdrawal } = useSelector((store) => store);

  const handleChange = useCallback((e) => {
    const value = e.target.value;
    if (value.toString().length < 6) {
      setAmount(value);
    }
  }, []);

  const handleSubmit = useCallback(() => {
    if (amount) {
      dispatch(withdrawalRequest({ 
        jwt: localStorage.getItem("jwt"), 
        amount: Number(amount)
      }));
    }
  }, [amount, dispatch]);

  const navigateToPaymentDetails = useCallback(() => {
    navigate("/payment-details");
  }, [navigate]);

  // Early return if no payment details
  if (!withdrawal.paymentDetails) {
    return <NoPaymentDetails onNavigate={navigateToPaymentDetails} />;
  }

  return (
    <div className="pt-10 space-y-5">
      <BalanceDisplay balance={wallet.userWallet?.balance} />
      
      <div className="flex flex-col items-center">
        <h1>Enter withdrawal amount</h1>
        <div className="flex items-center justify-center">
          <Input
            onChange={handleChange}
            value={amount}
            className="withdrawInput py-7 border-none outline-none focus:outline-none px-0 text-2xl text-center"
            placeholder="$9999"
            type="number"
            aria-label="Withdrawal amount"
          />
        </div>
      </div>

      <div>
        <p className="pb-2">Transfer to</p>
        <BankDetails 
          bankName={withdrawal.paymentDetails.bankName}
          accountNumber={withdrawal.paymentDetails.accountNumber}
        />
      </div>
      
      <DialogClose className="w-full">
        <Button
          onClick={handleSubmit}
          variant=""
          className="w-full py-7 text-xl"
          disabled={!amount}
        >
          Withdraw {amount && <span className="ml-5">${amount}</span>}
        </Button>
      </DialogClose>
    </div>
  );
};

export default WithdrawForm;