import { motion } from "framer-motion";
import IconMessage from "../../../icons/IconMessage";
import Icon from "../../../icons/Icon";
import { TEST_CAROUSEL_VARIANT } from "../constants/TEST_CAROUSEL_VARIANT";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import Loader from "../../loader/Loader";
import Button from "../../Button";
import { useNavigate } from "@tanstack/react-router";

interface Props {
  direction: number;
  setOpen: (open: boolean) => void;
}

const TestFinishPage = ({ direction, setOpen }: Props) => {
  const navigate = useNavigate();
  const { fetchData } = useFetch();
  const { data } = fetchData("GET /respuesta/for/resolve");
  const unsolvedTests = data?.filter((v) => v.estado === "Pendiente");

  return (
    <motion.div
      variants={TEST_CAROUSEL_VARIANT}
      custom={direction}
      initial="enter"
      animate="active"
      exit="exit"
      className="absolute inset-0 flex items-center justify-center flex-col gap-6"
    >
      {!unsolvedTests ? (
        <Loader />
      ) : (
        <>
          <IconMessage
            icon={Icon.Types.CHECK}
            message="¡Muchas gracias por completar el test!"
            small={
              unsolvedTests?.length > 0
                ? `Aún tienes ${unsolvedTests.length} test${unsolvedTests.length > 1 ? "s" : ""} pendiente${unsolvedTests.length > 1 ? "s" : ""}:`
                : "¡Felicidades! Ya completaste todos tus tests."
            }
            textColor="success"
            delay={0.5}
          />
          <small></small>
          <ul className="flex flex-col gap-2">
            {unsolvedTests?.map((v) => (
              <li className="flex items-center gap-4">
                <div className="w-40 overflow-hidden flex flex-col gap-1">
                  <strong className="whitespace-nowrap overflow-hidden text-ellipsis text-sm">
                    {v.nombre_test}
                  </strong>
                  <small className="text-xs whitespace-nowrap overflow-hidden text-ellipsis">
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
        </>
      )}
    </motion.div>
  );
};

export default TestFinishPage;
