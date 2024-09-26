import { measureAge } from "@/modules/core/utils/measureAge";
import { TestForm } from "../../tests/api/dtos";
import { T_Test } from "../../tests/api/responses";
import { MapiTestType } from "../../tests/modules/MAPI/types/MapiTestType";
import { TestIds } from "../../tests/types/TestIds";
import { TestType } from "../../tests/types/TestType";

export interface PunctuationData {
  dimension: string;
  natural: number;
  [nombreEscala: string]: string | number;
}

export const getPunctuations = (
  testData: T_Test,
  testGeneral: TestType,
  resultados: TestForm[]
): PunctuationData[] => {
  switch (testData.id) {
    case TestIds.MAPI:
      const test = testGeneral as MapiTestType;
      return test.dimensiones.map((dimension) => {
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

        test.escalas.forEach((escala) => {
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
      return [];
    default:
      return [];
  }
};
