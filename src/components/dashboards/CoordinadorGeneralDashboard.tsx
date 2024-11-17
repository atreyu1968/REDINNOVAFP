import React from 'react';
import { Network, FileText, Users, TrendingUp } from 'lucide-react';
import StatsCard from '../ui/StatsCard';

const CoordinadorGeneralDashboard = () => {
  const stats = [
    {
      title: 'Total Subredes',
      value: '5',
      icon: Network,
      description: 'Activas',
    },
    {
      title: 'Total Centros',
      value: '42',
      icon: FileText,
      description: 'Participantes',
    },
    {
      title: 'Total Participantes',
      value: '384',
      icon: Users,
      description: 'En toda la red',
    },
    {
      title: 'Proyectos Activos',
      value: '156',
      icon: TrendingUp,
      description: 'Este curso',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white rounded-lg shadow">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900">Estado por Subredes</h3>
            <div className="mt-4">
              <div className="space-y-4">
                {[
                  { name: 'Madrid-Norte', progress: 85 },
                  { name: 'Madrid-Sur', progress: 92 },
                  { name: 'Madrid-Este', progress: 78 },
                  { name: 'Madrid-Oeste', progress: 88 },
                ].map((subred) => (
                  <div key={subred.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">
                        {subred.name}
                      </span>
                      <span className="text-sm font-medium text-gray-600">
                        {subred.progress}%
                      </span>
                    </div>
                    <div className="relative pt-1">
                      <div className="overflow-hidden h-2 text-xs flex rounded bg-blue-100">
                        <div
                          style={{ width: `${subred.progress}%` }}
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900">Resumen de Actividad</h3>
            <div className="mt-4">
              <div className="flow-root">
                <ul className="-mb-8">
                  {[
                    'Nueva subred añadida: Madrid-Este',
                    'Actualización general de informes',
                    'Nuevo coordinador asignado en Madrid-Sur',
                    'Inicio de nuevo período académico',
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

export default CoordinadorGeneralDashboard;