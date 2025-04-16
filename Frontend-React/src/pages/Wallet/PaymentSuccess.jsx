import { getUserWallet } from '@/Redux/Wallet/Action'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ReloadIcon } from '@radix-ui/react-icons'
import { DollarSignIcon, WalletIcon } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useCallback } from 'react'

const PaymentSuccess = () => {
  const dispatch = useDispatch();
  const { userWallet } = useSelector((store) => store.wallet);

  const handleFetchUserWallet = useCallback(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      dispatch(getUserWallet(jwt));
    }
  }, [dispatch]);

  // Fetch wallet on component mount
  useEffect(() => {
    handleFetchUserWallet();
  }, [handleFetchUserWallet]);

  return (
    <div className='flex flex-col justify-center items-center h-screen'>
      <h1 className='text-2xl font-semibold pb-5'>Payment Added Successfully</h1>
      <Card className="w-[50%]">
        <CardHeader className="pb-9">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-5">
              <WalletIcon className="h-8 w-8" />
              <CardTitle className="text-2xl">My Balance</CardTitle>
            </div>
            <div>
              <Button
                onClick={handleFetchUserWallet}
                variant="ghost"
                size="icon"
                className="rounded-full"
                aria-label="Refresh wallet balance"
              >
                <ReloadIcon className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <DollarSignIcon />
            <span className="text-2xl font-semibold">
              {userWallet?.balance || 0}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default PaymentSuccess