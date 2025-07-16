import React from "react";
import { isCampoObrigatorio } from "./formUtils";
import { TEXTAREA_FIELDS } from "./constants";

interface FormFieldsProps {
  field: any;
  formData: Record<string, any>;
  handleInputChange: (key: string, value: any) => void;
  fieldInfo: any;
}

const FormFields: React.FC<FormFieldsProps> = ({
  field,
  formData,
  handleInputChange,
  fieldInfo,
}) => {
  // Verificação defensiva para evitar erro se field for undefined
  if (!field || !field.key) {
    return null;
  }

  const isRequired = isCampoObrigatorio(field.key, field.required);
  const type = field.type || "string";
  const key = field.key;
  const value = formData[key] || "";

  const handleChange = (newValue: any) => {
    handleInputChange(key, newValue);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(e.target.value);
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleChange(e.target.value);
  };

  const handleSelectChange = (selectedOption: any) => {
    handleChange(selectedOption);
  };

  switch (type) {
    case "string":
      if (TEXTAREA_FIELDS.includes(key as any)) {
        return (
          <div key={key} className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {fieldInfo.label}{" "}
              {isRequired && <span className="text-red-500">*</span>}
            </label>
            {fieldInfo.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {fieldInfo.description}
              </p>
            )}
            <textarea
              value={value}
              onChange={handleTextareaChange}
              placeholder={fieldInfo.placeholder}
              rows={fieldInfo.rows || 3}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${
                isRequired && !value
                  ? "border-red-300 bg-red-50 dark:bg-red-900/10 dark:border-red-700"
                  : "border-gray-300 dark:border-gray-600"
              } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
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
            value={value}
            onChange={handleTextChange}
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
            value={value}
            onChange={(e) => handleChange(e.target.value)}
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
            value={value}
            onChange={(e) => handleChange(parseFloat(e.target.value) || 0)}
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
            value={typeof value === "object" ? value?.id || "" : value || ""}
            onChange={(e) =>
              handleSelectChange(e.target.value ? { id: e.target.value } : null)
            }
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            required={isRequired}
          >
            <option value="">{fieldInfo.placeholder}</option>
            {field.options?.map((option: any) => (
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
            value={typeof value === "object" ? value?.id || "" : value || ""}
            onChange={(e) =>
              handleSelectChange(e.target.value ? { id: e.target.value } : null)
            }
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            required={isRequired}
          >
            <option value="">{fieldInfo.placeholder}</option>
            {field.options?.map((option: any) => (
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
                checked={Array.isArray(value) ? value.includes("10712") : false}
                onChange={(e) => {
                  if (e.target.checked) {
                    handleChange(["10712"]);
                  } else {
                    handleChange([]);
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
            value={value}
            onChange={handleTextChange}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            required={isRequired}
            placeholder={fieldInfo.placeholder}
          />
        </div>
      );
  }
};

export default FormFields;
