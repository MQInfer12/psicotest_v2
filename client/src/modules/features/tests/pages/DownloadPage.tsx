import IconMessage from "@/modules/core/components/icons/IconMessage";
import { T_Test_Respuesta } from "../api/responses";
import Icon from "@/modules/core/components/icons/Icon";
import Button from "@/modules/core/components/ui/Button";
import { useMeasureContext } from "../../_layout/context/MeasureContext";
import { PDFDownloadLink } from "@react-pdf/renderer";
import GptPdf from "../../answers/components/interpretation/GptPdf";
import { measureAge } from "@/modules/core/utils/measureAge";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";

interface Props {
  data: T_Test_Respuesta;
}

const DownloadPage = ({ data }: Props) => {
  const [clicked, setClicked] = useState(false);
  const { PRIVATE_PADDING_INLINE } = useMeasureContext();
  const navigate = useNavigate();

  return (
    <div
      style={{
        paddingInline: PRIVATE_PADDING_INLINE,
      }}
      className="flex-1 flex flex-col gap-12 items-center justify-center"
    >
      <IconMessage
        icon={Icon.Types.CHECK}
        textColor="success"
        message="¡Muchas gracias!"
        small="Esperamos que este informe pueda serte de utilidad, cuídate mucho."
      />
      <div className="flex flex-col items-center gap-4 justify-center flex-wrap">
        {clicked && (
          <Button
            onClick={() =>
              navigate({
                to: "/blogs",
              })
            }
            icon={Icon.Types.BLOG}
          >
            Ver novedades
          </Button>
        )}
        <PDFDownloadLink
          document={
            <GptPdf
              data={{
                name: data.user.nombre,
                group: "",
                age:
                  data.user.fecha_nacimiento && data.fecha_enviado
                    ? String(
                        measureAge(
                          data.user.fecha_nacimiento,
                          data.fecha_enviado
                        )
                      )
                    : "",
              }}
              content={data.interpretacion ?? ""}
            />
          }
          fileName={`${data.user.nombre
            .toLocaleLowerCase()
            .replaceAll(" ", "_")}.pdf`}
        >
          <Button
            onClick={() => setClicked(true)}
            btnType={clicked ? "secondary" : "primary"}
            icon={Icon.Types.DOWNLOAD}
          >
            {clicked ? "Volver a descargar" : "Descargar informe"}
          </Button>
        </PDFDownloadLink>
        {clicked && (
          <Button
            onClick={() =>
              navigate({
                to: "/resolve",
              })
            }
            btnType="secondary"
          >
            Regresar
          </Button>
        )}
      </div>
    </div>
  );
};

export default DownloadPage;
