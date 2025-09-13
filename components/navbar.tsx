"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

export default function Navbar() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="w-full backdrop-blur-md border-b sticky top-0 z-40 bg-background/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-primary text-primary-foreground font-semibold">
              P
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-semibold text-lg text-primary">
                Paste It
              </span>
              <span className="text-xs text-muted-foreground">
                by BugHook
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {/* New Paste button */}
            <Link href="/new">
              <Button className="inline-flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Paste
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
