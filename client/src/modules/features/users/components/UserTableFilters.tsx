import Input from "@/modules/core/components/ui/Input";
import {
  UserTableFiltersType,
  useUserTableContext,
} from "../context/UserTableContext";
import { useEffect } from "react";
import { Genero } from "../types/Genero";

const UserTableFilters = () => {
  const { filters, setFilters, roles } = useUserTableContext();

  useEffect(() => {
    setFilters((prev) => ({ ...prev, value: "" }));
  }, [filters.type]);

  return (
    <div className="flex gap-2 w-96">
      <div className="flex-1">
        <Input
          inputSize="small"
          type="select"
          value={filters.type}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              type: e.target.value as UserTableFiltersType,
            }))
          }
        >
          <option value="nombre">Nombre</option>
          <option value="email">Email</option>
          <option value="genero">Género</option>
          <option value="estado">Estado</option>
          <option value="rol">Rol</option>
        </Input>
      </div>
      <div className="flex-[2_1_0]">
        {filters.type === "estado" ? (
          <Input
            type="select"
            inputSize="small"
            value={filters.value}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                value: e.target.value,
              }))
            }
          >
            <option value="">Cualquiera</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </Input>
        ) : filters.type === "genero" ? (
          <Input
            type="select"
            inputSize="small"
            value={filters.value}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                value: e.target.value,
              }))
            }
          >
            <option value="">Cualquiera</option>
            {Object.values(Genero).map((g) => (
              <option value={g}>{g}</option>
            ))}
            <option value="Sin especificar">Sin especificar</option>
          </Input>
        ) : filters.type === "rol" ? (
          <Input
            type="select"
            inputSize="small"
            value={filters.value}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                value: e.target.value,
              }))
            }
          >
            <option value="">Cualquiera</option>
            {roles?.map((rol) => (
              <option value={rol.id}>{rol.descripcion}</option>
            ))}
          </Input>
        ) : (
          <Input
            type="text"
            inputSize="small"
            placeholder="Realiza una búsqueda..."
            value={filters.value}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                value: e.target.value,
              }))
            }
          />
        )}
      </div>
    </div>
  );
};

export default UserTableFilters;
