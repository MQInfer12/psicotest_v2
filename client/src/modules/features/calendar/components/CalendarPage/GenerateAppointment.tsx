import Icon from "@/modules/core/components/icons/Icon";
import Button from "@/modules/core/components/ui/Button";
import Input from "@/modules/core/components/ui/Input";
import UserList from "@/modules/features/users/shared/UserList";
import { useState } from "react";

interface SelectedUser {
  nombre: string;
  email: string | null;
}

const GenerateAppointment = () => {
  const [query, setQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<SelectedUser | null>(null);

  return (
    <div className="flex flex-col gap-2">
      {selectedUser ? (
        <></>
      ) : (
        <>
          <div className="flex gap-2">
            <Input
              inputSize="small"
              type="text"
              icon={Icon.Types.SEARCH}
              placeholder="Buscar..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button
              btnSize="small"
              btnType="secondary"
              icon={Icon.Types.ADD}
              disabled={!query.trim()}
              onClick={() => {  
                setSelectedUser({ nombre: query, email: null });
              }}
            />
          </div>
          <UserList
            search={query}
            anonymous
            emptySearchAll={false}
            button={{
              icon: Icon.Types.ADD,
              onClick: (user) =>
                setSelectedUser({
                  nombre: user.nombre,
                  email: user.email,
                }),
              title: "Generar cita",
            }}
          />
        </>
      )}
    </div>
  );
};

export default GenerateAppointment;
