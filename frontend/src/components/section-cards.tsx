"use client"

import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"
import { formatUnits } from "viem"
import { useMemo } from "react"

import { useStaking } from "@/hooks/useStaking"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function SectionCards() {
  const { 
    positions, 
    contractInfo, 
    tokenBalance, 
    isLoading,
    formatTokenAmount 
  } = useStaking()

  // Calculate derived values
  const { 
    // totalStaked, 
    totalRewards, 
    currentStake, 
    maturityDate, 
    currentApr,
    allTotalStaked 
  } = useMemo(() => {
    // Total staked by user
    const totalStaked = positions.reduce(
      (acc, pos) => acc + parseFloat(pos.amount),
      0
    )

    // Total rewards by user
    const totalRewards = positions.reduce(
      (acc, pos) => acc + parseFloat(pos.reward),
      0
    )

    // Current stake (most recent position)
    const currentPosition = positions[0]
    const currentStake = currentPosition ? parseFloat(currentPosition.amount) : 0

    // Maturity date for current stake
    const maturityDate = currentPosition 
      ? new Date(currentPosition.endTime * 1000).toLocaleDateString()
      : 'N/A'

    // Calculate current APR based on contract info
    const currentApr = contractInfo 
      ? calculateCurrentAPR(contractInfo.initialApr, contractInfo.aprReductionPerThousand, contractInfo.totalStaked)
      : 0

    // Total staked across all users
    const allTotalStaked = contractInfo 
      ? formatTokenAmount(contractInfo.totalStaked)
      : '0'

    return {
      totalStaked,
      totalRewards,
      currentStake,
      maturityDate,
      currentApr,
      allTotalStaked
    }
  }, [positions, contractInfo, formatTokenAmount])

  // Helper function to calculate current APR
  function calculateCurrentAPR(initialApr: bigint, aprReduction: bigint, totalStaked: bigint): number {
    // Convert to numbers for calculation (assuming 18 decimals for APR)
    const initialAprNum = Number(formatUnits(initialApr, 18))
    const reductionNum = Number(formatUnits(aprReduction, 18))
    const totalStakedNum = Number(formatUnits(totalStaked, 18))
    
    // Calculate reduction based on total staked (per thousand tokens)
    const reductionAmount = Math.floor(totalStakedNum / 1000) * reductionNum
    const currentAprNum = Math.max(0, initialAprNum - reductionAmount)
    
    return Math.round(currentAprNum * 100) / 100 // Round to 2 decimal places
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="@container/card animate-pulse">
            <CardHeader>
              <CardDescription>Loading...</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                --
              </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <Badge variant="outline">--</Badge>
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
      
      {/* Total Staked by User */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Staked</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {allTotalStaked.toLocaleString()}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <Badge variant="outline" className="gap-1">
            <IconTrendingUp className="h-3 w-3" />
            Balance: {parseFloat(tokenBalance).toLocaleString()}
          </Badge>
        </CardFooter>
      </Card>

      {/* Current Active Stake */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Current Stake</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {currentStake.toLocaleString()}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <Badge variant="outline" className="gap-1">
            <IconTrendingDown className="h-3 w-3" />
            Unlocks: {maturityDate}
          </Badge>
        </CardFooter>
      </Card>

      {/* Current APR */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Current APR</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {currentApr}%
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <Badge variant="outline" className="gap-1">
            <IconTrendingUp className="h-3 w-3" />
            Initial APR: {contractInfo?.initialApr}%
          </Badge>
        </CardFooter>
      </Card>

      {/* Total Rewards */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Rewards</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalRewards.toLocaleString(undefined, { 
              minimumFractionDigits: 2, 
              maximumFractionDigits: 6 
            })}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <Badge variant="outline" className="gap-1">
            <IconTrendingUp className="h-3 w-3" />
            Claimable Now
          </Badge>
        </CardFooter>
      </Card>

      {/* Lock Duration */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Lock Duration</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {contractInfo 
              ? `${Math.ceil(Number(contractInfo.minLockDuration) / 86400)} days`
              : '--'
            }
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <Badge variant="outline" className="gap-1">
            <IconTrendingDown className="h-3 w-3" />
            Min Duration
          </Badge>
        </CardFooter>
      </Card>

      {/* Contract Status */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Contract Status</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {contractInfo?.isPaused ? 'Paused' : 'Active'}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <Badge 
            variant={contractInfo?.isPaused ? "destructive" : "default"}
            className="gap-1"
          >
            {contractInfo?.isPaused ? (
              <IconTrendingDown className="h-3 w-3" />
            ) : (
              <IconTrendingUp className="h-3 w-3" />
            )}
            {contractInfo?.isPaused ? 'Maintenance' : 'Operational'}
          </Badge>
        </CardFooter>
      </Card>

    </div>
  )
}