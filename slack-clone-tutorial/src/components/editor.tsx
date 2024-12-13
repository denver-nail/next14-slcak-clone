import Quill, { type QuillOptions } from "quill";
import "quill/dist/quill.snow.css";
import {
  MutableRefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Button } from "./ui/button";
import { IoTextSharp } from "react-icons/io5";
import { ImageIcon, Smile, SendHorizontal, XIcon } from "lucide-react";
import { Hint } from "./hint";
import { EmojiPopover } from "./emoji-popover";
import { Delta, Op } from "quill/core";
import { cn } from "@/lib/utils";
import Image from "next/image";
//提交函数参数的声明
type EditorValue = {
  image: File | null;
  body: string;
};
//编辑组件需要接收的参数
interface EditorProps {
  onSubmit: ({ image, body }: EditorValue) => void; //提交表单时的回调函数。
  variant?: "create" | "update"; //用于区分创建和更新模式，默认为 "create"。
  onCancel?: () => void; //在更新模式下点击取消时的回调函数。
  placeholder?: string; //默认的提示文本。
  disabled?: boolean; //是否禁用编辑器。
  defaultValue?: Delta | Op[]; //编辑器的初始内容。
  innerRef?: MutableRefObject<Quill | null>; //允许父组件访问 Quill 实例的引用。
}
const Editor = ({
  variant = "create",
  onCancel,
  onSubmit,
  placeholder = "Write something...",
  defaultValue = [],
  disabled = false,
  innerRef,
}: EditorProps) => {
  const [text, setText] = useState("");
  //保存图片选择器上传的图片
  const [image, setImage] = useState<File | null>(null);
  const [isToolbarVisibile, setIsToolbarVisable] = useState(true);
  //containerRef 被用来获取富文本编辑器 Quill 将会挂载到的 DOM 容器
  const containerRef = useRef<HTMLDivElement>(null);
  //quillRef 保存了 Quill 实例的引用。
  const quillRef = useRef<Quill | null>(null);
  /* submitRef ，placeholderRef ，defaultValueRef ，disabledRef 这些 useRef() 的目的是避免依赖的过度更新，从而提高性能。每次 onSubmit、placeholder 等参数变化时，你不希望触发不必要的 useEffect 重新执行或者导致组件的重新渲染，所以你把这些参数存储在 useRef 中： */
  //submitRef 保存最新的 onSubmit 函数，确保每次提交时使用的是最新的回调函数。
  const submitRef = useRef(onSubmit);
  //placeholderRef 保存当前的占位符文本，避免在每次渲染时重新读取该值。
  const placeholderRef = useRef(placeholder);
  //defaultValueRef 保存传入的默认值，确保在编辑器初始化时使用正确的初始内容。
  const defaultValueRef = useRef(defaultValue);
  //disabledRef 保存编辑器的禁用状态，避免因为状态更新引发不必要的重新渲染。
  const disabledRef = useRef(disabled);
  //imageElementRef被用来获取图片选择器
  const imageElementRef = useRef<HTMLInputElement>(null);
  //在 useLayoutEffect 中，每次 onSubmit、placeholder、defaultValue 或 disabled 变化时，更新这些 ref 的值，而不是重新执行整个 useEffect：
  useLayoutEffect(() => {
    submitRef.current = onSubmit;
    placeholderRef.current = placeholder;
    defaultValueRef.current = defaultValue;
    disabledRef.current = disabled;
  });
  useEffect(() => {
    // 初始化 Quill 编辑器时，通过 containerRef.current 来获取编辑器容器，并将 Quill 实例挂载到该 DOM 元素中：
    if (!containerRef.current) return;
    const container = containerRef.current;
    const editorContainer = container.appendChild(
      container.ownerDocument.createElement("div")
    );
    //配置第三方quill库的选项
    const options: QuillOptions = {
      theme: "snow",
      placeholder: placeholderRef.current,
      modules: {
        //Toolbar：工具栏模块，用于配置编辑器上方的工具按钮，可以自定义布局。
        toolbar: [
          ["bold", "italic", "strike"],
          ["link"],
          [{ list: "ordered" }, { list: "bullet" }],
        ],

        //Keyboard：键盘绑定模块，可以自定义快捷键行为，例如 Shift+Enter 插入换行、Enter 提交表单等。
        keyboard: {
          bindings: {
            enter: {
              key: "Enter",
              handler: () => {
                const text = quill.getText();
                const addedImage = imageElementRef.current?.files?.[0] || null;
                const isEmpty =
                  !addedImage &&
                  text.replace(/<(.|\n)*?>/g, "").trim().length === 0; //判断文本是否
                if (isEmpty) return;
                const body = JSON.stringify(quill.getContents());
                submitRef.current?.({ body, image: addedImage });
              },
            },
            shift_enter: {
              key: "Enter",
              shiftKey: true,
              handler: () => {
                quill.insertText(quill.getSelection()?.index || 0, "\n");
              },
            },
          },
        },
      },
    };
    //创建富文本框
    const quill = new Quill(editorContainer, options);
    //当 Quill 编辑器实例在 useEffect 中被创建时，它会被赋值给 quillRef.current，这样你可以在组件的其他部分访问或操作这个 Quill 实例。
    quillRef.current = quill;
    quillRef.current.focus();
    // innerRef 是通过 props 传入的可选的引用，父组件可以通过它来访问子组件中的 Quill 实例。如果父组件传入了 innerRef，该引用会被赋值为 Quill 实例。这样父组件可以直接通过 innerRef.current 访问和操作 Quill 编辑器。
    if (innerRef) {
      innerRef.current = quill;
    }
    //quill.setContents(delta)：用 Delta 对象设置内容。
    quill.setContents(defaultValueRef.current);
    //quill.getText()：获取编辑器的纯文本内容。
    setText(quill.getText());
    quill.on(Quill.events.TEXT_CHANGE, () => {
      setText(quill.getText());
    });
    return () => {
      quill.off(Quill.events.TEXT_CHANGE);
      if (container) {
        container.innerHTML = "";
      }
      //在组件销毁时（useEffect 的返回函数中），quillRef.current 被重置为 null，以确保清理内存并防止潜在的内存泄漏
      if (quillRef.current) {
        quillRef.current = null;
      }
      if (innerRef) {
        innerRef.current = null;
      }
    };
  }, [innerRef]);
  //修改工具栏的可见性
  const toggleToolbar = () => {
    setIsToolbarVisable((current) => !current);
    const toolbarElement = containerRef.current?.querySelector(".ql-toolbar");
    if (toolbarElement) {
      toolbarElement.classList.toggle("hidden");
    }
  };
  const isEmpty = !image && text.replace(/<(.|\n)*?>/g, "").trim().length === 0; //判断编辑区是否为空
  //表情选择好后的回调函数
  const onEmojiSelect = (emojiValue: string) => {
    const quill = quillRef.current;
    //将emoji插入编辑区
    quill?.insertText(quill?.getSelection()?.index || 0, emojiValue);
  };
  return (
    <div className="flex flex-col">
      {/* 图片选择器 */}
      <input
        type="file"
        accept="image/*"
        ref={imageElementRef}
        onChange={(event) => setImage(event.target.files![0])}
        className="hidden"
      />
      <div
        className={cn(
          "flex flex-col border border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm transition bg-white",
          disabled && "opacity-50"
        )}
      >
        <div ref={containerRef} className="h-full ql-custom " />
        {/* 上传图片预览区 */}
        {!!image && (
          <div className="relative size-[62px] flex items-center justify-center group/image">
            {/* 图片删除按钮 */}
            <Hint label="Remove image">
              <button
                onClick={() => {
                  setImage(null);
                  imageElementRef.current!.value = "";
                }}
                className="hidden group-hover/image:flex rounded-full bg-black/70 hover:bg-black absolute -top-2.5 -right-2.5 text-white size-6 z-[4] border-2 border-white items-center justify-center"
              >
                <XIcon className="size-3.5" />
              </button>
            </Hint>
            <Image
              // URL.createObjectURL() 静态方法会创建一个 DOMString，其中包含一个表示参数中给出的对象的URL
              src={URL.createObjectURL(image)}
              alt="Uploaded"
              fill
              className="rounded-xl overflow-hidden border object-cover"
            />
          </div>
        )}
        <div className="flex px-2 pb-2 z-[5]">
          {/* 开关编辑区工具栏 */}
          <Hint
            label={isToolbarVisibile ? "Hide Formatting" : "Show formatting"}
          >
            <Button
              disabled={disabled}
              size="iconSm"
              variant="ghost"
              onClick={toggleToolbar}
            >
              <IoTextSharp className="size-4" />
            </Button>
          </Hint>
          {/* 表情 */}
          <EmojiPopover onEmojiSelect={onEmojiSelect}>
            <Button disabled={disabled} size="iconSm" variant="ghost">
              <Smile className="size-4" />
            </Button>
          </EmojiPopover>
          {/* 上传图片按钮 */}
          {variant === "create" && (
            <Hint label="Image">
              <Button
                disabled={disabled}
                size="iconSm"
                variant="ghost"
                onClick={() => imageElementRef.current?.click()}
              >
                <ImageIcon className="size-4" />
              </Button>
            </Hint>
          )}
          {/* 取消和保存按钮 */}
          {variant === "update" && (
            <div className="ml-auto flex items-center gap-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onCancel}
                disabled={disabled}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  onSubmit({
                    body: JSON.stringify(quillRef.current?.getContents()),
                    image,
                  });
                }}
                disabled={disabled || isEmpty}
                className="ml-auto bg-theme-4 hover:bg-theme-4/80 text-white"
              >
                Save
              </Button>
            </div>
          )}
          {/* 发送按钮 */}
          {variant === "create" && (
            <Button
              onClick={() => {
                onSubmit({
                  body: JSON.stringify(quillRef.current?.getContents()),
                  image,
                });
              }}
              disabled={disabled || isEmpty}
              size="sm"
              className={cn(
                "ml-auto",
                isEmpty
                  ? " bg-white hover:bg-white text-muted-foreground"
                  : " bg-theme-4 hover:bg-theme-4/80 text-white"
              )}
            >
              <span className="px-2">Send</span>
              <SendHorizontal className="size-4" />
            </Button>
          )}
        </div>
      </div>
      {/* 提示信息 */}
      {variant === "create" && (
        <div
          className={cn(
            "p-2 text-[10px] text-muted-foreground flex justify-end opacity-0 transition ",
            !isEmpty && "opacity-100"
          )}
        >
          <p>
            <strong>Shift +Return</strong>to add a new line
          </p>
        </div>
      )}
    </div>
  );
};
export default Editor;
