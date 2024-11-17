import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Subnet, EducationalCenter, Island, ProfessionalFamily } from '../types/network';

export const ISLANDS: Island[] = [
  'Tenerife',
  'Gran Canaria',
  'Lanzarote',
  'La Palma',
  'La Gomera',
  'El Hierro',
  'Fuerteventura'
];

interface NetworkState {
  subnets: Subnet[];
  centers: EducationalCenter[];
  families: ProfessionalFamily[];
  addSubnet: (subnet: Subnet) => void;
  updateSubnet: (subnet: Subnet) => void;
  deleteSubnet: (subnetId: string) => void;
  addCenter: (center: EducationalCenter) => void;
  updateCenter: (center: EducationalCenter) => void;
  deleteCenter: (centerId: string) => void;
  addFamily: (family: ProfessionalFamily) => void;
  updateFamily: (family: ProfessionalFamily) => void;
  deleteFamily: (familyId: string) => void;
  getCIFPs: () => EducationalCenter[];
  getSubnetsByIsland: (island: Island) => Subnet[];
  getCentersBySubnet: (subnetId: string) => EducationalCenter[];
  getFamiliesByYear: (yearId: string) => ProfessionalFamily[];
  importSubnetsFromCSV: (file: File) => Promise<{ success: boolean; message: string }>;
  importCentersFromCSV: (file: File) => Promise<{ success: boolean; message: string }>;
  importFamiliesFromCSV: (file: File) => Promise<{ success: boolean; message: string }>;
  importSubnetsFromYear: (fromYearId: string, toYearId: string) => void;
  importCentersFromYear: (fromYearId: string, toYearId: string) => void;
  importFamiliesFromYear: (fromYearId: string, toYearId: string) => void;
  removeDuplicates: () => { subnets: number; centers: number; families: number };
}

