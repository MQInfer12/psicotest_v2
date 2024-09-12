import Button from "@/modules/core/components/ui/Button";
import { useNavigate } from "@tanstack/react-router";

const TestPage = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full flex flex-col items-center pb-20 px-10 gap-12">
      <Button btnType="secondary" onClick={() => {}}>
        Añadir test
      </Button>
      <div className="flex gap-16 flex-wrap items-center justify-center">
        <Button onClick={() => navigate({ to: "/tests/mapi" })}>MAPI</Button>
      </div>
    </div>
  );
};
export default TestPage;
