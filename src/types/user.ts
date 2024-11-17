export type UserRole = 'gestor' | 'coordinador_subred' | 'coordinador_general';

export interface User {
  id: string;
  email: string;
  nombre: string;
  apellidos: string;
  telefono: string;
  familiaProfesional: string;
  role: UserRole;
  centro?: string;
  subred?: string;
  academicYearId: string;
  active: boolean;
}

export interface ImportResult {
  success: boolean;
  message: string;
  totalProcessed: number;
  successful: number;
  failed: number;
  errors?: string[];
}