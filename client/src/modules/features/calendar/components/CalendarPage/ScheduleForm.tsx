import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toastSuccess } from "@/modules/core/utils/toasts";
import Input from "@/modules/core/components/ui/Input";
import Button from "@/modules/core/components/ui/Button";
import { Schedule } from "../../api/responses";
import { ScheduleDTOSchema } from "../../validations/ScheduleDTO.schema";
import { DAYS } from "../../data/days";
import { ScheduleDTO } from "../../api/dtos";

interface Props {
  onSuccess: (schedule: Schedule) => void;
}

const ScheduleForm = ({ onSuccess }: Props) => {
  const [loading, setLoading] = useState(false);

  const { postData } = useFetch();

  const postMutation = postData("POST /horario");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      minutos: 30,
      tipo: "Presencial",
    },
    resolver: yupResolver(ScheduleDTOSchema),
  });

  const onSubmit = (form: ScheduleDTO) => {
    setLoading(true);
    postMutation(form, {
      onSuccess: (res) => {
        toastSuccess(res.message);
        onSuccess(res.data);
      },
      onSettled: () => {
        setLoading(false);
      },
    });
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Día"
        error={errors.dia?.message}
        type="select"
        required
        {...register("dia")}
      >
        <option value="">Elije un día</option>
        {DAYS.map((d, i) => (
          <option key={d.dia} value={i}>
            {d.dia}
          </option>
        ))}
      </Input>
      <Input
        label="Hora"
        type="time"
        required
        error={errors.hora_inicio?.message}
        {...register("hora_inicio")}
      />
      <Input
        label="Minutos"
        type="number"
        required
        error={errors.minutos?.message}
        {...register("minutos")}
      />
      <Input
        label="Tipo"
        type="select"
        error={errors.tipo?.message}
        {...register("tipo")}
        required
      >
        <option value="Presencial">Presencial</option>
        <option value="Virtual">Virtual</option>
      </Input>
      <Button disabled={loading} type="submit">
        Enviar
      </Button>
    </form>
  );
};

export default ScheduleForm;
