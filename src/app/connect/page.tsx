import { ControlPanel } from "@/components/ControlPanel/ControlPanel";
import { Suspense } from "react";

export default function Home() {
  return (
    <Suspense>
      <ControlPanel />
    </Suspense>
  );
}
