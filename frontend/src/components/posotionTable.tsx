'use client';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { 
  IconClock, 
  IconCoins, 
  IconRefresh,
  IconLock,
  IconAlertCircle,
  IconCopy,
  IconCheck
} from '@tabler/icons-react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useStaking } from "@/hooks/useStaking"
import { Button } from "./ui/button"
import { Skeleton } from "./ui/skeleton"
import { Badge } from "./ui/badge"
import { Progress } from "./ui/progress"
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip"

const formatTimeRemaining = (endTime: number) => {
  const now = Math.floor(Date.now() / 1000);
  const remaining = endTime - now;
  
  if (remaining <= 0) return 'Unlocked';
  
  const days = Math.floor(remaining / 86400);
  const hours = Math.floor((remaining % 86400) / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);
  
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

const getProgressPercentage = (startTime: number, endTime: number) => {
  const now = Math.floor(Date.now() / 1000);
  const total = endTime - startTime;
  const elapsed = now - startTime;
  
  if (elapsed <= 0) return 0;
  if (elapsed >= total) return 100;
  
  return Math.round((elapsed / total) * 100);
};

function CopyableAddress({ address }: { address: string }) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={handleCopy}
            className="font-mono text-xs hover:text-primary transition-colors flex items-center gap-1"
          >
            {`${address.slice(0, 6)}...${address.slice(-4)}`}
            {copied ? (
              <IconCheck className="h-3 w-3 text-green-500" />
            ) : (
              <IconCopy className="h-3 w-3 opacity-50" />
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{copied ? 'Copied!' : 'Click to copy full address'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function StatusBadge({ status, canWithdraw }: { status: string; canWithdraw: boolean }) {
  const getStatusConfig = () => {
    if (status === 'Active' && canWithdraw) {
      return {
        variant: 'default' as const,
        icon: <IconLock className="h-3 w-3" />,
        text: 'Unlocked',
        className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      };
    }
    
    if (status === 'Active' || status === 'Pending') {
      return {
        variant: 'secondary' as const,
        icon: <IconLock className="h-3 w-3" />,
        text: 'Locked',
        className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      };
    }
    
    return {
      variant: 'outline' as const,
      icon: <IconAlertCircle className="h-3 w-3" />,
      text: status,
      className: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
    };
  };

  const config = getStatusConfig();

  return (
    <Badge variant={config.variant} className={`gap-1 ${config.className}`}>
      {config.icon}
      {config.text}
    </Badge>
  );
}

export function PositionTable() {
  const { address } = useAccount();
  
  const { 
    positions, 
    isLoading, 
    error, 
    refreshPositions,
    // claimRewards,
    // withdraw
  } = useStaking({
    onStaked: (position) => {
      console.log('New position staked:', position);
    },
    onWithdrawn: (positionId) => {
      console.log('Position withdrawn:', positionId);
      refreshPositions();
    },
    onRewardsClaimed: (amount) => {
      console.log('Rewards claimed:', amount);
      refreshPositions();
    },
    onError: (err) => {
      console.error('Staking error:', err);
    },
  });

  const [isRefreshing, setIsRefreshing] = useState(false);

  // Refresh positions when account changes
  useEffect(() => {
    if (address) {
      refreshPositions();
    }
  }, [address, refreshPositions]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshPositions();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  // const handleClaimRewards = async (positionId: string) => {
  //   try {
  //     await claimRewards();
  //   } catch (err) {
  //     console.error('Failed to claim rewards:', err);
  //   }
  // };

  // const handleWithdraw = async () => {
  //   try {
  //     await withdraw();
  //   } catch (err) {
  //     console.error('Failed to withdraw:', err);
  //   }
  // };

  if (isLoading) {
    return (
      <div className="rounded-md border mx-6">
        <div className="p-4">
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-4 w-1/7" />
                <Skeleton className="h-4 w-1/7" />
                <Skeleton className="h-4 w-1/7" />
                <Skeleton className="h-4 w-1/7" />
                <Skeleton className="h-4 w-1/7" />
                <Skeleton className="h-4 w-1/7" />
                <Skeleton className="h-8 w-1/7" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md border mx-6">
        <div className="text-center py-6">
          <IconAlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-500 mb-2">Error loading positions</p>
          <p className="text-sm text-muted-foreground mb-4">{error.message}</p>
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            {isRefreshing ? <IconRefresh className="h-4 w-4 animate-spin mr-2" /> : null}
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const totalStaked = positions.reduce((sum, pos) => sum + parseFloat(pos.amount), 0);
  const totalRewards = positions.reduce((sum, pos) => sum + parseFloat(pos.reward), 0);
  // const hasClaimableRewards = positions.some(pos => parseFloat(pos.reward) > 0);

  return (
    <div className="rounded-md border mx-6">
      <Table>
        <TableCaption>
          {positions.length === 0 ? (
            <div className="py-4 text-center">
              <IconCoins className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">No staking positions</p>
              <p className="text-muted-foreground">{address ? "Start staking to see your positions here" : "Connect wallet to see your positions"}</p>
            </div>
          ) : (
            <div className="flex justify-between items-center p-2">
              <div className="flex items-center gap-4">
                <span className="text-sm">
                  {positions.length} position{positions.length !== 1 ? 's' : ''}
                </span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="gap-1"
              >
                <IconRefresh className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          )}
        </TableCaption>

        {positions.length > 0 && (
          <>
            <TableHeader>
              <TableRow>
                <TableHead>Position</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount Staked</TableHead>
                <TableHead className="text-right">Rewards</TableHead>
                <TableHead>Lock Progress</TableHead>
                <TableHead>Unlock Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {positions.map((position) => {
                const progress = getProgressPercentage(position.startTime, position.endTime);
                const timeRemaining = formatTimeRemaining(position.endTime);
                const hasRewards = parseFloat(position.reward) > 0;
                
                return (
                  <TableRow key={position.id} className="group">
                    <TableCell>
                      <CopyableAddress address={position.id} />
                    </TableCell>
                    <TableCell>
                      <StatusBadge 
                        status={position.status} 
                        canWithdraw={position.canWithdraw} 
                      />
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      <div className="flex flex-col">
                        <span className="font-semibold">
                          {parseFloat(position.amount).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 6
                          })}
                        </span>
                        <span className="text-xs text-muted-foreground">tokens</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      <div className="flex flex-col">
                        <span className={`font-semibold ${hasRewards ? 'text-green-600' : ''}`}>
                          +{parseFloat(position.reward).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 6
                          })}
                        </span>
                        <span className="text-xs text-muted-foreground">rewards</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 min-w-[120px]">
                        <Progress value={progress} className="flex-1" />
                        <span className="text-xs text-muted-foreground w-8">
                          {progress}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <IconClock className="h-3 w-3 text-muted-foreground" />
                        <span className={progress === 100 ? 'text-green-600 font-medium' : ''}>
                          {timeRemaining}
                        </span>
                      </div>
                    </TableCell>
                    
                  </TableRow>
                );
              })}
            </TableBody>
            <TableFooter>
              <TableRow className="bg-muted/50">
                <TableCell colSpan={2} className="font-semibold">
                  <div className="flex items-center gap-2">
                    <IconCoins className="h-4 w-4" />
                    Totals
                  </div>
                </TableCell>
                <TableCell className="text-right font-mono font-semibold">
                  {totalStaked.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 6
                  })}
                </TableCell>
                <TableCell className="text-right font-mono font-semibold text-green-600">
                  +{totalRewards.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 6
                  })}
                </TableCell>
                <TableCell colSpan={2} className="text-right font-semibold">
                  Total Value: {(totalStaked + totalRewards).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 6
                  })}
                </TableCell>
              </TableRow>
            </TableFooter>
          </>
        )}
      </Table>
    </div>
  );
}
