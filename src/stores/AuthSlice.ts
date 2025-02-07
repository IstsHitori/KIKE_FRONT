import { StateCreator } from "zustand";
import { IProfile } from "@/types";
import { fetchProfile } from "@/helpers/fetchAPI";
export interface IAuthSlice {
  token: string;
  profile: IProfile;
  getProfile: () => Promise<void>;
  logoutSesion: () => void;
  setToken: (token: string) => void;
}

export const createAuthSlice: StateCreator<IAuthSlice> = (set, get) => ({
  token:
    (localStorage.getItem("kike-token")?.toString() as string) || "",
  profile: {
    user: "",
  },
  getProfile: async () => {
    const dataProfile = (await fetchProfile(get().token)) as IProfile;
    set(() => ({
      profile: dataProfile,
    }));
  },
  logoutSesion: () => {
    localStorage.removeItem("kike-token");
    set(() => ({ token: "" }));
  },
  setToken: (token: string) => {
    set(() => ({
      token,
    }));
  },
});
