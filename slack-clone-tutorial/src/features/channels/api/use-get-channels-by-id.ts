import { useQuery } from "convex/react";
import { Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";

interface UseGetChannelsProps {
  channelId: Id<"channels">;
}
//根据channelId查询其对应的channel
export const useGetChannelById = ({ channelId }: UseGetChannelsProps) => {
  const data = useQuery(api.channels.getById, { id: channelId });
  const isLoading = data == undefined;
  return { data, isLoading };
};
