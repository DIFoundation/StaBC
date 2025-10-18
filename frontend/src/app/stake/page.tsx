'use client'
import { SiteHeader } from "@/components/site-header"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { useStaking } from "@/hooks/useStaking"
import { useState } from "react";
import { Button } from "@/components/ui/button"
import { useAccount } from "wagmi"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

export default function StakePage() {

  const { address } = useAccount();
  const { 
    stake, 
    approve, 
    tokenBalance,
    needsApproval,  
  } = useStaking();

  const [amount, setAmount] = useState('');
  const [isApproving, setIsApproving] = useState(false);
  const [isStaking, setIsStaking] = useState(false);
  

  

  const handleApprove = async () => {
    if (!amount) {
      toast.error('Please enter an amount to approve');
      return;
    }
    if (!address) {
      toast.error('Handle approve: Please connect your wallet');
      return;
    }


    try {
      setIsApproving(true);
      await toast.promise(approve(amount), {
        loading: 'Approving tokens...',
        success: 'Tokens approved!',
        error: (err) => `Approval failed: ${err.message || 'Unknown error'}`,
      });
    } catch (err) {
      console.error('Approval failed:', err);
    } finally {
      setIsApproving(false);
    }
  };

  const handleStake = async () => {
    if (!amount) {
      toast.error('Please enter an amount to stake');
      return;
    }

    try {
      setIsStaking(true);
      await toast.promise(stake(amount), {
        loading: 'Staking tokens...',
        success: () => {
          setAmount(''); // Clear the input after successful staking
          return 'Tokens staked successfully!';
        },
        error: (err) => `Staking failed: ${err.message || 'Unknown error'}`,
      });
    } catch (err) {
      console.error('Staking failed:', err);
    } finally {
      setIsStaking(false);
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
        <Card className="w-full max-w-sm self-center ">
          <CardHeader>
            <CardTitle>Stake</CardTitle>
            <CardDescription>
              Enter the amount of tokens you want to stake.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="flex flex-col gap-2">
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pr-16 text-lg font-mono"
                  disabled={isApproving || isStaking}
                />
                <CardDescription>
                  {tokenBalance}
                </CardDescription>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            {needsApproval(amount) ? (
              <Button 
                className="w-full mt-4" 
                onClick={handleApprove}
                disabled={isApproving || !amount}
              >
                {isApproving ? 'Approving...' : 'Approve'}
              </Button>
            ) : (
              <Button 
                className="w-full mt-4" 
                onClick={handleStake}
                disabled={isStaking || !amount || !address}
              >
                {isStaking ? 'Staking...' : 'Stake'}
              </Button>
            )}
            <div className="text-sm text-muted-foreground mt-2">
              Wallet Balance: {tokenBalance ? (tokenBalance) : '0'} tokens
            </div>
          </CardFooter>
        </Card>
      </SidebarInset>
    </SidebarProvider>

  )
}
