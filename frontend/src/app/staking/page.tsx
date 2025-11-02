'use client'
import React from 'react';
import StatsOverview from '@/components/StatsOverview'
import { GlobalStakingStats } from '@/components/GlobalStakingStats';
import StakingTab from '@/components/dashboardTabs/StakingTab'
import { Lock } from 'lucide-react'

export default function StakingPage() {
  return (
    <div className="px-4 sm:px-6 lg:px-10 xl:px-20 2xl:px-40 py-8 min-h-screen bg-gray-950 text-white">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Staking</h1>
            <p className="text-gray-400 mt-1">Stake your tokens and earn rewards with flexible lock periods</p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <StatsOverview />
      
      {/* Global Staking Stats */}
      <div className="mt-8">
        <GlobalStakingStats />
      </div>

      {/* Main Staking Interface */}
      <div className="mt-8">
        <StakingTab />
      </div>
    </div>
  )
}
