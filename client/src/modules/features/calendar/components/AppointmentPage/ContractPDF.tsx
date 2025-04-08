import { formatDate } from "@/modules/core/utils/formatDate";
import { Text } from "@/modules/features/answers/components/interpretation/GptPdf";
import { User } from "@/modules/features/users/api/responses";
import { Document, Page, PDFViewer, View } from "@react-pdf/renderer";
import { stringFromDate } from "../../utils/stringFromDate";
import dayjs from "dayjs";
import { measureAge } from "@/modules/core/utils/measureAge";
import { getTodayUtc } from "@/modules/core/utils/getTodayUtc";

interface Props {
  user: User;
  fecha: string;
  nombre_psicologo: string;
}

const ContractPDF = ({ user, fecha, nombre_psicologo }: Props) => {
  const { date, day, month, year } = stringFromDate(dayjs(fecha));

  const CI = user.codigo_estudiantil?.slice(3);

  return (
    <PDFViewer height="100%" width="100%">
      <Document title="Contrato terapéutico">
        <Page
          size="LETTER"
          style={{
            padding: 72,
          }}
        >
          <View fixed style={{ position: "absolute", top: 50, right: 72 }}>
            <Text>{formatDate(getTodayUtc())}</Text>
          </View>
          <Text
            style={{
              textAlign: "center",
              textDecoration: "underline",
              fontWeight: 700,
            }}
          >
            CONTRATO TERAPÉUTICO
          </Text>
          <Text
            style={{
              marginTop: 8,
            }}
          >
            Este documento es un contrato terapéutico que establece las normas
            que han de cumplir por una parte el Gabinete Psicológico de la
            Universidad Privada FRANZ TAMAYO subsede Cochabamba, y por otro lado
            el paciente
          </Text>
          <Text>
            Nombre: <Text style={{ fontWeight: 700 }}>{user.nombre}</Text>
          </Text>
          <Text>
            Código estudiantil:{" "}
            <Text style={{ fontWeight: 700 }}>
              {user.codigo_estudiantil || "-"}
            </Text>
          </Text>
          <Text>
            Fecha de nacimiento:{" "}
            <Text style={{ fontWeight: 700 }}>
              {user.fecha_nacimiento
                ? `${formatDate(user.fecha_nacimiento)} (${measureAge(user.fecha_nacimiento, fecha)} años)`
                : "-"}
            </Text>
          </Text>
          <Text>
            Número de celular:{" "}
            <Text style={{ fontWeight: 700 }}>{user.telefono ?? "-"}</Text>
          </Text>
          <Text>
            Familiar responsable:{" "}
            <Text style={{ fontWeight: 700 }}>{user.nombre_tutor || "-"}</Text>
          </Text>
          <Text>
            Número de celular:{" "}
            <Text style={{ fontWeight: 700 }}>
              {user.telefono_tutor || "-"}
            </Text>
          </Text>
          <Text
            style={{
              marginTop: 8,
            }}
          >
            Ambas partes aceptan las siguientes condiciones del contrato
            terapéutico, conforme a las siguientes clausulas.
          </Text>
          <Text
            style={{
              marginTop: 8,
            }}
          >
            1.- El paciente acepta el servicio de apoyo psicológico brindando un
            soporte, entendiendo que no es sustitutorio de tratamiento
            psicológico clínico, psiquiátrico, neurológico u otros.
          </Text>
          <Text>
            2.-El paciente entiende que el apoyo del gabinete tiene un carácter
            breve y, por lo tanto, limitado en el tiempo, que de ser necesario
            el estudiante guiado por la psicóloga del gabinete, deberá buscar
            apoyo constante con una terapia mas larga.
          </Text>
          <Text>
            3.- Este modelo de intervención ha sido elegido por el paciente y
            familia de manera voluntaria y por lo tanto es de libre aceptación.
          </Text>
          <Text>
            4.- Tras la primera entrevista, se establecerá las metas a alcanzar
            en el tratamiento, pudiendo considerar la derivación a otros
            especialistas como ser, psiquiatría, neurología, o alguna
            especialidad en psicología clínica. El Gabinete psicológico hará el
            respectivo seguimiento a las derivaciones, la falta de dicho
            seguimiento no atribuye responsabilidades legales sobre la
            Universidad Unifraz.
          </Text>
          <Text>
            5.- El Gabinete tiene la obligación de reportar a los familiares del
            estudiante en caso de ser derivado a otro especialista, para que
            exista el mayor seguimiento por los familiares directos del
            estudiante.
          </Text>
          <Text>
            6.- Es obligatorio cumplir los horarios señalados, se realizará un
            plan individual de intervención, para el caso de cualquier falta o
            inasistencia injustificada a las citas programadas, el paciente
            aceptará que el gabinete reconsidere la prioridad de su caso o su
            posible rescisión del tratamiento en curso.
          </Text>
          <Text>
            7.- El Gabinete Psicológico no debe divulgar la información recibida
            por ningún paciente, no se dará información a personas ajenas a la
            demanda, se tendrá especial cuidado con la confidencialidad.
          </Text>
          <Text>
            8.- Se mantendrá un ambiente de respeto, ética profesional y
            armonía, dentro las sesiones psicológicas.
          </Text>
          <Text>
            9.- El incumplimiento del contrato y de las indicaciones o
            prescripciones anteriormente nombradas, dará por finalizado el
            contrato, dejando claro que el paciente no podrá demandar por
            abandono terapéutico, ni por mala praxis.
          </Text>
          <Text
            style={{
              marginTop: 8,
            }}
          >
            Conforme a lo anterior expuesto, firmamos en Cochabamba a {day}{" "}
            {date} de {month} del {year}
          </Text>
          <View
            style={{
              flexDirection: "row",
              marginTop: 48,
              justifyContent: "space-around",
            }}
          >
            <View style={{ alignItems: "center" }}>
              <View
                style={{ borderBottomWidth: 1, width: 100, marginBottom: 4 }}
              />
              <Text>{nombre_psicologo}</Text>
              <Text>Responsable del gabinete</Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <View
                style={{ borderBottomWidth: 1, width: 100, marginBottom: 4 }}
              />
              <Text>{user.nombre}</Text>
              <Text>Paciente</Text>
              {CI && <Text>CI: {CI}</Text>}
            </View>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default ContractPDF;
