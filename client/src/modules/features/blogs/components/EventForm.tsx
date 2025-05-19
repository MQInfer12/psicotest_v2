import Button from "@/modules/core/components/ui/Button";
import Input from "@/modules/core/components/ui/Input";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { EventDTO, EventDTOSchema } from "../validations/EventDTO.schema";
import { getTodayUtc } from "@/modules/core/utils/getTodayUtc";
import { toastConfirm } from "@/modules/core/utils/toasts";
import { lazy, Suspense } from "react";
import Loader from "@/modules/core/components/ui/loader/Loader";

const LazyMapInput = lazy(() => import("./MapInput"));

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
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      nombre: event?.nombre ?? "",
      fecha: event?.fecha ?? getTodayUtc(),
      hora: event?.hora ?? "",
      latitud: event?.latitud ?? -17.375174392296934,
      longitud: event?.longitud ?? -66.15867219891513,
    },
    resolver: yupResolver(EventDTOSchema),
  });

  const onSubmit = (form: EventDTO) => {
    onSuccess(form);
  };

  const handleDelete = () => {
    toastConfirm("¿Estás seguro de eliminar este evento?", onDelete);
  };

  const lat = watch("latitud");
  const lng = watch("longitud");

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Nombre del evento"
        error={errors.nombre?.message}
        required
        {...register("nombre")}
      />
      <div className="flex gap-4">
        <Input
          label="Fecha del evento"
          error={errors.fecha?.message}
          type="date"
          required
          {...register("fecha")}
        />
        <Input
          label="Hora del evento"
          type="time"
          error={errors.hora?.message}
          {...register("hora")}
        />
      </div>
      <div className="h-[400px] w-full">
        <Suspense
          fallback={
            <div className="h-full w-full">
              <Loader text="Cargando mapa..." />
            </div>
          }
        >
          <LazyMapInput
            lat={lat}
            lng={lng}
            onChange={({ lat, lng }) => {
              setValue("latitud", lat, { shouldValidate: true });
              setValue("longitud", lng, { shouldValidate: true });
            }}
          />
        </Suspense>
      </div>
      <div className="flex gap-4">
        <Input
          label="Latitud"
          error={errors.latitud?.message}
          required
          disabled
          {...register("latitud")}
        />
        <Input
          label="Longitud"
          error={errors.longitud?.message}
          required
          disabled
          {...register("longitud")}
        />
      </div>
      <div className="flex gap-4">
        <Button className="flex-1" type="submit">
          Guardar
        </Button>
        {event?.fecha && (
          <Button
            className="flex-1"
            type="button"
            btnType="secondary"
            danger
            onClick={handleDelete}
          >
            Eliminar
          </Button>
        )}
      </div>
    </form>
  );
};

export default EventForm;
