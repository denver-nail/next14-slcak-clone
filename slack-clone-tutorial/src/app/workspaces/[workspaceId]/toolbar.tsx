import { Button } from "@/components/ui/button";
import { useGetWorkspaceById } from "@/features/workspace/api/use-get-workspaceById";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Info, Search } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useState } from "react";
import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { useGetMembers } from "@/features/member/api/use-get-members";
import Link from "next/link";
export const Toolbar = () => {
  //从路由param参数获取id
  const workspaceId = useWorkspaceId();
  //根据id获取当前的workspace
  const { data } = useGetWorkspaceById({ id: workspaceId });
  //控制CommandDialog组件
  const [open, setOpen] = useState(false);
  //根据workspaceId获取channel数据
  const { data: channels } = useGetChannels({ workspaceId });
  //根据workspaceId获取member数据
  const { data: members } = useGetMembers({ workspaceId });
  return (
    <nav className="bg-theme-1 flex items-center justify-between h-10 p-1.5">
      <div className="flex-1" />
      <div className="min-w-[280px] max-[642px] grow-[2] shrink">
        <Button
          onClick={() => setOpen(true)}
          size="sm"
          className="bg-accent/25 hover:bg-accent/20 w-full justify-start h-7 px-2"
        >
          <Search className="size-4 text-white mr-2" />
          <span className="text-white text-xs">Search {data?.name}</span>
        </Button>
        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Channels">
              {channels?.map((channel) => (
                <CommandItem
                  key={channel._id}
                  asChild
                  onSelect={() => setOpen(false)}
                >
                  <Link
                    href={`/workspaces/${workspaceId}/channel/${channel._id}`}
                  >
                    {channel.name}
                  </Link>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Members">
              {members?.map((member) => (
                <CommandItem
                  key={member._id}
                  asChild
                  onSelect={() => setOpen(false)}
                >
                  <Link
                    href={`/workspaces/${workspaceId}/member/${member._id}`}
                  >
                    {member.user.name}
                  </Link>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </div>
      <div className="ml-auto flex-1 flex items-center justify-end">
        <Button variant="transparent" size="iconSm">
          <Info className="size-5 text-white" />
        </Button>
      </div>
    </nav>
  );
};
