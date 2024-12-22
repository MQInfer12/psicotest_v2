import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import { Schedule } from "../api/responses";
import { calcularTiempo } from "../utils/calcularTiempo";
import { toastConfirm, toastSuccess } from "@/modules/core/utils/toasts";
import { useUserContext } from "../../auth/context/UserContext";

interface Props {
  horario: Schedule;
  fecha: string;
  dia: string;
}

const ScheduleCard = ({ horario, fecha, dia }: Props) => {
  const { setUser } = useUserContext();
  const { postData } = useFetch();
  const mutation = postData("POST /cita");

  const hora_inicio = horario.hora_inicio.slice(0, 5);
  const hora_final = horario.hora_final.slice(0, 5);

  const handleRequestAppointment = () => {
    toastConfirm(
      `¿Quieres solicitar una cita el ${dia.toLocaleLowerCase()} a las ${hora_inicio}?`,
      () => {
        mutation(
          {
            id_horario: horario.id,
            fecha,
          },
          {
            onSuccess: (res) => {
              toastSuccess("Cita solicitada con éxito");
              setUser(res.data);
            },
          }
        );
      }
    );
  };

  return (
    <button
      onClick={handleRequestAppointment}
      className="flex items-center justify-between gap-10 bg-alto-50 px-4 py-2 border border-alto-300 rounded-md shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-primary-200"
    >
      <div className="flex items-center h-full gap-10">
        <div className="flex flex-col w-12">
          <strong className="text-xl text-primary-900">{hora_inicio}</strong>
          <small className="text-alto-500">~ {hora_final}</small>
        </div>
        <span className="h-[80%] w-1 rounded-full bg-primary-400" />
        <div className="flex flex-col items-start gap-1">
          <small className="text-alto-500 text-xs">
            {calcularTiempo(hora_inicio, hora_final)} apróx. con:
          </small>
          <p className="font-medium">{horario.nombre_user}</p>
        </div>
      </div>
    </button>
  );
};

export default ScheduleCard;
