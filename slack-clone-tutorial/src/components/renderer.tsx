import Quill from "quill";
import { useEffect, useRef, useState } from "react";
//渲染富文本内容组件所需参数
interface RendererProps {
  value: string;
}
const Renderer = ({ value }: RendererProps) => {
  //存储value的值是否为空的状态
  const [isEmpty, setIsEmpty] = useState(false);
  //获取Quill实例将会被挂载到的div元素实例
  const rendererRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!rendererRef.current) return;
    const container = rendererRef.current;
    //创建富文本框实例
    const quill = new Quill(document.createElement("div"), { theme: "snow" });
    quill.enable(false);//禁用编辑器
    const contents = JSON.parse(value);
    quill.setContents(contents);
    //判断内容是否为空
    const isEmpty =
      quill
        .getText()
        .replace(/<(.|\n)*?>/g, "")
        .trim().length === 0;
    setIsEmpty(isEmpty);
    container.innerHTML = quill.root.innerHTML;
    //返回清除函数
    return () => {
      if (container) {
        container.innerHTML = "";
      }
    };
  }, [value]);
  if (isEmpty) return null;

  return <div ref={rendererRef} className="ql-editor ql-renderer" />;
};
export default Renderer;
