import DefaultPhoto from "@/assets/images/defaultPhoto.jpg";
import Loader from "@/modules/core/components/ui/loader/Loader";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import { toastSuccess } from "@/modules/core/utils/toasts";
import { Navigate } from "@tanstack/react-router";
import clsx from "clsx";
import { useMeasureContext } from "../../_layout/context/MeasureContext";
import { useUserContext } from "../../auth/context/UserContext";
import AppointmentUserContractButton from "../../calendar/components/AppointmentPage/AppointmentUserContractButton";
import PreAppointmentForm from "../../calendar/components/CalendarPage/PreAppointmentForm";
import ProfileTimeline from "../components/timeline/ProfileTimeline";

interface Props {
  email?: string;
}

const Profile = ({ email }: Props) => {
  const { user, setUser } = useUserContext();
  const { size, PRIVATE_PADDING_INLINE } = useMeasureContext();
  const isSmall = size !== "normal";

  const { fetchData } = useFetch();
  const { data, setData, error } = fetchData(
    [
      email ? "GET /user/:id/psicotest/profile" : "GET /user/:id/psicotest",
      {
        id: email ?? user?.email ?? "",
      },
    ],
    {
      queryOptions: {
        gcTime: 0,
      },
    }
  );

  const { data: citas } = fetchData("GET /cita", {
    params: {
      previous: String(true),
      email: email!,
    },
    queryOptions: {
      gcTime: 0,
      //@ts-expect-error: email should exist
      enabled: !!email,
    },
  });

  if (error) return <Navigate to="/patients" />;
  if (!data) return <Loader />;

  return (
    <div
      className={clsx("w-full flex-1 overflow-auto", {
        "gap-y-4 gap-8": !isSmall,
        "gap-8": isSmall,
        grid: email,
        "flex flex-col items-center": !email,
      })}
      style={{
        paddingBottom: PRIVATE_PADDING_INLINE,
        paddingInline: PRIVATE_PADDING_INLINE,
        gridTemplateColumns: isSmall ? "1fr" : "480px 1fr",
        gridTemplateRows: isSmall ? "auto 420px 640px" : "auto 1fr",
        gridTemplateAreas: isSmall
          ? `
          'photo'
          'form'
          'table'
        `
          : `
          'photo table'
          'form table'
        `,
      }}
    >
      <div className="flex items-center justify-center">
        <img
          style={{
            gridArea: "photo",
          }}
          className="w-20 h-20 rounded-md border-4 border-white dark:border-alto-400 shadow-lg shadow-alto-950/20 dark:shadow-alto-50/10 pointer-events-none"
          src={data.foto ?? DefaultPhoto}
          onError={(event) => {
            event.currentTarget.src = DefaultPhoto;
          }}
        />
      </div>
      <div
        className="overflow-y-auto overflow-x-hidden w-[448px] max-w-full"
        style={{
          gridArea: "form",
        }}
      >
        <PreAppointmentForm
          user={data}
          onSuccess={async (userRes) => {
            if (userRes.email === user?.email) {
              setUser(userRes);
            }
            toastSuccess("Datos actualizados correctamente");
            setData(userRes);
          }}
          withName
          scrollable={false}
        />
      </div>
      {email && (
        <div
          style={{
            gridArea: "table",
          }}
          className="w-full h-full flex-1 flex flex-col gap-4 overflow-hidden"
        >
          <div className="self-end">
            <AppointmentUserContractButton user={data} full />
          </div>
          <div className="flex flex-1 flex-col rounded-lg overflow-hidden">
            <ProfileTimeline />
            {/* <AppointmentsTable patient={data} data={citas} /> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
