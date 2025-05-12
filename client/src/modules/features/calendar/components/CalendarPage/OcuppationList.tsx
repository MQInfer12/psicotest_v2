import Icon from "@/modules/core/components/icons/Icon";
import Button from "@/modules/core/components/ui/Button";
import { useModal } from "@/modules/core/components/ui/modal/useModal";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import GroupSubtitle from "@/modules/features/folders/components/GroupSubtitle";
import { Ocuppation } from "../../api/responses";
import { MONTHS } from "../../data/months";
import OcuppationForm from "./OcuppationForm";
import OcuppationCard from "./cards/OcuppationCard";

const OcuppationList = () => {
  const { modal, setOpen } = useModal<Ocuppation>();

  const { fetchData } = useFetch();
  const { data, setData } = fetchData("GET /ocupacion");

  const orderedDataByMonth = data?.sort((a, b) => {
    const dateA = new Date(a.fecha + " " + a.hora_inicio);
    const dateB = new Date(b.fecha + " " + b.hora_inicio);

    return dateA.getTime() - dateB.getTime();
  });

  const groupedDataByMonth = orderedDataByMonth?.reduce<
    Record<string, Ocuppation[]>
  >((acc, item) => {
    const date = new Date(item.fecha);
    date.setHours(date.getHours() + 4);
    const month = MONTHS[date.getMonth()];
    const year = date.getFullYear();
    const key = `${month} ${year}`;

    if (!acc[key]) {
      acc[key] = [];
    }

    acc[key].push(item);

    return acc;
  }, {});

  return (
    <>
      {modal("Formulario de ocupación", (item) => (
        <OcuppationForm
          ocupacion={item}
          onSuccess={(res) => {
            if (!item) {
              setData((prev) => [...prev, res]);
            } else {
              setData((prev) =>
                prev.map((ocupacion) =>
                  ocupacion.id === item.id ? res : ocupacion
                )
              );
            }
            setOpen(false);
          }}
          onSuccessDelete={() => {
            setData((prev) =>
              prev.filter((ocupacion) => ocupacion.id !== item?.id)
            );
            setOpen(false);
          }}
        />
      ))}
      <div className="flex flex-col overflow-hidden h-full">
        <div className="p-4 flex justify-end">
          <Button
            className="self-end"
            btnSize="small"
            btnType="secondary"
            icon={Icon.Types.ADD}
            onClick={() => setOpen(true)}
          >
            Añadir
          </Button>
        </div>
        <div className="flex flex-col gap-4 overflow-auto px-4 pb-4">
          {data?.length === 0 && (
            <div className="flex justify-center items-center">
              <small className="text-alto-500">
                No tienes ocupaciones próximamente
              </small>
            </div>
          )}
          {groupedDataByMonth &&
            Object.keys(groupedDataByMonth).map((month) => (
              <div className="flex flex-col gap-3" key={month}>
                <GroupSubtitle title={month} />
                {groupedDataByMonth[month].map((item) => (
                  <OcuppationCard
                    key={item.id}
                    ocupacion={item}
                    onClick={() => setOpen(item)}
                  />
                ))}
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default OcuppationList;
