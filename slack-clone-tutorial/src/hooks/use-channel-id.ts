import { useParams } from "next/navigation";
import { Id } from "../../convex/_generated/dataModel";
//根据路由的param参数返回当前channel的id
export const useChannelId = () => {
  const params = useParams();
  return params.channelId as Id<"channels">;
};
