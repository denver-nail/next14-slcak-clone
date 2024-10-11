import { Button } from "@/components/ui/button";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { cva, type VariantProps } from "class-variance-authority";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { IconType } from "react-icons/lib";
import { cn } from "@/lib/utils";
//自定义当前按钮的样式（参考ui/Button.tsx）
const siderbarItemVariants = cva(
  "flex items-center gap-1.5 justify-start font-normal h-9 px-[18px] text-sm overflow-hidden  ",
  {
    variants: {
      variant: {
        default: "text-theme-3",
        active: "text-theme-1 bg-white hover:bg-white/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);
// SidebarItem接收的参数声明
interface SiderbarItemProps {
  label: string;
  id: string;
  icon: LucideIcon | IconType;
  variant?: VariantProps<typeof siderbarItemVariants>["variant"];
}
export const SidebarItem = ({
  label,
  id,
  icon: Icon,
  variant,
}: SiderbarItemProps) => {
  const workspaceId = useWorkspaceId();
  return (
    <Button
      variant="transparent"
      size="sm"
      className={cn(siderbarItemVariants({ variant }))}
      asChild
    >
      <Link href={`/workspaces/${workspaceId}/channel/${id}`}>
        <Icon className="size-3.5 mr-1 shrink-0" />
        <span className="text-sm truncate">{label}</span>
      </Link>
    </Button>
  );
};
