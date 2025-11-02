'use client'
import React from 'react'
import { TrendingUp, Award, Clock, Coins, Users, Trophy } from 'lucide-react';
import { useToken } from '@/hooks/useStakingToken';
import { useStaking } from '@/hooks/useStakingContracts';
import { useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react'

function StatsOverview() {
    const { address } = useAppKitAccount();
    const { chainId } = useAppKitNetwork();

    // Get token data
    const {
        balanceFormatted,
        totalSupply,
    } = useToken({
        chainId: chainId?.valueOf() as number
    });

    // Get staking data
    const {
        currentRewardRateFormatted,
        totalStakedFormatted,
        totalRewardsFormatted,
        stakedAmountFormatted,
        pendingRewardsFormatted,
        timeUntilUnlockSeconds,
        isLoading
    } = useStaking({
        chainId: chainId?.valueOf() as number,
        watchEvents: true
    });

    // Parse and calculate values
    // currentRewardRateFormatted is now just the percentage number (e.g., "20" for 20%)
    const currentAPY = currentRewardRateFormatted
        ? Number(currentRewardRateFormatted).toFixed(2)
        : '0.00';

    const totalStaked = totalStakedFormatted
        ? Number(totalStakedFormatted)
        : 0;

    const tvl = totalStaked; // You can multiply by token price if available

    const totalRewardsDistributed = totalRewardsFormatted
        ? Number(totalRewardsFormatted)
        : 0;

    const userStaked = stakedAmountFormatted
        ? Number(stakedAmountFormatted)
        : 0;

    const userPendingRewards = pendingRewardsFormatted
        ? Number(pendingRewardsFormatted)
        : 0;

    const totalSupplyFormatted = totalSupply
        ? Number(totalSupply)
        : 0;

    const stakingRatio = totalSupplyFormatted > 0
        ? ((totalStaked / totalSupplyFormatted) * 100).toFixed(2)
        : '0.00';

    // Format time until unlock
    const formatTimeUntilUnlock = (seconds?: number) => {
        if (!seconds || seconds <= 0) return 'Unlocked';

        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const mins = Math.floor((seconds % 3600) / 60);

        if (days > 0) return `${days}d ${hours}h`;
        if (hours > 0) return `${hours}h ${mins}m`;
        return `${mins}m`;
    };

    // Format large numbers
    const formatNumber = (num: number) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(2)}K`;
        return num.toFixed(2);
    };

    const stats = [
        {
            label: 'Total Value Locked',
            value: formatNumber(tvl),
            icon: TrendingUp,
            color: 'blue',
            subtext: `${stakingRatio}% of supply`
        },
        {
            label: 'Current APY',
            value: `${currentAPY}%`,
            icon: Award,
            color: 'green',
            subtext: 'Annual rate'
        },
        {
            label: 'Total Rewards',
            value: formatNumber(totalRewardsDistributed),
            icon: Trophy,
            color: 'purple',
            subtext: 'Distributed'
        },
        {
            label: 'Your Stake',
            value: userStaked > 0 ? formatNumber(userStaked) : '-',
            icon: Coins,
            color: 'orange',
            subtext: userStaked > 0 ? formatTimeUntilUnlock(timeUntilUnlockSeconds) : 'Not staking'
        },
        {
            label: 'Pending Rewards',
            value: userPendingRewards > 0 ? formatNumber(userPendingRewards) : '-',
            icon: Clock,
            color: 'yellow',
            subtext: 'Claimable'
        },
        {
            label: 'Your Balance',
            value: balanceFormatted ? formatNumber(Number(balanceFormatted)) : '-',
            icon: Users,
            color: 'indigo',
            subtext: 'Available to stake'
        }
    ];

    // Filter stats based on user connection
    const displayStats = address
        ? stats
        : stats.slice(0, 3); // Show only first 3 stats if not connected

    return (
        <div className={`grid grid-cols-1 ${address ? 'md:grid-cols-3 lg:grid-cols-6' : 'md:grid-cols-3'} gap-4 mb-6`}>
            {isLoading ? (
                // Loading skeleton
                Array.from({ length: address ? 6 : 3 }).map((_, idx) => (
                    <div key={idx} className="bg-gray-800 rounded-xl p-5 border border-gray-700 animate-pulse">
                        <div className="h-4 bg-gray-700 rounded w-3/4 mb-3"></div>
                        <div className="h-8 bg-gray-700 rounded w-1/2"></div>
                    </div>
                ))
            ) : (
                displayStats.map((stat, idx) => (
                    <div key={idx} className="bg-gray-800 rounded-xl p-5 border border-gray-700 hover:border-gray-600 transition-all">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-gray-400 text-sm">{stat.label}</span>
                            <stat.icon className={`w-5 h-5 text-${stat.color}-500`} />
                        </div>
                        <div className="text-2xl font-bold text-white mb-1">
                            {stat.value}
                        </div>
                        <div className="text-xs text-gray-500">
                            {stat.subtext}
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}

export default StatsOverview