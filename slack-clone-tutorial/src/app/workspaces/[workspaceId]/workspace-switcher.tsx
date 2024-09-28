import { useGetWorkspaceById } from "@/features/workspace/api/use-get-workspaceById";
import { useGetWorkspaces } from "@/features/workspace/api/use-get-workspaces";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCreateWorkspaceModel } from "@/features/workspace/store/use-create-workspace-modal";
import { Loader, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export const WorkspaceSwitcher = () => {
  const router = useRouter();
  //使用全局状态标识当前创建工作区组件是否展现
  const [_open, setOpen] = useCreateWorkspaceModel();
  //获取所有workspace
  const { data: workspaces, isLoading: workspacesLoading } = useGetWorkspaces();
  //从路由param参数获取id
  const workspaceId = useWorkspaceId();
  //根据id获取当前的workspace
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspaceById({
    id: workspaceId,
  });
  //过滤出除了当前的workspace的其他workspace
  const filterWorkspaces = workspaces?.filter(
    (workspace) => workspace?._id !== workspaceId
  );
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button className="size-9 relative overflow-hidden bg-theme-2 hover:bg-theme-2/80 text-theme-3 text-lg">
          {workspaceLoading ? (
            <Loader className="size-5 animate-spin shrink-0" />
          ) : (
            workspace?.name.charAt(0).toUpperCase()
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="start" className="w-64">
        <DropdownMenuItem
          onClick={() => router.push(`/workspaces/${workspaceId}`)}
          className="cursor-pointer flex-col justify-start items-start capitalize"
        >
          {workspace?.name}
          <span className="text-xs text-muted-foreground">
            Active workspace
          </span>
        </DropdownMenuItem>
        {filterWorkspaces?.map((workspace) => (
          <DropdownMenuItem
            key={workspace._id}
            className="cursor-pointer capitalize  overflow-hidden"
            onClick={() => router.push(`/workspaces/${workspace._id}`)}
          >
            <div className="shrink-0 size-9 relative overflow-hidden bg-theme-4 text-theme-3 font-semibold text-lg rounded-md flex items-center justify-center mr-2">
              {workspace.name.charAt(0).toUpperCase()}
            </div>
            <p className="truncate">{workspace.name}</p>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <div className="size-9 relative overflow-hidden bg-theme-3 text-theme-1 font-semibold text-lg rounded-md flex items-center justify-center mr-2">
            <Plus />
          </div>
          Create a new worspace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
