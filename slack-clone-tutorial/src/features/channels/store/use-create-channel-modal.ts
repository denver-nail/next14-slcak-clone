import { atom } from "jotai";
import { useAtom } from "jotai";
//使用jotai库来管理状态
const modelState = atom(false);
export const useCreateChannelModel = () => {
  return useAtom(modelState);
};
