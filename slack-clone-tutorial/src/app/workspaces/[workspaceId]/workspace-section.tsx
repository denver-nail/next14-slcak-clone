import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { FaCaretDown } from "react-icons/fa";
import { useToggle } from "react-use";
import { cn } from "@/lib/utils";
interface WorkspaceSectionProps {
  children: React.ReactNode;
  hint: string;
  label: string;
  onNew?: () => void;
}
//workspace侧边功能区的分隔组件
export const WorkspaceSection = ({
  label,
  hint,
  onNew,
  children,
}: WorkspaceSectionProps) => {
  //使用react-use第三方库中的hooks来追踪布尔值的React状态钩子-实现向下展开按钮
  const [on, toggle] = useToggle(true);
  return (
    <div className="flex flex-col mt-3 px-2 ">
      <div className="flex items-center px-3.5 group">
        {/* 向下展开按钮 */}
        <Button
          variant="transparent"
          className=" p-0.5 text-sm text-theme-3 shrink-0 size-6"
          onClick={toggle}
        >
          <FaCaretDown
            className={cn("size-4 transition-transform", !on && "-rotate-90")}
          />
        </Button>
        {/* 标签按钮 */}
        <Button
          variant="transparent"
          size="sm"
          className="group px-1.5 text-sm text-theme-3 h-[28px] justify-start overflow-hidden items-center"
        >
          <span className=" truncate">{label}</span>
        </Button>
        {/* 新增按钮 */}
        {onNew && (
          <Hint label={hint} side="top" align="center">
            <Button
              onClick={onNew}
              variant="transparent"
              size="iconSm"
              className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto p-0.5 text-sm text-theme-3 size-6 shrink-0"
            >
              <PlusIcon className="size-5" />
            </Button>
          </Hint>
        )}
      </div>
      {on && <div className="px-6">{children}</div>}
    </div>
  );
};
