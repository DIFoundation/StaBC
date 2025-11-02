'use client';
import React, { useState, useEffect } from 'react';
import { Coins, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AppKitButton, AppKitNetworkButton } from '@reown/appkit/react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  // Helper: check if a path is active (handles nested routes)
  const isActive = (path: string) => pathname.startsWith(path);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        isMenuOpen &&
        !target.closest('.mobile-menu') &&
        !target.closest('.hamburger-button')
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  const navItems = [
    { name: 'staking', path: '/staking', icon: '🔒' },
    { name: 'governance', path: '/governance', icon: '🗳️' },
    { name: 'bridge', path: '/bridge', icon: '🌉' },
    { name: 'portfolio', path: '/portfolio', icon: '📊' },
    { name: 'settings', path: '/settings', icon: '⚙️' },
  ];

  return (
    <header className="bg-gray-900 dark:border-gray-800 sticky top-0 z-50 transition-colors duration-300 backdrop-blur-sm bg-opacity-80 dark:bg-opacity-80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-1">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center justify-between">
            <Link href="/staking" className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Coins className="w-5 h-5 text-white" />
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
                StaBC
              </span>
            </Link>
          </div>
            {/* Desktop Navigation */}
            <nav className="hidden md:ml-10 md:flex md:space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`relative px-4 py-2 rounded-lg font-medium capitalize transition-all flex items-center gap-2 ${
                    isActive(item.path)
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  <span>{item.icon}</span>
                  {item.name}
                  {isActive(item.path) && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 rounded-t-lg" />
                  )}
                </Link>
              ))}
            </nav>

          {/* Right Controls */}
          <div className="flex items-center space-x-3">
            {/* Desktop Wallet Buttons */}
            <div className="hidden md:flex items-center space-x-2">
              <AppKitNetworkButton />
              <AppKitButton />
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none hamburger-button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Toggle main menu</span>
              {isMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={`md:hidden mobile-menu overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-900">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              className={`px-5 py-2 rounded-md text-base font-medium flex items-center gap-2 ${
                isActive(item.path)
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <span>{item.icon}</span>
              {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
            </Link>
          ))}

          {/* Mobile Wallet Controls */}
          <div className="pt-4 flex flex-col sm:flex-row gap-2 border-t border-gray-700 px-5 w-full">
            <AppKitNetworkButton className="w-full justify-center sm:w-auto" />
            <AppKitButton className="w-full justify-center sm:w-auto" />
          </div>
        </div>
      </div>
    </header>
  );
}
