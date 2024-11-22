import {
  T_Test,
  T_Test_Respuesta,
} from "@/modules/features/tests/api/responses";
import clsx from "clsx";
import Button from "../../Button";
import Icon from "../../../icons/Icon";

interface Props {
  data: T_Test | T_Test_Respuesta;
  setOpen: (open: boolean) => void;
  finished: boolean;
  initiated: boolean;
}

const TestOutside = ({ data, setOpen, finished, initiated }: Props) => {
  return (
    <div className="w-full py-4 flex flex-col gap-2">
      <div className="px-4 w-full flex flex-col gap-2 pb-2 border-b-2 border-primary-200">
        <h3 className="text-[40px] leading-[40px] font-bold text-primary-900 after:content-['.'] after:text-primary-500">
          {data.nombre_test}
        </h3>
        <div className="w-full flex flex-wrap gap-4 items-center justify-between">
          <strong
            className={clsx("min-w-52 flex-[9999_1_0]", {
              "text-success": finished,
              "text-alto-800": !finished,
            })}
          >
            {finished ? "¡Ya resolviste este test!" : "¡Inicia tu test ahora!"}
          </strong>
          <div className="flex-1 flex justify-center gap-4">
            {/* {initiated && (
              <Button btnType="secondary" icon={Icon.Types.RELOAD} />
            )} */}
            <Button
              onClick={() => setOpen(true)}
              icon={Icon.Types.CHEVRON_RIGHT}
            >
              {finished
                ? "Ver mis respuestas"
                : initiated
                  ? "Continuar el test"
                  : "¡Comienza tu test!"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestOutside;
