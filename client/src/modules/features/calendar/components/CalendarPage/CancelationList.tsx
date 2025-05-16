import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import CancelationCard from "./cards/CancelationCard";
import Loader from "@/modules/core/components/ui/loader/Loader";

const CancelationList = () => {
  const { fetchData } = useFetch();
  const { data } = fetchData("GET /motivo/for/canceladas");

  return (
    <>
      <div className="flex flex-col gap-4 h-full">
        {!data ? (
          <Loader />
        ) : (
          <div className="flex flex-col gap-4">
            {data?.length === 0 && (
              <div className="flex justify-center items-center">
                <small className="text-alto-500">
                  No hay citas canceladas recientemente
                </small>
              </div>
            )}
            {data?.map((item) => (
              <CancelationCard key={item.id} cancelation={item} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default CancelationList;
