'use client'
import { useState } from 'react'
import { Plus, Check, X, Clock, AlertCircle, Vote } from 'lucide-react';
import { useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react'
import { useToken } from '@/hooks/useStakingToken';
import { useStaking } from '@/hooks/useStakingContracts';

export default function GovernanceTab() {
  const { isConnected } = useAppKitAccount();
  const { chainId } = useAppKitNetwork();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedProposal, setSelectedProposal] = useState<any>(null);
  
  // Token hook
  const { 
    symbol,
    // balanceFormatted 
  } = useToken({
    chainId: chainId?.valueOf() as number
  });

  // Staking hook for voting power
  const { 
    stakedAmountFormatted,
    totalStakedFormatted,
    isLoading
  } = useStaking({
    chainId: chainId?.valueOf() as number
  });

  const tokenSymbol = symbol || 'STABC';
  const votingPower = Number(stakedAmountFormatted || '0');
  const totalStaked = Number(totalStakedFormatted || '0');
  const votingPowerPercentage = totalStaked > 0 ? (votingPower / totalStaked * 100).toFixed(4) : '0';

  // Mock proposals data - to be replaced with real governance contract
  const proposals = [
    { 
      id: 1, 
      title: 'Increase Staking Rewards by 2%', 
      status: 'active', 
      votes: { for: 45000, against: 12000 }, 
      deadline: '3 days', 
      description: 'Proposal to increase the base staking APY from 12.5% to 14.5% to attract more stakers and improve protocol competitiveness.',
      proposer: '0x1234...5678',
      createdAt: '2025-10-25'
    },
    { 
      id: 2, 
      title: 'Reduce Bridge Fees to 0.1%', 
      status: 'active', 
      votes: { for: 38000, against: 8500 }, 
      deadline: '5 days', 
      description: 'Lower bridge fees from 0.3% to 0.1% to increase cross-chain liquidity and improve user adoption across multiple networks.',
      proposer: '0xabcd...efgh',
      createdAt: '2025-10-23'
    },
    { 
      id: 3, 
      title: 'Add Polygon Network Support', 
      status: 'passed', 
      votes: { for: 52000, against: 5000 }, 
      deadline: 'Ended', 
      description: 'Integrate Polygon network for faster and cheaper transactions, expanding the protocol reach and user base.',
      proposer: '0x9876...5432',
      createdAt: '2025-10-20'
    }
  ]; 

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleProposalClick = (proposal: any) => {
    setSelectedProposal(proposal);
  };

  const handleVote = (support: boolean) => {
    if (!isConnected) {
      alert('Please connect your wallet to vote');
      return;
    }
    if (votingPower <= 0) {
      alert('You need staked tokens to vote. Please stake tokens first.');
      return;
    }
    
    // TODO: Implement actual voting logic with governance contract
    alert(`Voting feature coming soon! You would vote ${support ? 'FOR' : 'AGAINST'} with ${votingPower.toFixed(4)} ${tokenSymbol} voting power.`);
  };

  const handleCreateProposal = () => {
    if (!isConnected) {
      alert('Please connect your wallet to create a proposal');
      return;
    }
    if (votingPower <= 0) {
      alert('You need staked tokens to create proposals');
      return;
    }
    
    // TODO: Implement proposal creation
    alert('Proposal creation coming soon!');
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-400">Loading governance data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Governance Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="text-2xl font-bold text-white">Governance</h3>
          <p className="text-gray-400 mt-1">Vote on proposals to shape the future of StaBC</p>
        </div>
        <button 
          onClick={handleCreateProposal}
          disabled={!isConnected || votingPower <= 0}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
          Create Proposal
        </button>
      </div>

      {/* Voting Power Card */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Vote className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <div className="text-sm text-gray-400">Your Voting Power</div>
              <div className="text-2xl font-bold text-white">
                {votingPower.toFixed(4)} {tokenSymbol}
              </div>
              <div className="text-xs text-gray-500">
                {votingPowerPercentage}% of total staked
              </div>
            </div>
          </div>
          {votingPower <= 0 && isConnected && (
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3 flex items-start gap-2 flex-1 max-w-md">
              <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="text-orange-500 font-medium">No voting power</p>
                <p className="text-gray-400 text-xs mt-1">Stake tokens to participate in governance</p>
              </div>
            </div>
          )}
          {!isConnected && (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 flex items-start gap-2 flex-1 max-w-md">
              <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="text-blue-500 font-medium">Connect wallet</p>
                <p className="text-gray-400 text-xs mt-1">Connect your wallet to view voting power</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Governance Notice */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="text-blue-400 font-medium">Governance Module - Coming Soon</p>
            <p className="text-gray-400 mt-1">
              The governance system is currently under development. Proposals shown below are examples. 
              Once deployed, you&apos;ll be able to create proposals, vote, and participate in protocol decisions using your staked tokens.
            </p>
          </div>
        </div>
      </div>

      {/* Proposal Detail View */}
      {selectedProposal ? (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <button
            onClick={() => setSelectedProposal(null)}
            className="text-gray-400 hover:text-white mb-4 flex items-center gap-2 transition-colors"
          >
            ← Back to proposals
          </button>
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  selectedProposal.status === 'active' ? 'bg-green-500/20 text-green-500' : 
                  selectedProposal.status === 'passed' ? 'bg-blue-500/20 text-blue-500' :
                  'bg-red-500/20 text-red-500'
                }`}>
                  {selectedProposal.status}
                </span>
                <span className="text-gray-400 text-sm flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {selectedProposal.deadline}
                </span>
                <span className="text-gray-400 text-sm">
                  Created: {selectedProposal.createdAt}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">{selectedProposal.title}</h2>
              <p className="text-gray-300 leading-relaxed mb-4">{selectedProposal.description}</p>
              <div className="text-sm text-gray-400">
                Proposer: <code className="text-gray-300">{selectedProposal.proposer}</code>
              </div>
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
                    <span className="text-white font-medium">
                      {selectedProposal.votes.for.toLocaleString()} votes 
                      <span className="text-gray-400 text-sm ml-2">
                        ({((selectedProposal.votes.for / (selectedProposal.votes.for + selectedProposal.votes.against)) * 100).toFixed(1)}%)
                      </span>
                    </span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all"
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
                    <span className="text-white font-medium">
                      {selectedProposal.votes.against.toLocaleString()} votes
                      <span className="text-gray-400 text-sm ml-2">
                        ({((selectedProposal.votes.against / (selectedProposal.votes.for + selectedProposal.votes.against)) * 100).toFixed(1)}%)
                      </span>
                    </span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full transition-all"
                      style={{ width: `${(selectedProposal.votes.against / (selectedProposal.votes.for + selectedProposal.votes.against)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-800 text-sm text-gray-400">
                Total votes: {(selectedProposal.votes.for + selectedProposal.votes.against).toLocaleString()} {tokenSymbol}
              </div>
            </div>

            {/* Voting Power Info */}
            <div className="bg-gray-900 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-400">Your Voting Power</div>
                  <div className="text-lg font-bold text-white">{votingPower.toFixed(4)} {tokenSymbol}</div>
                </div>
                {votingPower <= 0 && (
                  <span className="text-xs text-orange-500 bg-orange-500/10 px-3 py-1 rounded-full">
                    Stake tokens to vote
                  </span>
                )}
              </div>
            </div>

            {selectedProposal.status === 'active' && (
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => handleVote(true)}
                  disabled={!isConnected || votingPower <= 0}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Check className="w-5 h-5" />
                  Vote For
                </button>
                <button 
                  onClick={() => handleVote(false)}
                  disabled={!isConnected || votingPower <= 0}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X className="w-5 h-5" />
                  Vote Against
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Proposals List */
        <div className="space-y-3">
          {proposals.map((proposal) => (
            <button
              key={proposal.id}
              onClick={() => handleProposalClick(proposal)}
              className="w-full bg-gray-800 rounded-xl p-5 border border-gray-700 hover:border-gray-600 transition-colors text-left"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
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
                  <p className="text-gray-400 text-sm line-clamp-2">{proposal.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-6 flex-wrap">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-400">
                    {((proposal.votes.for / (proposal.votes.for + proposal.votes.against)) * 100).toFixed(1)}% For
                  </span>
                  <span className="text-xs text-gray-500">
                    ({proposal.votes.for.toLocaleString()})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <X className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-gray-400">
                    {((proposal.votes.against / (proposal.votes.for + proposal.votes.against)) * 100).toFixed(1)}% Against
                  </span>
                  <span className="text-xs text-gray-500">
                    ({proposal.votes.against.toLocaleString()})
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