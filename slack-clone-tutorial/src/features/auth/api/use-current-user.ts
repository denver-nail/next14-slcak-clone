import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
//查询当前用户信息的钩子
//根据当前查询的结果返回对应的用户信息和加载状态
export const useCurrentUser = () => {
  const data = useQuery(api.users.current);
  const isLoading = data === undefined;
  return { data, isLoading };
};
