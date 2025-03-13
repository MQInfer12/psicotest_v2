import DefaultPhoto from "@/assets/images/defaultPhoto.jpg";
import Icon from "@/modules/core/components/icons/Icon";
import TableHeader from "@/modules/core/components/ui/table/header/TableHeader";
import Table from "@/modules/core/components/ui/table/Table";
import { COLORS } from "@/modules/core/constants/COLORS";
import { LOCAL_ANSWERS_SEARCH } from "@/modules/core/constants/LOCALS";
import { useThemeContext } from "@/modules/core/context/ThemeContext";
import { useDebounce } from "@/modules/core/hooks/useDebounce";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import { formatStringList } from "@/modules/core/utils/formatStringList";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";
import clsx from "clsx";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useMeasureContext } from "../../_layout/context/MeasureContext";
import FolderList from "../../folders/components/FolderList";
import { IA_Plantilla } from "../../templates/api/responses";
import { T_Tests_Respuestas } from "../../tests/api/responses";
import AnswersHeader from "../components/AnswersHeader";
import AnswersInterpretation from "../components/AnswersInterpretation";
import {
  AnswersHeaderContextProvider,
  AnswersTableFilters,
  SelectedTests,
} from "../context/AnswersHeaderContext";
import { useLastFocused } from "../hooks/useLastFocused";
import { useSendMail } from "../hooks/useSendMail";
import { RespuestaEstado } from "../types/RespuestaEstado";
import { FOLDER_TYPES_I_CAN_MOVE } from "../constants/params";

const columnHelper = createColumnHelper<T_Tests_Respuestas>();

