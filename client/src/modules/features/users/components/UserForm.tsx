import { UserDTO } from "../api/dtos";
import useFetch from "@/modules/core/hooks/useFetch";
import { User } from "../api/responses";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { UserDTOSchema } from "../validations/UserDTOSchema";
import { toastSuccess } from "@/modules/core/utils/toasts";

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
      fechaNacimiento: user?.fecha_nacimiento,
      genero: user?.genero,
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <p>Email</p>
        <input type="text" {...register("email")} />
      </div>
      <div>
        <p>Nombre</p>
        <input type="text" {...register("nombre")} />
      </div>
      <button>Enviar</button>
    </form>
  );
};

export default UserForm;
