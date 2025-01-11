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

interface Props {
  user: User;
  fecha: string;
  onSuccess: (res: User) => void;
  hasPassed: boolean;
}

const AppointmentUser = ({ user, fecha, onSuccess, hasPassed }: Props) => {
  const { modal, setOpen } = useModal();

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
      icon: Icon.Types.CALENDAR,
    },
    {
      title: "Teléfono",
      value: user.telefono ? String(user.telefono) : "-",
      icon: Icon.Types.PHONE,
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
                    {!hasPassed && (
                      <Button
                        btnSize="small"
                        btnType="secondary"
                        icon={Icon.Types.PENCIL}
                        onClick={() => setOpen(true)}
                      >
                        Editar
                      </Button>
                    )}
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
                          className="flex gap-3 items-center"
                        >
                          <div className="min-w-5 max-w-5 aspect-square text-primary-400">
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
      />
    </>
  );
};

export default AppointmentUser;
