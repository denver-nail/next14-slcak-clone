import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
//展示消息中的图片的组件所需参数
interface ThumbnailProps {
  url: string | null | undefined;
}
//展示消息中的图片的组件
export const Thumbnail = ({ url }: ThumbnailProps) => {
  if (!url) return null;
  return (
    <Dialog>
      <DialogTrigger>
        {/* 普通展示 */}
        <div className="relative overflow-hidden max-w-[360px] border rounded-lg my-2 cursor-zoom-in bg-red-500">
          <Image src={url} alt="Message image" width={360} height={200} />
        </div>
      </DialogTrigger>
      {/* 放大展示 */}
      <DialogContent className="max-w-[800px] border-none bg-transparent p-0 shadow-none">
        <Image src={url} alt="Message image" width={800} height={600} />
      </DialogContent>
    </Dialog>
  );
};
