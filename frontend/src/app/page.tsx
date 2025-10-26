'use client'
import Header from '@/components/Header'
import React, { useState } from 'react';
import { Wallet, TrendingUp, Vote, ArrowLeftRight, Coins, History, Settings, ChevronDown, Copy, ExternalLink, Lock, Unlock, Clock, Award, Info, Plus, Check, X, Search, Filter, Download, Moon, Sun, Globe } from 'lucide-react';

export default function Page() {

    const [currentPage, setCurrentPage] = useState('dashboard');
    const [activeTab, setActiveTab] = useState('staking');
    const [walletConnected, setWalletConnected] = useState(true);
    const [selectedProposal, setSelectedProposal] = useState(null);
    const [stakeAmount, setStakeAmount] = useState('');
    const [unstakeAmount, setUnstakeAmount] = useState('');
    const [bridgeAmount, setBridgeAmount] = useState('');
    const [sourceChain, setSourceChain] = useState('ethereum');
    const [destChain, setDestChain] = useState('base');
    const [theme, setTheme] = useState('dark');

    // Mock data
    const userAddress = '0x742d...4a9c';
    const walletBalance = 1250.5;
    const stakedAmount = 5000;
    const pendingRewards = 125.75;
    const currentAPY = 12.5;
    const tvl = 25000000;
    const totalStakers = 15420;
    const activeValidators = 127;

    const stakingPositions = [
        { id: 1, amount: 3000, rewards: 85.5, duration: '30 days', unlockDate: '2025-11-25', apy: 12.5 },
        { id: 2, amount: 2000, rewards: 40.25, duration: '90 days', unlockDate: '2026-01-23', apy: 15.2 }
    ];

    const proposals = [
        { id: 1, title: 'Increase Staking Rewards by 2%', status: 'active', votes: { for: 45000, against: 12000 }, deadline: '3 days', description: 'Proposal to increase the base staking APY from 12.5% to 14.5% to attract more stakers.' },
        { id: 2, title: 'Reduce Bridge Fees to 0.1%', status: 'active', votes: { for: 38000, against: 8500 }, deadline: '5 days', description: 'Lower bridge fees to increase cross-chain liquidity and user adoption.' },
        { id: 3, title: 'Add Polygon Network Support', status: 'passed', votes: { for: 52000, against: 5000 }, deadline: 'Ended', description: 'Integrate Polygon network for faster and cheaper transactions.' }
    ];

    const bridgeHistory = [
        { id: 1, from: 'Ethereum', to: 'Base', amount: 500, token: 'STABC', status: 'completed', date: '2025-10-25' },
        { id: 2, from: 'Base', to: 'Arbitrum', amount: 250, token: 'STABC', status: 'pending', date: '2025-10-26' }
    ];

    const transactions = [
        { id: 1, type: 'Stake', amount: 1000, hash: '0xabc...123', date: '2025-10-24', status: 'confirmed' },
        { id: 2, type: 'Claim', amount: 25.5, hash: '0xdef...456', date: '2025-10-23', status: 'confirmed' },
        { id: 3, type: 'Bridge', amount: 500, hash: '0xghi...789', date: '2025-10-22', status: 'confirmed' },
        { id: 4, type: 'Unstake', amount: 500, hash: '0xjkl...012', date: '2025-10-21', status: 'confirmed' }
    ];

    const chains = [
        { id: 'ethereum', name: 'Ethereum', icon: '⟠' },
        { id: 'base', name: 'Base', icon: '🔵' },
        { id: 'arbitrum', name: 'Arbitrum', icon: '🔷' },
        { id: 'optimism', name: 'Optimism', icon: '🔴' }
    ];

    return (
        <div>
            <Header />

            <div className="min-h-screen bg-gray-950 text-white">
                <Header />
                {currentPage === 'dashboard' && <DashboardPage />}
                {currentPage === 'portfolio' && <PortfolioPage />}
                {currentPage === 'settings' && <SettingsPage />}
            </div>


        </div>
    )
}