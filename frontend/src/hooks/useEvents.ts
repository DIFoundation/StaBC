import { parseAbiItem } from 'viem'
import { publicClient } from '@/config/chain';
import { CONTRACT_ADDRESS, TransactionHistory } from "./types";
import { useCallback, useState } from 'react';


export function useEvents() {
  // const publicClient = usePublicClient();

  const [eventInfo, setEventsInfo] = useState<TransactionHistory>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchEvents = useCallback(async () => {
    if (!publicClient) {
      setError(new Error('Public client not available'));
      return;
    }

    setIsLoading(true);
    setError(null);

    const fromBlock = 9163648n; // from contract creation
    const toBlock = 'latest';

    console.log('-----------fromBlock', fromBlock);
    console.log('-----------toBlock', toBlock);

    try {
      const stakedLogs = await publicClient.getLogs({
        address: CONTRACT_ADDRESS,
        event: parseAbiItem('event Staked(address indexed user, uint256 amount, uint256 timestamp, uint256 newTotalStaked, uint256 currentRewardRate)'),
        fromBlock: fromBlock,
        toBlock: toBlock
      });
      const [
        withdrawnLogs,
        emergencyWithdrawnLogs,
        rewardsClaimedLogs
      ] = await Promise.all([
        publicClient.getLogs({
          address: CONTRACT_ADDRESS,
          event: parseAbiItem('event Withdrawn(address indexed user, uint256 amount, uint256 timestamp, uint256 newTotalStaked, uint256 currentRewardRate, uint256 rewardsAccrued)'),
          fromBlock: fromBlock,
          toBlock: toBlock
        }),
        publicClient.getLogs({
          address: CONTRACT_ADDRESS,
          event: parseAbiItem('event EmergencyWithdrawn(address indexed user, uint256 amount, uint256 penalty, uint256 timestamp, uint256 newTotalStaked)'),
          fromBlock: fromBlock,
          toBlock: toBlock
        }),
        publicClient.getLogs({
          address: CONTRACT_ADDRESS,
          event: parseAbiItem('event RewardsClaimed(address indexed user, uint256 amount, uint256 timestamp, uint256 newPendingRewards, uint256 totalStaked)'),
          fromBlock: fromBlock,
          toBlock: toBlock
        })
      ]);
      
      const currentBlock = await publicClient.getBlockNumber();
      console.log('Fetched logs:', {
        stakedLogs: stakedLogs.length,
        withdrawnLogs: withdrawnLogs.length,
        emergencyWithdrawnLogs: emergencyWithdrawnLogs.length,
        rewardsClaimedLogs: rewardsClaimedLogs.length,
        currentChain: publicClient.chain,
        contractAddress: CONTRACT_ADDRESS,
        currentBlock
      });

      const allEvents = [
        ...stakedLogs.map((log, index) => {
          console.log(`Processing Staked log ${index}:`, log);
          return {
            txHash: log.transactionHash,
            user: log.args?.user,
            timestamp: Number(log.args?.timestamp || 0),
            blockNumber: log.blockNumber,
            type: 'Staked' as const,
            amount: log.args?.amount,
            newTotalStaked: log.args?.newTotalStaked,
            currentRewardRate: log.args?.currentRewardRate
          };
        }),
        ...withdrawnLogs.map((log, index) => {
          console.log(`Processing Withdrawn log ${index}:`, log);
          return {
            txHash: log.transactionHash,
            user: log.args?.user,
            timestamp: Number(log.args?.timestamp || 0),
            blockNumber: log.blockNumber,
            type: 'Withdrawn' as const,
            amount: log.args?.amount,
            newTotalStaked: log.args?.newTotalStaked,
            currentRewardRate: log.args?.currentRewardRate,
            rewardsAccrued: log.args?.rewardsAccrued
          };
        }),
        ...emergencyWithdrawnLogs.map((log, index) => {
          console.log(`Processing EmergencyWithdrawn log ${index}:`, log);
          return {
            txHash: log.transactionHash,
            user: log.args?.user,
            timestamp: Number(log.args?.timestamp || 0),
            blockNumber: log.blockNumber,
            type: 'EmergencyWithdrawn' as const,
            amount: log.args?.amount,
            penalty: log.args?.penalty,
            newTotalStaked: log.args?.newTotalStaked
          };
        }),
        ...rewardsClaimedLogs.map((log, index) => {
          console.log(`Processing RewardsClaimed log ${index}:`, log);
          return {
            txHash: log.transactionHash,
            user: log.args?.user,
            timestamp: Number(log.args?.timestamp || 0),
            blockNumber: log.blockNumber,
            type: 'RewardsClaimed' as const,
            amount: log.args?.amount,
            newPendingRewards: log.args?.newPendingRewards,
            totalStaked: log.args?.totalStaked
          };
        })
      ];

      console.log('All processed events:', allEvents);

      // Sort by timestamp (most recent first)
      const sortedEvents = allEvents.sort((a, b) => b.timestamp - a.timestamp);
      
      // Take only the last 100 events
      const last100Events = sortedEvents.slice(0, 100);
      
      const validEvents = last100Events.map(event => ({
        ...event,
        user: event.user || 'unknown' // or any other default value that makes sense
      }));

      console.log('Last 100 events:', validEvents);
      setEventsInfo(validEvents); 
    } catch (err) {
      console.error('Error fetching events:', err);
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    eventInfo,
    error,
    isLoading,
    fetchEvents,
    watchEvent: () => {}, // Simplified for debugging
  };
}