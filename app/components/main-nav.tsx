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
import { cn } from "@/lib/utils";
import type { NavItem } from "~/lib/navigation";

interface MainNavProps {
  navigation: NavItem[];
}

function isLinkActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MainNav({ navigation }: MainNavProps) {
  const { pathname } = useLocation();

  return (
    <NavigationMenu
      viewport={false}
      className="z-50 ml-auto max-w-none flex-1 justify-end"
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

          const isSectionActive = item.children?.some(
            (child) => child.href && isLinkActive(pathname, child.href),
          );

          return (
            <NavigationMenuItem key={item.label}>
              <NavigationMenuTrigger
                className={cn(isSectionActive && "text-primary")}
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
