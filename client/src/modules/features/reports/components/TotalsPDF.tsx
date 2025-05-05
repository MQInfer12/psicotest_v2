import PsicotestLogo from "@/assets/images/logo-title-2.png";
import { PRIMARY_COLORS_CLASSIC } from "@/modules/core/constants/COLORS";
import { formatDate } from "@/modules/core/utils/formatDate";
import { getTodayUtc } from "@/modules/core/utils/getTodayUtc";
import { Document, Image, Page, PDFViewer, View } from "@react-pdf/renderer";
import React, { PropsWithChildren } from "react";
import { Text } from "../../answers/components/interpretation/GptPdf";
import { Totales } from "../api/responses";

const Row = ({ children }: PropsWithChildren) => {
  return (
    <View
      style={{
        flexDirection: "row",
      }}
    >
      {children}
    </View>
  );
};


const Th = ({
  children,
  bold,
}: {
  bold?: boolean;
  children?: React.ReactNode;
}) => {
  return (
    <Text
      style={{
        flex: 1,
        backgroundColor: PRIMARY_COLORS_CLASSIC[100].rgb,
        borderWidth: 1,
        borderColor: PRIMARY_COLORS_CLASSIC[200].rgb,
        textAlign: "center",
        paddingTop: 4,
        fontWeight: bold ? 700 : 400,
        maxLines: 1,
        textOverflow: "ellipsis",
      }}
    >
      {children}
    </Text>
  );
};

const Td = ({
  children,
  bold,
}: {
  bold?: boolean;
  children?: React.ReactNode;
}) => {
  return (
    <Text
      style={{
        flex: 1,
        borderWidth: 1,
        borderColor: PRIMARY_COLORS_CLASSIC[200].rgb,
        textAlign: "center",
        paddingTop: 4,
        fontWeight: bold ? 700 : 400,
      }}
    >
      {children}
    </Text>
  );
};

const None = () => {
  return (
    <View
      style={{
        flex: 1,
        borderWidth: 1,
        opacity: 0,
      }}
    />
  );
};

interface Props {
  data: Totales;
}

const TotalsPDF = ({ data }: Props) => {
  return (
    <PDFViewer width="100%" height="100%">
      <Document title="Totales">
        <Page
          size="LETTER"
          style={{
            paddingVertical: 32,
            paddingBottom: 56,
            paddingHorizontal: 32,
            gap: 4,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              height: 32,
            }}
          >
            <Image source={PsicotestLogo} />
          </View>
          <Text
            style={{
              textAlign: "center",
              textDecoration: "underline",
              fontWeight: 700,
            }}
          >
            REPORTE DE TOTALES
          </Text>
          <Text>
            <Text
              style={{
                fontWeight: 700,
              }}
            >
              Fecha:{" "}
            </Text>
            {formatDate(getTodayUtc())}
          </Text>
          <View style={{ gap: 12 }}>
            {/* Tabla de tests */}
            <View>
              <Text
                style={{
                  textAlign: "center",
                  textDecoration: "underline",
                  fontWeight: 700,
                }}
              >
                TESTS
              </Text>
              <Row>
                <Th />
                <Th bold>TIEMPO (mins)</Th>
                <Th bold>SIN RESPONDER</Th>
                <Th bold>VARONES</Th>
                <Th bold>MUJERES</Th>
                <Th bold>SIN ESPECIFICAR</Th>
                <Th bold>TOTAL</Th>
              </Row>
              {data.tests.map((test) => (
                <Row key={test.id}>
                  <Th>{test.nombre}</Th>
                  <Td>{test.tiempo_promedio.toFixed(2)}</Td>
                  <Td>{test.sin_responder}</Td>
                  <Td>{test.varones}</Td>
                  <Td>{test.mujeres}</Td>
                  <Td>{test.sin_especificar}</Td>
                  <Td>{test.total}</Td>
                </Row>
              ))}
              <Row>
                <Th bold>TOTALES</Th>
                <Td />
                <Td>{data.tests_totals.sin_responder}</Td>
                <Td>{data.tests_totals.varones}</Td>
                <Td>{data.tests_totals.mujeres}</Td>
                <Td>{data.tests_totals.sin_especificar}</Td>
                <Td bold>{data.tests_totals.total}</Td>
              </Row>
            </View>
            {/* Tabla de tests */}
            <View>
              <Text
                style={{
                  textAlign: "center",
                  textDecoration: "underline",
                  fontWeight: 700,
                }}
              >
                GABINETE PSICOLÓGICO
              </Text>
              <Row>
                <Th />
                <Th bold>VARONES ATENDIDOS</Th>
                <Th bold>MUJERES ATENDIDAS</Th>
                <Th bold>TOTAL</Th>
              </Row>
              {data.gabinete.map((gabinete) => (
                <Row key={gabinete.email}>
                  <Th>{gabinete.nombre}</Th>
                  <Td>{gabinete.varones}</Td>
                  <Td>{gabinete.mujeres}</Td>
                  <Td>{gabinete.total}</Td>
                </Row>
              ))}
              <Row>
                <Th bold>TOTALES</Th>
                <Td>{data.gabinete_totals.varones}</Td>
                <Td>{data.gabinete_totals.mujeres}</Td>
                <Td bold>{data.gabinete_totals.total}</Td>
              </Row>
              <Row>
                <None />
                <None />
                <Th bold>CONTADORES</Th>
                <Th bold>TOTAL</Th>
              </Row>
              <Row>
                <None />
                <None />
                <Th>PASADAS SIN ATENDER</Th>
                <Td>{data.gabinete_counters.pasadas_sin_atender}</Td>
              </Row>
              <Row>
                <None />
                <None />
                <Th>PASADAS ATENDIDAS</Th>
                <Td>{data.gabinete_counters.pasadas_atendidas}</Td>
              </Row>
              <Row>
                <None />
                <None />
                <Th>PASADAS DERIVADAS</Th>
                <Td>{data.gabinete_counters.pasadas_derivadas}</Td>
              </Row>
            </View>
            {/* Tabla de tests */}
            <View>
              <Text
                style={{
                  textAlign: "center",
                  textDecoration: "underline",
                  fontWeight: 700,
                }}
              >
                BLOGS
              </Text>
              <Row>
                <Th bold>BLOG POPULARES</Th>
                <Th bold>VISUALIZACIONES</Th>
              </Row>
              {data.blogs_populares.map((blog) => (
                <Row key={blog.id}>
                  <Td>{blog.titulo}</Td>
                  <Td>{blog.visitas}</Td>
                </Row>
              ))}
              <Row>
                <Th bold>EVENTOS POPULARES</Th>
                <Th bold>ASISTENCIAS</Th>
              </Row>
              {data.eventos_populares.map((evento) => (
                <Row key={evento.id}>
                  <Td>{evento.nombre}</Td>
                  <Td>{evento.asistencias}</Td>
                </Row>
              ))}
            </View>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default TotalsPDF;
