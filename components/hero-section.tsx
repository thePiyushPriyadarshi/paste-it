"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { AuroraBackground } from "@/components/ui/aurora-background"; // from Aceternity UI
import { TextHoverEffect } from "./ui/text-hover-effect";
import ColourfulText from "./ui/colourful-text";
import { BackgroundBeams } from "./ui/background-beams";

export default function LandingPage() {
  return (
    <main >
      <div className="h-[20rem] max-w-11/12 mx-auto">
        <TextHoverEffect text="PASTE IT" />
      </div>
      <h1 className="text-xl md:text-3xl lg:text-5xl font-bold text-center relative z-2 font-sans">
        A smarter <ColourfulText text="clipboard" /> for everyone.
      </h1>
       {/* <BackgroundBeams /> */}
    </main>
  );
}
