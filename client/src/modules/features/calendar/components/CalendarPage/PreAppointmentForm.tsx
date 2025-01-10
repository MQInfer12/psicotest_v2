import Button from "@/modules/core/components/ui/Button";
import Input from "@/modules/core/components/ui/Input";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import { User } from "@/modules/features/users/api/responses";
import { Genero } from "@/modules/features/users/types/Genero";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { PreAppointmentDTO } from "../../api/dtos";
import { CAREERS } from "../../data/careers";
import { PreAppointmentDTOSchema } from "../../validations/PreAppointmentDTO.schema";

interface Props {
  children?: React.ReactNode;
  withName?: boolean;
  user: User | null;
  onSuccess: (res: User, message: string) => Promise<void>;
}

const PreAppointmentForm = ({ withName, user, children, onSuccess }: Props) => {
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
  });

  const carrera = watch("carrera");

  return (
    <form
      className="flex flex-col gap-4 max-h-[80svh] overflow-auto"
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
          required
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
          required
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
          required
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
          required
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
          type="number"
          error={errors.semestre?.message}
          required
          {...register("semestre")}
        />
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
          value={CAREERS.find((c) => c.name === carrera)?.sub ?? "-"}
          required
          readOnly
          disabled
        />
        <Input
          label="&nbsp;"
          type="number"
          error={errors.codigo_estudiantil?.message}
          {...register("codigo_estudiantil")}
        />
      </div>
      <Input
        label={withName ? "Nombre del tutor" : "Nombre de tu apoderado"}
        error={errors.nombre_tutor?.message}
        {...register("nombre_tutor")}
      />
      <Input
        label={withName ? "Teléfono del tutor" : "Teléfono de tu apoderado"}
        type="number"
        error={errors.telefono_tutor?.message}
        {...register("telefono_tutor")}
      />
      <Button disabled={loading} type="submit">
        Enviar
      </Button>
    </form>
  );
};

export default PreAppointmentForm;
