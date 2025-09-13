"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Copy } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

export default function ViewPaste() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  const [paste, setPaste] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const [copying, setCopying] = useState(false);

  useEffect(() => {
    if (!code) return;

    const fetchPaste = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await axios.get(
          `/api/pasteit?code=${encodeURIComponent(code)}`
        );
        setPaste(data.text || "");
        
      } 
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      catch (err: any) {
        setError(err.error  || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchPaste();
  }, [code]);

  const handleCopy = async () => {
    if (!paste) return;
    try {
      setCopying(true);
      await navigator.clipboard.writeText(paste);
      toast.success("Copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy to clipboard.");
      console.error(err);
    } finally {
      setCopying(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Your Paste</h1>

      {loading && (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" /> Loading...
        </div>
      )}

      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && paste && (
        <Card className="w-full max-w-3xl relative">
          <CardContent className="p-6">
            {/* Scrollable paste content */}
            <div className="max-h-[70vh] overflow-auto rounded-lg border p-3 bg-muted/30">
              <pre className="whitespace-pre-wrap break-words text-sm">
                {paste}
              </pre>
            </div>

            {/* Floating Copy Button */}
            <div className="absolute top-4 right-4">
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopy}
                className="inline-flex items-center gap-1"
                disabled={copying}
              >
                {copying ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                {copying ? "Copying..." : "Copy"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