export const useNetworkStore = create<NetworkState>()(
  persist(
    (set, get) => ({
      subnets: [],
      centers: [],
      families: [],

      addSubnet: (subnet) => set((state) => ({ 
        subnets: [...state.subnets, subnet] 
      })),

      updateSubnet: (updatedSubnet) => set((state) => ({
        subnets: state.subnets.map(subnet => 
          subnet.id === updatedSubnet.id ? updatedSubnet : subnet
        )
      })),

      deleteSubnet: (subnetId) => set((state) => ({
        subnets: state.subnets.filter(subnet => subnet.id !== subnetId)
      })),

      addCenter: (center) => set((state) => ({
        centers: [...state.centers, center]
      })),

      updateCenter: (updatedCenter) => set((state) => ({
        centers: state.centers.map(center =>
          center.id === updatedCenter.id ? updatedCenter : center
        )
      })),

      deleteCenter: (centerId) => set((state) => ({
        centers: state.centers.filter(center => center.id !== centerId)
      })),

      addFamily: (family) => set((state) => ({
        families: [...state.families, family]
      })),

      updateFamily: (updatedFamily) => set((state) => ({
        families: state.families.map(family =>
          family.id === updatedFamily.id ? updatedFamily : family
        )
      })),

      deleteFamily: (familyId) => set((state) => ({
        families: state.families.filter(family => family.id !== familyId)
      })),

      getCIFPs: () => {
        const { centers } = get();
        return centers.filter(center => center.type === 'CIFP');
      },

      getSubnetsByIsland: (island) => {
        const { subnets } = get();
        return subnets.filter(subnet => subnet.island === island);
      },

      getCentersBySubnet: (subnetId) => {
        const { centers } = get();
        return centers.filter(center => center.subnetId === subnetId);
      },

      getFamiliesByYear: (yearId) => {
        const { families } = get();
        return families.filter(family => family.academicYearId === yearId);
      },

      importSubnetsFromCSV: async (file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            try {
              const text = e.target?.result as string;
              const rows = text.split('\n').filter(Boolean);
              const subnets: Subnet[] = rows.slice(1).map((row) => {
                const [name, island, cifpId] = row.split(',').map(cell => cell.trim());
                return {
                  id: crypto.randomUUID(),
                  name,
                  island: island as Island,
                  cifpId,
                  academicYearId: '', // Se establece al importar
                  active: true,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                };
              });

              set((state) => ({
                subnets: [...state.subnets, ...subnets],
              }));

              resolve({
                success: true,
                message: `${subnets.length} subredes importadas correctamente`,
              });
            } catch (error) {
              resolve({
                success: false,
                message: 'Error al procesar el archivo CSV',
              });
            }
          };
          reader.readAsText(file);
        });
      },

      importCentersFromCSV: async (file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            try {
              const text = e.target?.result as string;
              const rows = text.split('\n').filter(Boolean);
              const centers: EducationalCenter[] = rows.slice(1).map((row) => {
                const [code, name, type, island, subnetId] = row.split(',').map(cell => cell.trim());
                return {
                  id: crypto.randomUUID(),
                  code,
                  name,
                  type: type as 'CIFP' | 'IES',
                  island: island as Island,
                  subnetId: subnetId || undefined,
                  academicYearId: '', // Se establece al importar
                  active: true,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                };
              });

              set((state) => ({
                centers: [...state.centers, ...centers],
              }));

              resolve({
                success: true,
                message: `${centers.length} centros importados correctamente`,
              });
            } catch (error) {
              resolve({
                success: false,
                message: 'Error al procesar el archivo CSV',
              });
            }
          };
          reader.readAsText(file);
        });
      },

      importFamiliesFromCSV: async (file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            try {
              const text = e.target?.result as string;
              const rows = text.split('\n').filter(Boolean);
              const families: ProfessionalFamily[] = rows.slice(1).map((row) => {
                const [code, name] = row.split(',').map(cell => cell.trim());
                return {
                  id: crypto.randomUUID(),
                  code,
                  name,
                  academicYearId: '', // Se establece al importar
                  active: true,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                };
              });

              set((state) => ({
                families: [...state.families, ...families],
              }));

              resolve({
                success: true,
                message: `${families.length} familias importadas correctamente`,
              });
            } catch (error) {
              resolve({
                success: false,
                message: 'Error al procesar el archivo CSV',
              });
            }
          };
          reader.readAsText(file);
        });
      },

      importSubnetsFromYear: (fromYearId, toYearId) => {
        const { subnets } = get();
        const subnetsToImport = subnets
          .filter((subnet) => subnet.academicYearId === fromYearId)
          .map((subnet) => ({
            ...subnet,
            id: crypto.randomUUID(),
            academicYearId: toYearId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }));

        set((state) => ({
          subnets: [...state.subnets, ...subnetsToImport],
        }));
      },

      importCentersFromYear: (fromYearId, toYearId) => {
        const { centers } = get();
        const centersToImport = centers
          .filter((center) => center.academicYearId === fromYearId)
          .map((center) => ({
            ...center,
            id: crypto.randomUUID(),
            academicYearId: toYearId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }));

        set((state) => ({
          centers: [...state.centers, ...centersToImport],
        }));
      },

      importFamiliesFromYear: (fromYearId, toYearId) => {
        const { families } = get();
        const familiesToImport = families
          .filter((family) => family.academicYearId === fromYearId)
          .map((family) => ({
            ...family,
            id: crypto.randomUUID(),
            academicYearId: toYearId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }));

        set((state) => ({
          families: [...state.families, ...familiesToImport],
        }));
      },

      removeDuplicates: () => {
        const state = get();
        const uniqueSubnets = new Map<string, Subnet>();
        const uniqueCenters = new Map<string, EducationalCenter>();
        const uniqueFamilies = new Map<string, ProfessionalFamily>();

        // Eliminar duplicados de subredes (por nombre e isla)
        state.subnets.forEach(subnet => {
          const key = `${subnet.name}-${subnet.island}`;
          if (!uniqueSubnets.has(key) || subnet.updatedAt > uniqueSubnets.get(key)!.updatedAt) {
            uniqueSubnets.set(key, subnet);
          }
        });

        // Eliminar duplicados de centros (por código)
        state.centers.forEach(center => {
          if (!uniqueCenters.has(center.code) || center.updatedAt > uniqueCenters.get(center.code)!.updatedAt) {
            uniqueCenters.set(center.code, center);
          }
        });

        // Eliminar duplicados de familias profesionales (por código)
        state.families.forEach(family => {
          if (!uniqueFamilies.has(family.code) || family.updatedAt > uniqueFamilies.get(family.code)!.updatedAt) {
            uniqueFamilies.set(family.code, family);
          }
        });

        const removedCount = {
          subnets: state.subnets.length - uniqueSubnets.size,
          centers: state.centers.length - uniqueCenters.size,
          families: state.families.length - uniqueFamilies.size
        };

        set({
          subnets: Array.from(uniqueSubnets.values()),
          centers: Array.from(uniqueCenters.values()),
          families: Array.from(uniqueFamilies.values())
        });

        return removedCount;
      }
    }),
    {
      name: 'network-storage',
    }
  )
);