import { useMeasureContext } from "../../_layout/context/MeasureContext";
import Hexagon from "../../landing/components/elements/Hexagon";
import ServicesCards from "../../landing/components/elements/ServicesCards";

const HomePage = () => {
  const { PRIVATE_PADDING_INLINE } = useMeasureContext();
  return (
    <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-transparent to-primary-800/40">
      <div
        style={{
          paddingInline: PRIVATE_PADDING_INLINE,
          paddingBlock: 40,
        }}
        className="overflow-hidden w-full h-full"
      >
        <div className="flex items-center justify-center h-full w-full">
          <ServicesCards type="secondary">
            <div className="absolute bottom-[-90px] left-[-112px] -z-10">
              <Hexagon secondary />
            </div>
            <div className="absolute right-[-104px] top-[-112px] -z-10">
              <Hexagon secondary size={320} />
            </div>
          </ServicesCards>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
