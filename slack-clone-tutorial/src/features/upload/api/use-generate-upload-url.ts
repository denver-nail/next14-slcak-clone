import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useCallback, useMemo, useState } from "react";

type ResponseType = string | null;
//声明一个类型来标识数据增删改操作后的后续操作
type Options = {
  onSuccess?: (data: ResponseType) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  throwError?: boolean;
};
//生成一个上传的url
export const useGenerateUploadUrl = () => {
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

  const mutation = useMutation(api.upload.generateUploadUrl);
  //使用useCallback()将函数缓存起来
  const mutate = useCallback(
    async (_values: object, options?: Options) => {
      try {
        //初始状态
        setData(null);
        setError(null);
        setStatus("pending");
        const response = await mutation();
        //传递了方法执行成功后，需要执行的方法就执行
        options?.onSuccess?.(response);
        return response;
      } catch (error) {
        setStatus("error");
        //传递了方法执行失败后，需要执行的方法就执行
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
