import React from 'react';
import { FileText, Users, BookOpen } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import StatsCard from '../ui/StatsCard';

const GestorDashboard = () => {
  const { user } = useAuthStore();

  const stats = [
    {
      title: 'Informes Pendientes',
      value: '3',
      icon: FileText,
      description: 'Informes por completar',
    },
    {
      title: 'Proyectos Activos',
      value: '5',
      icon: BookOpen,
      description: 'En el curso actual',
    },
    {
      title: 'Participantes',
      value: '12',
      icon: Users,
      description: 'En tu centro',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900">Acciones Rápidas</h3>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <button className="btn-primary">
              <FileText className="h-5 w-5 mr-2" />
              Nuevo Informe
            </button>
            <button className="btn-primary">
              <Users className="h-5 w-5 mr-2" />
              Gestionar Participantes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GestorDashboard;