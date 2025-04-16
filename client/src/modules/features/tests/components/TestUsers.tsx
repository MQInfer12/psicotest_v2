import Icon from "@/modules/core/components/icons/Icon";
import Input from "@/modules/core/components/ui/Input";
import { useState } from "react";
import UserList from "../../users/shared/UserList";

interface Props {
  idTest: number;
}

const TestUsers = ({ idTest }: Props) => {
  const [query, setQuery] = useState("");

  return (
    <div className="flex flex-col gap-2">
      <Input
        inputSize="small"
        type="text"
        icon={Icon.Types.SEARCH}
        placeholder="Buscar..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <UserList search={query} idTest={idTest} />
    </div>
  );
};

export default TestUsers;
