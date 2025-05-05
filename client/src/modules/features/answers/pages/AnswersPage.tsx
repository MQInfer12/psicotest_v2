import Icon from "@/modules/core/components/icons/Icon";
import Button from "@/modules/core/components/ui/Button";
import { useModal } from "@/modules/core/components/ui/modal/useModal";
import DoubleColumn from "@/modules/core/components/ui/table/columns/DoubleColumn";
import PhotoColumn from "@/modules/core/components/ui/table/columns/PhotoColumn";
import StateColumn from "@/modules/core/components/ui/table/columns/StateColumn";
import TableHeader from "@/modules/core/components/ui/table/header/TableHeader";
import Table from "@/modules/core/components/ui/table/Table";
import { LOCAL_ANSWERS_SEARCH } from "@/modules/core/constants/LOCALS";
import { useThemeContext } from "@/modules/core/context/ThemeContext";
import { useDebounce } from "@/modules/core/hooks/useDebounce";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import { formatDate } from "@/modules/core/utils/formatDate";
import { formatStringList } from "@/modules/core/utils/formatStringList";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { useMeasureContext } from "../../_layout/context/MeasureContext";
import FolderList from "../../folders/components/FolderList";
import { IA_Plantilla } from "../../templates/api/responses";
import { T_Tests_Respuestas } from "../../tests/api/responses";
import AnswersHeader from "../components/AnswersHeader";
import AnswersInterpretation from "../components/AnswersInterpretation";
import EnsureAnswerPage from "../components/EnsureAnswerPage";
import {
  AnswersHeaderContextProvider,
  AnswersTableFilters,
  SelectedTests,
} from "../context/AnswersHeaderContext";
import { useLastFocused } from "../hooks/useLastFocused";
import { useSendMail } from "../hooks/useSendMail";
import { RespuestaEstado } from "../types/RespuestaEstado";

const columnHelper = createColumnHelper<T_Tests_Respuestas>();

