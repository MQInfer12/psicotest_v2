import DefaultPhoto from "@/assets/images/defaultPhoto.jpg";
import Icon from "@/modules/core/components/icons/Icon";
import { useReturnTo } from "@/modules/core/hooks/navigation/useReturnTo";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import { toastSuccess } from "@/modules/core/utils/toasts";
import { validateRoute } from "@/modules/features/_layout/components/breadcrumb/utils/validateRoute";
import { useUserContext } from "@/modules/features/auth/context/UserContext";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Appointment, AppointmentStatus } from "../../../api/responses";
import CalendarCard, { CalendarCardFooterButton } from "./CalendarCard";
import { calcPassedHour } from "../../../utils/calcPassedHour";

interface Props {
  appointment: Appointment;
  sidebar?: boolean;
  psicologo?: {
    nombre: string;
    foto: string | null;
  };
}

const AppointmentCard = ({ appointment, sidebar = true, psicologo }: Props) => {
  const { user } = useUserContext();
  const navigate = useNavigate();
  const { goWithReturnTo } = useReturnTo();

  const [patched, setPatched] = useState(false);
  const [loading, setLoading] = useState(false);

  const { fetchData, postData } = useFetch();
  const patchMutation = postData("PATCH /cita/respuesta/:id");

  const imThePsicologist = appointment.email_psicologo === user?.email;

  const { data, setData } = fetchData(
    [
      "GET /cita/respuesta/status/:id_calendar",
      {
        id_calendar: appointment.id_calendar,
      },
    ],
    {
      params: {
        me: "true",
      },
      queryOptions: {
        //@ts-ignore
        enabled: imThePsicologist && !!appointment.id_calendar,
      },
    }
  );

  const handleRespuesta = () => {
    if (!data) return;
    if (!setData) return;
    setLoading(true);
    const status: AppointmentStatus = "accepted";
    patchMutation(
      {
        estado: status,
      },
      {
        params: {
          id: appointment.id,
        },
        onSuccess: () => {
          toastSuccess(
            {
              accepted: "Cita aceptada con éxito",
              declined: "Cita rechazada con éxito",
              needsAction: "Cita necesita acción",
            }[data]
          );
          setPatched(true);
          setData(status);
        },
        onSettled() {
          setLoading(false);
        },
      }
    );
  };

  const hora_inicio = appointment.hora_inicio.slice(0, 5);
  const hora_final = appointment.hora_final.slice(0, 5);

  const buttons: CalendarCardFooterButton[] = [];
  if (imThePsicologist && !!appointment.id_calendar) {
    buttons.push(
      {
        type: "secondary",
        title:
          "Aceptar la cita en el calendario (Enviaremos un correo de confirmación al paciente)",
        icon: !data
          ? Icon.Types.LOADER
          : data === "accepted"
          ? patched
            ? Icon.Types.CHECK_ANIMATED
            : Icon.Types.CHECK
          : Icon.Types.MAIL,
        subicon: !data || data === "accepted" ? undefined : Icon.Types.SEND,
        onClick: handleRespuesta,
        disabled: !data || loading || data === "accepted",
      },
      {
        type: "secondary",
        icon: Icon.Types.GOOGLE_CALENDAR,
        onClick: () => {
          window.open(
            appointment.html_link_calendar + `&authuser=${user?.email}`,
            "_blank"
          );
        },
      }
    );
  }
  buttons.push({
    text: imThePsicologist ? "Atender" : "Detalles",
    icon: imThePsicologist ? Icon.Types.PENCIL : Icon.Types.EYE,
    disabled: !imThePsicologist && !appointment.fecha_cierre_clinico,
    onClick: () => {
      if (psicologo) {
        navigate({
          to: "/calendar/$id",
          params: {
            id: String(appointment.id),
          },
          search: {
            returnTo: goWithReturnTo(
              validateRoute("/patients/$id", {
                id: String(appointment.email_paciente),
              })
            ),
          },
        });
      } else {
        navigate({
          to: "/calendar/$id",
          params: {
            id: String(appointment.id),
          },
        });
      }
    },
  });

  return (
    <CalendarCard shadowSuccess={!!appointment.fecha_cierre_clinico}>
      {sidebar && <CalendarCard.Aside date={appointment.fecha} />}
      <CalendarCard.Body>
        <CalendarCard.Header
          imageSrc={appointment.foto_paciente ?? DefaultPhoto}
          headerTexts={[
            [
              {
                text: appointment.nombre_paciente,
                onClick: psicologo
                  ? undefined
                  : () => {
                      navigate({
                        to: "/patients/$id",
                        params: {
                          id: String(appointment.email_paciente),
                        },
                        search: {
                          returnTo: goWithReturnTo(validateRoute("/calendar")),
                        },
                      });
                    },
              },
              {
                text: psicologo ? psicologo.nombre : appointment.email_paciente,
                icon: psicologo ? undefined : Icon.Types.MAIL,
                src: psicologo ? psicologo.foto ?? undefined : undefined,
              },
            ],
            [
              {
                text: `${hora_inicio} - ${hora_final}`,
                icon: Icon.Types.CLOCK,
              },
            ],
          ]}
        />
        <CalendarCard.Footer
          labels={[
            {
              color: appointment.fecha_cierre_clinico
                ? "success"
                : appointment.observaciones
                ? "warning"
                : calcPassedHour(appointment.fecha, appointment.hora_inicio)
                ? "danger"
                : "alto",
              text: appointment.fecha_cierre_clinico
                ? `${appointment.metodo}`
                : appointment.observaciones
                ? "Borrador"
                : calcPassedHour(appointment.fecha, appointment.hora_inicio)
                ? "Pendiente"
                : "Programado",
              icon: appointment.fecha_cierre_clinico
                ? Icon.Types.CHECK
                : undefined,
            },
          ]}
          buttons={buttons}
        />
      </CalendarCard.Body>
    </CalendarCard>
  );
};

export default AppointmentCard;
