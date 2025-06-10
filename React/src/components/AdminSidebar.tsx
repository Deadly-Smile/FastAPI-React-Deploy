// components/AdminSidebar.tsx
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

type Props = {
  open: boolean;
};

export default function AdminSidebar({ open }: Props) {
  return (
    <Sheet open={open}>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle className="text-lg font-semibold">Admin Panel</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-4">
          <a href="/admin/dashboard" className="block hover:text-primary">
            Dashboard
          </a>
          <a href="/admin/users" className="block hover:text-primary">
            Manage Users
          </a>
          <a href="/admin/settings" className="block hover:text-primary">
            Settings
          </a>
        </div>
      </SheetContent>
    </Sheet>
  );
}
