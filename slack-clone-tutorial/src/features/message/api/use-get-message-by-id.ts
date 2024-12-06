import { useQuery } from "convex/react";
import { Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";

interface UseGetMessageProps {
  id: Id<"messages">;
}
//根据channelId查询其对应的channel
export const useGetMessageById = ({ id }: UseGetMessageProps) => {
  const data = useQuery(api.messages.getById, { id });
  const isLoading = data == undefined;
  return { data, isLoading };
};
