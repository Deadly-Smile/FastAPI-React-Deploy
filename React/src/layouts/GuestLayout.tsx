import type React from "react";
import Navbar from "../components/Navbar";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import BasicLinksForNav from "@/components/BasicLinksForNav";

type props = {
  children: React.ReactNode;
};
const GuestLayout = ({ children }: props) => {
  const rightside = (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Input type={"text"} placeholder={"Search.."} />
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link to={"/login"}>Login</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link to={"/register"}>Register</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
  const leftside = <BasicLinksForNav />;
  return (
    <>
      <Navbar leftside={leftside} rightside={rightside} />
      {children}
    </>
  );
};

export default GuestLayout;
