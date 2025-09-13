"use client";
import HeroSection from "@/components/hero-section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [code, setCode] = useState("");
  const router = useRouter();

  const handleView = () => {
    if (!code.trim()) return; // prevent empty input
    router.push(`/view?code=${encodeURIComponent(code.trim())}`);
  };

  return (
    <main className="">
      <HeroSection />

      <div className="max-w-xl flex gap-2 w-11/12 my-20 mx-auto bg-background z-[9999]">
        <Input
          placeholder="Enter paste ID"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <Button onClick={handleView}>
          View
        </Button>
      </div>
    </main>
  );
}
