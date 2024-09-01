import useFetch from "@/hooks/useFetch";
import { Timestamps } from "@/types/Timestamps";
import { toastSuccess } from "@/utils/toasts";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

interface UserForm {
  email: string;
  nombre: string;
}

interface User extends Timestamps {
  email: string;
  nombre: string;
  genero: string | null;
  foto: string | null;
  fecha_nacimiento: string | null;
}

const initialForm = {
  email: "",
  nombre: "",
};

const Users = () => {
  const { fetchData, postData } = useFetch();
  const { data, setData } = fetchData<User[]>(["users"], "/user");
  const mutation = postData<User, UserForm>("/user");
  const [form, setForm] = useState<UserForm>(initialForm);

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
          <li>
            {user.email}: {user.nombre}
          </li>
        ))}
      </ul>
    </div>
  );
};

export const Route = createFileRoute("/(root)/users")({
  component: Users,
});
