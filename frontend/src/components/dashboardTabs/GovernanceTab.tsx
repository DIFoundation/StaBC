'use client'
import {useState} from 'react'
import { Plus, Check, X, Clock } from 'lucide-react';

export default function GovernanceTab() {

  const [selectedProposal, setSelectedProposal] = useState(null);
  
  const proposals = [
    { id: 1, title: 'Increase Staking Rewards by 2%', status: 'active', votes: { for: 45000, against: 12000 }, deadline: '3 days', description: 'Proposal to increase the base staking APY from 12.5% to 14.5% to attract more stakers.' },
    { id: 2, title: 'Reduce Bridge Fees to 0.1%', status: 'active', votes: { for: 38000, against: 8500 }, deadline: '5 days', description: 'Lower bridge fees to increase cross-chain liquidity and user adoption.' },
    { id: 3, title: 'Add Polygon Network Support', status: 'passed', votes: { for: 52000, against: 5000 }, deadline: 'Ended', description: 'Integrate Polygon network for faster and cheaper transactions.' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-white">Governance</h3>
          <p className="text-gray-400 mt-1">Vote on proposals to shape the future of StaBC</p>
        </div>
        <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Proposal
        </button>
      </div>

      {selectedProposal ? (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <button
            onClick={() => setSelectedProposal(null)}
            className="text-gray-400 hover:text-white mb-4 flex items-center gap-2"
          >
            ← Back to proposals
          </button>
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  selectedProposal.status === 'active' ? 'bg-green-500/20 text-green-500' : 'bg-blue-500/20 text-blue-500'
                }`}>
                  {selectedProposal.status}
                </span>
                <span className="text-gray-400 text-sm flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {selectedProposal.deadline}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">{selectedProposal.title}</h2>
              <p className="text-gray-300 leading-relaxed">{selectedProposal.description}</p>
            </div>

            <div className="bg-gray-900 rounded-lg p-4">
              <h4 className="text-white font-medium mb-4">Voting Results</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-green-500 flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      For
                    </span>
                    <span className="text-white font-medium">{selectedProposal.votes.for.toLocaleString()} votes</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${(selectedProposal.votes.for / (selectedProposal.votes.for + selectedProposal.votes.against)) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-red-500 flex items-center gap-2">
                      <X className="w-4 h-4" />
                      Against
                    </span>
                    <span className="text-white font-medium">{selectedProposal.votes.against.toLocaleString()} votes</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full"
                      style={{ width: `${(selectedProposal.votes.against / (selectedProposal.votes.for + selectedProposal.votes.against)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {selectedProposal.status === 'active' && (
              <div className="grid grid-cols-2 gap-4">
                <button className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                  <Check className="w-5 h-5" />
                  Vote For
                </button>
                <button className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
                  <X className="w-5 h-5" />
                  Vote Against
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {proposals.map((proposal) => (
            <button
              key={proposal.id}
              onClick={() => setSelectedProposal(proposal)}
              className="w-full bg-gray-800 rounded-xl p-5 border border-gray-700 hover:border-gray-600 transition-colors text-left"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      proposal.status === 'active' ? 'bg-green-500/20 text-green-500' :
                      proposal.status === 'passed' ? 'bg-blue-500/20 text-blue-500' :
                      'bg-red-500/20 text-red-500'
                    }`}>
                      {proposal.status}
                    </span>
                    <span className="text-gray-400 text-sm flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {proposal.deadline}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">{proposal.title}</h4>
                  <p className="text-gray-400 text-sm">{proposal.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-400">
                    {((proposal.votes.for / (proposal.votes.for + proposal.votes.against)) * 100).toFixed(1)}% For
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <X className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-gray-400">
                    {((proposal.votes.against / (proposal.votes.for + proposal.votes.against)) * 100).toFixed(1)}% Against
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
