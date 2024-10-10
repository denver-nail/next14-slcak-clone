import { useCurrentMember } from "@/features/member/api/use-current-member";
import { useGetWorkspaceById } from "@/features/workspace/api/use-get-workspaceById";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { AlertTriangle, Loader } from "lucide-react";
import WorkspaceHeader from "./workspace-header";
//工作区的左边的侧边区域
const WorkspaceSiderbar = () => {
  //获取worksapce的id
  const workspaceId = useWorkspaceId();
  //使用api获取当前member数据
  const { data: member, isLoading: memberIsLoading } = useCurrentMember({
    workspaceId,
  });
  //根据id获取当前workspace数据
  const { data: workspace, isLoading: workspaceIsLoading } =
    useGetWorkspaceById({
      id: workspaceId,
    });
  //数据正在加载显示内容
  if (workspaceIsLoading || memberIsLoading) {
    return (
      <div className="flex flex-col bg-theme-1/90 h-full items-center justify-center">
        <Loader className="size-5 animate-spin text-white" />
      </div>
    );
  }
  //数据加载失败显示内容
  if (!workspace || !member) {
    return (
      <div className="flex flex-col bg-theme-1/90 h-full items-center justify-center">
        <AlertTriangle className="size-5  text-white" />
        <p className="text-white text-sm">Workspace not found</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col bg-theme-1/90 h-full">
      <WorkspaceHeader
        workspace={workspace}
        isAdmin={member.role === "admin"}
      />
    </div>
  );
};
export default WorkspaceSiderbar;
