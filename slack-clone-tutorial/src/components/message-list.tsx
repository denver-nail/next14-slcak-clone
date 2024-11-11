import { GetMessagesReturnType } from "@/features/message/api/use-get-messages";
import { differenceInMinutes, format, isToday, isYesterday } from "date-fns";
import { Message } from "./message";
import { ChannelHero } from "./channel-hero";
import { useState } from "react";
import { Id } from "../../convex/_generated/dataModel";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useCurrentMember } from "@/features/member/api/use-current-member";
import { Loader } from "lucide-react";
//设置消息间隔（当间隔小于时显示消息的方式不同）
const TIME_THRESHOLD = 5;
//消息列表组件所需的参数
interface MessageListProps {
  memberName?: string;
  memberImage?: string;
  channelName?: string;
  channelCreationTime?: number;
  variant?: "channel" | "thread" | "conversation";
  data: GetMessagesReturnType | undefined;
  loadMore: () => void;
  isLoadingMore: boolean;
  canLoadMore: boolean;
}
//根据日期转换成标签
const formatDateLabel = (dateStr: string) => {
  const date = new Date(dateStr);
  if (isToday(date)) return "Tody";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "EEEE,MMMM d");
};
// 消息列表组件
export const MessageList = ({
  memberImage,
  memberName,
  channelName,
  channelCreationTime,
  variant = "channel",
  loadMore,
  data,
  isLoadingMore,
  canLoadMore,
}: MessageListProps) => {
  // 存储编辑messageId的状态
  const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);
  const workspaceId = useWorkspaceId();
  const { data: currentMember } = useCurrentMember({ workspaceId });

  //将messages按照日期分组
  const groupedMessage = data?.reduce(
    (groups, message) => {
      const date = new Date(message._creationTime);
      const dateKey = format(date, "yyyy-MM-dd");
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].unshift(message);
      return groups;
    },
    {} as Record<string, typeof data>
  );
  return (
    <div className="flex-1 flex flex-col-reverse pb-4 overflow-y-auto messages-scrollbar">
      {/* 按日期分组展示消息 */}
      {Object.entries(groupedMessage || {}).map(([dateKey, messages]) => (
        <div key={dateKey}>
          <div className="text-center my-2 relative">
            <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
            <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm ">
              {formatDateLabel(dateKey)}
            </span>
          </div>
          {/* 展示消息 */}
          {messages.map((message, index) => {
            // 比较上一条消息和当前发送消息的时间
            const prevMessage = messages[index - 1];
            const isCompact =
              prevMessage &&
              prevMessage.user?._id === message.user?._id &&
              differenceInMinutes(
                new Date(message._creationTime),
                new Date(prevMessage._creationTime)
              ) < TIME_THRESHOLD;
            return (
              // 消息组件
              <Message
                key={message._id}
                id={message._id}
                memberId={message.memberId}
                authorImage={message.user.image}
                authorName={message.user.name}
                isAuthor={message.memberId === currentMember?._id}
                reactions={message.reactions}
                body={message.body}
                image={message.image}
                isEditing={editingId === message._id}
                setEditingId={setEditingId}
                isCompact={isCompact}
                hideThreadButton={variant === "thread"}
                updatedAt={message.updatedAt}
                createdAt={message._creationTime}
                threadCount={message.threadCount}
                threadImage={message.threadImage}
                threadTimestamp={message.threadTimestamp}
              />
            );
          })}
        </div>
      ))}
      {/*这里的写法值得注意：用于实现很多消息的滚动加载功能 */}
      <div
        className="h-1"
        ref={(el) => {
          //通过 ref 属性，将 div 元素的 DOM 引用赋值给 el 变量，并执行一段逻辑。
          if (el) {
            /*    IntersectionObserver 是一个浏览器 API，用于检测元素是否进入视口。它被配置为在元素完全进入视口时（threshold: 1.0）触发回调函数。 */
            const observer = new IntersectionObserver(
              ([entry]) => {
                /* 当目标元素（div）进入视口时，entry.isIntersecting 会返回 true。此时，如果 canLoadMore 为 true，则调用 loadMore()，表示可以加载更多内容。 */
                if (entry.isIntersecting && canLoadMore) {
                  loadMore();
                }
              },
              { threshold: 1.0 }
            );
            //将 IntersectionObserver 绑定到指定的 el 元素（这里是 div 元素），从而开始观察该元素是否进入视口。
            observer.observe(el);
            // 解除 IntersectionObserver 对 el 元素的监听，以避免不必要的回调触发
            return () => observer.disconnect();
          }
        }}
      />

      {isLoadingMore && (
        <div className="text-center my-2 relative">
          <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
          <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm ">
            <Loader className="size-4 animate-spin" />
          </span>
        </div>
      )}
      {/* 展现channel信息的头部组件 */}
      {variant === "channel" && channelName && channelCreationTime && (
        <ChannelHero
          name={channelName}
          createTime={channelCreationTime}
        ></ChannelHero>
      )}
    </div>
  );
};
