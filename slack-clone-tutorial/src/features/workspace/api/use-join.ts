import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useCallback, useMemo, useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";
//携带给newJoin()的参数
type RequestType = { workspaceId: Id<"workspaces">; joinCode: string };
//这里对应在convex\workspces.ts中newJoinCode返回的数据类型
type ResponseType = Id<"workspaces"> | null; //返回的是id
// type ResponseType = Doc<"workspaces">; //返回的是文档

//声明一个类型来标识数据增删改操作后的后续操作
type Options = {
  onSuccess?: (data: ResponseType) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  throwError?: boolean;
};
//更新一个文档在workspace表
export const useJoin = () => {
  //返回的数据，错误，请求状态等
  const [data, setData] = useState<ResponseType>(null);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<
    "success" | "error" | "settled" | "pending" | null
  >(null);

  const isPending = useMemo(() => status === "pending", [status]);
  const isSuccess = useMemo(() => status === "success", [status]);
  const isError = useMemo(() => status === "error", [status]);
  const isSettled = useMemo(() => status === "settled", [status]);

  //设置新的joinCode的方法
  const mutation = useMutation(api.workspaces.join);
  //使用useCallback()将函数缓存起来
  const mutate = useCallback(
    async (values: RequestType, options?: Options) => {
      try {
        //初始状态
        setData(null);
        setError(null);
        setStatus("pending");
        //更新一个文档在workspace表
        const response = await mutation(values);
        //传递了创建方法执行成功后，需要执行的方法就执行
        options?.onSuccess?.(response);
        return response;
      } catch (error) {
        setStatus("error");
        //传递了创建方法执行失败后，需要执行的方法就执行
        options?.onError?.(error as Error);
        if (options?.throwError) {
          throw error;
        }
      } finally {
        setStatus("settled");
        options?.onSettled?.();
      }
    },
    [mutation]
  );
  //返回调用函数、数据、错误、各种请求状态
  return { mutate, data, error, isError, isPending, isSettled, isSuccess };
};
