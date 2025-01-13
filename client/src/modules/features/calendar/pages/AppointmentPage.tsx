import Loader from "@/modules/core/components/ui/loader/Loader";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import { Navigate, useParams } from "@tanstack/react-router";
import clsx from "clsx";
import dayjs from "dayjs";
import { useMeasureContext } from "../../_layout/context/MeasureContext";
import AnswerCardTemplate from "../../answers/components/AnswerCardTemplate";
import AppointmentPDFsRenderer from "../components/AppointmentPage/AppointmentPDFsRenderer";
import AppointmentUser from "../components/AppointmentPage/AppointmentUser";
import DerivacionForm from "../components/AppointmentPage/DerivacionForm";
import FichaForm from "../components/AppointmentPage/FichaForm";

const AppointmentPage = () => {
  const { size, PRIVATE_PADDING_INLINE } = useMeasureContext();
  const isSmall = size !== "normal";

  const { id } = useParams({
    from: "/_private/calendar/$id",
  });

  const { fetchData } = useFetch();
  const { data, setData, error } = fetchData([
    "GET /cita/:id",
    {
      id: Number(id),
    },
  ]);

  if (!!error) return <Navigate to="/calendar" />;
  if (!data) return <Loader />;

  const hasPassed = dayjs(data.cita.fecha).isBefore(dayjs(), "day");
  return (
    <div
      className={clsx("flex-1 grid pb-10 gap-x-8 overflow-auto", {
        "gap-y-8": isSmall,
        "gap-y-4": !isSmall,
      })}
      style={{
        paddingInline: PRIVATE_PADDING_INLINE,
        gridTemplateColumns: isSmall ? "1fr" : "1fr 1fr",
        gridTemplateRows: isSmall ? "456px 420px 640px" : "270px 1fr",
        gridTemplateAreas: isSmall
          ? `
        'user'
        'form'
        'tabs'
      `
          : `
        'user tabs'
        'form tabs'
     `,
      }}
    >
      <AppointmentUser
        id={data.cita.id}
        user={data.paciente}
        fecha={data.cita.fecha}
        onSuccess={(res) => {
          setData((prev) => ({ ...prev, paciente: res }));
        }}
      />
      <AnswerCardTemplate
        gridArea="form"
        tabs={[
          {
            component: (
              <FichaForm
                disabled={hasPassed}
                cita={data.cita}
                onSuccess={(res) => {
                  setData((prev) => ({ ...prev, cita: res }));
                }}
              />
            ),
            title: "Ficha",
          },
          {
            component: data.cita.metodo ? (
              <DerivacionForm
                disabled={hasPassed}
                user={data.paciente}
                cita={data.cita}
                onSuccess={(res) => {
                  setData((prev) => ({ ...prev, cita: res }));
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <small className="text-alto-950 dark:text-alto-50 opacity-60">
                  Primero llena la ficha inicial para comenzar con la derivación
                </small>
              </div>
            ),
            title: "Derivación",
          },
        ]}
      />
      <AppointmentPDFsRenderer cita={data.cita} paciente={data.paciente} />
    </div>
  );
};

export default AppointmentPage;
