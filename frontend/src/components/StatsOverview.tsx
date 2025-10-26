'use client'
import React from 'react'
import { TrendingUp, Award, Check, Coins } from 'lucide-react';

function StatsOverview() {

    // Mock data
    const userAddress = '0x742d...4a9c';
    const walletBalance = 1250.5;
    const stakedAmount = 5000;
    const pendingRewards = 125.75;
    const currentAPY = 12.5;
    const tvl = 25000000;
    const totalStakers = 15420;
    const activeValidators = 127;

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[
                { label: 'Total Value Locked', value: `$${(tvl / 1000000).toFixed(1)}M`, icon: TrendingUp, color: 'blue' },
                { label: 'Current APY', value: `${currentAPY}%`, icon: Award, color: 'green' },
                { label: 'Active Validators', value: activeValidators, icon: Check, color: 'purple' },
                { label: 'Total Stakers', value: totalStakers.toLocaleString(), icon: Coins, color: 'orange' }
            ].map((stat, idx) => (
                <div key={idx} className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-gray-400 text-sm">{stat.label}</span>
                        <stat.icon className={`w-5 h-5 text-${stat.color}-500`} />
                    </div>
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                </div>
            ))}
        </div>
    )
}

export default StatsOverview