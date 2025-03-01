import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import { useMeasureContext } from "../../_layout/context/MeasureContext";
import TotalsPDF from "../components/TotalsPDF";
import Loader from "@/modules/core/components/ui/loader/Loader";

const ReportsPage = () => {
  const { PRIVATE_PADDING_INLINE } = useMeasureContext();
  const { fetchData } = useFetch();

  const { data } = fetchData("GET /reportes/totales");

  return (
    <div
      style={{
        paddingInline: PRIVATE_PADDING_INLINE,
      }}
      className="flex-1 rounded-lg overflow-hidden shadow-lg flex flex-col pb-10"
    >
      <div className="w-full h-full rounded-lg overflow-hidden">
        {/* <PDFViewer width="100%" height="100%"> */}
        {data ? <TotalsPDF data={data} /> : <Loader />}
        {/* </PDFViewer> */}
      </div>
    </div>
  );
};

export default ReportsPage;
