import Input from "@/modules/core/components/ui/Input";
import { useEffect } from "react";
import {
  AppointmentPassedFiltersType,
  useAppointmentPassedContext,
} from "../../context/AppointmentPassedContext";

const AppointmentPassedFilters = () => {
  const { filters, setFilters } = useAppointmentPassedContext();

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
              type: e.target.value as AppointmentPassedFiltersType,
            }))
          }
        >
          <option value="nombre">Nombre</option>
          <option value="fecha">Fecha</option>
          <option value="estado">Estado</option>
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
            <option value="Corregido">Corregido</option>
            <option value="Derivado">Derivado</option>
            <option value="Ignorado">Ignorado</option>
          </Input>
        ) : filters.type === "fecha" ? (
          <Input
            type="date"
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
        ) : (
          <Input
            type={"text"}
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

export default AppointmentPassedFilters;
