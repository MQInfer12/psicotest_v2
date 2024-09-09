import useFetch from "@/modules/core/hooks/useFetch";
import { useModal } from "@/modules/core/components/ui/modal/useModal";
import { User } from "../api/responses";
import UserForm from "../components/UserForm";
import UserCard from "../components/UserCard";

const UserPage = () => {
  const { fetchData } = useFetch();
  const { data, setData } = fetchData(["users"], "GET /user");
  const { modal, setOpen } = useModal<User>();

  return (
    <div className="w-full flex flex-col items-center pb-20 px-10">
      {modal((item) => (
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
      <button className="sticky top-0" onClick={() => setOpen(true)}>
        Añadir usuario
      </button>
      <br />
      <div className="flex gap-16 flex-wrap items-center justify-center">
        {data?.map((u) => (
          <UserCard
            key={u.email}
            user={u}
            setOpen={setOpen}
            setData={setData}
          />
        ))}
      </div>
    </div>
  );
};

export default UserPage;
