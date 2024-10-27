// import Editor from "@/components/editor";不使用这种引入方式
import { useCreateMessage } from "@/features/message/api/use-create-message";
import { useChannelId } from "@/hooks/use-channel-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import dynamic from "next/dynamic";
import Quill from "quill";
import { useRef, useState } from "react";
import { toast } from "sonner";
const Editor = dynamic(() => import("@/components/editor"), { ssr: false }); //富文本组件不使用ssr
//chatInput组件需要接收的参数
interface ChatInputProps {
  placeholder: string;
}
//提交函数参数的声明
type EditorValue = {
  image: File | null;
  body: string;
};

export const ChatInput = ({ placeholder }: ChatInputProps) => {
  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();
  //小技巧：每次key的变化都会销毁当前的Editor组件，从而实现提交信息后清除当前编辑区的内容
  const [editorKey, setEditorKey] = useState(0);
  //标识handleSubmit中调用许多mutate操作的状态
  const [isPending, setIsPending] = useState(false);
  //传递给Editor子组件的Quill富文本编辑器的对象实例
  const editorRef = useRef<Quill | null>(null);
  //创建一个message的API
  const { mutate: createMessage } = useCreateMessage();
  //处理Editor组件的提交信息事件的回调
  const handleSubmit = async ({ image, body }: EditorValue) => {
    console.log({ image, body });
    //主要是处理图片上传可能会出现的问题
    try {
      setIsPending(true);
      //调用创建一个message的API
      await createMessage(
        {
          workspaceId,
          channelId,
          body,
        },
        { throwError: true }
      );
      setEditorKey((prev) => prev + 1);
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setIsPending(false);
    }
  };
  return (
    <div className="px-5 w-full">
      <Editor
        key={editorKey}
        placeholder={placeholder}
        onSubmit={handleSubmit}
        disabled={isPending}
        innerRef={editorRef}
      />
    </div>
  );
};
