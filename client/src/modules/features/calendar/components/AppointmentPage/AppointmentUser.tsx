import DefaultPhoto from "@/assets/images/defaultPhoto.jpg";
import Icon from "@/modules/core/components/icons/Icon";
import Button from "@/modules/core/components/ui/Button";
import { useModal } from "@/modules/core/components/ui/modal/useModal";
import { formatDate } from "@/modules/core/utils/formatDate";
import { measureAge } from "@/modules/core/utils/measureAge";
import { toastSuccess } from "@/modules/core/utils/toasts";
import AnswerCardTemplate from "@/modules/features/answers/components/AnswerCardTemplate";
import { User } from "@/modules/features/users/api/responses";
import PreAppointmentForm from "../CalendarPage/PreAppointmentForm";
import clsx from "clsx";
import { useNavigate } from "@tanstack/react-router";
import { validateRoute } from "@/modules/features/_layout/components/breadcrumb/utils/validateRoute";
import UserResume from "./UserResume";
import { UserResumeContextProvider } from "../../context/UserResumeContext";

interface Props {
  id: number;
  user: User;
  fecha: string;
  onSuccess: (res: User) => void;
}

const AppointmentUser = ({ id, user, fecha, onSuccess }: Props) => {
  const { modal, setOpen } = useModal();
  const navigate = useNavigate();

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
        ? `${formatDate(user.fecha_nacimiento)} (${measureAge(user.fecha_nacimiento, fecha)} años)`
        : "-",
      icon: Icon.Types.CAKE,
    },
    {
      title: "Teléfono",
      value: user.telefono ? String(user.telefono) : "-",
      icon: Icon.Types.PHONE,
      onClick: () => {
        if (!user.telefono) return;
        window.open(`https://wa.me/591${user.telefono}`);
      },
      disabled: !user.telefono,
    },
    {
      title: "Carrera",
      value: user.carrera || "-",
      icon: Icon.Types.CAREER,
    },
    {
      title: "Semestre",
      value: user.semestre ? `Semestre ${user.semestre}` : "-",
      icon: Icon.Types.PROGRESS,
    },
    {
      title: "Código estudiantil",
      value: user.codigo_estudiantil || "-",
      icon: Icon.Types.BARCODE,
    },
    {
      title: "Nombre del tutor",
      value: user.nombre_tutor || "-",
      icon: Icon.Types.CONTACT,
    },
    {
      title: "Teléfono del tutor",
      value: user.telefono_tutor ? String(user.telefono_tutor) : "-",
      icon: Icon.Types.CONTACTPHONE,
      onClick: () => {
        if (!user.telefono_tutor) return;
        window.open(`https://wa.me/591${user.telefono_tutor}`);
      },
      disabled: !user.telefono_tutor,
    },
    {
      title: "Citas anteriores",
      value: `${user.contador_citas} cita${user.contador_citas !== 1 ? "s" : ""} previa${user.contador_citas !== 1 ? "s" : ""}`,
      icon: Icon.Types.CALENDAR,
      onClick: () => {
        navigate({
          to: "/patients/$id",
          params: {
            id: user.email,
          },
          search: {
            returnTo: validateRoute("/calendar/$id", {
              id: String(id),
            }),
          },
        });
      },
    },
  ];

  return (
    <>
      {modal(
        "Datos del paciente",
        <PreAppointmentForm
          withName
          user={user}
          onSuccess={async (res, message) => {
            toastSuccess(message);
            onSuccess(res);
            setOpen(false);
          }}
        />,
        {
          width: 480,
        }
      )}
      <UserResumeContextProvider user={user}>
        <AnswerCardTemplate
          gridArea="user"
          tabs={[
            {
              title: "Datos del paciente",
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
                      <div className="flex justify-between gap-4">
                        <Button
                          className="w-full"
                          btnSize="small"
                          btnType="secondary"
                          icon={Icon.Types.PENCIL}
                          onClick={() => setOpen(true)}
                        >
                          Editar
                        </Button>
                      </div>
                    </div>
                    <div className="h-full max-lg:w-full flex-1 py-1 flex flex-col overflow-hidden">
                      <strong
                        className="text-lg overflow-hidden text-ellipsis whitespace-nowrap max-lg:text-center text-alto-950 dark:text-alto-50"
                        title={user.nombre}
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
                          <div
                            key={data.title}
                            title={`${data.value} (${data.title})`}
                          >
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
            {
              title: "Resumen",
              component: <UserResume user={user} />,
            },
          ]}
        />
      </UserResumeContextProvider>
    </>
  );
};

export default AppointmentUser;
