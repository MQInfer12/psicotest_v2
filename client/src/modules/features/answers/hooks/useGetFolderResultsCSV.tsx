import { useEffect } from "react";
import { T_Tests_Respuestas } from "../../tests/api/responses";
import { KuderTestType } from "../../tests/modules/KUDER/types/KuderTestType";
import { PmaTestType } from "../../tests/modules/PMA/types/PmaTestType";
import { TestIds } from "../../tests/types/TestIds";
import { TestType } from "../../tests/types/TestType";
import { User } from "../../users/api/responses";
import { getPunctuations } from "../utils/getPunctuations";

export const useGetFolderResultsCSV = (data: T_Tests_Respuestas[]) => {
  const getCSV = () => {
    const uniqueTests = data.reduce<
      {
        id: number;
        nombre_test: string;
        test: TestType;
      }[]
    >((arr, item) => {
      const exist = arr.find((v) => v.id === item.id);
      if (exist) return arr;
      arr.push({
        id: item.id,
        nombre_test: item.nombre_test,
        test: JSON.parse(item.test),
      });
      return arr;
    }, []);

    const uniqueUsers = data.reduce<T_Tests_Respuestas[]>((arr, item) => {
      const exist = arr.find((v) => v.email_user === item.email_user);
      if (exist) return arr;
      arr.push(item);
      return arr;
    }, []);

    const csvHeader = [
      "#",
      "Nombre",
      "Email",
      "Teléfono",
      "Fecha de nacimiento",
      "Género",
      "Tutor",
      "Teléfono tutor",
    ];

    uniqueTests.forEach((test) => {
      csvHeader.push(`Fecha ${test.nombre_test}`);
    });

    uniqueTests.forEach((test) => {
      let dimensiones: {
        id: number;
        descripcion: string;
      }[] = [];
      switch (test.id) {
        case TestIds.KUDER:
          const KUDERTest = test.test as KuderTestType;
          dimensiones = KUDERTest.dimensiones.map((d) => {
            return { id: d.id, descripcion: d.descripcion };
          });
          break;
        case TestIds.PMA:
          const PMATest = test.test as PmaTestType;
          dimensiones = PMATest.dimensiones.map((d) => {
            return { id: d.id, descripcion: d.descripcion + " (%)" };
          });
          dimensiones.push({
            id: 0,
            descripcion: "CI",
          });
          break;
        default:
          break;
      }
      dimensiones.forEach((dimension) => {
        csvHeader.push(dimension.descripcion);
      });
    });

    const csvRows = uniqueUsers.map((item, index) => {
      const fechas = uniqueTests.map((test) => {
        const testItem = data.find(
          (v) => v.id === test.id && v.email_user === item.email_user
        );
        return testItem ? testItem.fecha_enviado : "";
      });

      const testItems = uniqueTests
        .map((test) => {
          const testItem = data.find(
            (v) => v.id === test.id && v.email_user === item.email_user
          );
          return testItem;
        })
        .filter((v) => !!v);

      const puntuacionesTest: string[] = [];

      testItems.forEach((testItem) => {
        switch (testItem.id) {
          case TestIds.KUDER:
            const KUDERTest = JSON.parse(testItem.test) as KuderTestType;
            const respuestas = getPunctuations(
              {
                ...testItem,
                interpretacion: "",
                user: {} as User,
                version: 0,
              },
              KUDERTest,
              JSON.parse(testItem.resultados ?? "[]")
            );
            respuestas.forEach((element) => {
              const natural = element.natural;
              puntuacionesTest.push(natural === 0 ? "-" : String(natural));
            });
            break;
          case TestIds.PMA:
            const PMATest = JSON.parse(testItem.test) as PmaTestType;
            const PMARespuestas = getPunctuations(
              {
                ...testItem,
                interpretacion: "",
                user: {
                  fecha_nacimiento: testItem.fecha_nacimiento_user,
                  genero: testItem.genero_user,
                } as User,
                version: 0,
              },
              PMATest,
              JSON.parse(testItem.resultados ?? "[]")
            );
            PMARespuestas.forEach((element) => {
              const percentil =
                element.dimension === "CI"
                  ? element.natural === 0
                    ? "-"
                    : element.natural
                  : element["Percentil"] === "N/A"
                    ? "-"
                    : element["Percentil"];
              puntuacionesTest.push(String(percentil));
            });
            break;
          default:
            break;
        }
      });

      return [
        index,
        item.nombre_user,
        item.email_user,
        item.telefono_user,
        item.fecha_nacimiento_user,
        item.genero_user,
        item.nombre_tutor_user,
        item.telefono_user,
        ...fechas,
        ...puntuacionesTest,
      ];
    });

    return [csvHeader, ...csvRows];
  };

  useEffect(() => {
    if (data.length) {
      const csv = getCSV();
      //create and download txt file
      const csvContent = csv.map((e) => e.join(",")).join("\n");
      console.log(csvContent);
    }
  }, [data]);
};
