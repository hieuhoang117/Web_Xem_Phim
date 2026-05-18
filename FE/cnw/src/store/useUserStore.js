import { create } from "zustand";
import { persist } from "zustand/middleware";

const userStore = create(
  persist(
    (set) => ({
      userId: null,
      token: null,
      role: null,

      login: (userId, token, role) =>
        set({
          userId,
          token,
          role
        }),

      logout: () =>
        set({
          userId: null,
          token: null,
          role: null
        })
    }),
    {
      name: "user-storage"
    }
  )
);

export default userStore;