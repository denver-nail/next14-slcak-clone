// import Editor from "@/components/editor";不使用这种引入方式
import { useCreateMessage } from "@/features/message/api/use-create-message";
import { useGenerateUploadUrl } from "@/features/upload/api/use-generate-upload-url";
import { useChannelId } from "@/hooks/use-channel-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import dynamic from "next/dynamic";
import Quill from "quill";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Id } from "../../../../../../convex/_generated/dataModel";
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
type CreateMessageValues = {
  channelId: Id<"channels">;
  workspaceId: Id<"workspaces">;
  body: string;
  image?: Id<"_storage"> | undefined;
};
export const ChatInput = ({ placeholder }: ChatInputProps) => {
  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();
  const { mutate: generateUploadUrl } = useGenerateUploadUrl();
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
      editorRef?.current?.enable(false);
      const value: CreateMessageValues = {
        channelId,
        workspaceId,
        body,
        image: undefined,
      };
      if (image) {
        //生成上传图片的url
        const url = await generateUploadUrl({}, { throwError: true });
        if (!url) {
          throw new Error("Url not found");
        }
        console.log({ url });
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
        console.log({ result });
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
