import { useQueryState } from "nuqs";
export const useProfileMemberId = () => {
  //获取url中的param参数，例如 /fhdsjkfhaj?profileMemberId=thisisid,则返回thisisid
  return useQueryState("profileMemberId");
};
