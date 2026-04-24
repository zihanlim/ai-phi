"use client";

import { SidePanel } from "./SidePanel";

interface Philosopher {
  id: string;
  name: string;
  era: string;
  tradition: string;
  bio: string;
  works: string[];
  ideas: string[];
  imageUrl?: string | null;
}

interface SidePanelWrapperProps {
  philosophers: Philosopher[];
}

export function SidePanelWrapper({ philosophers }: SidePanelWrapperProps) {
  return <SidePanel philosophers={philosophers} />;
}
