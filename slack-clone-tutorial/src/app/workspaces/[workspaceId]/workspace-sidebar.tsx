import { useCurrentMember } from "@/features/member/api/use-current-member";
import { useGetWorkspaceById } from "@/features/workspace/api/use-get-workspaceById";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { useGetMember } from "@/features/member/api/use-get-member";
import { useCreateChannelModel } from "@/features/channels/store/use-create-channel-modal";
import { useChannelId } from "@/hooks/use-channel-id";
import {
  AlertTriangle,
  HashIcon,
  Loader,
  MessageSquareText,
  SendHorizonal,
} from "lucide-react";
import WorkspaceHeader from "./workspace-header";
import { SidebarItem } from "./sidebar-item";
import { WorkspaceSection } from "./workspace-section";
import { UserItem } from "./user-item";
//工作区的左边的侧边区域
const WorkspaceSiderbar = () => {
  //获取channel的id
  const channelId = useChannelId();
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
  //使用api获取当前workspace对应的所有channels
  const { data: channels, isLoading: _channelsIsLoading } = useGetChannels({
    workspaceId,
  });
  //使用API获取当前workspace对应的所有成员的信息
  const { data: members, isLoading: _membersIsLoading } = useGetMember({
    workspaceId,
  });
  //使用jotai托管的全局状态来控制“新建channel对话框”是否展现
  const [_open, setOpen] = useCreateChannelModel();
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
      {/* 头部功能区 */}
      <WorkspaceHeader
        workspace={workspace}
        isAdmin={member.role === "admin"}
      />
      <div className="flex flex-col px-2 mt-3">
        <SidebarItem label="Threads" icon={MessageSquareText} id="threads" />
        <SidebarItem label="Drafts&Sent" icon={SendHorizonal} id="draft" />
      </div>
      {/* 频道分隔区 */}
      <WorkspaceSection
        label="Channels"
        hint="New Channel"
        // 管理员才能创建新的频道
        onNew={member.role === "admin" ? () => setOpen(true) : undefined}
      >
        {channels?.map((item) => (
          <SidebarItem
            key={item._id}
            icon={HashIcon}
            label={item.name}
            id={item._id}
            variant={channelId === item._id ? "active" : "default"}
          />
        ))}
      </WorkspaceSection>
      {/* 用户分割区 */}
      <WorkspaceSection
        label="Direct Message"
        hint="New direct message"
        onNew={() => {}}
      >
        {members?.map((item) => (
          <UserItem
            key={item._id}
            id={item._id}
            label={item.user.name}
            image={item.user.image}
          />
        ))}
      </WorkspaceSection>
    </div>
  );
};
export default WorkspaceSiderbar;
