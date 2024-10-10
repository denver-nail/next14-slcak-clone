import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface UserCurrentMemberProps {
  workspaceId: Id<"workspaces">;
}
//自己编写的根据当前用户和给定的workspaceId查找member
export const useCurrentMember = ({ workspaceId }: UserCurrentMemberProps) => {
  const data = useQuery(api.members.current, { workspaceId });
  const isLoading = data === undefined;
  return { data, isLoading };
};
