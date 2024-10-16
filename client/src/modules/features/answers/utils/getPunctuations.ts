import { measureAge } from "@/modules/core/utils/measureAge";
import { TestForm, TextSectionOption } from "../../tests/api/dtos";
import { T_Test_Respuesta } from "../../tests/api/responses";
import { MapiTestType } from "../../tests/modules/MAPI/types/MapiTestType";
import { TestIds } from "../../tests/types/TestIds";
import { TestType } from "../../tests/types/TestType";
import { KuderTestType } from "../../tests/modules/KUDER/types/KuderTestType";
import { PmaTestType } from "../../tests/modules/PMA/types/PmaTestType";

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
    case TestIds.PMA:
      const PMATest = testGeneral as PmaTestType;
      return PMATest.dimensiones.map((dimension) => {
        switch (dimension.tipo) {
          case "classic":
            const classicRes: PunctuationData = {
              dimension: dimension.descripcion,
              natural: dimension.items.reduce((sum, item) => {
                const meetsConditions = item.condiciones.every((condicion) => {
                  const seccion = PMATest.secciones.find((s) =>
                    s.items.some((i) => i.id === condicion.id_pregunta)
                  );
                  switch (seccion?.type ?? "single") {
                    case "single":
                      return resultados.some(
                        (resultado) =>
                          resultado.idPregunta === condicion.id_pregunta &&
                          resultado.idOpcion === condicion.id_opcion
                      );
                    case "multi":
                      return resultados.some((resultado) => {
                        const respuestas = resultado.idOpcion as number[];
                        return (
                          resultado.idPregunta === condicion.id_pregunta &&
                          respuestas.includes(condicion.id_opcion)
                        );
                      });
                    default:
                      return false;
                  }
                });
                if (meetsConditions) {
                  sum += item.puntuacion;
                }
                return sum;
              }, 0),
            };
            return classicRes;
          case "words":
            const wordsRes: PunctuationData = {
              dimension: dimension.descripcion,
              natural: dimension.secciones
                .map((seccionId) =>
                  PMATest.secciones.find((seccion) => seccion.id === seccionId)
                )
                .reduce((sum, seccion) => {
                  if (!seccion) return sum;
                  for (const item of seccion.items) {
                    const respuestas = resultados.find(
                      (r) => r.idPregunta === item.id
                    );
                    if (!respuestas) continue;
                    const opciones = respuestas.idOpcion as TextSectionOption[];
                    opciones.forEach((opcion) => {
                      if (opcion.correct) {
                        sum++;
                      }
                    });
                  }
                  return sum;
                }, 0),
            };
            return wordsRes;
        }
      });
    default:
      return [];
  }
};
