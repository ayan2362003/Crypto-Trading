import { paymentHandler } from "@/Redux/Wallet/Action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { DotFilledIcon } from "@radix-ui/react-icons";
import { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

const PAYMENT_METHODS = {
  RAZORPAY: {
    id: "r1",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Razorpay_logo.svg/1200px-Razorpay_logo.svg.png",
    alt: "Razorpay logo"
  },
  STRIPE: {
    id: "r2",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/768px-Stripe_Logo%2C_revised_2016.svg.png",
    alt: "Stripe logo"
  }
};

const PaymentMethodOption = ({ method, value, id, logo, alt }) => (
  <div className="flex items-center space-x-2 border p-3 px-5 rounded-md">
    <RadioGroupItem
      icon={DotFilledIcon}
      iconClassName="h-8 w-8"
      className="h-9 w-9"
      value={value}
      id={id}
    />
    <Label htmlFor={id}>
      <div className="bg-white rounded-md px-5 py-2 w-32">
        <img
          src={logo}
          alt={alt}
          className={value === "STRIPE" ? "h-10" : ""}
        />
      </div>
    </Label>
  </div>
);

const TopupForm = () => {
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("RAZORPAY");
  const { loading } = useSelector((store) => store.wallet);
  const dispatch = useDispatch();

  const handleChange = useCallback((e) => {
    // Only allow numeric input
    const value = e.target.value.replace(/[^0-9]/g, "");
    setAmount(value);
  }, []);

  const handleSubmit = useCallback(() => {
    if (!amount || amount <= 0) {
      return; // Prevent submission with invalid amount
    }
    
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      dispatch(
        paymentHandler({
          jwt,
          paymentMethod,
          amount: parseInt(amount, 10),
        })
      );
    }
  }, [amount, paymentMethod, dispatch]);

  const isSubmitDisabled = !amount || amount <= 0;

  return (
    <div className="pt-10 space-y-5">
      <div>
        <h1 className="pb-1">Enter Amount</h1>
        <Input
          onChange={handleChange}
          value={amount}
          className="py-7 text-lg"
          placeholder="$9999"
          type="text"
          inputMode="numeric"
          aria-label="Payment amount"
        />
      </div>

      <div>
        <h1 className="pb-1">Select payment method</h1>
        <RadioGroup
          onValueChange={setPaymentMethod}
          className="flex gap-2"
          defaultValue="RAZORPAY"
        >
          {Object.entries(PAYMENT_METHODS).map(([key, details]) => (
            <PaymentMethodOption
              key={key}
              method={key}
              value={key}
              id={details.id}
              logo={details.logo}
              alt={details.alt}
            />
          ))}
        </RadioGroup>
      </div>
      
      {loading ? (
        <Skeleton className="py-7 w-full" />
      ) : (
        <Button
          onClick={handleSubmit}
          disabled={isSubmitDisabled}
          className="w-full py-7 text-xl"
          variant="default"
        >
          Submit
        </Button>
      )}
    </div>
  );
};

export default TopupForm;