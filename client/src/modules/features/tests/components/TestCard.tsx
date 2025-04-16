import Icon from "@/modules/core/components/icons/Icon";
import Button from "@/modules/core/components/ui/Button";
import clsx from "clsx";
import { motion } from "framer-motion";
import ShareButton from "./ShareButton";
import Loader from "@/modules/core/components/ui/loader/Loader";
import DefaultPhoto from "@/assets/images/defaultPhoto.jpg";
import { useModal } from "@/modules/core/components/ui/modal/useModal";
import TestUsers from "./TestUsers";

interface Props {
  idTest: number;
  title: string;
  description: string;
  author: string;
  starred?: boolean;
  psychologist?: string;
  users?: (string | null)[];
  resolve?: () => void;
  edit?: () => void;
  share?: boolean;
  layoutId?: string;
  loading?: boolean;
  finished?: boolean;
  respuestas?: boolean;
}

const TestCard = ({
  idTest,
  title,
  description,
  author,
  psychologist,
  users,
  starred,
  resolve,
  edit,
  share,
  layoutId,
  loading,
  finished,
  respuestas,
}: Props) => {
  const { modal, setOpen } = useModal();

  return (
    <>
      {modal(`Usuarios evaluados (${title})`, <TestUsers idTest={idTest} />, {
        width: 500,
      })}
      <motion.div
        layoutId={layoutId}
        className="w-full h-full rounded-lg border-t-8 border-primary-700 dark:border-primary-400 bg-alto-50 dark:bg-alto-1000 shadow-lg shadow-alto-950/10 dark:shadow-alto-50/10 pt-4 p-8 flex flex-col gap-4"
      >
        <div className="flex items-center gap-2 justify-between">
          <strong className="text-xl w-full overflow-hidden text-ellipsis whitespace-nowrap text-alto-950 dark:text-alto-50">
            {title}
          </strong>
          <div className="flex gap-1">
            {finished && (
              <div
                title="Test finalizado"
                className="h-6 aspect-square text-success"
              >
                <Icon type={Icon.Types.CHECK_FILLED} />
              </div>
            )}
            {starred && (
              <div
                title="Seleccionado por los creadores"
                className="h-6 aspect-square text-primary-700 dark:text-primary-400"
              >
                <Icon type={Icon.Types.STARRED} />
              </div>
            )}
          </div>
        </div>
        <p className="text-sm text-alto-800 dark:text-alto-200 leading-6 line-clamp-3 h-[72px]">
          {description}
        </p>
        <div className="flex flex-col gap-3 text-alto-700 dark:text-alto-400">
          <div className="flex gap-4 text-sm items-center">
            <div className="w-5 aspect-square text-primary-400">
              <Icon type={Icon.Types.USER} />
            </div>
            <p
              title={author}
              className="whitespace-nowrap overflow-hidden text-ellipsis"
            >
              {author}
            </p>
          </div>
          {psychologist && (
            <div className="flex gap-4 text-sm items-center">
              <div className="w-5 aspect-square text-primary-400">
                <Icon type={Icon.Types.SCHOOL} />
              </div>
              <p
                title={psychologist}
                className="whitespace-nowrap overflow-hidden text-ellipsis"
              >
                {psychologist}
              </p>
            </div>
          )}
        </div>
        {users && (
          <div className="flex">
            {users
              .filter((_, i) => i < 8)
              .map((u, i) => (
                <div
                  key={i}
                  className={clsx(
                    "w-10 aspect-square rounded-full overflow-hidden border-2 border-white dark:border-alto-400",
                    {
                      "-ml-4": i > 0,
                    }
                  )}
                >
                  <img
                    className="w-full h-full bg-alto-50"
                    src={u ?? DefaultPhoto}
                    onError={(event) => {
                      event.currentTarget.src = DefaultPhoto;
                    }}
                  />
                </div>
              ))}
            <button
              className={clsx(
                "w-10 aspect-square rounded-full overflow-hidden border-2 border-white bg-alto-100 text-alto-800 p-2 hover:bg-alto-300 transition-all duration-300",
                {
                  "-ml-4": users.length > 0,
                }
              )}
              onClick={() => setOpen(true)}
            >
              <Icon type={Icon.Types.DOTS} />
            </button>
          </div>
        )}
        <div className="flex gap-4 justify-center pt-1 h-[42px]">
          {loading ? (
            <div className="-mt-5">
              <Loader text="" scale=".5" />
            </div>
          ) : (
            <>
              {resolve && (
                <Button
                  onClick={resolve}
                  icon={respuestas ? Icon.Types.BRAIN : Icon.Types.EYE}
                  title="Resolver test"
                >
                  {respuestas ? "Resolver" : "Previsualizar"}
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
              {share && <ShareButton idTest={idTest} nombreTest={title} />}
            </>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default TestCard;
