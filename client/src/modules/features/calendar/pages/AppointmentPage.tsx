import Loader from "@/modules/core/components/ui/loader/Loader";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import { Navigate, useNavigate, useParams } from "@tanstack/react-router";
import clsx from "clsx";
import { useMeasureContext } from "../../_layout/context/MeasureContext";
import AnswerCardTemplate from "../../answers/components/AnswerCardTemplate";
import AppointmentPDFsRenderer from "../components/AppointmentPage/AppointmentPDFsRenderer";
import AppointmentUser from "../components/AppointmentPage/AppointmentUser";
import FichaForm from "../components/AppointmentPage/FichaForm";
import { UserResumeContextProvider } from "../context/UserResumeContext";
import IconMessage from "@/modules/core/components/icons/IconMessage";
import Icon from "@/modules/core/components/icons/Icon";
import Button from "@/modules/core/components/ui/Button";
import { useReturnTo } from "@/modules/core/hooks/navigation/useReturnTo";
import { validateRoute } from "../../_layout/components/breadcrumb/utils/validateRoute";

const AppointmentPage = () => {
  const { size, PRIVATE_PADDING_INLINE } = useMeasureContext();
  const isSmall = size !== "normal";
  const navigate = useNavigate();
  const { goWithReturnTo, returnTo } = useReturnTo();

  const { id } = useParams({
    from: "/_private/calendar/$id",
  });

  const { fetchData } = useFetch();
  const { data, setData, error } = fetchData(
    [
      "GET /cita/:id",
      {
        id: Number(id),
      },
    ],
    {
      queryOptions: {
        gcTime: 0,
      },
    }
  );

  if (!!error) return <Navigate to="/calendar" />;
  if (!data) return <Loader />;

  const hasPassed = !!data.cita.fecha_cierre_clinico;
  const active = data.cita.cita_anterior
    ? !!data.cita.cita_anterior.fecha_cierre_clinico
    : true;

  const TABS = [
    {
      title: "Ficha",
      component: active ? (
        <FichaForm
          key={data.cita.metodo}
          disabled={hasPassed}
          cita={data.cita}
          onSuccess={(res) => {
            setData((prev) => ({ ...prev, cita: res }));
          }}
        />
      ) : (
        <div className="h-full w-full flex items-center justify-center">
          <IconMessage
            icon={Icon.Types.CANCEL}
            textColor="danger"
            message="Cierra clínicamente la sesión anterior para poder editar esta ficha."
            small="Una vez llenada la ficha de la sesión, haz clic en el botón de cerrar clínicamente."
          >
            <div className="mt-4 flex gap-4">
              <Button
                icon={Icon.Types.PENCIL}
                onClick={() => {
                  navigate({
                    to: "/calendar/$id",
                    params: {
                      id: String(data.cita.cita_anterior!.id),
                    },
                    search: {
                      returnTo: returnTo ?? undefined,
                    },
                  });
                }}
              >
                Ver cita anterior
              </Button>
              <Button
                icon={Icon.Types.HISTORY}
                onClick={() => {
                  navigate({
                    to: "/patients/$id",
                    params: {
                      id: data.paciente.email,
                    },
                    search: {
                      returnTo: goWithReturnTo(
                        validateRoute("/calendar/$id", {
                          id: String(data.cita.id),
                        })
                      ),
                    },
                  });
                }}
                btnType="secondary"
              >
                Ver historial clínico del paciente
              </Button>
            </div>
          </IconMessage>
        </div>
      ),
    },
  ];

  return (
    <div
      className={clsx(
        "relative isolate flex-1 grid pb-10 gap-x-8 overflow-auto",
        {
          "gap-y-8": isSmall,
          "gap-y-4": !isSmall,
        }
      )}
      style={{
        paddingInline: PRIVATE_PADDING_INLINE,
        gridTemplateColumns: isSmall ? "1fr" : "1fr 1fr",
        gridTemplateRows: isSmall ? "456px 420px 640px" : `270px 1fr`,
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
      <AppointmentPDFsRenderer cita={data.cita} paciente={data.paciente} />
    </div>
  );
};

export default AppointmentPage;
