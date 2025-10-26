'use client'
import Header from '@/components/Header'
import React, { useState } from 'react';
import SettingsPage from './settings/page';
import DashboardPage from './dashboard/page';
import PortfolioPage from './portfolio/page';

export default function Page() {

    const [currentPage, setCurrentPage] = useState('dashboard');

    return (
        <div>
            <Header />
            <div className="min-h-screen bg-gray-950 text-white">
                {currentPage === 'dashboard' && <DashboardPage />}
                {currentPage === 'portfolio' && <PortfolioPage />}
                {currentPage === 'settings' && <SettingsPage />}
            </div>
        </div>
    )
}