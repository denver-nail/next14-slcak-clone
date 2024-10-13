import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNewJoinCode } from "@/features/workspace/api/use-new-join-code";
import { useConfirm } from "@/hooks/use-confirm";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { DialogClose, DialogDescription } from "@radix-ui/react-dialog";
import { CopyIcon, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
interface InviteModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  name: string;
  joinCode: string;
}
export const InviteModal = ({
  open,
  setOpen,
  name,
  joinCode,
}: InviteModalProps) => {
  const workspaceId = useWorkspaceId();
  //设置新的JoinCodeAPI（管理员）
  const { mutate, isPending } = useNewJoinCode();
  //生成新的joinCode前的确认框
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you Sure?",
    "This will deactivate the current invite code and generate a new one❗"
  );
  //复制邀请链接按钮的回调
  const handleCopy = () => {
    //生成邀请链接《localhost:3000/join/kd72jy0yta8sfa6cmbv8xnz49x72fewg》
    const inviteLink = `${window.location.origin}/join/${workspaceId}`;
    //写入剪切板
    navigator.clipboard
      .writeText(inviteLink)
      .then(() => toast.success("Invite link copied to clipboard.🎉"));
  };
  //生成新的joinCode按钮回调
  const hanldeNewCode = async () => {
    const ok = await confirm();
    if (!ok) return;
    mutate(
      { workspaceId },
      {
        onSuccess: () => {
          toast.success("Invite code regengerated");
        },
        onError: () => {
          toast.error("Failed to regenerated invite code");
        },
      }
    );
  };

  return (
    <>
      <ConfirmDialog />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite people to {name}</DialogTitle>
            <DialogDescription>
              Use the code below to invite people to your workspace.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-y-4 items-center justify-center py-10">
            <p className="text-4xl font-bold tracking-widest uppercase">
              {joinCode}
            </p>
            {/* 复制邀请按钮 */}
            <Button variant="ghost" size="sm" onClick={handleCopy}>
              Copy link
              <CopyIcon className="size-4 ml-2 " />
            </Button>
          </div>
          <div className="flex items-center justify-between w-full">
            {/* 生成新的joinCode按钮 */}
            <Button
              onClick={hanldeNewCode}
              variant="outline"
              disabled={isPending}
            >
              New Code
              <RefreshCcw className="size-4 ml-2" />
            </Button>
            <DialogClose asChild>
              {/* 取消按钮 */}
              <Button value="gost">Cancel</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
