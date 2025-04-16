import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import PaymentDetailsForm from "./PaymentDetailsForm";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo } from "react";
import { getPaymentDetails } from "@/Redux/Withdrawal/Action";
import { maskAccountNumber } from "@/Util/maskAccountNumber";

const PaymentDetails = () => {
  const dispatch = useDispatch();
  const { paymentDetails } = useSelector((store) => store.withdrawal);

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      dispatch(getPaymentDetails({ jwt }));
    }
  }, [dispatch]);

  const bankName = useMemo(() => 
    paymentDetails?.bankName?.toUpperCase() || '', 
    [paymentDetails?.bankName]
  );

  const ifscCode = useMemo(() => 
    paymentDetails?.ifsc?.toUpperCase() || '', 
    [paymentDetails?.ifsc]
  );

  const maskedAccountNumber = useMemo(() => 
    paymentDetails?.accountNumber ? maskAccountNumber(paymentDetails.accountNumber) : '',
    [paymentDetails?.accountNumber]
  );

  return (
    <div className="px-20">
      <h1 className="text-3xl font-bold py-10">Payment Details</h1>
      {paymentDetails ? (
        <Card className="mb-10">
          <CardHeader>
            <CardTitle>{bankName}</CardTitle>
            <CardDescription>
              A/C No: {maskedAccountNumber}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <p className="w-32">A/C Holder</p>
              <p className="text-gray-400">
                : {paymentDetails.accountHolderName}
              </p>
            </div>
            <div className="flex items-center">
              <p className="w-32">IFSC</p>
              <p className="text-gray-400">
                : {ifscCode}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Dialog>
          <DialogTrigger asChild>
            <Button className="py-6">Add Payment Details</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader className="pb-5">
              <DialogTitle>Payment Details</DialogTitle>
            </DialogHeader>
            <PaymentDetailsForm />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default PaymentDetails;