const AnswersPage = () => {
  const { dark, COLORS } = useThemeContext();

  const { setOpen, modal } = useModal();
  const { setOpen: setOpenDetalle, modal: modalDetalle } = useModal<number>();

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
          <PhotoColumn
            src={info.row.original.foto_user}
            text={info.getValue()}
            small={info.row.original.email_user}
            imgLayoutId={`answer-foto-${info.row.original.id_respuesta}`}
            textLayoutId={`answer-nombre-${info.row.original.id_respuesta}`}
            smallLayoutId={`answer-email-${info.row.original.id_respuesta}`}
          />
        ),
      }),
      columnHelper.accessor("nombre_test", {
        header: "Test",
        cell: (info) => (
          <DoubleColumn
            text={info.getValue()}
            small={info.row.original.nombre_carpeta ?? "Sin clasificación"}
            icon={Icon.Types.FOLDER}
            textLayoutId={`answer-test-${info.row.original.id_respuesta}`}
          />
        ),
        meta: {
          width: 160,
        },
      }),
      columnHelper.accessor("fecha_enviado", {
        header: "Fechas",
        cell: (info) => {
          const fecha_enviado = info.getValue();
          return (
            <DoubleColumn
              text={fecha_enviado ? formatDate(fecha_enviado) : "-"}
              textTitleDetail="Fecha de envío"
              small={formatDate(info.row.original.fecha_asignado)}
              smallTitleDetail="Fecha de asignación"
              icon={Icon.Types.CALENDAR}
            />
          );
        },
        meta: {
          width: 120,
        },
      }),
      columnHelper.accessor("estado", {
        header: "Estado",
        cell: (info) => (
          <StateColumn
            data={[
              {
                text: RespuestaEstado.ENVIADO,
                color: "success",
                condition: info.getValue() === RespuestaEstado.ENVIADO,
              },
              {
                text: RespuestaEstado.PENDIENTE,
                color: "alto",
                condition: info.getValue() === RespuestaEstado.PENDIENTE,
              },
            ]}
          />
        ),
        meta: {
          width: 120,
        },
      }),
      columnHelper.accessor("tiene_interpretacion", {
        header: "Interpretado",
        cell: (info) => (
          <StateColumn
            data={[
              {
                text: "SI",
                color: "success",
                condition: info.getValue(),
                onClick: () => {
                  handleSendMail([info.row.original.id_respuesta], (res) => {
                    setData((prev) =>
                      prev.map((v) => {
                        const exist = res.find(
                          (respuesta) =>
                            respuesta.id_respuesta === v.id_respuesta
                        );
                        if (exist) {
                          return exist;
                        }
                        return v;
                      })
                    );
                  });
                },
                icon: info.row.original.fecha_visible
                  ? Icon.Types.MAIL
                  : undefined,
              },
              {
                text: "NO",
                color: "alto",
                condition: !info.getValue(),
              },
            ]}
          />
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
    if (row.estado === RespuestaEstado.PENDIENTE) return true;

    const isFromTemplate = Object.values(startedSelection.id_tests).includes(
      row.id
    );

    if (!selectedTests) return !isFromTemplate;

    const isSameUser = row.email_user === selectedTests.user.email;

    const alreadySelected = selectedTests.selecteds.some(
      (s) => s.id_test === row.id && s.id_respuesta !== row.id_respuesta
    );

    return !isSameUser || !isFromTemplate || alreadySelected;
  };

  const { getLastFocused } = useLastFocused();
  const lastFocused = getLastFocused(showInterpretation);

  const filteredData = getFilteredData();

  const actualFolders = folders
    .map((f) =>
      f === 0
        ? "Sin clasificación"
        : (dataFolders?.find((f2) => f2.id === f)?.descripcion ?? "")
    )
    .filter((v) => !!v);

  return (
    <>
      {modal(
        "Selección de carpetas",
        <FolderList
          selectedFolders={folders}
          setSelectedFolders={setFolders}
          loading={isDebouncing || isLoading}
          loadingFetch={isLoading}
          data={dataFolders}
          setData={setDataFolders}
        />,
        {
          type: "floating",
          canBeClosed: !isLoading,
        }
      )}
      {modalDetalle(
        "Detalles del resultado",
        (id) => (
          <EnsureAnswerPage id={id} loading={loading} setLoading={setLoading} />
        ),
        {
          width: 1420,
          type: "floating",
          blur: true,
        }
      )}
      <div
        style={{
          paddingInline: PRIVATE_PADDING_INLINE,
        }}
        className="flex flex-col pb-10 flex-1 overflow-hidden gap-4"
      >
        <header className="flex gap-4 justify-between items-center overflow-hidden">
          {actualFolders.length ? (
            <Button
              btnSize="small"
              onClick={() => setOpen(true)}
              icon={Icon.Types.FOLDER}
              reverse
              btnType="tertiary"
              className="overflow-hidden"
              disabled={isLoading}
            >
              {formatStringList(actualFolders)}
            </Button>
          ) : (
            <span />
          )}
          <div className="flex gap-4">
            <Button
              onClick={() => setOpen(true)}
              btnType="secondary"
              btnSize="small"
              icon={Icon.Types.MENU}
              subicon={Icon.Types.FOLDER}
              disabled={isLoading}
            >
              Carpetas
            </Button>
          </div>
        </header>
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
                /* canBeChecked={(row) => {
                const carpeta = dataFolders?.find(
                  (f) => f.id === row.id_carpeta
                );
                return carpeta?.tipo
                  ? FOLDER_TYPES_I_CAN_MOVE.includes(carpeta.tipo)
                  : true;
              }} */
                disableCheck={!!startedSelection}
                idKey="id_respuesta"
                defaultFocusedRows={lastFocused ?? []}
                actions={[
                  {
                    fn: (row) => {
                      setLoading(row.id_respuesta);
                      //! xd
                      if (false) {
                        setOpenDetalle(row.id_respuesta);
                      } else {
                        navigate({
                          to: "/answers/$id",
                          params: {
                            id: String(row.id_respuesta),
                          },
                        });
                      }
                    },
                    icon: Icon.Types.EYE,
                    title: "Ver respuesta",
                    type: "secondary",
                    disabled: (row) =>
                      !!startedSelection ||
                      row.estado === RespuestaEstado.PENDIENTE,
                  },
                ]}
                loadingRow={(row) => row.id_respuesta === loading}
                rounded={false}
                smallEmptyMessage={
                  actualFolders.length === 0
                    ? "Selecciona una carpeta para mostrar las respuestas"
                    : loading || isDebouncing
                      ? "Cargando..."
                      : "Sin resultados"
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
                        disabled: checkDisabled,
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
    </>
  );
};

export default AnswersPage;
