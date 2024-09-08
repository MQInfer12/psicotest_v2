import useFetch from "@/modules/core/hooks/useFetch";
import { useModal } from "@/modules/core/components/ui/modal/useModal";
import { User } from "../api/responses";
import UserForm from "../components/UserForm";
import { toastConfirm, toastSuccess } from "@/modules/core/utils/toasts";
import { useUserContext } from "../../auth/context/UserContext";

const UserPage = () => {
  const { fetchData, postData } = useFetch();
  const deleteMutation = postData("DELETE /user/:id");
  const { data, setData } = fetchData(["users"], "GET /user");
  const { modal, setOpen } = useModal<User>();
  const { user } = useUserContext();

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

  return (
    <div className="w-full flex flex-col items-center">
      {modal((item) => (
        <UserForm
          user={item}
          onSuccess={(user) => {
            if (!item) {
              setData((prev) => [...prev, user]);
            } else {
              setData((prev) =>
                prev.map((v) => (v.email === item.email ? user : v))
              );
            }
            setOpen(false);
          }}
        />
      ))}
      <button onClick={() => setOpen(true)}>Añadir usuario</button>
      <br />
      <ul>
        {data?.map((u) => (
          <li key={u.email}>
            <p>
              {u.email}: {u.nombre}
            </p>
            <button
              disabled={u.email === user?.email}
              onClick={() => setOpen(u)}
            >
              Editar
            </button>
            <button
              disabled={u.email === user?.email}
              onClick={() => handleDelete(u.email)}
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserPage;
