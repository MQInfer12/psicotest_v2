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
import { UserResumeContextProvider } from "../context/UserResumeContext";

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

  const TABS = [
    {
      title: "Ficha",
      component: (
        <FichaForm
          paciente={data.paciente}
          disabled={hasPassed}
          cita={data.cita}
          onSuccess={(res) => {
            setData((prev) => ({ ...prev, cita: res }));
          }}
        />
      ),
    },
  ];

  if (!hasPassed || !!data.cita.derivado_a) {
    TABS.push({
      title: "Derivación",
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
    });
  }

  return (
    <div
      className={clsx("flex-1 grid pb-10 gap-x-8 overflow-auto", {
        "gap-y-8": isSmall,
        "gap-y-4": !isSmall,
      })}
      style={{
        paddingInline: PRIVATE_PADDING_INLINE,
        gridTemplateColumns: isSmall ? "1fr" : "1fr 1fr",
        gridTemplateRows: isSmall
          ? "456px 420px 640px"
          : `${hasPassed ? "242px" : "270px"} 1fr`,
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
      <UserResumeContextProvider user={data.paciente}>
        <AppointmentUser
          id={data.cita.id}
          user={data.paciente}
          setData={setData}
          cita={data.cita}
          hasPassed={hasPassed}
        />
        <AnswerCardTemplate gridArea="form" tabs={TABS} />
      </UserResumeContextProvider>
      <AppointmentPDFsRenderer
        cita={data.cita}
        paciente={data.paciente}
        hasPassed={hasPassed}
      />
    </div>
  );
};

export default AppointmentPage;
