import { UserDTO } from "../api/dtos";
import { User } from "../api/responses";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { UserDTOSchema } from "../validations/UserDTO.schema";
import { toastSuccess } from "@/modules/core/utils/toasts";
import { Genero } from "../types/Genero";
import Input from "@/modules/core/components/ui/Input";
import Button from "@/modules/core/components/ui/Button";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import { useState } from "react";

interface Props {
  user: User | null;
  onSuccess: (user: User) => void;
}

const UserForm = ({ user, onSuccess }: Props) => {
  const [loading, setLoading] = useState(false);

  const { postData } = useFetch();
  const postMutation = postData("POST /user");
  const putMutation = postData("PUT /user/:id/psicotest");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: user?.email,
      nombre: user?.nombre,
      foto: user?.foto,
      fecha_nacimiento: user?.fecha_nacimiento,
      genero: user?.genero ? String(user.genero) : "",
    },
    resolver: yupResolver(UserDTOSchema),
  });

  const onSubmit = (form: UserDTO) => {
    setLoading(true);
    if (!user) {
      postMutation(form, {
        onSuccess: (res) => {
          toastSuccess(res.message);
          onSuccess(res.data);
        },
        onSettled: () => {
          setLoading(false);
        },
      });
    } else {
      putMutation(form, {
        params: {
          id: user.email,
        },
        onSuccess: (res) => {
          toastSuccess(res.message);
          onSuccess(res.data);
        },
        onSettled: () => {
          setLoading(false);
        },
      });
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Nombre"
        error={errors.nombre?.message}
        {...register("nombre")}
      />
      <Input
        label="Email"
        error={errors.email?.message}
        type="email"
        {...register("email")}
      />
      <Input
        label="Fecha de nacimiento"
        type="date"
        error={errors.fecha_nacimiento?.message}
        {...register("fecha_nacimiento")}
      />
      <Input
        label="Género"
        error={errors.genero?.message}
        type="select"
        {...register("genero")}
      >
        <option value="">Sin especificar</option>
        {Object.values(Genero).map((genero) => (
          <option key={genero} value={genero}>
            {genero}
          </option>
        ))}
      </Input>
      <Button disabled={loading} type="submit">
        Enviar
      </Button>
    </form>
  );
};

export default UserForm;
