import UserTableFilters from "./UserTableFilters";

const UserTableHeader = () => {
  return (
    <div className="flex justify-between gap-2">
      <UserTableFilters />
    </div>
  );
};

export default UserTableHeader;
