export type FormFieldType = 'text' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date' | 'number' | 'file' | 'section';

export interface ConditionalRule {
  fieldId: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains';
  value: string | string[];
  jumpToFieldId: string;
}

export interface FormField {
  id: string;
  type: FormFieldType;
  label: string;
  required: boolean;
  options?: string[];
  placeholder?: string;
  description?: string;
  fileTypes?: string[]; // Allowed file types (e.g., ['image/*', 'application/pdf'])
  maxFileSize?: number; // Maximum file size in bytes
  multiple?: boolean; // Allow multiple file uploads
  fields?: FormField[]; // For sections
  conditionalRules?: ConditionalRule[]; // Rules for conditional logic
}

export interface FormResponse {
  id: string;
  formId: string;
  userId: string;
  academicYearId: string;
  responses: {
    [fieldId: string]: string | string[] | boolean | FileResponse[];
  };
  status: 'draft' | 'submitted';
  responseTimestamp: string;
  lastModifiedTimestamp: string;
  submissionTimestamp?: string;
}

export interface FileResponse {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: string;
}

export interface Form {
  id: string;
  title: string;
  description: string;
  fields: FormField[];
  assignedRoles: ('gestor' | 'coordinador_subred' | 'coordinador_general')[];
  academicYearId: string;
  startDate?: string;
  endDate?: string;
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
}