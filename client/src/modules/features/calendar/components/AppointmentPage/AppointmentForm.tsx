import Button from "@/modules/core/components/ui/Button";
import Input from "@/modules/core/components/ui/Input";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import { toastSuccess } from "@/modules/core/utils/toasts";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AppointmentDTO } from "../../api/dtos";
import { AppointmentDTOSchema } from "../../validations/AppointmentDTO.schema";
import { Appointment } from "../../api/responses";
import { User } from "@/modules/features/users/api/responses";
import dayjs from "dayjs";

interface Props {
  cita: Appointment;
  user: User;
  onSuccess: (res: Appointment) => void;
}

const AppointmentForm = ({ cita, user, onSuccess }: Props) => {
  const [loading, setLoading] = useState(false);

  const { postData, fetchData } = useFetch();
  const patchMutation = postData("POST /cita");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<AppointmentDTO>({
    defaultValues: {
      fecha: cita.fecha,
      email_paciente: user.email,
      comprobar_ocupaciones: false,
    },
    resolver: yupResolver(AppointmentDTOSchema),
    context: {
      fechaCita: cita.fecha,
    },
  });

  const onSubmit = (form: AppointmentDTO) => {
    setLoading(true);
    patchMutation(
      {
        ...form,
        comprobar_ocupaciones: !form.comprobar_ocupaciones,
      },
      {
        onSuccess: (res) => {
          toastSuccess(res.message);
          onSuccess(res.data.cita);
        },
        onSettled: () => {
          setLoading(false);
        },
      }
    );
  };

  const selectedDate = watch("fecha");
  const showAll = watch("comprobar_ocupaciones");

  const { data } = fetchData("GET /horario/for/reprogramming", {
    params: {
      fecha: selectedDate,
      ocultar_ocupados: String(!showAll),
    },
    queryOptions: {
      gcTime: 0,
    },
  });

  useEffect(() => {
    //@ts-ignore
    if (data?.length === 0) setValue("id_horario", "");
  }, [selectedDate, showAll]);

  const dayLessThanAppointmentDate = dayjs(selectedDate).isBefore(
    cita.fecha,
    "day"
  );

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Fecha"
        type="date"
        {...register("fecha")}
        error={errors.fecha?.message}
        required
        danger={dayLessThanAppointmentDate}
      />
      <Input
        label="Horario"
        required
        {...register("id_horario")}
        error={errors.id_horario?.message}
        type="select"
        danger={data?.length === 0}
      >
        {!data && <option value="">Cargando...</option>}
        {data?.length === 0 && (
          <option value="">No tienes horarios disponibles este día</option>
        )}
        {(data?.length ?? 0) > 0 && (
          <option value="">Selecciona un horario</option>
        )}
        {data?.map((horario) => (
          <option key={horario.id} value={horario.id}>
            {horario.hora_inicio.slice(0, 5)} - {horario.hora_final.slice(0, 5)}
          </option>
        ))}
      </Input>
      <div className="flex items-center justify-end">
        <label
          htmlFor="checkbox-ocultar-ocupaciones"
          className="mx-2 text-xs font-semibold whitespace-nowrap text-alto-950 dark:text-alto-50"
        >
          Ver horarios ocupados
        </label>
        <input
          className="accent-primary-400"
          type="checkbox"
          id="checkbox-ocultar-ocupaciones"
          {...register("comprobar_ocupaciones")}
        />
      </div>
      <Button className="flex-1" disabled={loading} type="submit">
        Enviar
      </Button>
    </form>
  );
};

export default AppointmentForm;
