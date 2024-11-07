"use client";

import { useGetChannelById } from "@/features/channels/api/use-get-channels-by-id";
import { useChannelId } from "@/hooks/use-channel-id";
import { Loader, TriangleAlert } from "lucide-react";
import { Header } from "./header";
import { ChatInput } from "./chat-input";
import { useGetMessages } from "@/features/message/api/use-get-messages";
import { MessageList } from "@/components/message-list";
const ChannelIdPage = () => {
  //获取当前的channalID
  const channelId = useChannelId();
  //根据id查询channel数据
  const { data: channel, isLoading: channelLoading } = useGetChannelById({
    channelId,
  });
  //根据channelId查询message数据
  const { results, status, loadMore } = useGetMessages({ channelId });
  console.log({ results });
  //数据正在加载显示内容
  if (channelLoading || status === "LoadingFirstPage") {
    return (
      <div className="h-full flex-1 flex items-center justify-center">
        <Loader className="animate-spin size-5 to-muted-foreground" />
      </div>
    );
  }
  //数据加载失败显示内容
  if (!channel) {
    return (
      <div className="h-full flex flex-1 flex-col gap-y-2 items-center justify-center">
        <TriangleAlert className="size-6 to-muted-foreground text-theme-4" />
        <span className="text-sm text-muted-foreground">Channel not found</span>
      </div>
    );
  }
  return (
    <div className="flex flex-col h-full">
      {/* 头部组件 */}
      <Header title={channel.name} />
      {/* 消息区 */}
        {/* 消息列表组件 */}
      <MessageList
        channelName={channel.name}
        channelCreationTime={channel._creationTime}
        data={results}
        loadMore={loadMore}
        isLoadingMore={status === "LoadingMore"}
        canLoadMore={status == "CanLoadMore"}
      ></MessageList>
    
      {/* 消息输入框 */}
      <ChatInput placeholder={`Message #${channel.name}`} />
    </div>
  );
};
export default ChannelIdPage;
