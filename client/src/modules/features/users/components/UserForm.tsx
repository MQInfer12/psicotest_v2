import { UserDTO } from "../api/dtos";
import useFetch from "@/modules/core/hooks/useFetch";
import { User } from "../api/responses";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { UserDTOSchema } from "../validations/UserDTOSchema";
import { toastSuccess } from "@/modules/core/utils/toasts";
import { Genero } from "../types/Genero";
import Input from "@/modules/core/components/ui/Input";
import Button from "@/modules/core/components/ui/Button";

interface Props {
  user: User | null;
  onSuccess: (user: User) => void;
}

const UserForm = ({ user, onSuccess }: Props) => {
  const { postData } = useFetch();
  const postMutation = postData("POST /user");
  const putMutation = postData("PUT /user/:id");

  const { register, handleSubmit } = useForm<UserDTO>({
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
    if (!user) {
      postMutation(form, {
        onSuccess: (res) => {
          toastSuccess(res.message);
          onSuccess(res.data);
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
      });
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <Input label="Nombre" {...register("nombre")} />
      <Input label="Email" type="email" {...register("email")} />
      <Input
        label="Fecha de nacimiento"
        type="date"
        {...register("fecha_nacimiento")}
      />
      <Input label="Género" type="select" {...register("genero")}>
        <option value="">Sin especificar</option>
        {Object.values(Genero).map((genero) => (
          <option key={genero} value={genero}>
            {genero}
          </option>
        ))}
      </Input>
      <Button type="submit">Enviar</Button>
    </form>
  );
};

export default UserForm;
