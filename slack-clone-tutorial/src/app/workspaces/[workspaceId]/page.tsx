"use client";

import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { useCreateChannelModel } from "@/features/channels/store/use-create-channel-modal";
import { useGetWorkspaceById } from "@/features/workspace/api/use-get-workspaceById";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { Loader, TriangleAlert } from "lucide-react";
import { useCurrentMember } from "@/features/member/api/use-current-member";
const WorkspaceIdPage = () => {
  const router = useRouter();
  //使用自己写的hook获取当前的workspaceId
  const workspaceId = useWorkspaceId();
  //使用全局状态来控制新建channel的对话框展现状态
  const [open, setOpen] = useCreateChannelModel();
  //根据id获取当前工作区的数据
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspaceById({
    id: workspaceId,
  });
  //获取当前工作区的所有channels
  const { data: channels, isLoading: channelsLoading } = useGetChannels({
    workspaceId,
  });
  //获取当前用户和工作区对应的相关信息
  const { data: member, isLoading: memberLoading } = useCurrentMember({
    workspaceId,
  });
  //判断当前工作区是否有channel
  const channelId = useMemo(() => channels?.[0]?._id, [channels]);
  //判断当前用户是不是当前工作区的管理员
  const isAdmin = useMemo(() => member?.role === "admin", [member?.role]);
  useEffect(() => {
    if (
      workspaceLoading ||
      channelsLoading ||
      !workspace ||
      !member ||
      memberLoading
    )
      return;
    //当前工作区有channel
    if (channelId) {
      //重定向到第一个channel
      router.push(`/workspaces/${workspaceId}/channel/${channelId}`);
    }
    //当前工作区没有channel且当前用户是管理员
    else if (!open && isAdmin) {
      //打开创建channel的对话框
      setOpen(true);
    }
  }, [
    channelId,
    workspaceLoading,
    channelsLoading,
    open,
    workspace,
    setOpen,
    router,
    workspaceId,
    member,
    memberLoading,
    isAdmin,
  ]);
  //加载过程中的显示内容
  if (workspaceLoading || channelsLoading || memberLoading) {
    return (
      <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  //数据加载失败显示内容
  if (!workspace || member) {
    return (
      <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
        <TriangleAlert className="size-6 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          Workspace not found.
        </span>
      </div>
    );
  }
  return (
    <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
      <TriangleAlert className="size-6 text-muted-foreground" />
      <span className="text-sm text-muted-foreground">No Channel found.</span>
    </div>
  );
};
export default WorkspaceIdPage;
