import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  // {
  //   title: "Home",
  //   url: "/",
  //   icon: Home,
  // },
  // {
  //   title: "Retrieve Data",
  //   url: "/retrieve-data",
  //   icon: Inbox,
  // },
  {
    title: "Template JSON",
    url: "/template-json",
    icon: Calendar,
  }
];

export function AppSidebar() {
  return (
    <Sidebar className="py-4 px-2">
      <SidebarHeader>
        <h1>Dynamic UI</h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="list-none">
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <a href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
