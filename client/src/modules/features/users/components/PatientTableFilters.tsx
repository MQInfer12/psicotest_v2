import Input from "@/modules/core/components/ui/Input";
import { useEffect } from "react";
import Button from "@/modules/core/components/ui/Button";
import Icon from "@/modules/core/components/icons/Icon";
import {
  PatientTableFiltersType,
  usePatientTableContext,
} from "../context/PatientTableContext";
import { CAREERS } from "../../calendar/data/careers";
import { usePermiso } from "../../auth/hooks/usePermiso";
import { Permisos } from "../../auth/types/Permisos";

const PatientTableFilters = () => {
  const { filters, setFilters, showMine, setShowMine } =
    usePatientTableContext();

  useEffect(() => {
    setFilters((prev) => ({ ...prev, value: "" }));
  }, [filters.type]);

  const canViewButton = usePermiso([Permisos.ADMINISTRAR_PACIENTES]);

  return (
    <div className="flex justify-between items-center gap-2">
      <div className="flex gap-2 w-96">
        <div className="flex-1">
          <Input
            inputSize="small"
            type="select"
            value={filters.type}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                type: e.target.value as PatientTableFiltersType,
              }))
            }
          >
            <option value="nombre">Nombre</option>
            <option value="email">Email</option>
            <option value="genero">Género</option>
            <option value="carrera">Carrera</option>
          </Input>
        </div>
        <div className="flex-[2_1_0]">
          {filters.type === "carrera" ? (
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
              <option value="">Todas las carreras</option>
              {CAREERS.map((carrer) => (
                <option key={carrer.name} value={carrer.name}>
                  {carrer.name}
                </option>
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
      {canViewButton && (
        <div>
          <Button
            btnType={showMine ? "secondary" : "primary"}
            icon={showMine ? Icon.Types.PATIENT_SINGLE : Icon.Types.PATIENT}
            btnSize="small"
            onClick={() => setShowMine((prev) => !prev)}
            title={
              showMine
                ? "Mostrando solo mis pacientes"
                : "Mostrando todos los pacientes"
            }
          />
        </div>
      )}
    </div>
  );
};

export default PatientTableFilters;
