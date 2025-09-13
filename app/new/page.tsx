"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import axios from "axios";

export default function PasteEditor() {
  const [text, setText] = useState("");

  const handleSave = async() => {
    if (!text.trim()) return;
    console.log("Saved paste:", text);
    await axios.post('/api/pasteit', { text });
    // TODO: call API or redirect to paste page
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-10 px-4">
      <div className="relative">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your text here..."
          className="min-h-[calc(100vh-200px)] resize-none rounded-xl border border-muted bg-background/80 shadow-sm focus-visible:ring-2 focus-visible:ring-primary/50"
        />

        {/* Floating Button */}
        <div className="absolute bottom-4 right-4">
          <Button
            onClick={handleSave}
            disabled={!text.trim()}
            className="inline-flex items-center gap-2 shadow-lg"
          >
            <Save className="h-4 w-4" />
            Save Paste
          </Button>
        </div>
      </div>
    </div>
  );
}
