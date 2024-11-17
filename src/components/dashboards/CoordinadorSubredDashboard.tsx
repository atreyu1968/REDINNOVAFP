import React from 'react';
import { Network, FileText, Users } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import StatsCard from '../ui/StatsCard';

const CoordinadorSubredDashboard = () => {
  const { user } = useAuthStore();

  const stats = [
    {
      title: 'Centros en la Subred',
      value: '8',
      icon: Network,
      description: user?.subred,
    },
    {
      title: 'Informes Recibidos',
      value: '24',
      icon: FileText,
      description: 'Este curso académico',
    },
    {
      title: 'Total Participantes',
      value: '96',
      icon: Users,
      description: 'En toda la subred',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white rounded-lg shadow">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900">Estado de Informes</h3>
            <div className="mt-4">
              <div className="space-y-4">
                {['IES Example 1', 'IES Example 2', 'IES Example 3'].map((centro) => (
                  <div key={centro} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">{centro}</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Completado
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900">Actividad Reciente</h3>
            <div className="mt-4">
              <div className="flow-root">
                <ul className="-mb-8">
                  {[
                    'Nuevo informe de IES Example 1',
                    'Actualización de datos en IES Example 2',
                    'Registro de nuevo proyecto en IES Example 3',
                  ].map((activity, idx) => (
                    <li key={idx}>
                      <div className="relative pb-8">
                        <div className="relative flex space-x-3">
                          <div>
                            <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                              <FileText className="h-5 w-5 text-white" />
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm text-gray-500">{activity}</p>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoordinadorSubredDashboard;