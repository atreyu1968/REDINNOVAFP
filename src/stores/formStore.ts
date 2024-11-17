import { create } from 'zustand';
import { Form, FormResponse } from '../types/form';

interface FormState {
  forms: Form[];
  responses: FormResponse[];
  addForm: (form: Form) => void;
  updateForm: (form: Form) => void;
  deleteForm: (formId: string) => void;
  publishForm: (formId: string) => void;
  archiveForm: (formId: string) => void;
  addResponse: (response: FormResponse) => void;
  updateResponse: (response: FormResponse) => void;
  getFormsByRole: (role: string) => Form[];
  getResponsesByForm: (formId: string) => FormResponse[];
  getResponseByUserAndForm: (userId: string, formId: string) => FormResponse | undefined;
}

export const useFormStore = create<FormState>((set, get) => ({
  forms: [],
  responses: [],

  addForm: (form) =>
    set((state) => ({
      forms: [...state.forms, form],
    })),

  updateForm: (updatedForm) =>
    set((state) => ({
      forms: state.forms.map((form) =>
        form.id === updatedForm.id ? updatedForm : form
      ),
    })),

  deleteForm: (formId) =>
    set((state) => ({
      forms: state.forms.filter((form) => form.id !== formId),
    })),

  publishForm: (formId) =>
    set((state) => ({
      forms: state.forms.map((form) =>
        form.id === formId ? { ...form, status: 'published' } : form
      ),
    })),

  archiveForm: (formId) =>
    set((state) => ({
      forms: state.forms.map((form) =>
        form.id === formId ? { ...form, status: 'archived' } : form
      ),
    })),

  addResponse: (response) =>
    set((state) => ({
      responses: [...state.responses, response],
    })),

  updateResponse: (updatedResponse) =>
    set((state) => ({
      responses: state.responses.map((response) =>
        response.id === updatedResponse.id ? updatedResponse : response
      ),
    })),

  getFormsByRole: (role) => {
    const { forms } = get();
    return forms.filter(
      (form) =>
        form.status === 'published' && form.assignedRoles.includes(role as any)
    );
  },

  getResponsesByForm: (formId) => {
    const { responses } = get();
    return responses.filter((response) => response.formId === formId);
  },

  getResponseByUserAndForm: (userId, formId) => {
    const { responses } = get();
    return responses.find(
      (response) => response.userId === userId && response.formId === formId
    );
  },
}));