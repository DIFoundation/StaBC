'use client'
import React, { useEffect } from 'react'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/site-header'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useEvents } from "@/hooks/useEvents"
import Link from 'next/link'
import { Skeleton } from '@/components/ui/skeleton'

export default function TxHistory() {
    const { eventInfo, isLoading, fetchEvents } = useEvents();

    console.log('######eventInfo####### ', eventInfo)

    // Fetch events on component mount
    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    return (
        <div>
            <SidebarProvider
                style={{
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties}
            >
                <AppSidebar variant="inset" />
                <SidebarInset>
                    <SiteHeader />
                    <Card className="w-[calc(100%-var(--sidebar-width)/2)] mt-10 self-center">
                        <CardHeader>
                            <CardTitle className="text-3xl font-bold text-center">Transaction History</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                    <TableHead className='font-semibold'>Hash</TableHead>
                                        <TableHead className='font-semibold'>Users</TableHead>
                                        <TableHead className="text-right font-semibold">Amount</TableHead>
                                        <TableHead className='font-semibold'>Timestamp</TableHead>
                                        <TableHead className='font-semibold'>Action</TableHead>
                                        <TableHead className='text-right font-semibold'>Staked</TableHead>
                                    </TableRow>
                                </TableHeader>
                                {isLoading && <TableBody>
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-24 text-center">
                                            <Skeleton className="h-4 w-20" />
                                        </TableCell>
                                    </TableRow>
                                </TableBody>}
                                <TableBody>
                                    {
                                        eventInfo?.map(event => (
                                            <TableRow key={event.txHash}>
                                                <TableCell>
                                                    <Link href={`https://sepolia.etherscan.io/tx/${event.txHash }`} target="_blank" className='underline'>
                                                    {`${event.txHash.slice(0, 6)}...${event.txHash.slice(-4)}`}
                                                    </Link>
                                                    </TableCell>
                                                <TableCell>{`${event.user.slice(0, 6)}...${event.user.slice(-4)}`}</TableCell>
                                                <TableCell className="text-right">{(Number(event.amount)/1e18).toFixed(2)}</TableCell>
                                                <TableCell>{new Date(Number(event.timestamp)*1000).toLocaleString()}</TableCell>
                                                <TableCell>{event.type}</TableCell>
                                                <TableCell className='text-right'>{(Number(event.newTotalStaked)/1e18).toFixed(2)}</TableCell>
                                            </TableRow>
                                        ))
                                    }
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </SidebarInset>
            </SidebarProvider>
        </div>
    )
}
