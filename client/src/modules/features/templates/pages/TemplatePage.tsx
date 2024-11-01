import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import { useMeasureContext } from "../../_layout/context/MeasureContext";
import TemplateCard from "../components/TemplateCard";
import Loader from "@/modules/core/components/ui/loader/Loader";

const TemplatePage = () => {
  const { PRIVATE_PADDING_INLINE } = useMeasureContext();
  const { fetchData } = useFetch();
  const { data } = fetchData("GET /plantilla");

  return (
    <div
      style={{
        paddingInline: PRIVATE_PADDING_INLINE,
      }}
      className="w-full flex flex-col items-center pb-20 gap-12 flex-1"
    >
      {data ? (
        <div
          className="w-full grid gap-8 place-content-center"
          style={{
            gridTemplateColumns: `repeat(auto-fill, minmax(328px, 1fr))`,
          }}
        >
          {data.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              loading={false}
            />
          ))}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default TemplatePage;
