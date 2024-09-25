import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateWorkspaceModel } from "../store/use-create-workspace-modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateWorkspace } from "../api/use-create-workspace";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
export const CreateWorkspaceModal = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  //使用全局状态标识当前创建工作区组件是否展现
  const [open, setOpen] = useCreateWorkspaceModel();
  //自己封装的创建一个workspace的hook，返回一个函数
  const { mutate, isPending } = useCreateWorkspace();
  //表单提交回调
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(
      { name },
      {
        //创建成功的回调，id是workspaceId
        onSuccess(id) {
          toast.success("created successfully");
          router.push(`/workspaces/${id}`);
          handleClose();
        },
      }
    );
  };
  //关闭对话框回调函数
  const handleClose = () => {
    setOpen(false);
    //清除表单数据
    setName("");
  };
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a workspace</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            value={name}
            disabled={isPending}
            onChange={(e) => {
              setName(e.target.value);
            }}
            required
            autoFocus
            minLength={3}
            placeholder="Workspace name e.g. 'Work','Personal','Home'"
          />
          <div className="flex justify-end">
            <Button disabled={false}>Create</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
