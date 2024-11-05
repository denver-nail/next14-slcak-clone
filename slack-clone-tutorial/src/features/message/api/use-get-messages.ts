import { usePaginatedQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

const BATCH_SIZE = 20; //记录每次加载消息的条数
//获取一些消息的API所需参数声明
interface UseGetMessagesProps {
  channelId?: Id<"channels">;
  conversationId?: Id<"conversations">;
  parentMessageId?: Id<"messages">;
}
//获取一些消息的API的返回值类型
export type GetMessagesReturnType =
  (typeof api.messages.get._returnType)["page"];

export const useGetMessages = ({
  channelId,
  conversationId,
  parentMessageId,
}: UseGetMessagesProps) => {
  //调用convex提供的分页查询方法
  const { results, status, loadMore } = usePaginatedQuery(
    api.messages.get,
    {
      channelId,
      conversationId,
      parentMessageId,
    },
    { initialNumItems: BATCH_SIZE }
  );
  return { results, status, loadMore: () => loadMore(BATCH_SIZE) };
};
