import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { NavItem } from "~/lib/navigation";
import { ChevronRightIcon, MenuIcon } from "lucide-react";

interface MainNavProps {
  navigation: NavItem[];
}

function isLinkActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function isSectionActive(pathname: string, item: NavItem) {
  if (item.href) return isLinkActive(pathname, item.href);
  return item.children?.some(
    (child) => child.href && isLinkActive(pathname, child.href),
  );
}

function DesktopNav({ navigation, pathname }: { navigation: NavItem[]; pathname: string }) {
  return (
    <NavigationMenu
      viewport={false}
      className="z-50 hidden max-w-none flex-1 justify-end lg:flex"
    >
      <NavigationMenuList className="flex-wrap justify-end gap-0.5">
        {navigation.map((item) => {
          if (item.href) {
            return (
              <NavigationMenuItem key={item.label}>
                <NavigationMenuLink
                  asChild
                  active={isLinkActive(pathname, item.href)}
                  className={cn(navigationMenuTriggerStyle())}
                >
                  <Link to={item.href}>{item.label}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            );
          }

          const sectionActive = isSectionActive(pathname, item);

          return (
            <NavigationMenuItem key={item.label}>
              <NavigationMenuTrigger
                className={cn(sectionActive && "text-primary")}
              >
                {item.label}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[168px] gap-1 p-2">
                  {item.children?.map((child) => (
                    <li key={child.href}>
                      <NavigationMenuLink
                        asChild
                        active={
                          child.href
                            ? isLinkActive(pathname, child.href)
                            : false
                        }
                      >
                        <Link to={child.href!}>{child.label}</Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function MobileSidebarNav({
  navigation,
  pathname,
  onNavigate,
}: {
  navigation: NavItem[];
  pathname: string;
  onNavigate: () => void;
}) {
  return (
    <>
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
        <p className="text-base font-semibold text-sidebar-foreground">사이트 메뉴</p>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="px-2 py-3">
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => {
                if (item.href) {
                  const active = isLinkActive(pathname, item.href);
                  return (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton asChild isActive={active} size="lg">
                        <Link to={item.href} onClick={onNavigate}>
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                }

                const sectionActive = isSectionActive(pathname, item);

                return (
                  <Collapsible
                    key={item.label}
                    defaultOpen={sectionActive}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton size="lg">
                          <span>{item.label}</span>
                          <ChevronRightIcon className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.children?.map((child) => {
                            if (!child.href) return null;
                            const active = isLinkActive(pathname, child.href);
                            return (
                              <SidebarMenuSubItem key={child.href}>
                                <SidebarMenuSubButton asChild isActive={active}>
                                  <Link to={child.href} onClick={onNavigate}>
                                    <span>{child.label}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            );
                          })}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </>
  );
}

export function MainNav({ navigation }: MainNavProps) {
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (navigation.length === 0) return null;

  return (
    <SidebarProvider className="contents !min-h-0 w-auto">
      <div className="ml-auto flex items-center gap-2">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="lg:hidden"
              aria-label="메뉴 열기"
            >
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-[min(18rem,85vw)] gap-0 border-sidebar-border bg-sidebar p-0 text-sidebar-foreground"
          >
            <SheetHeader className="sr-only">
              <SheetTitle>사이트 메뉴</SheetTitle>
            </SheetHeader>
            <MobileSidebarNav
              navigation={navigation}
              pathname={pathname}
              onNavigate={() => setMobileOpen(false)}
            />
          </SheetContent>
        </Sheet>
        <DesktopNav navigation={navigation} pathname={pathname} />
      </div>
    </SidebarProvider>
  );
}
