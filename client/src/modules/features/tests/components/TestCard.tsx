import Icon from "@/modules/core/components/icons/Icon";
import Button from "@/modules/core/components/ui/Button";
import clsx from "clsx";
import { motion } from "framer-motion";

interface Props {
  title: string;
  description: string;
  author: string;
  starred?: boolean;
  psychologist?: string;
  users?: string[];
  resolve?: () => void;
  edit?: () => void;
  share?: () => void;
}

const TestCard = ({
  title,
  description,
  author,
  psychologist,
  users,
  starred,
  resolve,
  edit,
  share,
}: Props) => {
  return (
    <motion.div
      layoutId="card"
      className="w-full h-full rounded-lg border-t-8 border-primary-700 bg-alto-50 shadow-lg pt-4 p-8 flex flex-col gap-4"
    >
      <div className="flex items-center gap-2 justify-between">
        <strong className="text-xl w-full overflow-hidden text-ellipsis whitespace-nowrap">
          {title}
        </strong>
        {starred && (
          <div className="h-6 aspect-square text-primary-700">
            <Icon type={Icon.Types.STARRED} />
          </div>
        )}
      </div>
      <p className="text-sm text-alto-800 leading-6 line-clamp-3 h-[72px]">
        {description}
      </p>
      <div className="flex flex-col gap-3 text-alto-700">
        <div className="flex gap-4 text-sm items-center">
          <div className="w-5 aspect-square text-primary-400">
            <Icon type={Icon.Types.USER} />
          </div>
          <p>{author}</p>
        </div>
        {psychologist && (
          <div className="flex gap-4 text-sm items-center">
            <div className="w-5 aspect-square text-primary-400">
              <Icon type={Icon.Types.SCHOOL} />
            </div>
            <p>{psychologist}</p>
          </div>
        )}
      </div>
      {users && (
        <div className="flex isolate">
          {users
            .filter((_, i) => i < 8)
            .map((u, i) => (
              <button
                key={i}
                style={{
                  zIndex: i,
                }}
                className={clsx(
                  "w-10 aspect-square rounded-full overflow-hidden border-2 border-white hover:opacity-80 transition-all duration-300",
                  {
                    "-ml-4": i > 0,
                  }
                )}
              >
                <img className="w-full h-full" src={u} />
              </button>
            ))}
          <button
            style={{
              zIndex: 20,
            }}
            className="w-10 -ml-4 aspect-square rounded-full overflow-hidden border-2 border-white bg-alto-200 text-alto-800 p-2 hover:bg-alto-300 transition-all duration-300"
          >
            <Icon type={Icon.Types.DOTS} />
          </button>
        </div>
      )}
      <div className="flex gap-4 justify-center pt-1">
        {resolve && (
          <Button
            onClick={resolve}
            icon={Icon.Types.BRAIN}
            title="Resolver test"
          >
            Resolver
          </Button>
        )}
        {edit && (
          <Button
            btnType="secondary"
            onClick={edit}
            icon={Icon.Types.PENCIL}
            title="Editar test"
          />
        )}
        {share && (
          <Button
            btnType="secondary"
            onClick={edit}
            icon={Icon.Types.QR}
            title="Compartir test"
          />
        )}
      </div>
    </motion.div>
  );
};

export default TestCard;