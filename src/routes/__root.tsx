import {
  createRootRouteWithContext,
  Outlet,
  useLocation,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import { useSupabaseAuth } from "@/auth/supabase";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";

function BaseLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col">
      <SidebarProvider>
        <AppSidebar />
        <main className="bg-background h-full w-full">{children}</main>
      </SidebarProvider>
    </div>
  );
}

const RootLayout = () => {
  const location = useLocation();

  if (location.pathname === "/sign-in" || location.pathname === "/sign-up") {
    return (
      <>
        <Outlet />
        <TanStackRouterDevtools />
        <Toaster position="top-right" />
      </>
    );
  }

  return (
    <>
      <BaseLayout>
        <Outlet />
      </BaseLayout>
      <TanStackRouterDevtools />
      <Toaster position="top-right" />
    </>
  );
};

type RouterContext = {
  auth: ReturnType<typeof useSupabaseAuth>;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
});
