import React, { useState } from 'react';
import { Save, Send, X, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { Form, FormResponse as IFormResponse, FormField } from '../../types/form';
import { useFormStore } from '../../stores/formStore';
import { useAuthStore } from '../../stores/authStore';
import FileUpload from './FileUpload';
import * as XLSX from 'xlsx';

interface FormResponseProps {
  form: Form;
  onClose: () => void;
}

const FormResponse: React.FC<FormResponseProps> = ({ form, onClose }) => {
  const { user } = useAuthStore();
  const { addResponse, updateResponse, getResponseByUserAndForm, getResponsesByForm } = useFormStore();
  const existingResponse = user ? getResponseByUserAndForm(user.id, form.id) : undefined;

  const [formData, setFormData] = useState<{ [key: string]: any }>(
    existingResponse?.responses || {}
  );
  const [currentPage, setCurrentPage] = useState(0);

  // Agrupar campos por secciones
  const sections = form.fields.reduce((acc: FormField[][], field) => {
    if (field.type === 'section') {
      acc.push([field]);
    } else if (acc.length === 0) {
      acc.push([field]);
    } else {
      acc[acc.length - 1].push(field);
    }
    return acc;
  }, []);

  const findNextField = (
    currentField: FormField,
    value: any,
    allFields: FormField[]
  ): string | null => {
    if (!currentField.conditionalRules?.length) return null;

    for (const rule of currentField.conditionalRules) {
      let matches = false;

      switch (rule.operator) {
        case 'equals':
          matches = value === rule.value;
          break;
        case 'not_equals':
          matches = value !== rule.value;
          break;
        case 'contains':
          matches = Array.isArray(value) 
            ? value.includes(rule.value)
            : String(value).includes(String(rule.value));
          break;
        case 'not_contains':
          matches = Array.isArray(value)
            ? !value.includes(rule.value)
            : !String(value).includes(String(rule.value));
          break;
      }

      if (matches) {
        return rule.jumpToFieldId;
      }
    }

    return null;
  };

  const handleChange = (fieldId: string, value: any) => {
    const updatedData = { ...formData, [fieldId]: value };
    setFormData(updatedData);

    // Buscar el campo actual y verificar reglas condicionales
    const currentField = form.fields.find(f => f.id === fieldId);
    if (currentField) {
      const nextFieldId = findNextField(currentField, value, form.fields);
      if (nextFieldId) {
        // Encontrar la sección que contiene el campo destino
        const targetSectionIndex = sections.findIndex(section => 
          section.some(field => field.id === nextFieldId)
        );
        if (targetSectionIndex !== -1) {
          setCurrentPage(targetSectionIndex);
        }
      }
    }
  };

  const handleSubmit = (e: React.FormEvent, isDraft: boolean) => {
    e.preventDefault();
    
    const now = new Date().toISOString();
    const responseData: IFormResponse = {
      id: existingResponse?.id || crypto.randomUUID(),
      formId: form.id,
      userId: user!.id,
      academicYearId: form.academicYearId,
      responses: formData,
      status: isDraft ? 'draft' : 'submitted',
      submittedAt: isDraft ? undefined : now,
      createdAt: existingResponse?.createdAt || now,
      updatedAt: now,
      responseTimestamp: existingResponse?.responseTimestamp || now,
      lastModifiedTimestamp: now,
      submissionTimestamp: isDraft ? undefined : now,
    };

    if (existingResponse) {
      updateResponse(responseData);
    } else {
      addResponse(responseData);
    }

    if (!isDraft) {
      onClose();
    }
  };

  const exportToExcel = () => {
    const responses = getResponsesByForm(form.id);
    
    // Preparar los datos para Excel
    const data = responses.map(response => {
      const row: any = {
        'ID Respuesta': response.id,
        'Usuario': response.userId,
        'Estado': response.status,
        'Fecha de Envío': response.submissionTimestamp,
        'Última Modificación': response.lastModifiedTimestamp,
      };

      // Añadir todas las respuestas
      form.fields.forEach(field => {
        row[field.label] = response.responses[field.id];
      });

      return row;
    });

    // Crear el libro de Excel
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, 'Respuestas');

    // Descargar el archivo
    XLSX.writeFile(wb, `${form.title}_respuestas.xlsx`);
  };

  const renderField = (field: FormField) => {
    const value = formData[field.id];

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            id={`field-${field.id}`}
            value={value || ''}
            onChange={(e) => handleChange(field.id, e.target.value)}
            required={field.required}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={4}
          />
        );

      case 'select':
        return (
          <select
            id={`field-${field.id}`}
            value={value || ''}
            onChange={(e) => handleChange(field.id, e.target.value)}
            required={field.required}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Seleccionar...</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div className="mt-2 space-y-2">
            {field.options?.map((option) => (
              <label key={option} className="inline-flex items-center mr-4">
                <input
                  type="radio"
                  id={`field-${field.id}`}
                  name={field.id}
                  value={option}
                  checked={value === option}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  required={field.required}
                  className="border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className="mt-2 space-y-2">
            {field.options?.map((option) => (
              <label key={option} className="inline-flex items-center mr-4">
                <input
                  type="checkbox"
                  id={`field-${field.id}`}
                  value={option}
                  checked={(value || []).includes(option)}
                  onChange={(e) => {
                    const currentValues = new Set(value || []);
                    if (e.target.checked) {
                      currentValues.add(option);
                    } else {
                      currentValues.delete(option);
                    }
                    handleChange(field.id, Array.from(currentValues));
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'file':
        return (
          <FileUpload
            value={value}
            onChange={(files) => handleChange(field.id, files)}
            fileTypes={field.fileTypes}
            maxFileSize={field.maxFileSize}
            multiple={field.multiple}
            required={field.required}
          />
        );

      case 'section':
        return (
          <div className="mt-4 space-y-4 border-l-4 border-blue-200 pl-4">
            {field.fields?.map((subField) => (
              <div key={subField.id}>
                <label className="block text-sm font-medium text-gray-700">
                  {subField.label}
                  {subField.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </label>
                {subField.description && (
                  <p className="mt-1 text-sm text-gray-500">{subField.description}</p>
                )}
                {renderField(subField)}
              </div>
            ))}
          </div>
        );

      default:
        return (
          <input
            type={field.type}
            id={`field-${field.id}`}
            value={value || ''}
            onChange={(e) => handleChange(field.id, e.target.value)}
            required={field.required}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        );
    }
  };

  return (
    <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">{form.title}</h3>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={exportToExcel}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar Respuestas
          </button>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {form.description && (
        <p className="text-sm text-gray-500">{form.description}</p>
      )}

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          {sections[currentPage].map((field) => (
            <div key={field.id} className="mb-6 last:mb-0">
              <label className="block text-sm font-medium text-gray-700">
                {field.label}
                {field.required && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </label>
              {field.description && (
                <p className="mt-1 text-sm text-gray-500">{field.description}</p>
              )}
              {renderField(field)}
            </div>
          ))}
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => setCurrentPage(prev => prev - 1)}
              disabled={currentPage === 0}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Anterior
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={currentPage === sections.length - 1}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Siguiente
              <ChevronRight className="h-4 w-4 ml-2" />
            </button>
          </div>

          <div className="text-sm text-gray-500">
            Página {currentPage + 1} de {sections.length}
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={(e) => handleSubmit(e, true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <Save className="h-4 w-4 mr-2" />
              Guardar Borrador
            </button>
            {currentPage === sections.length - 1 && (
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Send className="h-4 w-4 mr-2" />
                Enviar Respuesta
              </button>
            )}
          </div>
        </div>
      </div>

      {existingResponse && (
        <div className="text-sm text-gray-500">
          <p>Última modificación: {new Date(existingResponse.lastModifiedTimestamp).toLocaleString()}</p>
          {existingResponse.submissionTimestamp && (
            <p>Enviado: {new Date(existingResponse.submissionTimestamp).toLocaleString()}</p>
          )}
        </div>
      )}
    </form>
  );
};

export default FormResponse;