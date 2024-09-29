import { measureAge } from "@/modules/core/utils/measureAge";
import { TestForm } from "../../tests/api/dtos";
import { T_Test_Respuesta } from "../../tests/api/responses";
import { MapiTestType } from "../../tests/modules/MAPI/types/MapiTestType";
import { TestIds } from "../../tests/types/TestIds";
import { TestType } from "../../tests/types/TestType";
import { KuderTestType } from "../../tests/modules/KUDER/types/KuderTestType";

export interface PunctuationData {
  dimension: string;
  natural: number;
  [nombreEscala: string]: string | number;
}

export const getPunctuations = (
  testData: T_Test_Respuesta,
  testGeneral: TestType,
  resultados: TestForm[]
): PunctuationData[] => {
  switch (testData.id) {
    case TestIds.MAPI:
      const MAPITest = testGeneral as MapiTestType;
      return MAPITest.dimensiones.map((dimension) => {
        const res: PunctuationData = {
          dimension:
            dimension.descripcion +
            (dimension.abreviacion ? ` (${dimension.abreviacion})` : ""),
          natural: dimension.items.reduce((sum, item) => {
            const meetsConditions = item.condiciones.every((condicion) =>
              resultados.some(
                (resultado) =>
                  resultado.idPregunta === condicion.id_pregunta &&
                  resultado.idOpcion === condicion.id_opcion
              )
            );
            if (meetsConditions) {
              sum += item.puntuacion;
            }
            return sum;
          }, 0),
        };

        MAPITest.escalas.forEach((escala) => {
          let value: string | number = "N/A";
          const { user } = testData;
          if (user?.fecha_nacimiento && user.genero && testData.fecha_enviado) {
            const edad = measureAge(
              user.fecha_nacimiento,
              testData.fecha_enviado
            );
            const mapeo = escala.conversiones
              .find(
                (conversion) =>
                  conversion.genero === user.genero &&
                  edad >= conversion.edad_minima &&
                  edad <= conversion.edad_maxima
              )
              ?.dimensiones.find((d) => d.id_dimension === dimension.id)?.mapeo;
            if (mapeo) {
              value = mapeo[String(res.natural)];
            }
          }
          res[escala.descripcion] = value;
        });

        return res;
      });
    case TestIds.KUDER:
      const KUDERTest = testGeneral as KuderTestType;
      return KUDERTest.dimensiones.map((dimension) => {
        const res: PunctuationData = {
          dimension:
            dimension.descripcion +
            (dimension.abreviacion ? ` (${dimension.abreviacion})` : ""),
          natural: dimension.items.reduce((sum, item) => {
            const meetsConditions = item.condiciones.every((condicion) =>
              resultados.some(
                (resultado) =>
                  resultado.idPregunta === condicion.id_pregunta &&
                  resultado.idOpcion === condicion.id_opcion
              )
            );
            if (meetsConditions) {
              sum += item.puntuacion;
            }
            return sum;
          }, 0),
        };
        return res;
      });
    default:
      return [];
  }
};
