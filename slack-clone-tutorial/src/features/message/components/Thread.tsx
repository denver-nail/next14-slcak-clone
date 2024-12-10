import { Button } from "@/components/ui/button";
import { AlertTriangle, XIcon } from "lucide-react";
import { Loader } from "lucide-react";
import { Message } from "@/components/message";
import { toast } from "sonner";
import Quill from "quill";
import { Id } from "../../../../convex/_generated/dataModel";
import dynamic from "next/dynamic";
import { differenceInMinutes, format, isToday, isYesterday } from "date-fns";
import { useGetMessageById } from "../api/use-get-message-by-id";
import { useRef, useState } from "react";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useCurrentMember } from "@/features/member/api/use-current-member";
import { useCreateMessage } from "../api/use-create-message";
import { useGenerateUploadUrl } from "@/features/upload/api/use-generate-upload-url";
import { useChannelId } from "@/hooks/use-channel-id";
import { useGetMessages } from "../api/use-get-messages";
const Editor = dynamic(() => import("@/components/editor"), { ssr: false }); //富文本相关组件不使用ssr
//设置消息间隔（当间隔小于时显示消息的方式不同）
const TIME_THRESHOLD = 5;
// 该组件所需参数
interface ThreadProps {
  messageId: Id<"messages">;
  onClose: () => void;
}
//提交函数参数的声明
type EditorValue = {
  image: File | null;
  body: string;
};

type CreateMessageValues = {
  channelId: Id<"channels">;
  workspaceId: Id<"workspaces">;
  parentMessageId: Id<"messages">;
  body: string;
  image?: Id<"_storage"> | undefined;
};
//根据日期转换成标签
const formatDateLabel = (dateStr: string) => {
  const date = new Date(dateStr);
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "EEEE,MMMM d");
};
// 1对1聊天
export const Thread = ({ messageId, onClose }: ThreadProps) => {
  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();
  const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);
  //小技巧：每次key的变化都会销毁当前的Editor组件，从而实现提交信息后清除当前编辑区的内容
  const [editorKey, setEditorKey] = useState(0);
  //标识handleSubmit中调用许多mutate操作的状态
  const [isPending, setIsPending] = useState(false);
  //传递给Editor子组件的Quill富文本编辑器的对象实例
  const editorRef = useRef<Quill | null>(null);
  //创建一个message的API
  const { mutate: createMessage } = useCreateMessage();
  //生成一个上传URL的API
  const { mutate: generateUploadUrl } = useGenerateUploadUrl();
  //当前的成员信息
  const { data: currentMember } = useCurrentMember({ workspaceId });
  //获取根据id查询mesage的API
  const { data: message, isLoading: loadingMessage } = useGetMessageById({
    id: messageId,
  });
  //获取所有的消息
  const { results, status, loadMore } = useGetMessages({
    channelId,
    parentMessageId: messageId,
  });
  //逐步加载标志变量
  const canLoadMore = status === "CanLoadMore";
  const isLoadingMore = status === "LoadingMore";
  //将messages按照日期分组
  const groupedMessage = results?.reduce(
    (groups, message) => {
      const date = new Date(message._creationTime);
      const dateKey = format(date, "yyyy-MM-dd");
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].unshift(message);
      return groups;
    },
    {} as Record<string, typeof results>
  );
  //处理Editor组件的提交信息事件的回调
  const handleSubmit = async ({ image, body }: EditorValue) => {
    //主要是处理图片上传可能会出现的问题
    try {
      setIsPending(true);
      editorRef?.current?.enable(false);
      const value: CreateMessageValues = {
        channelId,
        workspaceId,

        parentMessageId: messageId,
        body,
        image: undefined,
      };
      if (image) {
        //生成上传图片的url
        const url = await generateUploadUrl({}, { throwError: true });
        if (!url) {
          throw new Error("Url not found");
        }

        //根据生成的url上传图片
        const result = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": image.type,
          },
          body: image,
        });
        if (!result.ok) {
          throw new Error("Failed to upload image");
        }
        //得到图片上传后的storageId
        const { storageId } = await result.json();
        value.image = storageId;
      }
      //调用创建一个message的API
      await createMessage(value, { throwError: true });
      setEditorKey((prev) => prev + 1);
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setIsPending(false);
      editorRef?.current?.enable(true);
    }
  };
  if (loadingMessage || status === "LoadingFirstPage") {
    return (
      // 加载中显示的内容
      <div className="h-full flex flex-col">
        <div className="h-[49px] flex justify-between items-center p-4 border-b">
          <p className="text-lg font-bold">Thread</p>
          <Button onClick={onClose} size="iconSm" variant="ghost">
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex flex-col gap-y-2 h-full items-center justify-center">
          <Loader className="size-5 animate-spin to-muted-foreground" />
        </div>
      </div>
    );
  }
  if (!message) {
    return (
      <div className="h-full flex flex-col">
        <div className="h-[49px] flex justify-between items-center p-4 border-b">
          <p className="text-lg font-bold">Thread</p>
          <Button onClick={onClose} size="iconSm" variant="ghost">
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex flex-col gap-y-2 h-full items-center justify-center">
          <AlertTriangle className="size-5 to-muted-foreground" />
          <p className="text-sm text-muted-foreground">Message not found</p>
        </div>
      </div>
    );
  }
  return (
    <div className="h-full flex flex-col">
      <div className="h-[49px] flex justify-between items-center p-4 border-b">
        <p className="text-lg font-bold">Thread</p>
        <Button onClick={onClose} size="iconSm" variant="ghost">
          <XIcon className="size-5 stroke-[1.5]" />
        </Button>
      </div>
      <div className="flex-1 flex flex-col-reverse pb-4 overflow-y-auto messages-scrollbar">
        {/* 按日期分组展示消息(后续交流的消息) */}
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
                  hideThreadButton={true}
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
        {/* 最初始的消息 */}
        <Message
          hideThreadButton={true}
          memberId={message.memberId}
          authorImage={message.user.image}
          authorName={message.user.name}
          isAuthor={message.memberId === currentMember?._id}
          body={message.body}
          image={message.image}
          createdAt={message._creationTime}
          updatedAt={message.updatedAt}
          id={message._id}
          reactions={message.reactions}
          isEditing={editingId === messageId}
          setEditingId={setEditingId}
        />
      </div>
      {/* 消息输入框 */}
      <div className=" px-4">
        <Editor
          key={editorKey}
          onSubmit={handleSubmit}
          innerRef={editorRef}
          disabled={isPending}
          placeholder="Reply..."
        />
      </div>
    </div>
  );
};
