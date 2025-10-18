"use client"

import { useStaking } from "@/hooks/useStaking"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function WithdrawModal() {
  const { withdraw } = useStaking()

  const handleWithdraw = async () => {
    try {
      await withdraw()
      alert("Withdrawn successfully!")
    } catch (error) {
      console.error(error)
      alert("Failed to withdraw.")
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Withdraw</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Withdraw Stake</DialogTitle>
          <DialogDescription>
            Are you sure you want to withdraw this position?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={handleWithdraw}>Withdraw</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
