import { formatDate } from "@/modules/core/utils/formatDate";
import { getTodayUtc } from "@/modules/core/utils/getTodayUtc";
import { measureAge } from "@/modules/core/utils/measureAge";
import { Text } from "@/modules/features/answers/components/interpretation/GptPdf";
import { User } from "@/modules/features/users/api/responses";
import { Document, Page, PDFViewer } from "@react-pdf/renderer";
import { Case } from "../../api/responses";

interface Props {
  user: User;
  caso: Case;
}

const DerivacionPDF = ({ user, caso }: Props) => {
  return (
    <PDFViewer height="100%" width="100%">
      <Document title="Ficha de derivación">
        <Page
          size="LETTER"
          style={{
            padding: 72,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              textDecoration: "underline",
              fontWeight: 700,
            }}
          >
            HOJA DE INTERCONSULTA {"\n"}
            GABINETE PSICOLÓGICO UNIVERSIDAD FRANZ TAMAYO
          </Text>
          <Text style={{ marginTop: 8 }}>
            <Text style={{ fontWeight: 700 }}>Fecha del reporte:</Text>{" "}
            {formatDate(getTodayUtc())}
          </Text>
          <Text
            style={{
              marginTop: 8,
            }}
          >
            <Text style={{ fontWeight: 700 }}>
              DATOS DE IDENTIFICACIÓN DEL PACIENTE
            </Text>{" "}
          </Text>
          <Text
            style={{
              marginTop: 8,
            }}
          >
            <Text style={{ fontWeight: 700 }}>Nombre del estudiante:</Text>{" "}
            {user.nombre}
          </Text>
          <Text>
            <Text style={{ fontWeight: 700 }}>Fecha de nacimiento:</Text>{" "}
            {user.fecha_nacimiento
              ? `${formatDate(user.fecha_nacimiento)} (${measureAge(
                  user.fecha_nacimiento,
                  getTodayUtc()
                )} años)`
              : "-"}
          </Text>
          <Text>
            <Text style={{ fontWeight: 700 }}>Número de celular:</Text>{" "}
            {user.telefono ?? "-"}
          </Text>
          <Text>
            <Text style={{ fontWeight: 700 }}>Nombre del apoderado:</Text>{" "}
            {user.nombre_tutor || "-"}
          </Text>
          <Text>
            <Text style={{ fontWeight: 700 }}>Celular del apoderado:</Text>{" "}
            {user.telefono_tutor ?? "-"}
          </Text>
          <Text>
            <Text style={{ fontWeight: 700 }}>
              Derivado a la especialidad de:
            </Text>{" "}
            {caso.derivacion?.derivado_a}
          </Text>
          <Text
            style={{
              fontWeight: 700,
              marginTop: 8,
            }}
          >
            SITUACIÓN QUE MOTIVA LA DERIVACIÓN (BREVE DESCRIPCIÓN):
            <Text>{"\n" + (caso.derivacion?.resumen || "")}</Text>
          </Text>
          <Text
            style={{
              fontWeight: 700,
              marginTop: 24,
            }}
          >
            FIRMA Y SELLO DEL GABINETE PSICOLÓGICO:
          </Text>
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default DerivacionPDF;
