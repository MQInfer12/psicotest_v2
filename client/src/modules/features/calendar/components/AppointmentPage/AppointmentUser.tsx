import DefaultPhoto from "@/assets/images/defaultPhoto.jpg";
import Icon from "@/modules/core/components/icons/Icon";
import Button from "@/modules/core/components/ui/Button";
import { useModal } from "@/modules/core/components/ui/modal/useModal";
import { formatDate } from "@/modules/core/utils/formatDate";
import { getRelativeTime } from "@/modules/core/utils/getRelativeTime";
import { measureAge } from "@/modules/core/utils/measureAge";
import { toastSuccess } from "@/modules/core/utils/toasts";
import { validateRoute } from "@/modules/features/_layout/components/breadcrumb/utils/validateRoute";
import AnswerCardTemplate, {
  AnswerCardTemplateTab,
} from "@/modules/features/answers/components/AnswerCardTemplate";
import { User } from "@/modules/features/users/api/responses";
import { useNavigate } from "@tanstack/react-router";
import clsx from "clsx";
import { Appointment } from "../../api/responses";
import PreAppointmentForm from "../CalendarPage/PreAppointmentForm";
import AppointmentReprogramming from "./AppointmentReprogramming";
import UserResume from "./UserResume";
import AppointmentReconsult from "./AppointmentReconsult";
import { SetData } from "@/modules/core/hooks/useFetch/getSetData";
import AppointmentUserContractButton from "./AppointmentUserContractButton";
import { useUserContext } from "@/modules/features/auth/context/UserContext";
import { useReturnTo } from "@/modules/core/hooks/navigation/useReturnTo";

interface Props {
  id: number;
  user: User;
  cita: Appointment;
  hasPassed: boolean;
  setData: SetData<{
    cita: Appointment;
    paciente: User;
  }>;
}

function abreviaturaOrdinal(numero: number) {
  const abreviaturas: Record<number, string> = {
    1: "1er",
    2: "2do",
    3: "3er",
    4: "4to",
    5: "5to",
    6: "6to",
    7: "7mo",
    8: "8vo",
    9: "9no",
    10: "10mo",
    11: "11vo",
    12: "12vo",
  };
  return abreviaturas[numero] || `${numero}°`;
}

