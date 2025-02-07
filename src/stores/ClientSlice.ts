import {
  fetchClients,
  createClient,
  updateClient,
  deleteClient,
} from "@/helpers/fetchAPI";
import { Client, CreateClient } from "@/types/client";
import { toast } from "react-toastify";
import { StateCreator } from "zustand";

export interface IClientSlice {
  clients: Client[];
  clientSelected: Client | null;
  fetchClients: () => Promise<void>;
  createClient: (newClient: CreateClient) => Promise<void>;
  updateClient: (clientToUpdate: Client) => Promise<void>;
  deleteClient: (idClient: Client["_id"]) => Promise<void>;
}

export const createClienteSlice: StateCreator<IClientSlice> = (set, get) => ({
  clients: [],
  clientSelected: null,
  fetchClients: async () => {
    try {
      const token = localStorage.getItem("kike-token")?.toString() || "";
      const arrayClients = await fetchClients(token);
      set(() => ({
        clients: [...arrayClients],
      }));
    } catch (error) {
      toast.error("Ha ocurrido un error al obtener los clientes");
      console.log(error);
    }
  },
  createClient: async (newClient) => {
    try {
      const token = localStorage.getItem("kike-token")?.toString() || "";
      await createClient(token, newClient);
      await get().fetchClients();
    } catch (error) {
      toast.error("Ha ocurrido un error al registrar el cliente");
      console.log(error);
    }
  },
  updateClient: async (clientToUpdate) => {
    try {
      const token = localStorage.getItem("kike-token")?.toString() || "";
      await updateClient(token, clientToUpdate);
      await get().fetchClients();
    } catch (error) {
      toast.error("Ha ocurrido un error al registrar el cliente");
      console.log(error);
    }
  },
  deleteClient: async (idClient) => {
    try {
      const token = localStorage.getItem("kike-token")?.toString() || "";
      await deleteClient(token, idClient);
      await get().fetchClients();
    } catch (error) {
      console.log(error);
    }
  },
});