const AnswersPage = () => {
  const { dark } = useThemeContext();

  const navigate = useNavigate();
  const [filters, setFilters] = useState<AnswersTableFilters>({
    type: "nombre",
    value: "",
  });

  const search = useSearch({
    from: "/_private/answers/",
  });
  const { folders } = search;
  const setFolders = (param: number[] | ((prev: number[]) => number[])) => {
    let newValue: number[] = [];
    if (typeof param === "function") {
      newValue = param(folders);
    } else {
      newValue = param;
    }
    navigate({
      to: "/answers",
      search: (prev) => ({ ...prev, folders: newValue }),
    });
  };

  const [plantilla, setPlantilla] = useState("");
  const [startedSelection, setStartedSelection] = useState<IA_Plantilla | null>(
    null
  );
  const [selectedTests, setSelectedTests] = useState<SelectedTests | null>(
    null
  );
  const showInterpretation =
    !!startedSelection &&
    !!Object.values(startedSelection.id_tests).every((id_test) =>
      selectedTests?.selecteds.map((s) => s.id_test).includes(id_test)
    );

  useEffect(() => {
    localStorage.setItem(LOCAL_ANSWERS_SEARCH, JSON.stringify(search));
    setSelectedTests(null);
  }, [search]);

  const { debouncedValue, isDebouncing } = useDebounce(
    JSON.stringify(folders),
    {
      delay: 1000,
      valueIsDefault: true,
    }
  );

  const { fetchData, getDataSetter } = useFetch();
  const { data, isLoading, refetch } = fetchData("GET /respuesta/for/table", {
    params: {
      folders: debouncedValue ?? "[]",
    },
    queryOptions: {
      gcTime: 0,
    },
  });
  const setData = getDataSetter("GET /respuesta/for/table", {
    folders: debouncedValue ?? "[]",
  });

  const { data: dataFolders, setData: setDataFolders } =
    fetchData("GET /carpeta");

  const { handleSendMail } = useSendMail();

  const [loading, setLoading] = useState<number | null>(null);
  const { PRIVATE_PADDING_INLINE } = useMeasureContext();

  const columns = useMemo(
    () => [
      columnHelper.accessor("nombre_user", {
        header: "Usuario",
        cell: (info) => (
          <div className="flex gap-3 items-center w-full overflow-hidden">
            <div className="min-w-10 w-10 aspect-square rounded-md bg-alto-100 overflow-hidden">
              <motion.img
                layoutId={`answer-foto-${info.row.original.id_respuesta}`}
                className="w-full h-full"
                src={info.row.original.foto_user || DefaultPhoto}
                onError={(event) => {
                  event.currentTarget.src = DefaultPhoto;
                }}
              />
            </div>
            <div className="flex-1 flex flex-col gap-1 overflow-hidden">
              <motion.strong
                layoutId={`answer-nombre-${info.row.original.id_respuesta}`}
                className="font-semibold text-sm whitespace-nowrap overflow-hidden text-ellipsis"
              >
                {info.getValue()}
              </motion.strong>
              <motion.p
                layoutId={`answer-email-${info.row.original.id_respuesta}`}
                className="text-[10px] font-medium text-alto-700 dark:text-alto-400"
              >
                {info.row.original.email_user}
              </motion.p>
            </div>
          </div>
        ),
      }),
      columnHelper.accessor("nombre_test", {
        header: "Test",
        cell: (info) => (
          <div className="flex-1 flex flex-col gap-1 overflow-hidden">
            <motion.strong
              layoutId={`answer-test-${info.row.original.id_respuesta}`}
              className="font-semibold text-sm text-primary-600 dark:text-primary-400 whitespace-nowrap overflow-hidden text-ellipsis"
            >
              {info.getValue()}
            </motion.strong>
            <div className="text-[10px] font-medium text-alto-700 dark:text-alto-400 overflow-hidden whitespace-nowrap flex gap-1">
              <div className="w-3 aspect-square">
                <Icon type={Icon.Types.FOLDER} />
              </div>
              <p>{info.row.original.nombre_carpeta ?? "Sin clasificación"}</p>
            </div>
          </div>
        ),
        meta: {
          width: 200,
        },
      }),
      columnHelper.accessor("estado", {
        header: "Estado",
        cell: (info) => (
          <div className="flex w-full justify-center">
            <small
              className={clsx(
                "px-2 py-[2px] text-xs font-semibold rounded-md",
                {
                  "bg-success/10 text-success":
                    info.getValue() === RespuestaEstado.ENVIADO,
                  "bg-alto-600/10 text-alto-600":
                    info.getValue() === RespuestaEstado.PENDIENTE,
                }
              )}
            >
              {info.getValue()}
            </small>
          </div>
        ),
        meta: {
          width: 120,
        },
      }),
      columnHelper.accessor("tiene_interpretacion", {
        header: "Interpretado",
        cell: (info) => (
          <div className="flex w-full justify-center">
            <button
              className={clsx(
                "px-2 py-[2px] text-xs font-semibold rounded-md flex items-center justify-center gap-1",
                {
                  "bg-success/10 text-success": info.getValue(),
                  "bg-alto-600/10 text-alto-600": !info.getValue(),
                }
              )}
              disabled={!info.getValue()}
              onClick={() =>
                handleSendMail([info.row.original.id_respuesta], (res) => {
                  setData((prev) =>
                    prev.map((v) => {
                      const exist = res.find(
                        (respuesta) => respuesta.id_respuesta === v.id_respuesta
                      );
                      if (exist) {
                        return exist;
                      }
                      return v;
                    })
                  );
                })
              }
            >
              {info.getValue() ? "SI" : "NO"}
              {info.row.original.fecha_visible && (
                <div className="h-3 w-3">
                  <Icon type={Icon.Types.MAIL} />
                </div>
              )}
            </button>
          </div>
        ),
        meta: {
          width: 120,
        },
      }),
    ],
    []
  );

  const getFilteredData = () => {
    return data?.filter((v) => {
      const value = filters.value.trim().toLocaleLowerCase();
      if (value === "") return true;
      if (filters.type === "nombre")
        return v.nombre_user?.toLocaleLowerCase().includes(value);
      if (filters.type === "test")
        return v.nombre_test?.toLocaleLowerCase().includes(value);
    });
  };

  const checkDisabled = (row: T_Tests_Respuestas) => {
    if (!startedSelection) return true;

    const isFromTemplate = Object.values(startedSelection.id_tests).includes(
      row.id
    );

    if (!selectedTests) return !isFromTemplate;

    const isSameUser = row.email_user === selectedTests.user.email;

    const alreadySelected = selectedTests.selecteds.some(
      (s) => s.id_test === row.id && s.id_respuesta !== row.id_respuesta
    );

    return (
      !isSameUser ||
      !isFromTemplate ||
      alreadySelected ||
      row.estado === RespuestaEstado.PENDIENTE
    );
  };

  const { getLastFocused } = useLastFocused();
  const lastFocused = getLastFocused(showInterpretation);

  const filteredData = getFilteredData();
  return (
    <div
      style={{
        paddingInline: PRIVATE_PADDING_INLINE,
      }}
      className="flex pb-10 flex-1 overflow-hidden gap-8 max-lg:flex-col max-lg:gap-4"
    >
      <FolderList
        selectedFolders={folders}
        setSelectedFolders={setFolders}
        loading={isDebouncing || isLoading}
        loadingFetch={isLoading}
        data={dataFolders}
        setData={setDataFolders}
      />
      <div className="flex-1 rounded-lg overflow-hidden flex flex-col">
        <AnswersHeaderContextProvider
          filters={filters}
          setFilters={setFilters}
          selectedTests={selectedTests}
          setSelectedTests={setSelectedTests}
          startedSelection={startedSelection}
          setStartedSelection={setStartedSelection}
          disableFilters={showInterpretation}
          setData={setData}
          refetch={refetch}
          plantilla={plantilla}
          setPlantilla={setPlantilla}
        >
          {showInterpretation ? (
            <AnswersInterpretation />
          ) : (
            <Table
              savedOffsetKey="answers_page_table_offset"
              data={filteredData}
              columns={columns}
              checkable
              canBeChecked={(row) => {
                const carpeta = dataFolders?.find(
                  (f) => f.id === row.id_carpeta
                );
                return carpeta?.tipo
                  ? FOLDER_TYPES_I_CAN_MOVE.includes(carpeta.tipo)
                  : true;
              }}
              disableCheck={!!startedSelection}
              idKey="id_respuesta"
              defaultFocusedRows={lastFocused ?? []}
              actions={[
                {
                  fn: (row) => {
                    setLoading(row.id_respuesta);
                    navigate({
                      to: "/answers/$id",
                      params: {
                        id: String(row.id_respuesta),
                      },
                    });
                  },
                  icon: Icon.Types.BRAIN,
                  title: "Ver respuesta",
                  disabled: (row) =>
                    !!startedSelection ||
                    row.estado === RespuestaEstado.PENDIENTE,
                },
              ]}
              loadingRow={(row) => row.id_respuesta === loading}
              rounded={false}
              smallEmptyMessage={
                folders.length === 0
                  ? "Selecciona una carpeta para mostrar las respuestas"
                  : undefined
              }
              rowStyle={
                startedSelection
                  ? (row) => ({
                      opacity: checkDisabled(row) ? 0.1 : undefined,
                      backgroundColor: selectedTests?.selecteds
                        .map((s) => s.id_respuesta)
                        .includes(row.id_respuesta)
                        ? dark
                          ? COLORS.primary[900]
                          : COLORS.primary[200]
                        : dark
                          ? COLORS.alto[1000]
                          : COLORS.alto[50],
                      pointerEvents: checkDisabled(row) ? "none" : undefined,
                    })
                  : undefined
              }
              onClickRow={
                startedSelection
                  ? {
                      fn: (row) => {
                        setSelectedTests((prev) => {
                          if (!prev) {
                            return {
                              user: {
                                email: row.email_user,
                                nombre: row.nombre_user,
                                fechaNacimiento: row.fecha_nacimiento_user,
                                fechaEnviado: row.fecha_enviado,
                              },
                              selecteds: [
                                {
                                  id_respuesta: row.id_respuesta,
                                  id_test: row.id,
                                  nombre_test: row.nombre_test,
                                  nombre_carpeta:
                                    row.nombre_carpeta || "Sin clasificación",
                                  fecha_visible: row.fecha_visible,
                                },
                              ],
                            };
                          }
                          const exists = prev.selecteds
                            .map((s) => s.id_respuesta)
                            .includes(row.id_respuesta);
                          if (!exists) {
                            return {
                              ...prev,
                              selecteds: [
                                ...prev.selecteds,
                                {
                                  id_respuesta: row.id_respuesta,
                                  id_test: row.id,
                                  nombre_test: row.nombre_test,
                                  nombre_carpeta:
                                    row.nombre_carpeta || "Sin clasificación",
                                  fecha_visible: row.fecha_visible,
                                },
                              ],
                            };
                          }
                          if (prev.selecteds.length - 1 === 0) {
                            return null;
                          }
                          return {
                            ...prev,
                            selecteds: prev.selecteds.filter(
                              (selected) =>
                                selected.id_respuesta !== row.id_respuesta
                            ),
                          };
                        });
                      },
                      disabled: checkDisabled,
                    }
                  : undefined
              }
            >
              <TableHeader
                text={
                  startedSelection
                    ? `Seleccionar tests de una persona: ${formatStringList(Object.keys(startedSelection.id_tests))}`
                    : undefined
                }
                folders={folders}
              >
                <AnswersHeader />
              </TableHeader>
            </Table>
          )}
        </AnswersHeaderContextProvider>
      </div>
    </div>
  );
};

export default AnswersPage;
