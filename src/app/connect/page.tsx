"use client";

import { BackButton } from "@/components/BackButton";
import { ControlPanel } from "@/components/ControlPanel/ControlPanel";
import { Heading } from "@chakra-ui/react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

export default function Home() {
  const searchParams = useSearchParams();
  const ip = searchParams.get("ip");

  return (
    <Suspense>
      <BackButton /> <Heading textAlign="center">Control panel</Heading>
      <ControlPanel ip={ip} />
    </Suspense>
  );
}
