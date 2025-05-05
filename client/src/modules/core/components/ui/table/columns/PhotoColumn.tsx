import { motion } from "framer-motion";
import DefaultPhoto from "@/assets/images/defaultPhoto.jpg";

interface Props {
  src?: string | null;
  text: string;
  small?: string;
  imgLayoutId?: string;
  textLayoutId?: string;
  smallLayoutId?: string;
}

const PhotoColumn = ({
  src,
  text,
  small,
  imgLayoutId,
  textLayoutId,
  smallLayoutId,
}: Props) => {
  return (
    <div className="flex gap-3 items-center w-full overflow-hidden">
      <div className="min-w-10 w-10 aspect-square rounded-md bg-alto-100 overflow-hidden">
        <motion.img
          layoutId={imgLayoutId}
          className="w-full h-full"
          src={src || DefaultPhoto}
          onError={(event) => {
            event.currentTarget.src = DefaultPhoto;
          }}
        />
      </div>
      <div className="flex-1 flex flex-col gap-1 overflow-hidden">
        <motion.strong
          layoutId={textLayoutId}
          className="font-medium whitespace-nowrap overflow-hidden text-ellipsis text-alto-950 dark:text-alto-50"
          title={text}
        >
          {text}
        </motion.strong>
        {small && (
          <motion.p
            layoutId={smallLayoutId}
            className="text-[10px] text-alto-700 dark:text-alto-400 whitespace-nowrap overflow-hidden text-ellipsis"
            title={small}
          >
            {small}
          </motion.p>
        )}
      </div>
    </div>
  );
};

export default PhotoColumn;
