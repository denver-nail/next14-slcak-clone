import { useParentMessageId } from "@/features/message/store/use-parent-message-id";

export const usePanel = () => {
  //获取url中的param参数
  const [parentMessageId, setParentMessageId] = useParentMessageId();
  // 打开消息对话框就设置当前的messageId
  const onOpenMessage = (messageId: string) => {
    setParentMessageId(messageId);
  };
  //关闭消息对话框就清除当前的messageId
  const onClose = () => {
    setParentMessageId(null);
  };
  return {
    parentMessageId,
    onOpenMessage,
    onClose,
  };
};
