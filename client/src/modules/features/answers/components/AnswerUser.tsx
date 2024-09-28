import Icon from "@/modules/core/components/icons/Icon";
import { useAnswerContext } from "../context/AnswerContext";
import AnswerCardTemplate from "./AnswerCardTemplate";
import DefaultPhoto from "@/assets/images/defaultPhoto.jpg";
import { measureAge } from "@/modules/core/utils/measureAge";
import { formatDate } from "@/modules/core/utils/formatDate";
import { motion } from "framer-motion";

const AnswerUser = () => {
  const { data } = useAnswerContext();
  const { user } = data;

  return (
    <AnswerCardTemplate title="Usuario" gridArea="user">
      <div className="w-full h-full p-4 flex flex-col justify-between">
        <div className="flex gap-4">
          <div className="min-h-full aspect-square z-10 rounded-lg overflow-hidden shadow-lg border-4 border-white">
            <motion.img
              layoutId={`answer-foto-${data.id_respuesta}`}
              className="w-full h-full bg-alto-100"
              src={user.foto || DefaultPhoto}
              alt={user.email}
            />
          </div>
          <div className="flex-1 py-1 flex flex-col overflow-hidden">
            <motion.strong
              layoutId={`answer-nombre-${data.id_respuesta}`}
              className="text-lg overflow-hidden text-ellipsis whitespace-nowrap"
              title={user.nombre}
            >
              {user.nombre}
            </motion.strong>
            <motion.p
              layoutId={`answer-email-${data.id_respuesta}`}
              className="text-sm text-alto-500 text-ellipsis whitespace-nowrap overflow-hidden"
              title={user.email}
            >
              {user.email}
            </motion.p>
            <div className="mt-4 flex flex-col gap-2">
              <div className="flex w-full gap-4">
                <div className="flex-1 flex gap-3 items-center">
                  <div
                    title="Edad"
                    className="w-5 aspect-square text-primary-400"
                  >
                    <Icon type={Icon.Types.CAKE} />
                  </div>
                  <p className="overflow-hidden whitespace-nowrap text-ellipsis text-xs text-alto-900">
                    {user.fecha_nacimiento && data.fecha_enviado
                      ? `${measureAge(user.fecha_nacimiento, data.fecha_enviado)} años`
                      : "N/A"}
                  </p>
                </div>
                <div className="flex-1 flex gap-3 items-center overflow-hidden">
                  <div
                    title="Género"
                    className="min-w-5 w-5 aspect-square text-primary-400"
                  >
                    <Icon
                      type={
                        user.genero
                          ? user.genero === "Hombre"
                            ? Icon.Types.GENDER_MALE
                            : Icon.Types.GENDER_FEMALE
                          : Icon.Types.GENDER_NONE
                      }
                    />
                  </div>
                  <p className="overflow-hidden whitespace-nowrap text-ellipsis text-xs text-alto-900">
                    {user.genero || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex w-full gap-4">
                <div className="flex-1 flex gap-3 items-center overflow-hidden">
                  <div
                    title="Nombre del test"
                    className="min-w-5 w-5 aspect-square text-primary-400"
                  >
                    <Icon type={Icon.Types.BRAIN} />
                  </div>
                  <motion.p
                    layoutId={`answer-test-${data.id_respuesta}`}
                    className="overflow-hidden whitespace-nowrap text-ellipsis text-xs text-alto-900"
                    title={data.nombre_test}
                  >
                    {data.nombre_test}
                  </motion.p>
                </div>
                <div className="flex-1 flex gap-3 items-center">
                  <div
                    title="Fecha de evaluación"
                    className="min-w-5 w-5 aspect-square text-primary-400"
                  >
                    <Icon type={Icon.Types.CALENDAR} />
                  </div>
                  <p className="overflow-hidden whitespace-nowrap text-ellipsis text-xs text-alto-900">
                    {data.fecha_enviado
                      ? formatDate(data.fecha_enviado)
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnswerCardTemplate>
  );
};

export default AnswerUser;
