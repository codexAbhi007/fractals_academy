"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Video,
  BookOpen,
  HelpCircle,
  ChartLine,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { signOut } from "@/lib/auth-client";

interface StudentSidebarProps {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  };
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  {
    title: "Overview",
    value: "overview",
    icon: LayoutDashboard,
  },
  {
    title: "Videos",
    value: "videos",
    icon: Video,
  },
  {
    title: "Questions",
    value: "questions",
    icon: BookOpen,
  },
  {
    title: "Doubts",
    value: "doubts",
    icon: HelpCircle,
  },
  {
    title: "Progress",
    value: "progress",
    icon: ChartLine,
  },
  {
    title: "Settings",
    value: "settings",
    icon: Settings,
  },
];

export function StudentSidebar({
  user,
  activeTab,
  onTabChange,
}: StudentSidebarProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
      router.push("/login");
      router.refresh();
    } catch {
      toast.error("Failed to sign out");
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleNavClick = (value: string) => {
    onTabChange(value);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden bg-background/80 backdrop-blur-sm border border-white/10"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed md:static inset-y-0 left-0 z-50 w-64 border-r border-white/10 bg-background/95 backdrop-blur flex flex-col transition-transform duration-300 md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Logo */}
        <div className="p-4 border-b border-white/10">
          <Link href="/?home" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Fractals Academy"
              width={36}
              height={36}
              className="rounded-lg"
            />
            <div>
              <span className="font-bold">Fractals Academy</span>
              <span className="ml-2 text-xs text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                Student
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-auto">
          {navItems.map((item) => {
            const isActive = activeTab === item.value;
            return (
              <button
                key={item.value}
                onClick={() => handleNavClick(item.value)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer text-left",
                  isActive
                    ? "bg-purple-500/20 text-purple-400"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5",
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.title}
              </button>
            );
          })}

          <Separator className="my-4 bg-white/10" />

          <Link
            href="/?home"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer text-muted-foreground hover:text-foreground hover:bg-white/5"
          >
            <Home className="h-5 w-5" />
            Home
          </Link>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.image || undefined} />
              <AvatarFallback className="bg-purple-500/20 text-purple-400">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">
                {user.email}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="w-full justify-start gap-2 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>
    </>
  );
}
