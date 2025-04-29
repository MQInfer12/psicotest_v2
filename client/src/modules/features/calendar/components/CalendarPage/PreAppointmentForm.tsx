import Button from "@/modules/core/components/ui/Button";
import Input from "@/modules/core/components/ui/Input";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import { User } from "@/modules/features/users/api/responses";
import { Genero } from "@/modules/features/users/types/Genero";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { PreAppointmentDTO } from "../../api/dtos";
import { CAREERS } from "../../data/careers";
import { PreAppointmentDTOSchema } from "../../validations/PreAppointmentDTO.schema";
import clsx from "clsx";

interface Props {
  children?: React.ReactNode;
  withName?: boolean;
  user: User | null;
  onSuccess: (res: User, message: string) => Promise<void>;
  scrollable?: boolean;
  required?: boolean;
}

const PreAppointmentForm = ({
  withName,
  user,
  children,
  onSuccess,
  scrollable = true,
  required = true,
}: Props) => {
  const { postData } = useFetch();
  const userMutation = postData("PUT /user/:id/psicotest");
  const [loading, setLoading] = useState(false);

  const onSubmit = (form: PreAppointmentDTO) => {
    setLoading(true);
    userMutation(
      {
        ...form,
        codigo_estudiantil:
          (CAREERS.find((c) => c.name === form.carrera)?.sub ?? "") +
          form.codigo_estudiantil,
      },
      {
        params: {
          id: String(user?.email),
        },
        onSuccess: async (res) => {
          await onSuccess(res.data, res.message);
          setLoading(false);
        },
        onError: () => {
          setLoading(false);
        },
      }
    );
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      nombre: user?.nombre,
      genero: user?.genero ?? undefined,
      fecha_nacimiento: user?.fecha_nacimiento ?? undefined,
      carrera: user?.carrera ?? undefined,
      semestre: user?.semestre ?? undefined,
      codigo_estudiantil: user?.codigo_estudiantil
        ? Number(user.codigo_estudiantil.slice(3))
        : undefined,
      telefono: user?.telefono ?? undefined,
      nombre_tutor: user?.nombre_tutor ?? undefined,
      telefono_tutor: user?.telefono_tutor ?? undefined,
    },
    resolver: yupResolver(PreAppointmentDTOSchema),
    context: {
      required,
    },
  });

  const [prevCarrera, setPrevCarrera] = useState<string | undefined>(
    user?.carrera ?? undefined
  );
  const carrera = watch("carrera");
  const carreraSelected = CAREERS.find((c) => c.name === carrera);

  useEffect(() => {
    if (prevCarrera === carrera) return;
    setPrevCarrera(carrera);
    //@ts-expect-error: Semestre can be setted to empty string
    setValue("semestre", "");
  }, [carrera]);

  return (
    <form
      className={clsx("flex flex-col gap-4 max-h-[80svh]", {
        "overflow-auto": scrollable,
      })}
      onSubmit={handleSubmit(onSubmit)}
    >
      {children}
      {withName && (
        <>
          <Input
            label="Nombre"
            error={errors.nombre?.message}
            required
            {...register("nombre")}
          />
          <Input label="Email" value={user?.email} readOnly required disabled />
        </>
      )}
      <div
        className="grid gap-4 overflow-hidden min-h-min"
        style={{
          gridTemplateColumns: "1fr 1fr",
        }}
      >
        <Input
          label="Género"
          type="select"
          error={errors.genero?.message}
          required={required}
          {...register("genero")}
        >
          <option value="">Selecciona un género</option>
          {Object.values(Genero).map((genero) => (
            <option key={genero} value={genero}>
              {genero}
            </option>
          ))}
        </Input>
        <Input
          label="Fecha de nacimiento"
          type="date"
          error={errors.fecha_nacimiento?.message}
          required={required}
          {...register("fecha_nacimiento")}
        />
      </div>
      <div
        className="grid gap-4 overflow-hidden min-h-min"
        style={{
          gridTemplateColumns: "80px 1fr",
        }}
      >
        <Input
          label="Teléfono"
          className="text-center"
          value="+591"
          readOnly
          required={required}
          disabled
        />
        <Input
          label="&nbsp;"
          type="number"
          error={errors.telefono?.message}
          {...register("telefono")}
        />
      </div>
      <div
        className="grid gap-4 overflow-hidden min-h-min"
        style={{
          gridTemplateColumns: "1fr 80px",
        }}
      >
        <Input
          label="Carrera"
          type="select"
          error={errors.carrera?.message}
          required={required}
          {...register("carrera")}
        >
          <option value="">Selecciona una carrera</option>
          {CAREERS.map((c) => (
            <option key={c.sub} value={c.name}>
              {c.name}
            </option>
          ))}
        </Input>
        <Input
          label="Semestre"
          type="select"
          error={errors.semestre?.message}
          required={required}
          {...register("semestre")}
        >
          <option value="">-</option>
          {carreraSelected ? (
            Array.of(...Array(carreraSelected.semesters)).map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))
          ) : (
            <option value="">Selecciona una carrera primero</option>
          )}
        </Input>
      </div>
      <div
        className="grid gap-4 overflow-hidden min-h-min"
        style={{
          gridTemplateColumns: "80px 1fr",
        }}
      >
        <Input
          label="Código estudiantil"
          className="text-center"
          value={carreraSelected?.sub ?? "-"}
          required={required}
          readOnly
          disabled
          overflowLabel
        />
        <Input
          label="&nbsp;"
          type="number"
          error={errors.codigo_estudiantil?.message}
          {...register("codigo_estudiantil")}
        />
      </div>
      <Input
        label={"Nombre del padre / madre / tutor"}
        error={errors.nombre_tutor?.message}
        required={required}
        {...register("nombre_tutor")}
      />
      <div
        className="grid gap-4 overflow-hidden min-h-min"
        style={{
          gridTemplateColumns: "80px 1fr",
        }}
      >
        <Input
          label={"Teléfono del padre / madre / tutor"}
          className="text-center"
          value="+591"
          readOnly
          required={required}
          disabled
          overflowLabel
        />
        <Input
          label="&nbsp;"
          type="number"
          error={errors.telefono_tutor?.message}
          {...register("telefono_tutor")}
        />
      </div>
      <Button disabled={loading} type="submit">
        Enviar
      </Button>
    </form>
  );
};

export default PreAppointmentForm;
