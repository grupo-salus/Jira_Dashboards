import React from "react";
import { isCampoObrigatorio } from "./formUtils";

interface CampoJira {
  key: string;
  label: string;
  type: string;
  required: boolean;
  options?: Array<{ id: string; label: string }>;
}

interface FormFieldsProps {
  campo: CampoJira;
  formData: Record<string, any>;
  handleInputChange: (key: string, value: any) => void;
  getFieldInfo: (key: string, originalLabel: string) => any;
}

const FormFields: React.FC<FormFieldsProps> = ({
  campo,
  formData,
  handleInputChange,
  getFieldInfo,
}) => {
  const { key, type, required, options } = campo;
  const fieldInfo = getFieldInfo(key, campo.label);

  // Usa a função customizada para determinar se o campo é obrigatório
  const isRequired = isCampoObrigatorio(key, required);

  switch (type) {
    case "string":
      if (
        [
          "description",
          "customfield_10481",
          "customfield_10476",
          "customfield_10477",
          "customfield_10248",
          "customfield_10482",
          "customfield_10485",
        ].includes(key)
      ) {
        return (
          <div key={key} className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {fieldInfo.label}{" "}
              {isRequired && <span className="text-red-500">*</span>}
            </label>
            {fieldInfo.description && (
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400 italic">
                {fieldInfo.description}
              </p>
            )}
            <textarea
              rows={fieldInfo.rows || 4}
              value={formData[key] || ""}
              onChange={(e) => handleInputChange(key, e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
              required={isRequired}
              placeholder={fieldInfo.placeholder}
            />
          </div>
        );
      }
      return (
        <div key={key} className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {fieldInfo.label}{" "}
            {isRequired && <span className="text-red-500">*</span>}
          </label>
          {fieldInfo.description && (
            <p className="mb-2 text-xs text-gray-500 dark:text-gray-400 italic">
              {fieldInfo.description}
            </p>
          )}
          <input
            type="text"
            value={formData[key] || ""}
            onChange={(e) => handleInputChange(key, e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            required={isRequired}
            placeholder={fieldInfo.placeholder}
          />
        </div>
      );
    case "date":
      return (
        <div key={key} className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {fieldInfo.label}{" "}
            {isRequired && <span className="text-red-500">*</span>}
          </label>
          {fieldInfo.description && (
            <p className="mb-2 text-xs text-gray-500 dark:text-gray-400 italic">
              {fieldInfo.description}
            </p>
          )}
          <input
            type="date"
            value={formData[key] || ""}
            onChange={(e) => handleInputChange(key, e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            required={isRequired}
          />
        </div>
      );
    case "number":
      return (
        <div key={key} className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {fieldInfo.label}{" "}
            {isRequired && <span className="text-red-500">*</span>}
          </label>
          {fieldInfo.description && (
            <p className="mb-2 text-xs text-gray-500 dark:text-gray-400 italic">
              {fieldInfo.description}
            </p>
          )}
          <input
            type="number"
            value={formData[key] || ""}
            onChange={(e) =>
              handleInputChange(key, parseFloat(e.target.value) || 0)
            }
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            required={isRequired}
            placeholder={fieldInfo.placeholder}
          />
        </div>
      );
    case "option":
      return (
        <div key={key} className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {fieldInfo.label}{" "}
            {isRequired && <span className="text-red-500">*</span>}
          </label>
          {fieldInfo.description && (
            <p className="mb-2 text-xs text-gray-500 dark:text-gray-400 italic">
              {fieldInfo.description}
            </p>
          )}
          <select
            value={
              typeof formData[key] === "object"
                ? formData[key]?.id || ""
                : formData[key] || ""
            }
            onChange={(e) =>
              handleInputChange(
                key,
                e.target.value ? { id: e.target.value } : null
              )
            }
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            required={isRequired}
          >
            <option value="">{fieldInfo.placeholder}</option>
            {options?.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      );
    case "priority":
      return (
        <div key={key} className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {fieldInfo.label}{" "}
            {isRequired && <span className="text-red-500">*</span>}
          </label>
          {fieldInfo.description && (
            <p className="mb-2 text-xs text-gray-500 dark:text-gray-400 italic">
              {fieldInfo.description}
            </p>
          )}
          <select
            value={
              typeof formData[key] === "object"
                ? formData[key]?.id || ""
                : formData[key] || ""
            }
            onChange={(e) =>
              handleInputChange(
                key,
                e.target.value ? { id: e.target.value } : null
              )
            }
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            required={isRequired}
          >
            <option value="">{fieldInfo.placeholder}</option>
            {options?.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      );
    case "array":
      return (
        <div key={key} className="mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                checked={
                  Array.isArray(formData[key])
                    ? formData[key].includes("10712")
                    : false
                }
                onChange={(e) => {
                  if (e.target.checked) {
                    handleInputChange(key, ["10712"]);
                  } else {
                    handleInputChange(key, []);
                  }
                }}
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700"
                required={isRequired}
              />
              <div className="flex-1">
                <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  {fieldInfo.label}{" "}
                  {isRequired && <span className="text-red-500">*</span>}
                </span>
                {fieldInfo.description && (
                  <p className="mt-1 text-xs text-blue-800 dark:text-blue-200">
                    {fieldInfo.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    default:
      return (
        <div key={key} className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {fieldInfo.label}{" "}
            {isRequired && <span className="text-red-500">*</span>}
          </label>
          {fieldInfo.description && (
            <p className="mb-2 text-xs text-gray-500 dark:text-gray-400 italic">
              {fieldInfo.description}
            </p>
          )}
          <input
            type="text"
            value={formData[key] || ""}
            onChange={(e) => handleInputChange(key, e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            required={isRequired}
            placeholder={fieldInfo.placeholder}
          />
        </div>
      );
  }
};

export default FormFields;
