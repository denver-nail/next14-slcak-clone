import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
//工作区数据查询
//查询所有工作区的信息
//根据当前查询的结果返回工作区的数据和加载状态
export const useGetWorkspaces = () => {
  const data = useQuery(api.workspces.get);
  const isLoading = data === undefined;
  return { data, isLoading };
};
