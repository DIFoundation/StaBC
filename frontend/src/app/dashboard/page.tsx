
'use client'
import { useState } from 'react'
import StatsOverview from '@/components/StatsOverview'
import { ArrowLeftRight, Lock, Vote } from 'lucide-react'
import StakingTab from '@/components/dashboardTabs/StakingTab'
import GovernanceTab from '@/components/dashboardTabs/GovernanceTab'
import BridgeTab from '@/components/dashboardTabs/BridgeTab'

export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState('staking');
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <StatsOverview />
      
      {/* Tabs */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="flex border-b border-gray-700">
          {[
            { id: 'staking', label: 'Staking', icon: Lock },
            { id: 'governance', label: 'Governance', icon: Vote },
            { id: 'bridge', label: 'Bridge', icon: ArrowLeftRight }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-6 py-4 font-medium flex items-center justify-center gap-2 transition-colors ${
                activeTab === tab.id
                  ? 'bg-gray-700 text-white border-b-2 border-blue-500'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>
        <div className="p-6">
          {activeTab === 'staking' && <StakingTab />}
          {activeTab === 'governance' && <GovernanceTab />}
          {activeTab === 'bridge' && <BridgeTab />}
        </div>
      </div>
    </div>
  )
}

