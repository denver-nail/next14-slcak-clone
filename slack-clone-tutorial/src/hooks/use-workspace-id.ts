import { useParams } from "next/navigation";
import { Id } from "../../convex/_generated/dataModel";
//根据路由的param参数返回当前工作区的id
export const useWorkspaceId = () => {
  const params = useParams();
  return params.workspaceId as Id<"workspaces">;
};
