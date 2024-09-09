import useFetch, { SetData } from "@/modules/core/hooks/useFetch";
import { useUserContext } from "../../auth/context/UserContext";
import { User } from "../api/responses";
import { toastConfirm, toastSuccess } from "@/modules/core/utils/toasts";
import Icon from "@/modules/core/components/icons/Icon";
import DefaultPhoto from "@/assets/images/defaultPhoto.jpg";
import clsx from "clsx";

interface Props {
  user: User;
  setOpen: (openOption: User) => void;
  setData: SetData<User[]>;
}

const UserCard = ({ user, setOpen, setData }: Props) => {
  const { postData } = useFetch();
  const deleteMutation = postData("DELETE /user/:id");
  const changeStateMutation = postData("PATCH /user/change-state/:id");

  const { user: loggedUser } = useUserContext();

  const handleDelete = (id: string) => {
    toastConfirm("¿Quieres eliminar este usuario?", () =>
      deleteMutation(null, {
        params: {
          id,
        },
        onSuccess: (res) => {
          toastSuccess(res.message);
          setData((prev) => prev.filter((v) => v.email !== id));
        },
      })
    );
  };

  const handleChangeState = (id: string) => {
    toastConfirm("¿Quires cambiar el estado de este usuario?", () =>
      changeStateMutation(null, {
        params: {
          id,
        },
        onSuccess: (res) => {
          toastSuccess(res.message);
          setData((prev) =>
            prev.map((v) => (v.email === res.data.email ? res.data : v))
          );
        },
      })
    );
  };

  return (
    <div
      className="w-80 bg-alto-200 flex flex-col p-6 gap-4 rounded-lg relative isolate mt-10 shadow-lg"
      key={user.email}
    >
      <div className="w-24 aspect-square absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 rounded-lg overflow-hidden shadow-md">
        <img
          className="w-full h-full bg-alto-100"
          src={user.foto || DefaultPhoto}
          alt={user.email}
        />
      </div>
      <div
        className={clsx(
          "absolute top-6 left-6 flex items-center gap-2 transition-all duration-300",
          {
            "text-emerald-500": user.estado,
            "text-rose-500": !user.estado,
          }
        )}
      >
        <div className="w-2 aspect-square">
          <Icon
            type={user.estado ? Icon.Types.CIRCLE_ACTIVE : Icon.Types.CIRCLE}
          />
        </div>
        <p className="text-xs">{user.estado ? "Activo" : "Inactivo"}</p>
      </div>
      <div className="flex flex-col pt-10">
        <strong
          title={user.nombre}
          className="text-lg w-full text-center overflow-hidden text-ellipsis whitespace-nowrap"
        >
          {user.nombre}
        </strong>
        <small
          title={user.email}
          className="w-full text-center text-alto-800 text-ellipsis whitespace-nowrap overflow-hidden"
        >
          {user.email}
        </small>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex gap-4 text-sm items-center">
          <div className="w-5 aspect-square">
            <Icon type={Icon.Types.GENDER_NONE} />
          </div>
          <p>{user.genero || "Sin especificar"}</p>
        </div>
        <div className="flex gap-4 text-sm items-center">
          <div className="w-5 aspect-square">
            <Icon type={Icon.Types.CALENDAR} />
          </div>
          <p>{user.fecha_nacimiento || "Sin especificar"}</p>
        </div>
      </div>
      <div className="flex gap-4 justify-center">
        <button
          disabled={user.email === loggedUser?.email}
          onClick={() => setOpen(user)}
        >
          Editar
        </button>
        <button
          disabled={user.email === loggedUser?.email}
          onClick={() => handleDelete(user.email)}
        >
          Eliminar
        </button>
        {user.email !== loggedUser?.email && (
          <button onClick={() => handleChangeState(user.email)}>
            {!user.estado ? "Habilitar" : "Deshabilitar"}
          </button>
        )}
      </div>
    </div>
  );
};

export default UserCard;
