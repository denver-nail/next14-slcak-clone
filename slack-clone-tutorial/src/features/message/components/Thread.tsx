import { Button } from "@/components/ui/button";
import { Id } from "../../../../convex/_generated/dataModel";
import { AlertTriangle, XIcon } from "lucide-react";
import { useGetMessageById } from "../api/use-get-message-by-id";
import { Loader } from "lucide-react";
import { Message } from "@/components/message";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useCurrentMember } from "@/features/member/api/use-current-member";
import { useState } from "react";
// 该组件所需参数
interface ThreadProps {
  messageId: Id<"messages">;
  onClose: () => void;
}
// 1对1聊天
export const Thread = ({ messageId, onClose }: ThreadProps) => {
  const workspaceId = useWorkspaceId();
  const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);
  //当前的成员信息
  const { data: currentMember } = useCurrentMember({ workspaceId });
  //获取根据id查询mesage的API
  const { data: message, isLoading: loadingMessage } = useGetMessageById({
    id: messageId,
  });
  if (loadingMessage) {
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
      <div>
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
    </div>
  );
};
