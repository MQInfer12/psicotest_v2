import useFetch, { SetData } from "@/modules/core/hooks/useFetch";
import { useUserContext } from "../../auth/context/UserContext";
import { User } from "../api/responses";
import { toastConfirm, toastSuccess } from "@/modules/core/utils/toasts";
import Icon from "@/modules/core/components/icons/Icon";
import DefaultPhoto from "@/assets/images/defaultPhoto.jpg";
import clsx from "clsx";
import Button from "@/modules/core/components/ui/Button";

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
      className="w-80 bg-alto-200 flex flex-col p-6 px-8 gap-4 rounded-lg relative isolate mt-4 shadow-lg"
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
          "absolute top-6 left-8 flex items-center gap-2 transition-all duration-300",
          {
            "text-success": user.estado,
            "text-danger": !user.estado,
          }
        )}
      >
        <div className="w-2 aspect-square">
          <Icon
            type={user.estado ? Icon.Types.CIRCLE_ACTIVE : Icon.Types.CIRCLE}
          />
        </div>
        <p className="text-xs font-medium">
          {user.estado ? "Activo" : "Inactivo"}
        </p>
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
          className="w-full text-center text-alto-500 text-ellipsis whitespace-nowrap overflow-hidden"
        >
          {user.email}
        </small>
      </div>
      <div className="flex flex-col gap-2 text-alto-700">
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
      <div className="flex gap-4 justify-center pt-1">
        <Button
          disabled={user.email === loggedUser?.email}
          onClick={() => setOpen(user)}
          icon={Icon.Types.PENCIL}
          title="Editar usuario"
        >
          Editar
        </Button>
        <Button
          btnType="secondary"
          danger
          disabled={user.email === loggedUser?.email}
          onClick={() => handleDelete(user.email)}
          icon={Icon.Types.TRASH}
          title="Eliminar usuario"
        />
        <Button
          btnType="secondary"
          disabled={user.email === loggedUser?.email}
          onClick={() => handleChangeState(user.email)}
          icon={
            user.estado ? Icon.Types.PERSON_ACTIVE : Icon.Types.PERSON_INACTIVE
          }
          title="Cambiar estado del usuario"
        />
      </div>
    </div>
  );
};

export default UserCard;
