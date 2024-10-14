import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
//工作区数据查询
//根据id查询工作区的不敏感信息
//根据当前查询的结果返回工作区的数据和加载状态
interface useGetWorkspaceInfoProps {
  id: Id<"workspaces">;
}
export const useGetWorkspaceInfoById = ({ id }: useGetWorkspaceInfoProps) => {
  const data = useQuery(api.workspaces.getInfoById, { id });
  const isLoading = data === undefined;
  return { data, isLoading };
};
