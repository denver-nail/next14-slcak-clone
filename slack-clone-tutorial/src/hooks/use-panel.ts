import { useProfileMemberId } from "@/features/member/store/use-profile-member-id";
import { useParentMessageId } from "@/features/message/store/use-parent-message-id";

export const usePanel = () => {
  //获取url中的param参数
  const [parentMessageId, setParentMessageId] = useParentMessageId();
  const [profileMemberId, setProfileMemberId] = useProfileMemberId();
  // 打开消息对话框就设置当前的profileMemberId
  const onOpenProfile = (memberId: string) => {
    setProfileMemberId(memberId);
    setParentMessageId(null);
  };
  // 打开消息对话框就设置当前的messageId
  const onOpenMessage = (messageId: string) => {
    setParentMessageId(messageId);
    setProfileMemberId(null);
  };
  //关闭消息对话框就清除当前的messageId和profileMemberId
  const onClose = () => {
    setParentMessageId(null);
    setParentMessageId(null);
  };
  return {
    parentMessageId,
    profileMemberId,
    onOpenMessage,
    onOpenProfile,
    onClose,
  };
};
