import Button from "@/modules/core/components/ui/Button";
import { DAYS } from "../data/days";
import { useModal } from "@/modules/core/components/ui/modal/useModal";
import ScheduleForm from "./ScheduleForm";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import ScheduleMarker from "./ScheduleMarker";

const ScheduleHeader = () => {
  const { modal, setOpen } = useModal();
  const { fetchData } = useFetch();
  const { data, setData } = fetchData("GET /horario/for/me");

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
      <div className="flex flex-col gap-4 px-4 max-lg:px-0">
        <header className="h-10 flex items-center justify-between">
          <strong className="text-primary-900">Mi horario</strong>
          <Button
            onClick={() => setOpen(true)}
            btnType="secondary"
            btnSize="small"
          >
            Añadir horario
          </Button>
        </header>
        <main className="grid gap-2 gap-x-6 grid-cols-3 max-lg:grid-cols-2 max-sm:!grid-cols-1">
          {DAYS.filter((_, i) => data?.some((h) => h.dia === 6) || i < 6).map(
            (d, i) => {
              const horarios = data?.filter((horario) => horario.dia === i);
              return (
                <div key={d.dia} className="flex flex-col gap-1">
                  <small>{d.dia}</small>
                  <div className="w-full h-2 bg-alto-50 border border-alto-200 rounded-full relative">
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
