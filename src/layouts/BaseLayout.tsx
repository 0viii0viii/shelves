import React from "react";

import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function BaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col">
      {/* <DragWindowRegion /> */}
      <SidebarProvider>
        <AppSidebar />
        <main className="bg-background h-full w-full">{children}</main>
      </SidebarProvider>
    </div>
  );
}
