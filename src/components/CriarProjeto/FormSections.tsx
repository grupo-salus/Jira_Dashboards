import React from "react";
import FormFields from "./FormFields";

// Interface para os campos do Jira
interface CampoJira {
  key: string;
  label: string;
  type: string;
  required: boolean;
  options?: Array<{ id: string; label: string }>;
}

interface FormSectionsProps {
  campos: CampoJira[];
  formData: Record<string, any>;
  handleInputChange: (key: string, value: any) => void;
  getFieldInfo: (key: string, originalLabel: string) => any;
}

const FormSections: React.FC<FormSectionsProps> = ({
  campos,
  formData,
  handleInputChange,
  getFieldInfo,
}) => {
  return (
    <div className="space-y-6">
      {campos.map((campo) => (
        <FormFields
          key={campo.key}
          field={campo}
          formData={formData}
          handleInputChange={handleInputChange}
          fieldInfo={getFieldInfo(campo.key, campo.label)}
        />
      ))}
    </div>
  );
};

export default FormSections;
