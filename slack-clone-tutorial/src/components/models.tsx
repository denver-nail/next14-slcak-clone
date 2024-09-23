"use client";
import { CreateWorkspaceModal } from "@/features/workspace/components/create-workspace-modal";
import { useEffect, useState } from "react";
export const Models = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;
  return (
    <>
      <CreateWorkspaceModal />
    </>
  );
};
