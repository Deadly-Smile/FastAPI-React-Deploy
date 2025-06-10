import BasicLinksForNav from "@/components/BasicLinksForNav";
import Navbar from "@/components/Navbar";
import type React from "react";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Props = {
  children: React.ReactNode;
  user: {
    id: number;
    username: string;
    email: string;
    is_active: boolean;
  };
};

const AuthenticatedLayout = ({ user, children }: Props) => {
  const leftside = <BasicLinksForNav />;
  const rightside = (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Input type={"text"} placeholder={"Search.."} />
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Button variant={"ghost"} className="mx-2">
            {user?.username}
          </Button>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
  return (
    <div>
      <Navbar leftside={leftside} rightside={rightside} />
      {children}
    </div>
  );
};

export default AuthenticatedLayout;
