import { transferMoney } from "@/Redux/Wallet/Action";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

const TransferForm = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((store) => store.wallet) || { loading: false };
  
  const [formData, setFormData] = useState({
    amount: "",
    walletId: "",
    purpose: "",
  });

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: name === "amount" ? value.replace(/[^0-9]/g, "") : value,
    }));
  }, []);

  const isFormValid = useMemo(() => {
    return (
      formData.amount && 
      formData.amount > 0 && 
      formData.walletId && 
      formData.walletId.trim().length > 0
    );
  }, [formData.amount, formData.walletId]);

  const handleSubmit = useCallback(() => {
    if (!isFormValid) return;
    
    const jwt = localStorage.getItem("jwt");
    if (!jwt) return;
    
    dispatch(
      transferMoney({
        jwt,
        walletId: formData.walletId.trim(),
        reqData: {
          amount: parseInt(formData.amount, 10),
          purpose: formData.purpose.trim(),
        },
      })
    );
  }, [dispatch, formData, isFormValid]);

  const inputFields = [
    {
      name: "amount",
      label: "Enter Amount",
      placeholder: "$9999",
      type: "text",
      inputMode: "numeric",
    },
    {
      name: "walletId",
      label: "Enter Wallet ID",
      placeholder: "#ADFE34456",
    },
    {
      name: "purpose",
      label: "Purpose",
      placeholder: "Gift for your friend...",
    },
  ];

  return (
    <div className="pt-10 space-y-5">
      {inputFields.map(field => (
        <div key={field.name}>
          <h1 className="pb-1">{field.label}</h1>
          <Input
            name={field.name}
            onChange={handleChange}
            value={formData[field.name]}
            className="py-7"
            placeholder={field.placeholder}
            type={field.type || "text"}
            inputMode={field.inputMode}
            aria-label={field.label}
          />
        </div>
      ))}

      <DialogClose asChild>
        <Button
          onClick={handleSubmit}
          disabled={!isFormValid || loading}
          variant="default"
          className="w-full p-7 text-xl"
        >
          {loading ? "Processing..." : "Send"}
        </Button>
      </DialogClose>
    </div>
  );
};

export default TransferForm;