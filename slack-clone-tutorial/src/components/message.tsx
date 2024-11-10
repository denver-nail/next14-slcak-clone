import dynamic from "next/dynamic";
import { Doc, Id } from "../../convex/_generated/dataModel";
import { format, isToday, isYesterday } from "date-fns";
import { Hint } from "./hint";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Thumbnail } from "./thumbnail";
import { Toolbar } from "./toolbar";
import { useUpdateMessage } from "@/features/message/api/use-update-message";
import { toast } from "sonner";
import { cn } from "../lib/utils";
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
  isCompact,
}: MessageProps) => {
  // 获取更新消息的API
  const { mutate: updateMessage, isPending: isUpdateingMessage } =
    useUpdateMessage();
  const isPending = isUpdateingMessage;
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
  if (isCompact) {
    return (
      <div
        className={cn(
          "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative",
          isEditing && "bg-theme-3 hover:bg-theme-3"
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
                <span className="text-xs text-muted-foreground">(edited)</span>
              ) : null}
            </div>
          )}
        </div>
        {/* 非编辑状态显示的工具栏 */}
        {!isEditing && (
          <Toolbar
            isAuthor={isAuthor}
            isPending={isPending}
            handleEdit={() => setEditingId(id)}
            handleThread={() => {}}
            handleDelete={() => {}}
            handleReaction={() => {}}
            hideThreadButton={hideThreadButton}
          />
        )}
      </div>
    );
  }
  //展示头像没有图片显示的文字
  const avatarFallback = authorName.charAt(0).toUpperCase();
  return (
    <div
      className={cn(
        "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative",
        isEditing && "bg-theme-3 hover:bg-theme-3"
      )}
    >
      <div className="flex items-start gap-2">
        <button>
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
                onClick={() => {}}
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
          </div>
        )}
      </div>

      {/* 非编辑状态显示的工具栏 */}
      {!isEditing && (
        <Toolbar
          isAuthor={isAuthor}
          isPending={isPending}
          handleEdit={() => setEditingId(id)}
          handleThread={() => {}}
          handleDelete={() => {}}
          handleReaction={() => {}}
          hideThreadButton={hideThreadButton}
        />
      )}
    </div>
  );
};
