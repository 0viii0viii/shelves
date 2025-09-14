import { Link } from "@tanstack/react-router";
import { Home, Inbox, StickyNote } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { UserProfile } from "@/components/UserProfile";

// Menu items.
const items = [
  {
    title: "홈",
    url: "/",
    icon: Home,
  },
  {
    title: "할 일",
    url: "/todo",
    icon: Inbox,
  },
  {
    title: "메모",
    url: "/memo",
    icon: StickyNote,
  },
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="none">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <UserProfile
              userName="이상헌"
              userEmail="ffff00yllw@gmail.com"
              avatarSrc="https://github.com/shadcn.png"
            />
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-2">
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
