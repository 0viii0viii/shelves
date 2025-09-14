import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

function BaseLayout({ children }: { children: React.ReactNode }) {
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

const RootLayout = () => (
  <>
    <BaseLayout>
      <Outlet />
    </BaseLayout>
    <TanStackRouterDevtools />
  </>
);

export const Route = createRootRoute({ component: RootLayout });
