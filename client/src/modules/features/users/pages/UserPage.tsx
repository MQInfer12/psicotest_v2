import useFetch from "@/modules/core/hooks/useFetch";
import { toastSuccess } from "@/modules/core/utils/toasts";
import { useState } from "react";
import { UserDTO } from "../api/dtos";

const initialForm: UserDTO = {
  email: "",
  nombre: "",
};

const UserPage = () => {
  const { fetchData, postData } = useFetch();
  const { data, setData } = fetchData(["users"], "GET /user");
  const mutation = postData("POST /user");
  const [form, setForm] = useState<UserDTO>(initialForm);

  const handleSend = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    mutation.mutate(form, {
      onSuccess: (res) => {
        setData((prev) => [...prev, res.data]);
        setForm(initialForm);
        toastSuccess(res.message);
      },
    });
  };

  return (
    <div>
      <form>
        <div>
          <p>Email</p>
          <input
            type="text"
            value={form.email}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, email: e.target.value }))
            }
          />
        </div>
        <div>
          <p>Nombre</p>
          <input
            type="text"
            value={form.nombre}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, nombre: e.target.value }))
            }
          />
        </div>
        <button onClick={handleSend}>Enviar</button>
      </form>
      <br />
      <ul>
        {data?.map((user) => (
          <li key={user.email}>
            {user.email}: {user.nombre}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserPage;
