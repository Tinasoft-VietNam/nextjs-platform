import { create } from "zustand";

type ModalState = {
    isOpen: boolean,
    selectedRecord: any | null,
    openModal: (record?: any) => void,
    closeModal: () => void,
};
export const useModalStore = create<ModalState>((set) => ({
    isOpen: false,
    selectedRecord: null,
    openModal: (record = null) => set({ isOpen: true, selectedRecord: record }),
    closeModal: () => set({ isOpen: false, selectedRecord: null }),
}));