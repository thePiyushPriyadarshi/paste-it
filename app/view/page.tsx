import { Suspense } from "react";
import ViewPaste from "./view";

export default function ViewPastePage() {
  return (
    <Suspense>
      <ViewPaste />
    </Suspense>
  );
}