const AppointmentUser = ({ id, user, cita, setData, hasPassed }: Props) => {
  const { modal, setOpen } = useModal();
  const navigate = useNavigate();
  const { user: me } = useUserContext();
  const { goWithReturnTo } = useReturnTo();

  const DATA = [
    {
      title: "Género",
      value: user.genero || "-",
      icon: user.genero
        ? user.genero === "Hombre"
          ? Icon.Types.GENDER_MALE
          : Icon.Types.GENDER_FEMALE
        : Icon.Types.GENDER_NONE,
    },
    {
      title: "Fecha de nacimiento",
      value: user.fecha_nacimiento
        ? `${formatDate(user.fecha_nacimiento)} (${measureAge(user.fecha_nacimiento, cita.fecha)} años)`
        : "-",
      icon: Icon.Types.CAKE,
    },
    {
      title: "Carrera",
      value: user.carrera
        ? `${user.carrera} ${user.semestre ? `(${abreviaturaOrdinal(user.semestre)} sem.)` : ""}`
        : "-",
      icon: Icon.Types.CAREER,
    },
    {
      title: "Código estudiantil",
      value: user.codigo_estudiantil || "-",
      icon: Icon.Types.BARCODE,
    },
    {
      title: "Teléfono",
      value: user.telefono ? `${user.telefono} (${user.nombre})` : "-",
      icon: Icon.Types.PHONE,
      onClick: () => {
        if (!user.telefono) return;
        window.open(`https://wa.me/591${user.telefono}`);
      },
      disabled: !user.telefono,
    },
    {
      title: "Nombre del tutor",
      value: user.nombre_tutor
        ? user.telefono_tutor
          ? `${user.telefono_tutor} (${user.nombre_tutor})`
          : user.nombre_tutor
        : "-",
      icon: Icon.Types.CONTACTPHONE,
      onClick: () => {
        if (!user.telefono_tutor) return;
        window.open(`https://wa.me/591${user.telefono_tutor}`);
      },
      disabled: !user.telefono_tutor,
    },
  ];

  if (!hasPassed) {
    DATA.push(
      {
        title: "Citas anteriores",
        value: `${user.contador_citas} cita${user.contador_citas !== 1 ? "s" : ""} previa${user.contador_citas !== 1 ? "s" : ""}`,
        icon: Icon.Types.CALENDAR_WEEK,
        onClick: () => {
          navigate({
            to: "/patients/$id",
            params: {
              id: user.email,
            },
            search: {
              returnTo: goWithReturnTo(
                validateRoute("/calendar/$id", {
                  id: String(id),
                })
              ),
            },
          });
        },
        disabled: false,
      },
      {
        title: "Última cita",
        value: user.fecha_ultima_cita
          ? `${formatDate(user.fecha_ultima_cita)} (${getRelativeTime(
              user.fecha_ultima_cita
            )})`
          : "Nunca",
        icon: Icon.Types.TIMELINE,
      }
    );
  }

  DATA.push(
    {
      title: "Cita actual",
      value: `${formatDate(cita.fecha)} ${hasPassed ? `(${getRelativeTime(cita.fecha)})` : `(${cita.hora_inicio.slice(0, 5)} - ${cita.hora_final.slice(0, 5)})`}`,
      icon: Icon.Types.CALENDAR,
    },
    {
      title: "Psicólogo",
      value: `${cita.nombre_psicologo} ${cita.email_psicologo === me?.email ? "(Tú)" : ""}`,
      icon: Icon.Types.CALENDAR_USER,
    }
  );

  const tabs: AnswerCardTemplateTab[] = [
    {
      title: "Paciente",
      component: (
        <div className="w-full h-full p-4 flex flex-col justify-between">
          <div className="flex gap-4 max-lg:flex-col max-lg:items-center">
            <div className="flex flex-col h-full max-lg:h-[170px] gap-4">
              <div className="h-[120px] w-[120px] aspect-square z-10 rounded-lg overflow-hidden shadow-md border-4 border-white dark:border-alto-400">
                <img
                  className="w-full h-full bg-alto-100"
                  src={user.foto ?? DefaultPhoto}
                  alt={user.email}
                  onError={(event) => {
                    event.currentTarget.src = DefaultPhoto;
                  }}
                />
              </div>
              <div className="flex justify-between gap-2">
                <Button
                  className="w-full"
                  btnSize="small"
                  btnType="secondary"
                  icon={Icon.Types.PENCIL}
                  onClick={() => setOpen(true)}
                />
                <AppointmentUserContractButton user={user} />
              </div>
            </div>
            <div className="h-full max-lg:w-full flex-1 py-1 flex flex-col overflow-hidden">
              <strong
                className="text-lg overflow-hidden text-ellipsis whitespace-nowrap max-lg:text-center text-alto-950 dark:text-alto-50 hover:underline cursor-pointer max-w-fit"
                title={user.nombre}
                onClick={() => {
                  navigate({
                    to: "/patients/$id",
                    params: {
                      id: user.email,
                    },
                    search: {
                      returnTo: goWithReturnTo(
                        validateRoute("/calendar/$id", {
                          id: String(id),
                        })
                      ),
                    },
                  });
                }}
              >
                {user.nombre}
              </strong>
              <p
                className="text-sm text-alto-400 text-ellipsis whitespace-nowrap overflow-hidden max-lg:text-center"
                title={user.email}
              >
                {user.email}
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {DATA.map((data) => (
                  <div key={data.title} title={`${data.value} (${data.title})`}>
                    <div
                      className={clsx(
                        "flex gap-3 items-center max-w-max text-alto-700 dark:text-alto-400",
                        {
                          "cursor-pointer hover:text-primary-400":
                            !!data.onClick && !data.disabled,
                        }
                      )}
                      onClick={data.onClick}
                    >
                      <div className="min-w-5 max-w-5 aspect-square text-primary-400">
                        <Icon type={data.icon} />
                      </div>
                      <p
                        className={clsx(
                          "overflow-hidden whitespace-nowrap text-ellipsis text-xs",
                          {
                            underline: !!data.onClick && !data.disabled,
                          }
                        )}
                      >
                        {data.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  if (!hasPassed) {
    tabs.push({
      title: "Resumen",
      component: <UserResume user={user} />,
    });

    if (cita.metodo) {
      tabs.push({
        title: "Reconsulta",
        component: (
          <AppointmentReconsult cita={cita} user={user} setData={setData} />
        ),
      });
    } else {
      tabs.push({
        title: "Reprogramación",
        component: <AppointmentReprogramming cita={cita} user={user} />,
      });
    }
  }

  return (
    <>
      {modal(
        "Datos del paciente",
        <PreAppointmentForm
          withName
          user={user}
          onSuccess={async (res, message) => {
            toastSuccess(message);
            setData((prev) => ({ ...prev, paciente: res }));
            setOpen(false);
          }}
        />,
        {
          width: 480,
        }
      )}
      <AnswerCardTemplate gridArea="user" tabs={tabs} />
    </>
  );
};

export default AppointmentUser;
