import Icon from "@/modules/core/components/icons/Icon";
import Button from "@/modules/core/components/ui/Button";
import Input from "@/modules/core/components/ui/Input";
import { useModal } from "@/modules/core/components/ui/modal/useModal";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import { useUserContext } from "@/modules/features/auth/context/UserContext";
import { User } from "@/modules/features/users/api/responses";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Appointment } from "../../api/responses";
import { stringFromDate } from "../../utils/stringFromDate";
import CancelationForm from "./CancelationForm";
import ReprogrammingForm from "./ReprogrammingForm";
import { useNavigate } from "@tanstack/react-router";

interface Props {
  cita: Appointment;
  user: User;
}

const localStorageKey = "psicotest-appointments-reprogramming";

const AppointmentReprogramming = ({ cita, user }: Props) => {
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState(() => {
    const storedData = JSON.parse(
      localStorage.getItem(localStorageKey) || "[]"
    );
    const appointmentData = storedData.find(
      (item: any) => item.idCita === cita.id
    );
    return appointmentData?.values?.selectedDate || cita.fecha;
  });

  const [selectedSchedule, setSelectedSchedule] = useState(() => {
    const storedData = JSON.parse(
      localStorage.getItem(localStorageKey) || "[]"
    );
    const appointmentData = storedData.find(
      (item: any) => item.idCita === cita.id
    );
    return appointmentData?.values?.selectedSchedule || "";
  });

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

  useEffect(() => {
    const storedData = JSON.parse(
      localStorage.getItem(localStorageKey) || "[]"
    );
    const updatedData = storedData.filter(
      (item: any) => item.idCita !== cita.id
    );

    updatedData.push({
      idCita: cita.id,
      values: {
        selectedDate,
        selectedSchedule: selectedSchedule,
      },
    });

    localStorage.setItem(localStorageKey, JSON.stringify(updatedData));
  }, [selectedDate, selectedSchedule, cita.id]);

  useEffect(() => {
    if (!data) return;
    const exists = data.find(
      (horario) => String(horario.id) === selectedSchedule
    );
    if (!exists) {
      setSelectedSchedule("");
    }
  }, [data]);

  const horarioSeleccionado = data?.find(
    (horario) => String(horario.id) === selectedSchedule
  );
  const { day } = selectedDate
    ? stringFromDate(dayjs(selectedDate))
    : { day: "" };
  const message = `Hola ${user.nombre.split(" ")[0]}, soy ${
    me?.nombre.split(" ")[0]
  }, te escribo del gabinete psicológico para informarte que tu cita esta siendo reprogramada para el día ${
    day || "DÍA"
  } ${selectedDate || "YYYY-MM-DD"} a horas ${
    horarioSeleccionado?.hora_inicio.slice(0, 5) ?? "HH:MM"
  }, por favor confírmame si estas de acuerdo con la nueva fecha y hora.`;

  const dayLessThanToday = dayjs(selectedDate).isBefore(dayjs(), "day");

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
        "Formulario de cancelación",
        <CancelationForm
          idCita={cita.id}
          onSuccess={() => {
            navigate({
              to: "/calendar",
            });
          }}
        />
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
              danger={dayLessThanToday}
              error={
                dayLessThanToday
                  ? "No puedes seleccionar una fecha anterior a hoy"
                  : undefined
              }
            />
            <Input
              value={selectedSchedule}
              onChange={(e) => setSelectedSchedule(e.target.value)}
              type="select"
              inputSize="small"
              danger={data?.length === 0}
              error={
                data?.length === 0
                  ? "No tienes horarios disponibles este día"
                  : undefined
              }
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
              reprogramación.
            </small>
          </div>
          <div className="flex flex-col gap-2 px-4">
            <Button
              btnType="secondary"
              btnSize="small"
              icon={Icon.Types.WHATSAPP}
              onClick={() => {
                window.open(
                  `https://wa.me/591${user.telefono}?text=${encodeURIComponent(
                    message
                  )}`,
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
                  `mailto:${
                    user.email
                  }?subject=Reprogramación de cita&body=${encodeURIComponent(
                    message
                  )}`,
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
