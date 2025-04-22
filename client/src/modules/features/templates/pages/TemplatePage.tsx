import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import { useMeasureContext } from "../../_layout/context/MeasureContext";
import TemplateCard from "../components/TemplateCard";
import Loader from "@/modules/core/components/ui/loader/Loader";
import Button from "@/modules/core/components/ui/Button";
import { useNavigate } from "@tanstack/react-router";
import Icon from "@/modules/core/components/icons/Icon";

const TemplatePage = () => {
  const { PRIVATE_PADDING_INLINE } = useMeasureContext();
  const { fetchData } = useFetch();
  const { data, setData } = fetchData("GET /plantilla");
  const navigate = useNavigate();

  return (
    <div
      style={{
        paddingInline: PRIVATE_PADDING_INLINE,
      }}
      className="w-full flex flex-col items-center pb-20 gap-12 flex-1 overflow-y-auto overflow-x-hidden"
    >
      <div className="w-full flex gap-4 justify-between items-center">
        <span />
        <div className="flex gap-4">
          <Button
            onClick={() =>
              navigate({
                to: "/templates/create",
              })
            }
            btnType="secondary"
            btnSize="small"
            icon={Icon.Types.ADD}
          >
            Crear plantilla
          </Button>
        </div>
      </div>
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
              onSuccessDelete={(id) => {
                setData((prev) => prev.filter((t) => t.id !== id));
              }}
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
