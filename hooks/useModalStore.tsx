import {
  Department,
  Exam,
  Location,
  SessionExam,
  Teacher,
} from "@prisma/client";
import { create } from "zustand";

export type ModalType =
  | "createSession"
  | "createDepartment"
  | "updateDepartment"
  | "createTeacher"
  | "updateTeacher"
  | "createBuilding"
  | "updateBuilding"
  | "createExam";

interface ModalData {
  session?: SessionExam;
  department?: Department;
  departments?: Department[];
  building?: Location;
  teacher?: Teacher;
  exam?: Exam;
  apiUrl?: string;
  query?: Record<string, any>;
}

interface ModalStore {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ type: null, isOpen: false }),
}));
