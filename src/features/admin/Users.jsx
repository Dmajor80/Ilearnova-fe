import { ArrowDown, Calendar, Search } from "lucide-react";
import React from "react";
import { useState } from "react";
import { useSuperAdminUsers } from "@/hooks/superadmin";

const Users = () => {
  const { loading, error, users, totalUsers, fetchUsers } = useSuperAdminUsers();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (event) => {
    event.preventDefault();
    fetchUsers({ search: searchQuery.trim() });
  };

  return (
    <>
      <div>
        {/* user nav */}
        <div className="flex items-center justify-between max-w-[1250px] p-[5px]">
          <p
            className="text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] font-medium"
            style={{ color: "rgba(18, 40, 164, 1)" }}
          >
            User Management <br />
            <span
              className="text-[8px] sm:text-[10px] md:text-[12px] lg:text-[14px]"
              style={{ color: "rgba(0, 0, 0, 1)" }}
            >
              Manage users across all roles efficiently.
            </span>
          </p>
          <div className="flex items-center gap-4">
            <button
              className="text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] font-medium flex items-center justify-center gap-3.5 p-[5px] w-[125px] h-[46px] rounded-[8px]"
              style={{
                color: "rgba(18, 40, 164, 1)",
                border: "1px  solid rgba(18, 40, 164, 1)",
              }}
              onClick={() => setShowSearch(!showSearch)}
            >
              <Search size={20} style={{ color: "rgba(18, 40, 164, 1)" }} />{" "}
              Search
            </button>
            {showSearch && (
              <form className="flex items-center gap-2" onSubmit={handleSearch}>
                <input
                  type="search"
                  aria-label="Search users"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="border border-gray-300 rounded-full py-2 px-4 text-sm"
                />
                <button className="text-sm text-blue-700" type="submit">Apply</button>
              </form>
            )}
            <button
              className="text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] font-medium flex items-center justify-center gap-3.5 p-[5px] w-[125px] h-[46px] rounded-[8px]"
              style={{
                color: "rgba(18, 40, 164, 1)",
                border: "1px  solid rgba(18, 40, 164, 1)",
              }}
            >
              <ArrowDown size={20} style={{ color: "rgba(18, 40, 164, 1)" }} />{" "}
              Export
            </button>
            <button
              className="text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] font-medium flex items-center justify-center gap-3.5 p-[5px] w-[125px] h-[46px] rounded-[8px]"
              style={{
                color: "rgba(18, 40, 164, 1)",
                border: "1px  solid rgba(18, 40, 164, 1)",
              }}
            >
              <Calendar size={20} style={{ color: "rgba(18, 40, 164, 1)" }} />
              Date
            </button>
          </div>
        </div>
        {/* end of user nav */}

        {/* users */}
        <div className="mt-8 flex flex-col gap-6 p-[5px]">
          <p className="text-sm text-gray-600" aria-live="polite">
            {totalUsers} user{totalUsers === 1 ? "" : "s"}
          </p>
          {loading && <p role="status">Loading users...</p>}
          {error && (
            <div role="alert" className="rounded-lg bg-red-50 p-4 text-red-700">
              <p>{error.message}</p>
              <button
                type="button"
                className="mt-2 underline"
                onClick={() => fetchUsers({ search: searchQuery.trim() })}
              >
                Retry
              </button>
            </div>
          )}
          {!loading && !error && users.length === 0 && (
            <p className="rounded-lg bg-white p-6 text-gray-600">No users found.</p>
          )}
          {users.map((user) => {
            const name = [user.first_name, user.last_name].filter(Boolean).join(" ") || user.username;
            const roles = Array.isArray(user.roles)
              ? user.roles.map((role) => (
                typeof role === "string" ? role : role.name ?? role.role ?? role.code
              )).filter(Boolean).join(", ")
              : "";

            return (
            <div
              key={user.id}
              className="rounded-[10px] p-3"
              style={{ backgroundColor: "rgba(255, 255, 255, 1)" }}
            >
              {/* user1 nav */}
              <div className="flex items-center justify-between max-w-[1250px] p-[5px]">
                <p
                  className="text-[16px] sm:text-[18px] md:text-[20px] lg:text-[25px]"
                  style={{ color: "rgba(51, 51, 51, 1)" }}
                >
                  {name}
                </p>
              </div>
              {/*end of  user1 nav */}

              {/* form generating */}
              {/* name fetch */}
              <div className="flex flex-col p-[10px]">
                <label
                  className="text-12px sm:text-[14px]  md:text-[16px] lg:text-[18px] font-medium mb-3"
                  style={{ color: "rgba(51, 51, 51, 1)" }}
                >
                  {" "}
                  Name
                </label>
                <p
                  className=" p-[10px] h-[54px] p-[5px]text-12px sm:text-[14px]  md:text-[16px] lg:text-[18px] font-medium rounded-[8px]"
                  style={{
                    color: "rgba(51, 51, 51, 1)",
                    border: "1.5px solid rgba(174, 174, 174, 1) ",
                    backgroundColor: "rgba(235, 235, 235, 1)",
                  }}
                >
                  {name}
                </p>
              </div>
              {/*end of  name fetch */}

              {/* email fetch */}

              <div className="flex flex-col p-[10px]">
                <label
                  className="text-12px sm:text-[14px]  md:text-[16px] lg:text-[18px] font-medium mb-3"
                  style={{ color: "rgba(51, 51, 51, 1)" }}
                >
                  Email Address
                </label>
                <p
                  className=" p-[10px] h-[54px] p-[5px]text-12px sm:text-[14px]  md:text-[16px] lg:text-[18px] font-medium rounded-[8px]"
                  type="text"
                  style={{
                    color: "rgba(51, 51, 51, 1)",
                    border: "1.5px solid rgba(174, 174, 174, 1)",
                    backgroundColor: "rgba(235, 235, 235, 1)",
                  }}
                >
                  {user.email}
                </p>
              </div>
              {/* end of  email fetch */}

              <div className="flex items-center w-full">
                {/* Role fetch */}
                <div className="flex flex-col p-[10px]">
                  <label
                    className="text-12px sm:text-[14px]  md:text-[16px] lg:text-[18px] font-medium mb-3"
                    style={{ color: "rgba(51, 51, 51, 1)" }}
                  >
                    Role
                  </label>
                  <p
                    className=" p-[10px] w-[487px] h-[54px] p-[5px]text-12px sm:text-[14px]  md:text-[16px] lg:text-[18px] font-medium rounded-[8px]"
                    type="text"
                    style={{
                      color: "rgba(51, 51, 51, 1)",
                      border: "1.5px solid rgba(174, 174, 174, 1) ",
                      backgroundColor: "rgba(235, 235, 235, 1)",
                    }}
                  >
                    {roles || "—"}
                  </p>
                </div>
                {/*end of  Role fetch */}

                {/* Status fetch */}
                <div className="flex flex-col p-[10px]">
                  <label
                    className="text-12px sm:text-[14px]  md:text-[16px] lg:text-[18px] font-medium mb-3"
                    style={{ color: "rgba(51, 51, 51, 1)" }}
                  >
                    Status
                  </label>
                  <p
                    className=" p-[10px] w-[487px] h-[54px] p-[5px]text-12px sm:text-[14px]  md:text-[16px] lg:text-[18px] font-medium rounded-[8px]"
                    type="text"
                    style={{
                      color: user.is_active ? "green" : "rgba(107, 114, 128, 1)",
                      border: "1.5px solid rgba(174, 174, 174, 1)",
                      backgroundColor: "rgba(235, 235, 235, 1)",
                    }}
                  >
                    {user.is_active ? "Active" : "Inactive"}
                  </p>
                </div>
                {/* end of  Status fetch */}
              </div>
              {/* last login */}
              <p
                className="text-12px sm:text-[14px]  md:text-[16px] lg:text-[18px] font-medium mb-3 p-[10px]"
                style={{ color: "rgba(51, 51, 51, 1)" }}
              >
                {user.created_at
                  ? `Joined ${new Date(user.created_at).toLocaleDateString()}`
                  : ""}
              </p>
              {/* end of  last login */}
              {/* end of form generating */}
            </div>
            );
          })}
        </div>
        {/*end of  users */}
      </div>
    </>
  );
};

export default Users;
