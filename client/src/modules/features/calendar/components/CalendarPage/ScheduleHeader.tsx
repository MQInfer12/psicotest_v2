import Button from "@/modules/core/components/ui/Button";
import { DAYS } from "../../data/days";
import { useModal } from "@/modules/core/components/ui/modal/useModal";
import ScheduleForm from "./ScheduleForm";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import ScheduleMarker from "./ScheduleMarker";
import Icon from "@/modules/core/components/icons/Icon";
import { useUserContext } from "@/modules/features/auth/context/UserContext";
import { toastSuccess } from "@/modules/core/utils/toasts";
import { useState } from "react";
import OcuppationList from "./OcuppationList";

const ScheduleHeader = () => {
  const { modal, setOpen } = useModal();
  const { modal: modalOcupacion, setOpen: setOpenOcupacion } = useModal();
  const { fetchData } = useFetch();
  const { data, setData } = fetchData("GET /horario/for/me");
  const { user, setUser } = useUserContext();

  const { postData } = useFetch();
  const patchMutation = postData(
    "PATCH /user/change-disponibility/:id/psicotest"
  );

  const [loadingDisponibility, setLoadingDisponibility] = useState(false);
  const handleDisponibilityToggle = () => {
    setLoadingDisponibility(true);
    patchMutation(null, {
      params: {
        id: user?.email ?? "",
      },
      onSuccess: (res) => {
        toastSuccess(res.message);
        setUser(res.data);
      },
      onSettled() {
        setLoadingDisponibility(false);
      },
    });
  };

  return (
    <>
      {modal(
        "Añadir horario",
        <ScheduleForm
          onSuccess={(newSchedule) => {
            setOpen(false);
            setData((prev) => [...prev, newSchedule]);
          }}
        />
      )}
      {modalOcupacion("Ocupaciones", <OcuppationList />, {
        type: "floating",
        bodyPadding: false,
        width: 480,
      })}
      <div className="flex flex-col gap-4">
        <header className="h-10 flex justify-between">
          <strong className="text-primary-900 dark:text-primary-400 self-center">
            Mi horario
          </strong>
          <div className="flex gap-4">
            <Button
              onClick={handleDisponibilityToggle}
              btnType="tertiary"
              btnSize="small"
              noHover
              icon={user?.disponible ? Icon.Types.DOT_FILLED : Icon.Types.DOT}
              success={!!user?.disponible}
              danger={!user?.disponible}
              disabled={loadingDisponibility}
            >
              {user?.disponible ? "Disponible" : "No disponible"}
            </Button>
            <Button
              onClick={() => setOpen(true)}
              btnType="secondary"
              btnSize="small"
              icon={Icon.Types.CLOCK}
              subicon={Icon.Types.ADD}
              textClassname="max-sm:hidden"
            >
              Horario
            </Button>
            <Button
              onClick={() => setOpenOcupacion(true)}
              btnType="secondary"
              btnSize="small"
              icon={Icon.Types.CLOCK}
              subicon={Icon.Types.MINUS}
              textClassname="max-sm:hidden"
            >
              Ocupación
            </Button>
          </div>
        </header>
        <main className="grid gap-2 gap-x-6 grid-cols-3 max-lg:grid-cols-2 max-sm:!grid-cols-1">
          {DAYS.filter((_, i) => data?.some((h) => h.dia === 6) || i < 6).map(
            (d, i) => {
              const horarios = data?.filter((horario) => horario.dia === i);
              return (
                <div key={d.dia} className="flex flex-col gap-1">
                  <small className="text-alto-950 dark:text-alto-50">
                    {d.dia}
                  </small>
                  <div className="w-full h-2 bg-alto-50 dark:bg-alto-1000 border border-alto-300/70 dark:border-alto-800 rounded-full relative">
                    {horarios?.map((h) => (
                      <ScheduleMarker
                        key={h.id}
                        schedule={h}
                        setData={setData}
                      />
                    ))}
                  </div>
                </div>
              );
            }
          )}
        </main>
      </div>
    </>
  );
};

export default ScheduleHeader;
