import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface UserGetMemberProps {
  workspaceId: Id<"workspaces">;
}
//自己编写的根据当前用户和给定的workspaceId查找member
export const useGetMember = ({ workspaceId }: UserGetMemberProps) => {
  const data = useQuery(api.members.get, { workspaceId });
  const isLoading = data === undefined;
  return { data, isLoading };
};
