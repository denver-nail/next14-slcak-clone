import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Id } from "../../../../convex/_generated/dataModel";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
//自定义当前按钮的样式（参考ui/Button.tsx）
const userItemVariants = cva(
  "flex items-center gap-1.5 justify-start font-normal h-9 px-4 text-sm overflow-hidden  ",
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
//用户信息展示组件需要的参数类型声明
interface UserItemProps {
  id: Id<"members">;
  label?: string;
  image?: string;
  variant?: VariantProps<typeof userItemVariants>["variant"];
}

export const UserItem = ({
  id,
  label = "Member",
  image,
  variant,
}: UserItemProps) => {
  const workspaceId = useWorkspaceId();
  return (
    <Button
      variant="transparent"
      className={cn(userItemVariants({ variant: variant }))}
      size="sm"
      asChild
    >
      <Link href={`/workspaces/${workspaceId}/member/${id}`}>
        <Avatar className="size-5 rounded-md mr-1">
          <AvatarImage className="rounded-md" src={image} />
          <AvatarFallback className="text-xs bg-theme-4 text-theme-3 rounded-md">
            {label.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <span className="text-sm truncate">{label}</span>
      </Link>
    </Button>
  );
};
