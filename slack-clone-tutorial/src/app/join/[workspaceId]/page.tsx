"use client";
import Link from "next/link";
import { useJoin } from "@/features/workspace/api/use-join";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useGetWorkspaceInfoById } from "@/features/workspace/api/use-get-workspace-info";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import VerificationInput from "react-verification-input";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useEffect, useMemo } from "react";

const JoinPage = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  //获取workspace的不敏感信息
  const { data, isLoading } = useGetWorkspaceInfoById({ id: workspaceId });
  //邀请码邀请用户的API
  const { mutate, isPending } = useJoin();
  //标识当前登录的用户是不是邀请码所属的workspace的成员
  const isMemeber = useMemo(() => data?.isMember, [data?.isMember]);
  //处理当前登录用户已经是该邀请码对应工作区的成员
  useEffect(() => {
    if (isMemeber) {
      router.push(`/workspaces/${workspaceId}`);
    }
  }, [isMemeber, router, workspaceId]);
  //加载过程中显示的内容
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader className="size-6 animate-spin to-muted-foreground" />
      </div>
    );
  }
  //邀请码输入框的输入完成回调
  const handleComplete = (value: string) => {
    mutate(
      { workspaceId, joinCode: value },
      {
        onSuccess: (id) => {
          router.replace(`/workspaces/${id}`);
          toast.success("Workspace joined✌️");
        },
        onError: () => {
          toast.error("Failed to join workspace");
        },
      }
    );
  };
  return (
    <div className="h-full flex flex-col gap-y-8 items-center justify-center bg-white p-8 rounded-lg shadow-md">
      <Image src="/logo.svg" width={60} height={60} alt="logo" />
      <div className="flex flex-col gap-y-4 items-center justify-center max-w-md">
        <div className="flex flex-col gap-y-2 items-center justify-center">
          <h1 className="text-2xl font-bold">Join {data?.name}</h1>
          <p className="text-md text-muted-foreground font-semibold ">
            Enter the worksapce code to join
          </p>
        </div>
        {/* 邀请码输入框 */}
        <VerificationInput
          onComplete={handleComplete}
          length={6}
          classNames={{
            container: cn(
              "flex gap-x-2",
              isPending && "opacity-50 cursor-not-allowed"
            ),
            character:
              "uppercase h-auto rounded-md border border-gray-300 flex items-center justify-center lg font-medium text-gray-500  font-semibold ",
            characterInactive: "bg-muted",
            characterSelected: "bg-white text-black",
            characterFilled: "bg-white text-black",
          }}
          autoFocus
        />
      </div>
      <div className="flex gap-x-4">
        <Button size="lg" variant="outline" asChild>
          <Link href={`/`}>Back to home</Link>
        </Button>
      </div>
    </div>
  );
};
export default JoinPage;
