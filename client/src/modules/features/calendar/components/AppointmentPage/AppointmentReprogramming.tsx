import Icon from "@/modules/core/components/icons/Icon";
import Button from "@/modules/core/components/ui/Button";
import Input from "@/modules/core/components/ui/Input";
import { useState } from "react";
import { Appointment } from "../../api/responses";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import { User } from "@/modules/features/users/api/responses";
import { useUserContext } from "@/modules/features/auth/context/UserContext";
import { stringFromDate } from "../../utils/stringFromDate";
import dayjs from "dayjs";
import { useModal } from "@/modules/core/components/ui/modal/useModal";
import ReprogrammingForm from "./ReprogrammingForm";
import CancelationForm from "./CancelationForm";

interface Props {
  cita: Appointment;
  user: User;
}

const AppointmentReprogramming = ({ cita, user }: Props) => {
  const [selectedDate, setSelectedDate] = useState(cita.fecha);
  const [selectedSchedule, setSelectedSchedule] = useState("");
  const { user: me } = useUserContext();
  const { modal: modalReprogramming, setOpen: setOpenReprogramming } =
    useModal();
  const { modal: modalCancelation, setOpen: setOpenCancelation } = useModal();

  const { fetchData } = useFetch();
  const { data } = fetchData("GET /horario/for/reprogramming", {
    params: {
      fecha: selectedDate,
    },
  });

  const horarioSeleccionado = data?.find(
    (horario) => String(horario.id) === selectedSchedule
  );
  const { day } = stringFromDate(dayjs(selectedDate));
  const message = `Hola ${user.nombre.split(" ")[0]}, soy ${me?.nombre.split(" ")[0]}, te escribo del gabinete psicológico para informarte que tu cita esta siendo reprogramada para el día ${day ?? "DÍA"} ${selectedDate || "YYYY-MM-DD"} a horas ${horarioSeleccionado?.hora_inicio ?? "HH:MM"}, por favor confírmame si estas de acuerdo con la nueva fecha y hora.`;

  return (
    <>
      {modalReprogramming(
        "Formulario de reprogramación",
        <ReprogrammingForm
          fecha={selectedDate}
          idCita={cita.id}
          idHorario={selectedSchedule}
        />
      )}
      {modalCancelation(
        "Formulario de reprogramación",
        <CancelationForm idCita={cita.id} />
      )}
      <div className="flex h-full w-full overflow-hidden">
        <div className="flex flex-col justify-between gap-4 flex-1 h-full py-4 overflow-hidden">
          <div className="flex flex-col gap-2 overflow-auto px-4">
            <strong>1</strong>
            <small className="w-full text-alto-950 dark:text-alto-50 opacity-60 leading-relaxed text-center text-xs">
              Si deseas reprogramar la cita revisa primeramente tus horarios
              disponibles próximamente.
            </small>
          </div>
          <div className="flex flex-col gap-2 px-4">
            <Input
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setSelectedSchedule("");
              }}
              type="date"
              inputSize="small"
            />
            <Input
              value={selectedSchedule}
              onChange={(e) => setSelectedSchedule(e.target.value)}
              type="select"
              inputSize="small"
              danger={data?.length === 0}
            >
              {!data && <option value="">Cargando...</option>}
              {data?.length === 0 && (
                <option value="">
                  No tienes horarios disponibles este día
                </option>
              )}
              {(data?.length ?? 0) > 0 && (
                <option value="">Selecciona un horario</option>
              )}
              {data?.map((horario) => (
                <option key={horario.id} value={horario.id}>
                  {horario.hora_inicio.slice(0, 5)} -{" "}
                  {horario.hora_final.slice(0, 5)}
                </option>
              ))}
            </Input>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-4 flex-1 h-full py-4 border-x overflow-hidden">
          <div className="flex flex-col gap-2 overflow-auto px-4">
            <strong>2</strong>
            <small className="w-full text-alto-950 dark:text-alto-50 opacity-60 leading-relaxed text-center text-xs">
              Por favor contacta con el paciente para informarle de la
              reprogramación .
            </small>
          </div>
          <div className="flex flex-col gap-2 px-4">
            <Button
              btnType="secondary"
              btnSize="small"
              icon={Icon.Types.WHATSAPP}
              onClick={() => {
                window.open(
                  `https://wa.me/591${user.telefono}?text=${encodeURIComponent(message)}`,
                  "_blank"
                );
              }}
            >
              Whatsapp
            </Button>
            <Button
              btnType="secondary"
              btnSize="small"
              icon={Icon.Types.MAIL}
              onClick={() => {
                window.open(
                  `mailto:${user.email}?subject=Reprogramación de cita&body=${encodeURIComponent(message)}`,
                  "_blank"
                );
              }}
            >
              Correo electrónico
            </Button>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-4 flex-1 h-full py-4 overflow-hidden">
          <div className="flex flex-col gap-2 overflow-auto px-4">
            <strong>3</strong>
            <small className="w-full text-alto-950 dark:text-alto-50 opacity-60 leading-relaxed text-center text-xs">
              Una vez el paciente haya sido contactado, puedes reprogramar o
              cancelar la cita.
            </small>
          </div>
          <div className="flex flex-col gap-2 px-4">
            <Button
              onClick={() => setOpenReprogramming(true)}
              btnSize="small"
              icon={Icon.Types.CALENDAR}
            >
              Reprogramar
            </Button>
            <Button
              onClick={() => setOpenCancelation(true)}
              btnType="secondary"
              danger
              btnSize="small"
              icon={Icon.Types.CANCEL}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AppointmentReprogramming;
