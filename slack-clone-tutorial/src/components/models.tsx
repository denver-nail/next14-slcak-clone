"use client";
import { CreateChannelModal } from "@/features/channels/components/create-channel-modal";
import { CreateWorkspaceModal } from "@/features/workspace/components/create-workspace-modal";
import { useEffect, useState } from "react";
//包含新增workspace和member的对话框表单
export const Models = () => {
  const [mounted, setMounted] = useState(false);
  //在组件渲染完毕之后执行一次
  useEffect(() => {
    setMounted(false);
  }, []);
  if (mounted) return null;
  return (
    <>
      <CreateWorkspaceModal />
      <CreateChannelModal />
    </>
  );
};
