import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { addPaymentDetails } from "@/Redux/Withdrawal/Action";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMemo } from "react";

const formSchema = yup.object().shape({
  accountHolderName: yup.string().required("Account holder name is required"),
  ifsc: yup.string()
    .required("IFSC code is required")
    .length(11, "IFSC code must be 11 characters"),
  accountNumber: yup.string().required("Account number is required"),
  confirmAccountNumber: yup.string()
    .required("Please confirm account number")
    .test({
      name: "match",
      message: "Account numbers do not match",
      test: function (value) {
        return value === this.parent.accountNumber;
      },
    }),
  bankName: yup.string().required("Bank name is required"),
});

const InputField = ({ label, name, placeholder, control, type = "text" }) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <Label>{label}</Label>
        <FormControl>
          <Input
            {...field}
            type={type}
            className="border w-full border-gray-700 py-5 px-5"
            placeholder={placeholder}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

const PaymentDetailsForm = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((store) => store.auth);
  
  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      accountHolderName: "",
      ifsc: "",
      accountNumber: "",
      confirmAccountNumber: "",
      bankName: "",
    },
  });

  const onSubmit = useMemo(() => (data) => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      dispatch(
        addPaymentDetails({
          paymentDetails: data,
          jwt,
        })
      );
    }
  }, [dispatch]);

  const inputFields = [
    {
      label: "Account holder name",
      name: "accountHolderName",
      placeholder: "Code with Crypto",
    },
    {
      label: "IFSC Code",
      name: "ifsc",
      placeholder: "YESB0000009",
    },
    {
      label: "Account Number",
      name: "accountNumber",
      placeholder: "*********5602",
      type: "password",
    },
    {
      label: "Confirm Account Number",
      name: "confirmAccountNumber",
      placeholder: "Confirm Account Number",
      type: "password",
    },
    {
      label: "Bank Name",
      name: "bankName",
      placeholder: "YES Bank",
    },
  ];

  return (
    <div className="px-10 py-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {inputFields.map((field) => (
            <InputField
              key={field.name}
              label={field.label}
              name={field.name}
              placeholder={field.placeholder}
              control={form.control}
              type={field.type || "text"}
            />
          ))}

          {!loading ? (
            <Button type="submit" className="w-full py-5">
              SUBMIT
            </Button>
          ) : (
            <Skeleton className="w-full py-5" />
          )}
        </form>
      </Form>
    </div>
  );
};

export default PaymentDetailsForm;