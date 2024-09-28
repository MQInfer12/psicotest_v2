import { useModal } from "@/modules/core/components/ui/modal/useModal";
import { User } from "../api/responses";
import UserForm from "../components/UserForm";
import UserCard from "../components/UserCard";
import Button from "@/modules/core/components/ui/Button";
import Loader from "@/modules/core/components/ui/loader/Loader";
import useFetch from "@/modules/core/hooks/useFetch/useFetch";
import { useMeasureContext } from "../../_layout/context/MeasureContext";

const UserPage = () => {
  const { fetchData } = useFetch();
  const { data, setData } = fetchData("GET /user");
  const { modal, setOpen } = useModal<User>();
  const { PRIVATE_PADDING_INLINE } = useMeasureContext();

  return (
    <div
      style={{
        paddingInline: PRIVATE_PADDING_INLINE,
      }}
      className="w-full flex-1 flex flex-col items-center pb-20 gap-12"
    >
      {modal("Formulario de usuario", (item) => (
        <UserForm
          user={item}
          onSuccess={(user) => {
            if (!item) {
              setData((prev) => [...prev, user]);
            } else {
              setData((prev) =>
                prev.map((v) => (v.email === item.email ? user : v))
              );
            }
            setOpen(false);
          }}
        />
      ))}
      <Button btnType="secondary" onClick={() => setOpen(true)}>
        Añadir usuario
      </Button>
      {data ? (
        <div
          className="w-full grid gap-8 gap-y-16 mt-8 place-content-center"
          style={{
            gridTemplateColumns: `repeat(auto-fill, minmax(328px, 1fr))`,
          }}
        >
          {data?.map((u) => (
            <UserCard
              key={u.email}
              user={u}
              setOpen={setOpen}
              setData={setData}
            />
          ))}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default UserPage;
