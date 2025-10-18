'use client'
import { AppSidebar } from "@/components/app-sidebar"
import { PositionTable } from "@/components/posotionTable"
// import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { TableCaption } from "@/components/ui/table"
import { useRouter } from "next/navigation"
export default function Page() {

  const router = useRouter()
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <div className="px-4 lg:px-6">
                {/* <ChartAreaInteractive /> */}
              </div>
              {/* <DataTable data={data} /> */}
              <PositionTable />
              <TableCaption>Check <button onClick={() => {router.push('/txHistory')}} className="underline cursor-pointer">History</button> to see all activities on the dApp</TableCaption>

            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
