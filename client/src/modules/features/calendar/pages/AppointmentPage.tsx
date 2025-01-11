import { Navigate, useParams } from "@tanstack/react-router";
import { useMeasureContext } from "../../_layout/context/MeasureContext";
import AnswerCardTemplate from "../../answers/components/AnswerCardTemplate";
import AppointmentUser from "../components/AppointmentPage/AppointmentUser";
import FichaForm from "../components/AppointmentPage/FichaForm";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import Loader from "@/modules/core/components/ui/loader/Loader";
import ContractPDF from "../components/AppointmentPage/ContractPDF";
import DerivacionForm from "../components/AppointmentPage/DerivacionForm";
import FichaPDF from "../components/AppointmentPage/FichaPDF";
import DerivacionPDF from "../components/AppointmentPage/DerivacionPDF";
import dayjs from "dayjs";

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
      className="flex-1 grid pb-10 gap-x-8 gap-y-4 overflow-auto max-xl:gap-y-8"
      style={{
        paddingInline: PRIVATE_PADDING_INLINE,
        gridTemplateColumns: isSmall ? "1fr" : "1fr 1fr",
        gridTemplateRows: isSmall ? "428px 420px 640px" : "auto 1fr",
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
        user={data.paciente}
        fecha={data.cita.fecha}
        onSuccess={(res) => {
          setData((prev) => ({ ...prev, paciente: res }));
        }}
        hasPassed={hasPassed}
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
            component: (
              <DerivacionForm
                disabled={hasPassed}
                user={data.paciente}
                cita={data.cita}
                onSuccess={(res) => {
                  setData((prev) => ({ ...prev, cita: res }));
                }}
              />
            ),
            title: "Derivación",
          },
        ]}
      />
      <AnswerCardTemplate
        gridArea="tabs"
        tabs={[
          {
            title: "Contrato",
            component: (
              <ContractPDF
                user={data.paciente}
                fecha={data.cita.fecha}
                nombre_psicologo={data.cita.nombre_psicologo}
              />
            ),
          },
          {
            title: "Ficha",
            component: <FichaPDF cita={data.cita} user={data.paciente} />,
          },
          {
            title: "Interconsulta",
            component: <DerivacionPDF cita={data.cita} user={data.paciente} />,
          },
        ]}
      />
    </div>
  );
};

export default AppointmentPage;
