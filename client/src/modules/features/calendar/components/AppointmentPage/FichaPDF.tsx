import { formatDate } from "@/modules/core/utils/formatDate";
import { getTodayUtc } from "@/modules/core/utils/getTodayUtc";
import { measureAge } from "@/modules/core/utils/measureAge";
import { Text } from "@/modules/features/answers/components/interpretation/GptPdf";
import { User } from "@/modules/features/users/api/responses";
import { Document, Page, PDFViewer } from "@react-pdf/renderer";
import { Appointment } from "../../api/responses";

interface Props {
  user: User;
  cita: Appointment;
}

const FichaPDF = ({ user, cita }: Props) => {
  return (
    <PDFViewer height="100%" width="100%">
      <Document title="Ficha de apertura del paciente">
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
            FICHA DE APERTURA DEL PACIENTE
          </Text>
          <Text style={{ marginTop: 8 }}>
            <Text style={{ fontWeight: 700 }}>Fecha y hora de la cita:</Text>{" "}
            {formatDate(cita.fecha) + " " + cita.hora_inicio.substring(0, 5)}
          </Text>
          <Text>
            <Text style={{ fontWeight: 700 }}>Fecha del reporte:</Text>{" "}
            {formatDate(getTodayUtc())}
          </Text>
          <Text
            style={{
              marginTop: 8,
            }}
          >
            <Text style={{ fontWeight: 700 }}>Nombre completo:</Text>{" "}
            {user.nombre}
          </Text>
          <Text>
            <Text style={{ fontWeight: 700 }}>Fecha de nacimiento:</Text>{" "}
            {user.fecha_nacimiento ? formatDate(user.fecha_nacimiento) : "-"}
          </Text>
          <Text>
            <Text style={{ fontWeight: 700 }}>Edad:</Text>{" "}
            {user.fecha_nacimiento
              ? `${measureAge(user.fecha_nacimiento, cita.fecha)} años`
              : "-"}
          </Text>
          <Text>
            <Text style={{ fontWeight: 700 }}>Carrera:</Text>{" "}
            {user.carrera || "-"}
          </Text>
          <Text>
            <Text style={{ fontWeight: 700 }}>Semestre:</Text>{" "}
            {user.semestre ?? "-"}
          </Text>
          <Text>
            <Text style={{ fontWeight: 700 }}>Código estudiantil:</Text>{" "}
            {user.codigo_estudiantil || "-"}
          </Text>
          <Text>
            <Text style={{ fontWeight: 700 }}>Número de celular:</Text>{" "}
            {user.telefono ?? "-"}
          </Text>
          <Text>
            <Text style={{ fontWeight: 700 }}>
              Número de celular de algún pariente:
            </Text>{" "}
            {user.telefono_tutor
              ? `${user.telefono_tutor} ${user.nombre_tutor ? `(${user.nombre_tutor})` : ""}`
              : "-"}
          </Text>
          <Text>
            <Text style={{ fontWeight: 700 }}>
              Derivación o búsqueda propia de apoyo:
            </Text>{" "}
            {cita.metodo}
          </Text>
          <Text
            style={{
              fontWeight: 700,
              marginTop: 8,
            }}
          >
            Motivo de consulta:
            <Text>{"\n" + (cita.motivo ?? "")}</Text>
          </Text>
          <Text
            style={{
              fontWeight: 700,
              marginTop: 8,
            }}
          >
            Historia y antecedentes familiares breve:
            <Text>{"\n" + (cita.antecedentes ?? "")}</Text>
          </Text>
          <Text
            style={{
              fontWeight: 700,
              marginTop: 8,
            }}
          >
            Observaciones:
            <Text>{"\n" + (cita.observaciones ?? "")}</Text>
          </Text>
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default FichaPDF;
