import Button from "@/modules/core/components/ui/Button";
import Input from "@/modules/core/components/ui/Input";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { EventDTO, EventDTOSchema } from "../validations/EventDTO.schema";
import { getTodayUtc } from "@/modules/core/utils/getTodayUtc";
import { toastConfirm } from "@/modules/core/utils/toasts";

interface Props {
  event: Partial<EventDTO> | null;
  onSuccess: (event: EventDTO) => void;
  onDelete: () => void;
}

const EventForm = ({ event, onSuccess, onDelete }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      evento_nombre: event?.evento_nombre ?? "",
      evento_fecha: event?.evento_fecha ?? getTodayUtc(),
      evento_hora: event?.evento_hora ?? "",
      evento_latitud: event?.evento_latitud ?? -17.375174392296934,
      evento_longitud: event?.evento_longitud ?? -66.15867219891513,
    },
    resolver: yupResolver(EventDTOSchema),
  });

  const onSubmit = (form: EventDTO) => {
    onSuccess(form);
  };

  const handleDelete = () => {
    toastConfirm("¿Estás seguro de eliminar este evento?", onDelete);
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Nombre del evento"
        error={errors.evento_nombre?.message}
        required
        {...register("evento_nombre")}
      />
      <div className="flex gap-4">
        <Input
          label="Fecha del evento"
          error={errors.evento_fecha?.message}
          type="date"
          required
          {...register("evento_fecha")}
        />
        <Input
          label="Hora del evento"
          type="time"
          error={errors.evento_hora?.message}
          {...register("evento_hora")}
        />
      </div>
      <Input
        label="Latitud"
        error={errors.evento_latitud?.message}
        required
        {...register("evento_latitud")}
      />
      <Input
        label="Nombre"
        error={errors.evento_longitud?.message}
        required
        {...register("evento_longitud")}
      />
      <div className="flex gap-4">
        <Button className="flex-1" type="submit">
          Guardar
        </Button>
        <Button
          className="flex-1"
          type="button"
          btnType="secondary"
          danger
          onClick={handleDelete}
        >
          Eliminar
        </Button>
      </div>
    </form>
  );
};

export default EventForm;
