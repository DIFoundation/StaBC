'use client'
import { SiteHeader } from "@/components/site-header"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useState } from "react"
import { useStakingActions } from "@/hooks/useStakingActions"
import { useUserPositions } from "@/hooks/useUserPositions"
import { useStakingContract } from "@/hooks/useStakingContract"
import { toast } from "sonner"
import { useAccount } from "wagmi"

export default function UnstakePage() {

  const { address } = useAccount()
  const [amount, setAmount] = useState('');
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const {
    withdraw,
    emergencyWithdraw,
  } = useStakingActions();

  const { positions } = useUserPositions();
  const currentPosition = positions[0]
  const currentStake = currentPosition ? parseFloat(currentPosition.amount) : 0

  const { contractInfo } = useStakingContract();
  const emergencyWithdrawPenalty = contractInfo?.emergencyWithdrawPenalty || 0;

  const handleWithdraw = async () => {
    if (!amount) {
      toast.error('Please enter an amount to withdraw');
      return;
    }
    if (!address) {
      toast.error('Handle withdraw: Please connect your wallet');
      return;
    }

    try {
      setIsWithdrawing(true);
      await toast.promise(withdraw(amount), {
        loading: 'Withdrawing tokens...',
        success: 'Tokens withdrawn successfully!',
        error: (err) => `Withdrawal failed: ${err.message || 'Unknown error'}`,
      });
    } catch (err) {
      console.error('Withdrawal failed:', err);
    } finally {
      setIsWithdrawing(false);
    }
  };

  const handleEmergencyWithdrawn = async () => {
    if (!address) {
      toast.error('Handle emergency withdraw: Please connect your wallet');
      return;
    }

    try {
      setIsWithdrawing(true);
      await toast.promise(emergencyWithdraw(), {
        loading: 'Withdrawing tokens...',
        success: 'Tokens withdrawn successfully!',
        error: (err) => `Withdrawal failed: ${err.message || 'Unknown error'}`,
      });
    } catch (err) {
      console.error('Withdrawal failed:', err);
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex w-full max-w-sm flex-col gap-6 self-center mt-12">
          <Tabs defaultValue="unstake">
            <TabsList className="w-full h-12">
              <TabsTrigger value="unstake">Withdraw Stake</TabsTrigger>
              <TabsTrigger value="emergency-withdrawal">Emergency Withdrawal</TabsTrigger>
            </TabsList>

            <TabsContent value="unstake">
              <Card>
                <CardHeader>
                  <CardTitle>Withdraw Stake</CardTitle>
                  <CardDescription>
                    Withdraw your stake here. Enter amount to withdraw and click withdraw when you&apos;re
                    done.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                  <form>
                    <div className="flex flex-col gap-2">
                      <Input
                        id="amount"
                        type="number"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="pr-16 text-lg font-mono"
                      />
                      <CardDescription>
                        Current Stake: {currentStake}
                      </CardDescription>
                    </div>
                  </form>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={handleWithdraw} 
                    disabled={isWithdrawing || !amount}
                    className="w-full"
                  >
                    {isWithdrawing ? 'Withdrawing...' : 'Withdraw'}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="emergency-withdrawal">
              <Card>
                <CardHeader>
                  <CardTitle>Emergency Withdrawal</CardTitle>
                  <CardDescription>
                    Urgently need to withdraw your stake here. 
                    Emergency withdrawal will give you all your staked token 
                    and <b>{emergencyWithdrawPenalty}%</b> penalty will be deducted.
                  </CardDescription>
                </CardHeader>
                <CardFooter className="flex flex-col gap-2">
                  <Button 
                    onClick={handleEmergencyWithdrawn} 
                    disabled={isWithdrawing || !address}
                    className="w-full bg-destructive hover:bg-destructive/90"
                  >
                    {isWithdrawing ? 'Withdrawing...' : 'Emergency Withdrawal'}
                  </Button>
                  <CardDescription>
                    Current Stake: {currentStake}
                  </CardDescription>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
