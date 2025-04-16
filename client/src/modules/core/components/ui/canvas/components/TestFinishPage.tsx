import { motion } from "framer-motion";
import IconMessage from "../../../icons/IconMessage";
import Icon from "../../../icons/Icon";
import { TEST_CAROUSEL_VARIANT } from "../constants/TEST_CAROUSEL_VARIANT";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import Loader from "../../loader/Loader";
import Button from "../../Button";
import { useNavigate } from "@tanstack/react-router";
import clsx from "clsx";

interface Props {
  direction: number;
  setOpen: (open: boolean) => void;
}

const TestFinishPage = ({ direction, setOpen }: Props) => {
  const navigate = useNavigate();
  const { fetchData } = useFetch();
  const { data } = fetchData("GET /respuesta/for/resolve");
  const unsolvedTests = data?.filter((v) => v.estado === "Pendiente") ?? [];

  return (
    <motion.div
      variants={TEST_CAROUSEL_VARIANT}
      custom={direction}
      initial="enter"
      animate="active"
      exit="exit"
      className="absolute inset-0 py-8 overflow-auto w-full h-full flex items-center justify-center"
    >
      {!unsolvedTests ? (
        <Loader />
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 m-auto">
          <IconMessage
            icon={
              unsolvedTests.length > 0
                ? Icon.Types.MINUS_CIRCLE
                : Icon.Types.CHECK
            }
            message="¡Muchas gracias por completar el test!"
            textColor={unsolvedTests.length > 0 ? "warning" : "success"}
            delay={0.5}
          >
            <small
              className={clsx(
                "text-sm  text-center",
                unsolvedTests.length > 0 ? "text-warning" : "text-success"
              )}
            >
              {unsolvedTests.length > 0
                ? `Pero aún tienes ${unsolvedTests.length} test${unsolvedTests.length > 1 ? "s" : ""} pendiente${unsolvedTests.length > 1 ? "s" : ""}... ¡tú puedes!:`
                : "¡Felicidades! Ya completaste todos tus tests."}
            </small>
          </IconMessage>
          <span />
          <ul className="flex flex-col gap-2">
            {unsolvedTests?.map((v) => (
              <li key={v.id_respuesta} className="flex items-center gap-4">
                <div className="w-40 overflow-hidden flex flex-col gap-1 text-alto-950 dark:text-alto-50">
                  <strong className="whitespace-nowrap overflow-hidden text-ellipsis text-sm">
                    {v.nombre_test}
                  </strong>
                  <small className="text-xs whitespace-nowrap overflow-hidden text-ellipsis opacity-80">
                    {v.nombre_asignador}
                  </small>
                </div>
                <Button
                  btnSize="small"
                  icon={Icon.Types.BRAIN}
                  onClick={() => {
                    navigate({
                      to: "/resolve/$idRespuesta",
                      params: { idRespuesta: String(v.id_respuesta) },
                    });
                    setOpen(false);
                  }}
                >
                  Resolver
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
};

export default TestFinishPage;
