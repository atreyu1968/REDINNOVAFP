import React from 'react';
import { FileText, Calendar, CheckCircle, Clock, Archive } from 'lucide-react';
import { Form } from '../../types/form';
import { useFormStore } from '../../stores/formStore';
import { useAuthStore } from '../../stores/authStore';

interface FormListProps {
  forms: Form[];
  isAdmin: boolean;
  onFormClick: (form: Form) => void;
}

const statusIcons = {
  draft: Clock,
  published: CheckCircle,
  archived: Archive,
};

const statusColors = {
  draft: 'text-yellow-500 bg-yellow-100',
  published: 'text-green-500 bg-green-100',
  archived: 'text-gray-500 bg-gray-100',
};

const FormList: React.FC<FormListProps> = ({ forms, isAdmin, onFormClick }) => {
  const { user } = useAuthStore();
  const { getResponseByUserAndForm } = useFormStore();

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {forms.map((form) => {
          const StatusIcon = statusIcons[form.status];
          const statusColor = statusColors[form.status];
          const response = user ? getResponseByUserAndForm(user.id, form.id) : undefined;

          return (
            <li key={form.id}>
              <button
                onClick={() => onFormClick(form)}
                className="w-full block hover:bg-gray-50 transition-colors duration-150"
              >
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <p className="ml-3 text-sm font-medium text-gray-900">
                        {form.title}
                      </p>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex space-x-2">
                      {response && (
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          response.status === 'submitted' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {response.status === 'submitted' ? 'Enviado' : 'Borrador'}
                        </span>
                      )}
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColor}`}
                      >
                        <StatusIcon className="h-4 w-4 mr-1" />
                        {form.status.charAt(0).toUpperCase() + form.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        {form.description}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      {response && (
                        <p className="mr-4">
                          Última modificación: {new Date(response.lastModifiedTimestamp).toLocaleString()}
                        </p>
                      )}
                      {form.startDate && form.endDate && (
                        <div className="flex items-center">
                          <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          <p>
                            {new Date(form.startDate).toLocaleDateString()} -{' '}
                            {new Date(form.endDate).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default FormList;