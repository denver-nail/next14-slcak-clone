import { format } from "date-fns";
interface ChannelHeroProps {
  name: string;
  createTime: number;
}
// 展现channel信息的头部组件
export const ChannelHero = ({ name, createTime }: ChannelHeroProps) => {
  return (
    <div className="mt-[88px] mx-5 mb-4">
      <p className="text-2xl font-bold items-center mb-2"># {name}</p>
      <p className="font-normal text-slate-800 mb-4">
        This channel was created on {format(createTime, "MMMM do,yyyy")}.This is
        very beginning of the <strong>{name}</strong>channel.
      </p>
    </div>
  );
};
