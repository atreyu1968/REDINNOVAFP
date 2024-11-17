import React, { useState } from 'react';
import { Plus, Download } from 'lucide-react';
import ReportList from '../components/reports/ReportList';
import ReportBuilder from '../components/reports/ReportBuilder';
import { Report } from '../types/report';
import { useAcademicYearStore } from '../stores/academicYearStore';
import { useAuthStore } from '../stores/authStore';
import { useReportStore } from '../stores/reportStore';

const Reports = () => {
  const [showBuilder, setShowBuilder] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const { user } = useAuthStore();
  const { activeYear } = useAcademicYearStore();
  const { reports, addReport, updateReport } = useReportStore();

  if (!activeYear && user?.role !== 'coordinador_general') {
    return (
      <div className="bg-yellow-50 p-4 rounded-md">
        <p className="text-yellow-700">
          No hay un curso académico activo. Contacta con el coordinador general.
        </p>
      </div>
    );
  }

  const handleReportSubmit = (data: Partial<Report>) => {
    const now = new Date().toISOString();
    if (selectedReport) {
      updateReport({
        ...selectedReport,
        ...data,
        updatedAt: now,
      } as Report);
    } else {
      addReport({
        ...data,
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
        createdBy: user!.id,
        academicYearId: activeYear?.id || '',
      } as Report);
    }
    setShowBuilder(false);
    setSelectedReport(null);
  };

  const handleExport = (report: Report) => {
    // Exportar datos en formato CSV
    const csvData = report.visualizations.map(visualization => {
      const data = useReportStore.getState().getReportData(visualization);
      return {
        title: visualization.title,
        data: data
      };
    });

    // Crear el contenido CSV
    const csvContent = csvData.map(({ title, data }) => {
      const headers = Object.keys(data[0] || {}).join(',');
      const rows = data.map(row => Object.values(row).join(',')).join('\n');
      return `${title}\n${headers}\n${rows}\n\n`;
    }).join('\n');

    // Descargar el archivo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `informe_${report.title}_${new Date().toISOString()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredReports = user?.role === 'coordinador_general'
    ? reports
    : reports.filter(report => 
        report.academicYearId === activeYear?.id && 
        (report.createdBy === user?.id || report.isPublic)
      );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Informes</h2>
          <p className="mt-1 text-sm text-gray-500">
            {activeYear ? `Curso académico: ${activeYear.year}` : 'Todos los cursos'}
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => {
              setSelectedReport(null);
              setShowBuilder(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Informe
          </button>
        </div>
      </div>

      {showBuilder ? (
        <div className="bg-white shadow sm:rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">
            {selectedReport ? 'Editar Informe' : 'Nuevo Informe'}
          </h3>
          <ReportBuilder
            initialData={selectedReport || undefined}
            onSubmit={handleReportSubmit}
            onCancel={() => {
              setShowBuilder(false);
              setSelectedReport(null);
            }}
          />
        </div>
      ) : (
        <ReportList
          reports={filteredReports}
          onReportClick={(report) => {
            setSelectedReport(report);
            setShowBuilder(true);
          }}
          onExport={handleExport}
        />
      )}
    </div>
  );
};

export default Reports;