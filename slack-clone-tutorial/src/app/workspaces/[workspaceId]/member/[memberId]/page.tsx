"use client";
import { AlertTriangle, Loader } from "lucide-react";
import { useCreateOrGetConversation } from "@/features/conversation/api/use-create-or-get-conversation";
import { useMemberId } from "@/hooks/use-member-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useEffect, useState } from "react";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { toast } from "sonner";
import { Conversation } from "./conversation";

const MemberIdPage = () => {
  const workspaceId = useWorkspaceId();
  const memberId = useMemberId();
  const [conversationId, setConversationId] =
    useState<Id<"conversations"> | null>(null);
  const { mutate, isPending } = useCreateOrGetConversation();
  useEffect(() => {
    mutate(
      { workspaceId, memberId },
      {
        onSuccess(data) {
          setConversationId(data);
        },
        onError() {
          toast.error("Fail to create or get conversation");
        },
      }
    );
  }, [workspaceId, memberId, mutate]);
  //正在加载显示
  if (isPending) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader className="size-6 animate-spin to-muted-foreground" />
      </div>
    );
  }
  //数据加载失败显示
  if (!conversationId) {
    return (
      <div className="h-full flex flex-col gap-y-2 items-center justify-center">
        <AlertTriangle className="size-6 to-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          Conversaction not found
        </span>
      </div>
    );
  }
  //显示对话组件
  return <Conversation id={conversationId} />;
};
export default MemberIdPage;
