"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Save, Copy } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

export default function PasteEditor() {
  const [text, setText] = useState("");
  const [savedLink, setSavedLink] = useState<string | null>(null);
  const [savedCode, setSavedCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!text.trim()) return;

    try {
      setLoading(true);
      const { data } = await axios.post("/api/pasteit", { text });
      setSavedLink(data.link);
      setSavedCode(data.code);

      toast.success("Your paste is ready to share.");
      
    }  
    catch (err) {
      toast.error("Could not save paste. Try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(`Copied ${label} to clipboard!`);
    } catch {
      toast.error(`Failed to copy ${label}.`);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-10 px-4">
      <div className="relative">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your text here..."
          className="h-64 min-h-[calc(100vh-400px)] resize-none rounded-xl border border-muted bg-background/80 shadow-sm focus-visible:ring-2 focus-visible:ring-primary/50 overflow-y-auto"
        />

        {/* Floating Save Button */}
        <div className="absolute bottom-4 right-4">
          <Button
            onClick={handleSave}
            disabled={!text.trim() || loading}
            className="inline-flex items-center gap-2 shadow-lg"
          >
            {loading ? "Saving..." : <Save className="h-4 w-4" />}
            {!loading && "Save Paste"}
          </Button>
        </div>
      </div>

      {/* Section after saving */}
      {/* Section after saving */}
      {savedLink && savedCode && (
        <div className="mt-8 p-6 rounded-xl border bg-card shadow-lg space-y-6">
          <h2 className="text-xl font-semibold text-center">
            ✨ Your Paste is Ready
          </h2>

          {/* Link row */}
          <div className="flex items-center justify-between gap-4 p-3 rounded-lg bg-muted/40">
            <span className="truncate text-sm text-muted-foreground flex-1">
              {savedLink}
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleCopy(savedLink, "Link")}
              className="shrink-0"
            >
              <Copy className="h-4 w-4 mr-1" /> Copy Link
            </Button>
          </div>

          {/* Code row */}
          <div className="flex items-center justify-between gap-4 p-3 rounded-lg bg-muted/40">
            <span className="font-mono text-sm flex-1 truncate">
              {savedCode}
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleCopy(savedCode, "Code")}
              className="shrink-0"
            >
              <Copy className="h-4 w-4 mr-1" /> Copy Code
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
