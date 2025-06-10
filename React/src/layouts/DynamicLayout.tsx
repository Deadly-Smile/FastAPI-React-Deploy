import type React from "react";
import AuthenticatedLayout from "./AuthenticatedLayout";
import GuestLayout from "./GuestLayout";
import { useUser } from "../contexts/UserContext";

type Props = {
  children: React.ReactNode;
};

const DynamicLayout = ({ children }: Props) => {
  const { user } = useUser();
  if (user) {
    return <AuthenticatedLayout user={user}>{children}</AuthenticatedLayout>;
  }

  return <GuestLayout>{children}</GuestLayout>;
};

export default DynamicLayout;
