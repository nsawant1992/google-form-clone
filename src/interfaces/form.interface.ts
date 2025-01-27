export type FieldType = 'text' | 'radio' | 'checkbox';

export interface FormField {
    id: string;
    type: FieldType;
    label: string;
    options?: string[];  // Only for radio/checkbox fields
}

export interface FormStructure {
    id: string;
    name: string;
    fields: FormField[];
}

export interface FormResponse {
    formId: string;
    responses: { [fieldId: string]: string | string[] };
}
