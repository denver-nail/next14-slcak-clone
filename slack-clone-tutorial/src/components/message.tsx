import { useConfirm } from "@/hooks/use-confirm";
import { useUpdateMessage } from "@/features/message/api/use-update-message";
import { useRemoveMessage } from "@/features/message/api/use-remove-message";
import dynamic from "next/dynamic";
import { Doc, Id } from "../../convex/_generated/dataModel";
import { format, isToday, isYesterday } from "date-fns";
import { Hint } from "./hint";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Thumbnail } from "./thumbnail";
import { Toolbar } from "./toolbar";
import { toast } from "sonner";
import { cn } from "../lib/utils";
import { useToggleReaction } from "@/features/reactions/api/use-toggle-reaction";
import { Reactions } from "./reactions";
import { usePanel } from "@/hooks/use-panel";
import { ThreadBar } from "./thread-bar";
const Renderer = dynamic(() => import("@/components/renderer"), { ssr: false }); //与富文本相关组件不使用ssr
const Editor = dynamic(() => import("@/components/editor"), { ssr: false });
// 单条消息组件所需参数
interface MessageProps {
  id: Id<"messages">;
  memberId: Id<"members">;
  authorImage?: string;
  authorName?: string;
  isAuthor: boolean;
  reactions: Array<
    Omit<Doc<"reactions">, "memberId"> & {
      count: number;
      memberIds: Id<"members">[];
    }
  >;
  body: Doc<"messages">["body"];
  image: string | null | undefined;
  createdAt: Doc<"messages">["_creationTime"];
  updatedAt: Doc<"messages">["updatedAt"];
  isEditing: boolean;
  isCompact?: boolean;
  setEditingId: (id: Id<"messages"> | null) => void;
  hideThreadButton?: boolean;
  threadCount?: number;
  threadImage?: string;
  threadTimestamp?: number;
  threadName?: string;
}
//转换时间格式函数
const formatFullTime = (date: Date) => {
  return `${isToday(date) ? "Today" : isYesterday(date) ? "Yesterday" : format(date, "MMM d, yyyy")} at ${format(date, "h:mm:ss a")}`;
};
// 单条消息组件
export const Message = ({
  id,
  isAuthor,
  memberId,
  authorImage,
  authorName = "Member",
  reactions,
  body,
  image,
  createdAt,
  updatedAt,
  isEditing,
  setEditingId,
  hideThreadButton,
  threadCount,
  threadImage,
  threadTimestamp,
  threadName,
  isCompact,
}: MessageProps) => {
  //控制thread对话栏
  const { parentMessageId, onOpenMessage, onOpenProfile, onClose } = usePanel();
  //确认框
  const [ConfirmDialog, confirm] = useConfirm(
    "Delete message",
    "Are you sure you want to delete this message? This cannot be  undone."
  );
  // 获取更新消息的API
  const { mutate: updateMessage, isPending: isUpdateingMessage } =
    useUpdateMessage();
  //获取删除消息的API
  const { mutate: removeMessage, isPending: isRemoveMessage } =
    useRemoveMessage();
  //切换消息的状态
  const { mutate: toggleReaction, isPending: isTogglingReaction } =
    useToggleReaction();
  const isPending = isUpdateingMessage || isTogglingReaction;
  // 处理更新消息的回调函数
  const handleUpdate = ({ body }: { body: string }) => {
    updateMessage(
      { id, body },
      {
        onSuccess: () => {
          toast.success("Message updated!");
          setEditingId(null);
        },
        onError: () => {
          toast.error("Failed to update message");
        },
      }
    );
  };
  //处理删除消息的回调函数
  const handleRemove = async () => {
    const ok = await confirm();
    if (!ok) return;
    //删除消息api
    removeMessage(
      { id },
      {
        onSuccess: () => {
          toast.success("Message deleted");
          //删除信息同时关闭该信息相关的1vs1聊天区
          if (parentMessageId === id) {
            onClose();
          }
        },
        onError: () => {
          toast.error("Failed to delete message");
        },
      }
    );
  };
  //处理状态的回调函数
  const handleReaction = (value: string) => {
    toggleReaction(
      { messageId: id, value },
      {
        onError: () => {
          toast.error("Failed to toggle reaction");
        },
      }
    );
  };
  if (isCompact) {
    return (
      <>
        <ConfirmDialog />
        <div
          className={cn(
            "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative",
            isEditing && "bg-theme-3 hover:bg-theme-3",
            isRemoveMessage &&
              "bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-200"
          )}
        >
          <div className="flex items-start gap-2">
            <Hint label={formatFullTime(new Date(createdAt))}>
              <button className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 w-[40px] leading-[22px] text-center hover:underline">
                {format(new Date(createdAt), "hh:mm")}
              </button>
            </Hint>
            {/* 编辑状态显示富文本输入框 */}
            {isEditing ? (
              <div className="w-full h-full">
                <Editor
                  onSubmit={handleUpdate}
                  disabled={isPending}
                  defaultValue={JSON.parse(body)}
                  onCancel={() => setEditingId(null)}
                  variant="update"
                ></Editor>
              </div>
            ) : (
              // 非编辑状态显示消息详情
              <div className="flex flex-col w-full">
                {/* 将富文本消息渲染出来的组件 */}
                <Renderer value={body} />
                {/* 展示消息中的图片的组件 */}
                <Thumbnail url={image} />
                {updatedAt ? (
                  <span className="text-xs text-muted-foreground">
                    (edited)
                  </span>
                ) : null}
                {/* 展示表情的组件 */}
                <Reactions data={reactions} onChange={handleReaction} />
                {/*展示Thread消息提醒的组件 */}

                <ThreadBar
                  count={threadCount}
                  image={threadImage}
                  timestamp={threadTimestamp}
                  onClick={() => onOpenMessage(id)}
                  name={threadName}
                />
              </div>
            )}
          </div>
          {/* 非编辑状态显示的工具栏 */}
          {!isEditing && (
            <Toolbar
              isAuthor={isAuthor}
              isPending={isPending}
              handleEdit={() => setEditingId(id)}
              handleThread={() => onOpenMessage(id)}
              handleDelete={handleRemove}
              handleReaction={handleReaction}
              hideThreadButton={hideThreadButton}
            />
          )}
        </div>
      </>
    );
  }
  //展示头像没有图片显示的文字
  const avatarFallback = authorName.charAt(0).toUpperCase();
  return (
    <>
      <ConfirmDialog />
      <div
        className={cn(
          "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative",
          isEditing && "bg-theme-3 hover:bg-theme-3",
          isRemoveMessage &&
            "bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-200"
        )}
      >
        <div className="flex items-start gap-2">
          <button onClick={() => onOpenProfile(memberId)}>
            {/* 发送消息的用户的头像 */}
            <Avatar>
              <AvatarImage src={authorImage} />
              <AvatarFallback className="text-md bg-theme-4 text-theme-3">
                {avatarFallback}
              </AvatarFallback>
            </Avatar>
          </button>
          {/* 编辑状态显示富文本输入框 */}
          {isEditing ? (
            <div className="w-full h-full">
              <Editor
                onSubmit={handleUpdate}
                disabled={isPending}
                defaultValue={JSON.parse(body)}
                onCancel={() => setEditingId(null)}
                variant="update"
              ></Editor>
            </div>
          ) : (
            //非编辑状态显示消息详情
            <div className="flex flex-col w-full overflow-hidden">
              <div className="text-sm">
                {/*  用户名*/}
                <button
                  onClick={() => onOpenProfile(memberId)}
                  className="font-bold text-primary hover:underline"
                >
                  {authorName}
                </button>
                <span>&nbsp;&nbsp;</span>
                {/* 发送消息的时间 */}
                <Hint label={formatFullTime(new Date(createdAt))}>
                  <button className="text-xs text-muted-foreground hover:underline">
                    {format(new Date(createdAt), "h:mm a")}
                  </button>
                </Hint>
              </div>

              {/* 将富文本消息渲染出来的组件 */}
              <Renderer value={body} />
              {/* 展示消息中的图片的组件 */}
              <Thumbnail url={image} />
              {updatedAt ? (
                <span className="text-xs text-muted-foreground">(edited)</span>
              ) : null}
              <Reactions data={reactions} onChange={handleReaction} />
              {/*展示Thread消息提醒的组件 */}
              <ThreadBar
                count={threadCount}
                image={threadImage}
                timestamp={threadTimestamp}
                onClick={() => onOpenMessage(id)}
                name={threadName}
              />
            </div>
          )}
        </div>

        {/* 非编辑状态显示的工具栏 */}
        {!isEditing && (
          <Toolbar
            isAuthor={isAuthor}
            isPending={isPending}
            handleEdit={() => setEditingId(id)}
            handleThread={() => onOpenMessage(id)}
            handleDelete={handleRemove}
            handleReaction={handleReaction}
            hideThreadButton={hideThreadButton}
          />
        )}
      </div>
    </>
  );
};
