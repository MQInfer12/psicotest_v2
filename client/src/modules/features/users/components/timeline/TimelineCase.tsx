import Icon from "@/modules/core/components/icons/Icon";
import Button from "@/modules/core/components/ui/Button";
import { useModal } from "@/modules/core/components/ui/modal/useModal";
import { SetData } from "@/modules/core/hooks/useFetch/getSetData";
import { Case, Historial } from "@/modules/features/calendar/api/responses";
import DerivacionPDF from "@/modules/features/calendar/components/AppointmentPage/DerivacionPDF";
import { User } from "../../api/responses";
import ChangeCaseNameForm from "./ChangeCaseNameForm";
import CloseCaseForm from "./CloseCaseForm";
import clsx from "clsx";

interface Props {
  caso: Case;
  someAppointmentNotClosed: boolean;
  nroCaso: number;
  setData: SetData<Historial>;
  paciente: User;
  onClickAddNote: () => void;
  activeButtonAddNote: boolean;
}

const TimelineCase = ({
  caso,
  someAppointmentNotClosed,
  nroCaso,
  setData,
  paciente,
  activeButtonAddNote,
  onClickAddNote,
}: Props) => {
  const casoCerrado = !!caso.fecha_cierre;
  const { modal, open, setOpen } = useModal();
  const { modal: modalCierre, setOpen: setOpenCierre } = useModal();

  const nombreCaso = `Caso${caso.nombre ? `: ${caso.nombre}` : ` ${nroCaso}`}`;
  const activeButton = activeButtonAddNote || open;

  return (
    <>
      {modal(
        "Cambiar nombre del caso",
        <ChangeCaseNameForm
          idCaso={caso.id}
          nombre={caso.nombre}
          onSuccess={(res) => {
            setData((prev) => ({
              ...prev,
              casos: prev.casos.map((v) => (v.id === res.id ? res : v)),
            }));
            setOpen(false);
          }}
        />
      )}
      {modalCierre(
        caso.derivacion ? "Reporte de derivación" : "Cerrar caso",
        caso.derivacion ? (
          <DerivacionPDF user={paciente} caso={caso} />
        ) : (
          <CloseCaseForm
            caso={caso}
            onSuccess={(res) => {
              setData((prev) => ({
                ...prev,
                casos: prev.casos.map((v) => (v.id === res.id ? res : v)),
              }));
              if (res.motivo_cierre !== "Derivación") {
                setOpenCierre(false);
              }
            }}
          />
        ),
        {
          type: "floating",
          width: caso.derivacion ? 900 : 560,
          bodyPadding: false,
          blur: !!caso.derivacion,
        }
      )}
      <div className="flex gap-2 group">
        <div className="flex gap-2">
          <div className="w-5 h-full relative isolate">
            <div
              className={clsx(
                " flex w-full h-9 absolute top-0 left-0 items-center z-10 transition-all duration-300",
                casoCerrado &&
                  (activeButton
                    ? "opacity-0"
                    : "group-hover:opacity-0 opacity-100")
              )}
            >
              <span className="w-full h-5 rounded-full border-2 border-primary-500 bg-primary-400 z-10" />
            </div>
            {casoCerrado && (
              <div
                className={clsx(
                  "flex opacity-0 w-full h-9 absolute top-0 left-0 items-center z-20 transition-all duration-300",
                  activeButton
                    ? "opacity-100"
                    : "group-hover:opacity-100 opacity-0"
                )}
              >
                <button
                  onClick={onClickAddNote}
                  className="outline-none text-alto-950/60 dark:text-alto-50 bg-alto-100 dark:bg-alto-950 hover:text-primary-800 dark:hover:text-primary-400 transition-all duration-300"
                >
                  <Icon type={Icon.Types.STICKY_NOTE} />
                </button>
              </div>
            )}
            <span className="absolute left-1/2 top-0 h-full border-l border-alto-400 dark:border-alto-800" />
          </div>
        </div>
        <div className="flex-1 flex justify-between items-center mb-5 border-b border-b-alto-400 dark:border-alto-800 transition-all duration-300 pb-1 overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <Button
              onClick={() => setOpen(true)}
              btnType="tertiary"
              className="font-bold !px-0 max-w-full"
              alto
              title={nombreCaso}
            >
              {nombreCaso}
            </Button>
          </div>
          <div>
            <Button
              icon={casoCerrado ? Icon.Types.CHECK : Icon.Types.CANCEL}
              danger={!casoCerrado}
              success={!!casoCerrado}
              btnType={casoCerrado ? "tertiary" : "secondary"}
              btnSize="small"
              disabled={someAppointmentNotClosed}
              className={
                casoCerrado
                  ? caso.derivacion
                    ? undefined
                    : "pointer-events-none"
                  : undefined
              }
              onClick={() => {
                setOpenCierre(true);
              }}
            >
              {casoCerrado
                ? caso.derivacion
                  ? `Derivado a ${caso.derivacion.derivado_a}`
                  : "Caso cerrado"
                : "Cerrar caso"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TimelineCase;
