import { formatDate } from "@/modules/core/utils/formatDate";
import { getTodayUtc } from "@/modules/core/utils/getTodayUtc";
import { measureAge } from "@/modules/core/utils/measureAge";
import { Text } from "@/modules/features/answers/components/interpretation/GptPdf";
import { User } from "@/modules/features/users/api/responses";
import { Document, Page, PDFViewer } from "@react-pdf/renderer";
import { Appointment, MetodoConsulta } from "../../api/responses";

interface Props {
  user: User;
  cita: Appointment;
}

const FichaPDF = ({ user, cita }: Props) => {
  const isReconsulta = cita.metodo === MetodoConsulta.Reconsulta;

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
            <Text style={{ fontWeight: 700 }}>Fecha y hora de la sesión:</Text>{" "}
            {formatDate(cita.fecha, cita.hora_inicio)}
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
              ? `${user.telefono_tutor} ${
                  user.nombre_tutor ? `(${user.nombre_tutor})` : ""
                }`
              : "-"}
          </Text>
          <Text>
            <Text style={{ fontWeight: 700 }}>Tipo de consulta:</Text>{" "}
            {cita.metodo}
          </Text>
          {cita.id_motivo_consulta && (
            <Text>
              <Text style={{ fontWeight: 700 }}>Motivo de consulta:</Text>{" "}
              {cita.descripcion_motivo_consulta}
            </Text>
          )}
          {cita.motivo && (
            <Text
              style={{
                fontWeight: 700,
                marginTop: 8,
              }}
            >
              {isReconsulta ? "Motivo de la reconsulta" : "Motivo de consulta"}:
              <Text>{"\n" + (cita.motivo ?? "")}</Text>
            </Text>
          )}
          {cita.antecedentes && (
            <Text
              style={{
                fontWeight: 700,
                marginTop: 8,
              }}
            >
              {isReconsulta
                ? "Antecedentes familiares adicionales"
                : "Historia y antecedentes familiares breve"}
              :<Text>{"\n" + (cita.antecedentes ?? "")}</Text>
            </Text>
          )}
          <Text
            style={{
              fontWeight: 700,
              marginTop: 8,
            }}
          >
            Reporte de sesión:
            <Text>{"\n" + (cita.observaciones ?? "")}</Text>
          </Text>
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default FichaPDF;
