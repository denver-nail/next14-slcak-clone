import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useUpdateChannel } from "@/features/channels/api/use-update-channel";
import { useChannelId } from "@/hooks/use-channel-id";
import { TrashIcon } from "lucide-react";
import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { toast } from "sonner";
import { useRemoveChannel } from "../../../../../features/channels/api/use-remove-channel";
import { useConfirm } from "@/hooks/use-confirm";
import { useRouter } from "next/navigation";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useCurrentMember } from "@/features/member/api/use-current-member";
// 当前组件需要的接收的参数声明
interface HeaderProps {
  title: string;
}
export const Header = ({ title }: HeaderProps) => {
  const router = useRouter();
  const channelId = useChannelId();
  const workspaceId = useWorkspaceId();
  const { data: member } = useCurrentMember({ workspaceId });
  //输入框数据
  const [value, setValue] = useState(title);
  //控制编辑channel的对话框的展示状态
  const [editOpen, setEditOpen] = useState(false);
  //编辑对话框显示/关闭回调
  const handleEditOpen = (value: boolean) => {
    //管理员权限
    if (member?.role !== "admin") return;
    setEditOpen(value);
  };
  //更新channel数据的API
  const { mutate: updateChannel, isPending: updatingPending } =
    useUpdateChannel();
  //删除channel的API
  const { mutate: removeChannel, isPending: removingPending } =
    useRemoveChannel();
  //确认对话框和确认回调
  const [ConfirmDialog, confirm] = useConfirm(
    "Delete this channel?",
    "Your are about to delete this channel.This action is irreversible."
  );
  //编辑对话框表单提交回调
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //调用更新API
    updateChannel(
      { channelId: channelId, name: value },
      {
        onSuccess: () => {
          toast.success("Channel updated");
          setEditOpen(false);
        },
        onError: () => {
          toast.error("Failed to update channel");
        },
      }
    );
  };
  //删除按钮的回调
  const handleDelete = async () => {
    const ok = await confirm();
    if (!ok) return;
    removeChannel(
      { channelId: channelId },
      {
        onSuccess: () => {
          toast.success("Channel deleted");
          router.push(`/workspaces/${workspaceId}`);
        },
        onError: () => {
          toast.error("Failed to delete channel");
        },
      }
    );
  };
  //输入框数据变化回调函数
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, "-").toLowerCase();
    setValue(value);
  };
  return (
    <div className="bg-white border-b h-[49px] flex items-center px-4 overflow-hidden">
      {/* 确认操作框 */}
      <ConfirmDialog />
      {/* 功能展示对话框 */}
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="text-lg font-semibold px-2 overflow-hidden w-auto"
          >
            <span className="truncate">#{title}</span>
            <FaChevronDown className="size-2.5 ml-2" />
          </Button>
        </DialogTrigger>
        <DialogContent className="p-0 bg-gray-50 overflow-hidden">
          <DialogHeader className="p-4 border-b bg-white">
            <DialogTitle>#{title}</DialogTitle>
          </DialogHeader>
          <div className="px-4 pb-4 flex flex-col gap-y-2">
            {/* 编辑对话框 */}
            <Dialog open={editOpen} onOpenChange={handleEditOpen}>
              <DialogTrigger asChild>
                <div className=" px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center justify-between ">
                    <p className="text-sm font-semibold"> Channel name</p>
                    {member?.role === "admin" && (
                      <p className="text-sm text-theme-1 hover:underline font-semibold">
                        Edit
                      </p>
                    )}
                  </div>
                  <p className="text-sm">#{title}</p>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Rename this channel</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    value={value}
                    disabled={updatingPending}
                    onChange={handleChange}
                    required
                    autoFocus
                    minLength={3}
                    maxLength={80}
                    placeholder="e.g. plan-budget"
                  />
                </form>
                <DialogFooter>
                  <DialogClose asChild>
                    {/* 取消按钮 */}
                    <Button variant="outline" disabled={updatingPending}>
                      Cancel
                    </Button>
                  </DialogClose>
                  {/* 保存按钮 */}
                  <Button disabled={updatingPending}>Save</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            {/* 删除按钮 */}
            {member?.role === "admin" && (
              <button
                onClick={handleDelete}
                disabled={removingPending}
                className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg cursor-pointer border hover:bg-gray-50 text-rose-600"
              >
                <TrashIcon className="size-4 " />
                <p className="text-sm font-semibold">Delete</p>
              </button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
