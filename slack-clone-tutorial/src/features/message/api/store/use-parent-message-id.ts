import { useQueryState } from "nuqs";
export const useParentMessageId = () => {
  //获取url中的param参数，例如 /fhdsjkfhaj/parentMessageId=thisisid,则返回thisisid
  return useQueryState("parentMessageId");
};
