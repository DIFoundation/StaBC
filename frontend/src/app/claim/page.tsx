"use client";
import { SiteHeader } from "@/components/site-header"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { useStaking } from "@/hooks/useStaking"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useState } from "react"
import { toast } from "sonner"

export default function ClaimPage() {
  const { claimRewards } = useStaking()
  const [isClaiming, setIsClaiming] = useState(false)

  const handleClaimRewards = async () => {
    try {
      setIsClaiming(true);
      await toast.promise(claimRewards(), {
        loading: 'Claiming rewards...',
        success: 'Rewards claimed!',
        error: (err) => `Claiming rewards failed: ${err.message || 'Unknown error'}`,
      });
    } catch (err) {
      console.error('Claiming rewards failed:', err);
    } finally {
      setIsClaiming(false);
    }
  }

  

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
        <Card className="w-full max-w-sm self-center mt-10">
          <CardHeader>
            <CardTitle>
              <h1 className="text-3xl font-bold mb-6">
                Claim Your Rewards
              </h1>
            </CardTitle>
          <CardDescription>
            By clicking on <strong>claim rewards</strong>, the reward of your stake will be sent to your wallet.
          </CardDescription>
          </CardHeader>
          <CardFooter className="flex-col gap-2">
            <Button onClick={handleClaimRewards} variant="default" className="w-full" disabled={isClaiming}>
              {isClaiming ? "Claiming..." : "Claim Rewards"}
            </Button>
          </CardFooter>
        </Card>
      </SidebarInset>
    </SidebarProvider>
  )
}
