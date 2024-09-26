"use client";

import { UserButton } from "@/features/auth/components/user-button";
import { useCreateWorkspaceModel } from "@/features/workspace/store/use-create-workspace-modal";
import { useGetWorkspaces } from "@/features/workspace/api/use-get-workspaces";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  //使用atom像使用useState一样（使用atom的好处是：该状态就变成全局状态了）
  const [open, setOpen] = useCreateWorkspaceModel();
  //获取当前工作区的数据和加载状态
  const { data, isLoading } = useGetWorkspaces();
  //useMemo()缓存当前函数的执行结果
  const workspaceId = useMemo(() => data?.[0]?._id, [data]);
  //当查询到有工作区就重定向到最新的工作区路由
  useEffect(() => {
    if (isLoading) return;
    if (workspaceId) {
      router.replace(`/workspaces/${workspaceId}`);
    } else if (!open) {
      setOpen(true);
    }
  }, [workspaceId, isLoading, open, setOpen, router]);
  return (
    <div>
      <UserButton></UserButton>
    </div>
  );
}
