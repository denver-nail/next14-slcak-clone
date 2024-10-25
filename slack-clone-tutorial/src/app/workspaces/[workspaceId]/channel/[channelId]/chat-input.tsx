// import Editor from "@/components/editor";不使用这种引入方式
import dynamic from "next/dynamic";
import Quill from "quill";
import { useRef } from "react";
const Editor = dynamic(() => import("@/components/editor"), { ssr: false }); //富文本组件不使用ssr
//chatInput组件需要接收的参数
interface ChatInputProps {
  placeholder: string;
}
export const ChatInput = ({ placeholder }: ChatInputProps) => {
  const editorRef = useRef<Quill | null>(null);
  return (
    <div className="px-5 w-full">
      <Editor
        variant="create"
        placeholder={placeholder}
        onSubmit={() => {}}
        disabled={false}
        innerRef={editorRef}
      />
    </div>
  );
};
