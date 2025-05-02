import { measureAge } from "@/modules/core/utils/measureAge";
import { TestForm, TextSectionOption } from "../../tests/api/dtos";
import { T_Test_Respuesta } from "../../tests/api/responses";
import { MapiTestType } from "../../tests/modules/MAPI/types/MapiTestType";
import { TestIds } from "../../tests/types/TestIds";
import { TestType } from "../../tests/types/TestType";
import { KuderTestType } from "../../tests/modules/KUDER/types/KuderTestType";
import { PmaTestType } from "../../tests/modules/PMA/types/PmaTestType";
import { ChasideTestType } from "../../tests/modules/CHASIDE/types/ChasideTestType";

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
      let IQ = 0;
      const PMAresults = PMATest.dimensiones.map((dimension) => {
        let res: PunctuationData;
        switch (dimension.tipo) {
          case "classic":
            res = {
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

            switch (res.dimension) {
              case "FACTOR V":
                IQ += res.natural * 1.5;
                break;
              case "FACTOR E":
                IQ += res.natural;
                break;
              case "FACTOR R":
                IQ += res.natural * 2;
                break;
              case "FACTOR N":
                IQ += res.natural;
                break;
            }
            break;
          case "words":
            res = {
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
            IQ += res.natural;
            break;
        }

        PMATest.escalas.forEach((escala) => {
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
              const minValue = Math.min(
                ...Object.keys(mapeo).map((v) => Number(v))
              );
              const maxValue = Math.max(
                ...Object.keys(mapeo).map((v) => Number(v))
              );
              value = mapeo[String(res.natural)];
              if (res.natural < minValue) {
                value = mapeo[String(minValue)];
              }
              if (res.natural > maxValue) {
                value = mapeo[String(maxValue)];
              }
            }
          }
          res[escala.descripcion] = value;
        });

        return res;
      });
      return [
        ...PMAresults,
        {
          dimension: "CI",
          natural: IQ,
          Percentil: "N/A",
        },
      ];
    case TestIds.CHASIDE:
      const CHASIDETest = testGeneral as ChasideTestType;
      return CHASIDETest.dimensiones.map((dimension) => {
        const res: PunctuationData = {
          dimension: dimension.descripcion,
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
