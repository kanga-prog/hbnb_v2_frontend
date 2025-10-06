import React, { useContext } from "react";
import { UserContext } from "../contexts/UserContext";

export default function Header() {
  const { user } = useContext(UserContext);

  return (
    <header className="bg-brandRed text-white shadow-md px-6 py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
      {/* Logo */}
      <h1 className="text-3xl font-extrabold tracking-wide">HBnB</h1>

      {/* Zone utilisateur */}
      <div className="flex items-center gap-3">
        {user ? (
          <>
            <img
              src={user.avatar ? `http://127.0.0.1:5000${user.avatar}` : "/default-avatar.png"}
              alt="Avatar"
              className="w-12 h-12 rounded-full border-2 border-white object-cover"
            />
            <div className="flex flex-col">
              <span className="text-sm">Bonjour 👋</span>
              <span className="font-semibold">{user.username}</span>
              {user.is_admin && (
                <span className="text-xs bg-white text-brandRed px-2 py-0.5 rounded-full mt-1 text-center">
                  Admin
                </span>
              )}
            </div>
          </>
        ) : (
          <span className="italic">Bienvenue invité 👋</span>
        )}
      </div>
    </header>
  );
}
