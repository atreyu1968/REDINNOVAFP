import React, { useState } from 'react';
import { Save, X } from 'lucide-react';
import { useNetworkStore, ISLANDS } from '../../stores/networkStore';
import { useAcademicYearStore } from '../../stores/academicYearStore';
import { EducationalCenter } from '../../types/network';

interface CenterFormProps {
  initialData?: EducationalCenter;
  onSubmit: () => void;
  onCancel: () => void;
}

const CenterForm: React.FC<CenterFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const { activeYear } = useAcademicYearStore();
  const { addCenter, updateCenter, getSubnetsByIsland } = useNetworkStore();

  const [formData, setFormData] = useState<Partial<EducationalCenter>>({
    code: initialData?.code || '',
    name: initialData?.name || '',
    type: initialData?.type || 'IES',
    island: initialData?.island || ISLANDS[0],
    subnetId: initialData?.subnetId || '',
    active: initialData?.active ?? true,
  });

  const subnets = getSubnetsByIsland(formData.island!);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const centerData: EducationalCenter = {
      id: initialData?.id || crypto.randomUUID(),
      ...formData,
      academicYearId: activeYear!.id,
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as EducationalCenter;

    if (initialData) {
      updateCenter(centerData);
    } else {
      addCenter(centerData);
    }

    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Código del Centro
          </label>
          <input
            type="text"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nombre del Centro
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tipo de Centro
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as 'CIFP' | 'IES' })}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="CIFP">CIFP</option>
            <option value="IES">IES</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Isla
          </label>
          <select
            value={formData.island}
            onChange={(e) => {
              setFormData({
                ...formData,
                island: e.target.value as any,
                subnetId: '', // Reset subnet when island changes
              });
            }}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {ISLANDS.map((island) => (
              <option key={island} value={island}>
                {island}
              </option>
            ))}
          </select>
        </div>
      </div>

      {formData.type === 'IES' && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Subred
          </label>
          <select
            value={formData.subnetId}
            onChange={(e) => setFormData({ ...formData, subnetId: e.target.value })}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Seleccionar subred...</option>
            {subnets.map((subnet) => (
              <option key={subnet.id} value={subnet.id}>
                {subnet.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex items-center">
        <input
          type="checkbox"
          checked={formData.active}
          onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <span className="ml-2 text-sm text-gray-700">Centro activo</span>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <X className="h-4 w-4 mr-2" />
          Cancelar
        </button>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <Save className="h-4 w-4 mr-2" />
          Guardar
        </button>
      </div>
    </form>
  );
};

export default CenterForm;