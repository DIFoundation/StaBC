'use client'
import React from 'react';
import BridgeTab from '@/components/dashboardTabs/BridgeTab'
import { ArrowLeftRight, Info } from 'lucide-react'

export default function BridgePage() {
  return (
    <div className="px-4 sm:px-6 lg:px-10 xl:px-20 2xl:px-40 py-8 min-h-screen bg-gray-950 text-white">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center">
            <ArrowLeftRight className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white">Bridge</h1>
            <p className="text-gray-400 mt-1">Bridge your tokens seamlessly across multiple chains</p>
          </div>
        </div>
        
        {/* Coming Soon Notice */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mt-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="text-blue-400 font-medium">Bridge Module - Coming Soon</p>
              <p className="text-gray-400 mt-1">
                The bridge functionality is currently under development. Once deployed, you&apos;ll be able to 
                transfer tokens between Base, Celo, and other supported networks with low fees and fast settlement.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bridge Interface */}
      <div className="mt-8">
        <BridgeTab />
      </div>
    </div>
  )
}

