"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { IconInnerShadowTop } from "@tabler/icons-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { LayoutDashboard, Wallet, ReceiptIcon,  History, CircleDollarSign } from "lucide-react"
import Link from "next/link"

interface NavItem {
  href: string;
  icon: React.ReactNode;
  label: string;
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  const navItems: NavItem[] = [
    { href: '/', icon: <LayoutDashboard />, label: 'Dashboard' },
    { href: '/stake', icon: <Wallet />, label: 'Stake' },
    { href: '/unstake', icon: <ReceiptIcon />, label: 'Unstake' },
    { href: '/claim', icon: <CircleDollarSign />, label: 'Claim' },
    { href: '/txHistory', icon: <History />, label: 'History' },
  ];


  return (
    <Sidebar className="w-64 flex-shrink-0 bg-[var(--bg-secondary)] p-6" collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5 mb-10"
            >
              <Link href="/">
                <IconInnerShadowTop className="!size-5" />
                <h1 className="text-xl font-bold">Staking dApp</h1>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
      <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <Link
              key={item.label}
              className={`flex items-center gap-3 px-4 py-2 rounded-full transition-colors ${
                pathname === item.href
                  ? 'bg-[var(--active-bg)] text-[var(--text-primary)] font-semibold'
                  : 'hover:bg-[var(--active-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
              href={item.href}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </SidebarContent>
      <SidebarFooter>
        <span>Change Color Theme</span>
      </SidebarFooter>
    </Sidebar>
  )
}
