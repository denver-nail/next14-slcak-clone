import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface UserGetMemberByIdProps {
  id: Id<"members">;
}
//自己编写的根据当前用户和给定的workspaceId查找member
export const useGetMemberById = ({ id }: UserGetMemberByIdProps) => {
  const data = useQuery(api.members.getById, { id });
  const isLoading = data === undefined;
  return { data, isLoading };
};
