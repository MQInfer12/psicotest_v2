import Icon from "@/modules/core/components/icons/Icon";
import IconMessage from "@/modules/core/components/icons/IconMessage";
import Button from "@/modules/core/components/ui/Button";
import { useUserContext } from "../../auth/context/UserContext";
import { stringFromDate } from "../utils/stringFromDate";
import dayjs from "dayjs";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import { toastConfirm, toastSuccess } from "@/modules/core/utils/toasts";

const NextAppointmentBanner = () => {
  const { user, setUser } = useUserContext();
  const { postData } = useFetch();
  const cancelMutation = postData("DELETE /cita/:id");

  const cita_proxima = user?.cita_proxima!;
  const { day, date, month } = stringFromDate(dayjs(cita_proxima.fecha));
  const hora_inicio = cita_proxima.hora_inicio.slice(0, 5);

  const handleCancelAppointment = () => {
    toastConfirm("¿Estás seguro de cancelar la cita?", () => {
      cancelMutation(null, {
        params: {
          id: cita_proxima.id,
        },
        onSuccess(res) {
          setUser(res.data);
          toastSuccess("Cita cancelada correctamente");
        },
      });
    });
  };

  return (
    <section className="flex flex-col gap-6 flex-1 overflow-hidden w-full">
      <header className="h-10 flex items-center px-4 max-lg:px-0">
        <strong className="text-primary-900">Cita programada</strong>
      </header>
      <div className="flex-1 flex flex-col gap-8 items-center justify-center">
        <IconMessage icon={Icon.Types.CALENDAR} message="¡Tienes una cita!">
          <p className="font-bold">{cita_proxima.nombre_psicologo}</p>
          <small className="text-alto-600">
            {day}, {date} de {month} a las {hora_inicio}
          </small>
        </IconMessage>
        <Button btnType="secondary" onClick={handleCancelAppointment}>
          Cancelar
        </Button>
      </div>
    </section>
  );
};

export default NextAppointmentBanner;