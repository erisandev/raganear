"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FoundryWorkspace } from "@/components/FoundryWorkspace";

export default function FoundryAppPage() {
  const router = useRouter();

  return (
    <FoundryWorkspace
      initialTab="MARKETPLACE"
      onGoToLanding={() => router.push("/")}
    />
  );
}
