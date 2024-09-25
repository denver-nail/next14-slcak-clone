"use client";
import { CreateWorkspaceModal } from "@/features/workspace/components/create-workspace-modal";
import { useEffect, useState } from "react";
export const Models = () => {
  const [mounted, setMounted] = useState(false);
  //在组件渲染完毕之后执行一次
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
