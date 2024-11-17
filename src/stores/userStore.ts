import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, ImportResult } from '../types/user';
import Papa from 'papaparse';

interface UserState {
  users: User[];
  setUsers: (users: User[]) => void;
  addUser: (user: User) => void;
  updateUser: (user: User) => void;
  deleteUser: (userId: string) => void;
  importUsers: (file: File) => Promise<ImportResult>;
  importFromPreviousYear: (fromYearId: string, toYearId: string) => ImportResult;
  removeDuplicates: () => number;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      users: [],

      setUsers: (users) => set({ users }),

      addUser: (user) => set((state) => ({
        users: [...state.users, user],
      })),

      updateUser: (updatedUser) => set((state) => ({
        users: state.users.map((user) =>
          user.id === updatedUser.id ? updatedUser : user
        ),
      })),

      deleteUser: (userId) => set((state) => ({
        users: state.users.filter((user) => user.id !== userId),
      })),

      importUsers: async (file: File): Promise<ImportResult> => {
        return new Promise((resolve) => {
          Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
              const errors: string[] = [];
              const validUsers: User[] = [];

              results.data.forEach((row: any, index) => {
                try {
                  // Validar campos obligatorios
                  if (!row.email || !row.nombre || !row.apellidos || !row.role || !row.academicYearId) {
                    throw new Error(`Fila ${index + 1}: Faltan campos obligatorios (email, nombre, apellidos, role, academicYearId)`);
                  }

                  // Validar el rol
                  const validRoles = ['gestor', 'coordinador_subred', 'coordinador_general'];
                  if (!validRoles.includes(row.role)) {
                    throw new Error(`Fila ${index + 1}: Rol inválido. Debe ser uno de: ${validRoles.join(', ')}`);
                  }

                  validUsers.push({
                    id: crypto.randomUUID(),
                    email: row.email.trim(),
                    nombre: row.nombre.trim(),
                    apellidos: row.apellidos.trim(),
                    telefono: row.telefono?.trim() || '',
                    familiaProfesional: row.familiaProfesional?.trim() || '',
                    role: row.role as User['role'],
                    centro: row.centro?.trim(),
                    subred: row.subred?.trim(),
                    academicYearId: row.academicYearId.trim(),
                    active: row.active === 'false' ? false : true,
                  });
                } catch (error) {
                  errors.push((error as Error).message);
                }
              });

              if (validUsers.length > 0) {
                set((state) => ({
                  users: [...state.users, ...validUsers],
                }));
              }

              resolve({
                success: errors.length === 0,
                message: errors.length === 0 
                  ? `${validUsers.length} usuarios importados correctamente` 
                  : 'Importación completada con errores',
                totalProcessed: results.data.length,
                successful: validUsers.length,
                failed: errors.length,
                errors,
              });
            },
            error: (error) => {
              resolve({
                success: false,
                message: 'Error al procesar el archivo CSV',
                totalProcessed: 0,
                successful: 0,
                failed: 1,
                errors: [error.message],
              });
            }
          });
        });
      },

      importFromPreviousYear: (fromYearId: string, toYearId: string): ImportResult => {
        const { users } = get();
        const previousYearUsers = users.filter(
          (user) => user.academicYearId === fromYearId
        );

        const newUsers = previousYearUsers.map((user) => ({
          ...user,
          id: crypto.randomUUID(),
          academicYearId: toYearId,
        }));

        set((state) => ({
          users: [...state.users, ...newUsers],
        }));

        return {
          success: true,
          message: `${newUsers.length} usuarios importados correctamente`,
          totalProcessed: previousYearUsers.length,
          successful: newUsers.length,
          failed: 0,
        };
      },

      removeDuplicates: () => {
        const state = get();
        const uniqueUsers = new Map<string, User>();

        // Eliminar duplicados por email
        state.users.forEach(user => {
          if (!uniqueUsers.has(user.email) || user.updatedAt > uniqueUsers.get(user.email)!.updatedAt) {
            uniqueUsers.set(user.email, user);
          }
        });

        const removedCount = state.users.length - uniqueUsers.size;

        set({
          users: Array.from(uniqueUsers.values())
        });

        return removedCount;
      }
    }),
    {
      name: 'user-storage',
    }
  )
);