"use client";

import { useGetWorkspaceById } from "@/features/workspace/api/use-get-workspaceById";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

const WorkspaceIdPage = () => {
  //使用自己写的hook获取当前的workspaceId
  const workspaceId = useWorkspaceId();
  //根据id获取当前工作区的数据
  const { data } = useGetWorkspaceById({ id: workspaceId });
  return <div>Data:{JSON.stringify(data)}</div>;
};
export default WorkspaceIdPage;
