'use client'
import React from 'react';
import Link from 'next/link'
import { Lock, Vote, ArrowLeftRight, TrendingUp, Coins, ArrowRight } from 'lucide-react'
import StatsOverview from '@/components/StatsOverview'

export default function DashboardPage() {
  return (
    <div className="px-4 sm:px-6 lg:px-10 xl:px-20 2xl:px-40 py-8 min-h-screen bg-gray-950 text-white">
      {/* Hero Section */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Welcome to <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">StaBC</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl">
          Your all-in-one DeFi platform for staking, governance, and cross-chain bridging
        </p>
      </div>

      {/* Stats Overview */}
      <StatsOverview />

      {/* Product Cards */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-white mb-6">Explore Our Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Staking Card */}
          <Link href="/staking" className="group">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-all h-full">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Staking</h3>
              <p className="text-gray-400 mb-4">
                Stake your tokens and earn competitive rewards with flexible lock periods and automatic compounding.
              </p>
              <div className="flex items-center text-blue-500 group-hover:text-blue-400 transition-colors">
                <span className="font-medium">Start Staking</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Governance Card */}
          <Link href="/governance" className="group">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-purple-500 transition-all h-full opacity-75">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mb-4">
                <Vote className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-bold text-white">Governance</h3>
                <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full">Coming Soon</span>
              </div>
              <p className="text-gray-400 mb-4">
                Participate in protocol governance, vote on proposals, and shape the future of StaBC using your staked tokens.
              </p>
              <div className="flex items-center text-purple-500 group-hover:text-purple-400 transition-colors">
                <span className="font-medium">Learn More</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Bridge Card */}
          <Link href="/bridge" className="group">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-green-500 transition-all h-full opacity-75">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center mb-4">
                <ArrowLeftRight className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-bold text-white">Bridge</h3>
                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">Coming Soon</span>
              </div>
              <p className="text-gray-400 mb-4">
                Bridge tokens seamlessly across Base, Celo, and other supported networks with low fees and fast settlement.
              </p>
              <div className="flex items-center text-green-500 group-hover:text-green-400 transition-colors">
                <span className="font-medium">Learn More</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Quick Stats Section */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <span className="text-gray-400 text-sm">Total Value Locked</span>
          </div>
          <p className="text-2xl font-bold text-white">-</p>
          <p className="text-xs text-gray-500 mt-1">Across all products</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <Coins className="w-5 h-5 text-blue-500" />
            <span className="text-gray-400 text-sm">Active Stakers</span>
          </div>
          <p className="text-2xl font-bold text-white">-</p>
          <p className="text-xs text-gray-500 mt-1">Staking tokens</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <Lock className="w-5 h-5 text-purple-500" />
            <span className="text-gray-400 text-sm">Supported Chains</span>
          </div>
          <p className="text-2xl font-bold text-white">2</p>
          <p className="text-xs text-gray-500 mt-1">Base & Celo</p>
        </div>
      </div>
    </div>
  )
}

