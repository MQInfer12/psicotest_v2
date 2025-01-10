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

  const DATA = [
    {
      title: "Género",
      value: user.genero || "N/A",
      icon: user.genero
        ? user.genero === "Hombre"
          ? Icon.Types.GENDER_MALE
          : Icon.Types.GENDER_FEMALE
        : Icon.Types.GENDER_NONE,
    },
    {
      title: "Edad",
      value:
        user.fecha_nacimiento && data.fecha_enviado
          ? `${measureAge(user.fecha_nacimiento, data.fecha_enviado)} años`
          : "N/A",
      icon: Icon.Types.CAKE,
    },
    {
      title: "Nombre del test",
      value: data.nombre_test,
      icon: Icon.Types.BRAIN,
    },
    {
      title: "Fecha de evaluación",
      value: data.fecha_enviado ? formatDate(data.fecha_enviado) : "N/A",
      icon: Icon.Types.CALENDAR,
    },
  ];

  return (
    <AnswerCardTemplate
      tabs={[
        {
          title: "Usuario",
          component: (
            <div className="w-full h-full p-4 flex flex-col justify-between">
              <div className="flex gap-4 max-lg:flex-col max-lg:items-center">
                <div className="h-[120px] w-[120px] z-10 rounded-lg overflow-hidden shadow-md border-4 border-white dark:border-alto-400">
                  <motion.img
                    layoutId={`answer-foto-${data.id_respuesta}`}
                    className="w-full h-full bg-alto-100"
                    src={user.foto ?? DefaultPhoto}
                    alt={user.email}
                    onError={(event) => {
                      event.currentTarget.src = DefaultPhoto;
                    }}
                  />
                </div>
                <div className="max-lg:w-full flex-1 py-1 flex flex-col overflow-hidden">
                  <motion.strong
                    layoutId={`answer-nombre-${data.id_respuesta}`}
                    className="text-lg overflow-hidden text-ellipsis whitespace-nowrap max-lg:text-center text-alto-950 dark:text-alto-50"
                    title={user.nombre}
                  >
                    {user.nombre}
                  </motion.strong>
                  <motion.p
                    layoutId={`answer-email-${data.id_respuesta}`}
                    className="text-sm text-alto-400 text-ellipsis whitespace-nowrap overflow-hidden max-lg:text-center"
                    title={user.email}
                  >
                    {user.email}
                  </motion.p>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {DATA.map((data) => (
                      <div
                        key={data.title}
                        title={`${data.value} (${data.title})`}
                        className="flex gap-3 items-center"
                      >
                        <div className="w-5 aspect-square text-primary-400">
                          <Icon type={data.icon} />
                        </div>
                        <p className="overflow-hidden whitespace-nowrap text-ellipsis text-xs text-alto-700 dark:text-alto-400">
                          {data.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ),
        },
      ]}
      gridArea="user"
    />
  );
};

export default AnswerUser;
