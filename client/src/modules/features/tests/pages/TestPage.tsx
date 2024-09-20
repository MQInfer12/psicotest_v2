import Button from "@/modules/core/components/ui/Button";
import TestCard_MAPI from "../modules/MAPI/components/TestCard_MAPI";
import { PRIVATE_PADDING_INLINE } from "../../_layout/constants/LAYOUT_SIZES";
const TestPage = () => {
  return (
    <div
      style={{
        paddingInline: PRIVATE_PADDING_INLINE,
      }}
      className="w-full flex flex-col items-center pb-20 gap-12"
    >
      <Button btnType="secondary" onClick={() => {}}>
        Añadir test
      </Button>
      <div
        className="w-full grid gap-8 place-content-center"
        style={{
          gridTemplateColumns: `repeat(auto-fill, minmax(328px, 1fr))`,
        }}
      >
        <TestCard_MAPI />
      </div>
      {/* <div className="flex gap-16 flex-wrap items-center justify-center">
        <Button onClick={() => navigate({ to: "/tests/mapi" })}>MAPI</Button>
      </div> */}
    </div>
  );
};
export default TestPage;
