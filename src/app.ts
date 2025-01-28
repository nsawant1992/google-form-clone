import { FieldType, FormField, FormResponse, FormStructure } from './interfaces/form.interface.js';
import { LocalStorageHelper } from './storage/localStorageHelper.js';

class GoogleFormApp {
    private forms: FormStructure[] = [];
    private responses: FormResponse[] = [];
    private formKey = 'forms';
    private responseKey = 'responses';
    private activeForm: FormStructure | null = null;

    constructor() {
        this.loadForms();
        this.renderFormList();
        this.addEventListeners();
    }

    private loadForms(): void {
        this.forms = LocalStorageHelper.getData<FormStructure[]>(this.formKey) || [];
    }

    private saveForms(): void {
        LocalStorageHelper.saveData(this.formKey, this.forms);
    }

    private renderFormList(): void {
        const formListContainer = document.getElementById('form-list');
        if (!formListContainer) return;

        formListContainer.innerHTML = '';

        this.forms.forEach((form) => {
            const formElement = document.createElement('div');
            formElement.className = 'form-item';


            formElement.innerHTML = `
                <h3>${form.name}</h3>
                <button onclick="window.app.viewForm('${form.id}')">View</button>
                <button onclick="window.app.goToFormDetails('${form.id}')">Preview</button>
                <button onclick="window.app.viewResponses('${form.id}')">View Responses</button>
                <button onclick="window.app.deleteForm('${form.id}')">Delete</button>
            `;
            formListContainer.appendChild(formElement);
        });
    }

    private addEventListeners(): void {
        const createFormButton = document.getElementById('create-form');
        if (createFormButton) {
            createFormButton.addEventListener('click', () => this.createNewForm());
        }
    }

    private createNewForm(): void {
        const formName = prompt('Enter Form Name:');
        if (!formName) return;

        const newForm: FormStructure = {
            id: new Date().toISOString(),
            name: formName,
            fields: [],
        };

        this.forms.push(newForm);
        this.saveForms();
        this.renderFormList();
    }

    public viewResponses(formId: string): void {
        const storedResponses: FormResponse[] = LocalStorageHelper.getData<FormResponse[]>('responses') || [];
        const forms: FormStructure[] = LocalStorageHelper.getData<FormStructure[]>('forms') || [];

        const formResponses = storedResponses.filter(response => response.formId === formId);
        const formStructure = forms.find(form => form.id === formId);

        if (formResponses.length === 0 || !formStructure) {
            alert("No responses found for this form.");
            return;
        }

        console.log(`Responses for Form: ${formStructure.name}`);

        // Extract field labels instead of IDs
        const fieldLabels = formStructure.fields.map(field => field.label);

        // Convert responses into a structured table format
        const tableData = formResponses.map((response, index) => {
            const formattedResponse: { [key: string]: any } = {};

            formStructure.fields.forEach((field) => {
                const fieldLabel = field.label;
                formattedResponse[fieldLabel] = response.responses[fieldLabel] || "-"; // Use "-" if empty
            });

            return formattedResponse;
        });

        // Log the responses in tabular format
        console.table(tableData);

        // Inform the user that responses are available in the console
        alert("Responses are displayed in the console.\nOpen the browser console (F12 -> Console) to view them in table format.");
    }

    public viewForm(formId: string): void {
        this.activeForm = this.forms.find((form) => form.id === formId) || null;
        if (!this.activeForm) return;

        const formBuilder = document.getElementById('form-builder');
        if (!formBuilder) return;

        formBuilder.innerHTML = `
            <h2>${this.activeForm.name}</h2>
            <button onclick="window.app.addField()">Add Field</button>
            <div id="fields-container"></div>
        `;

        this.renderFields();
    }

    private renderFields(): void {
        if (!this.activeForm) return;

        const fieldsContainer = document.getElementById('fields-container');
        if (!fieldsContainer) return;

        fieldsContainer.innerHTML = ''; // Clear existing fields before rendering

        this.activeForm.fields.forEach((field) => {
            const fieldElement = document.createElement('div');
            fieldElement.classList.add('form-field');
            fieldElement.setAttribute('data-field-id', field.id); // Add unique identifier

            // Create label
            const labelElement = document.createElement('label');
            labelElement.textContent = field.label;
            labelElement.htmlFor = field.id;
            fieldElement.appendChild(labelElement);

            // Create input fields based on type
            if (field.type === 'text') {
                const input = document.createElement('input');
                input.type = 'text';
                input.name = field.id;
                input.id = field.id;
                input.disabled = true; // Disabled by default
                fieldElement.appendChild(input);
            } else if (field.type === 'radio' || field.type === 'checkbox') {
                const optionsContainer = document.createElement('div');
                optionsContainer.classList.add(field.type === 'radio' ? 'radio-group' : 'checkbox-group');

                field.options?.forEach((option) => {
                    const optionWrapper = document.createElement('div');
                    const input = document.createElement('input');
                    input.type = field.type;
                    input.name = field.id;
                    input.value = option;
                    input.id = `${field.id}-${option}`;
                    input.disabled = true;

                    const optionLabel = document.createElement('label');
                    optionLabel.htmlFor = input.id;
                    optionLabel.textContent = option;

                    optionWrapper.appendChild(input);
                    optionWrapper.appendChild(optionLabel);
                    optionsContainer.appendChild(optionWrapper);
                });

                fieldElement.appendChild(optionsContainer);
            }

            // Add Edit and Delete buttons
            const buttonContainer = document.createElement('div');
            buttonContainer.classList.add('action-buttons');

            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.onclick = () => this.editField(field.id);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = () => this.deleteField(field.id);

            buttonContainer.appendChild(editButton);
            buttonContainer.appendChild(deleteButton);
            fieldElement.appendChild(buttonContainer);

            fieldsContainer.appendChild(fieldElement);
        });
    }

    public addField(): void {
        if (!this.activeForm) return;

        const label = prompt('Enter field label:');
        if (!label || label.trim() === '') {
            alert('Field label cannot be empty.');
            return;
        }

        // Prompt user for field type
        const type = prompt('Enter field type (text, radio, checkbox):') as FieldType;
        if (!type || !['text', 'radio', 'checkbox'].includes(type)) {
            alert('Invalid field type. Allowed types: text, radio, checkbox.');
            return;
        }

        let options: string[] | undefined;

        // If field type is radio/checkbox, ensure at least one option is provided
        if (type === 'radio' || type === 'checkbox') {
            const optionsInput = prompt('Enter options (comma-separated):');
            if (!optionsInput || optionsInput.trim() === '') {
                alert('Options are required for radio/checkbox fields.');
                return;
            }

            options = optionsInput.split(',').map(option => option.trim()).filter(option => option !== '');
            if (options.length === 0) {
                alert('At least one option must be provided.');
                return;
            }
        }

        const newField: FormField = {
            id: label,
            type,
            label,
            options: type === 'radio' || type === 'checkbox' ? prompt('Enter options (comma-separated)')?.split(',').map(opt => opt.trim()).filter(opt => opt) : undefined,
        };

        this.activeForm.fields.push(newField);
        this.saveForms();
        this.renderFields();
    }

    public editField(fieldId: string): void {
        if (!this.activeForm) return;

        const field = this.activeForm.fields.find((f) => f.id === fieldId);
        if (!field) return;

        // Create an input field for editing
        const fieldElement = document.querySelector(`[data-field-id="${fieldId}"]`);
        if (!fieldElement) return;

        // Backup original field data in case of cancel
        const originalLabel = field.label;
        const originalOptions = field.options ? [...field.options] : [];

        // Clear existing content
        fieldElement.innerHTML = '';

        // Create input for new label
        const inputLabel = document.createElement('input');
        inputLabel.type = 'text';
        inputLabel.value = field.label;
        inputLabel.style.marginBottom = '10px';

        // Create option input fields if field type is radio/checkbox
        const optionContainer = document.createElement('div');
        if (field.type === 'radio' || field.type === 'checkbox') {
            field.options?.forEach((option, index) => {
                const optionInput = document.createElement('input');
                optionInput.type = 'text';
                optionInput.value = option;
                optionInput.style.marginRight = '5px';

                optionContainer.appendChild(optionInput);
            });
        }

        // Create Save button
        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.onclick = () => {
            field.label = inputLabel.value;
            if (field.type === 'radio' || field.type === 'checkbox') {
                field.options = Array.from(optionContainer.children)
                    .map((input) => (input as HTMLInputElement).value)
                    .filter(Boolean); // Remove empty options
            }
            this.saveForms();
            this.renderFields();
        };

        // Create Cancel button
        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
        cancelButton.style.marginLeft = '5px';
        cancelButton.onclick = () => {
            field.label = originalLabel; // Restore original label
            if (field.type === 'radio' || field.type === 'checkbox') {
                field.options = originalOptions; // Restore original options
            }
            this.renderFields(); // Re-render fields to exit edit mode
        };

        // Append elements
        fieldElement.appendChild(inputLabel);
        if (field.type === 'radio' || field.type === 'checkbox') {
            fieldElement.appendChild(optionContainer);
        }
        fieldElement.appendChild(saveButton);
        fieldElement.appendChild(cancelButton);
    }

    public deleteField(fieldId: string): void {
        if (!this.activeForm) return;

        // Remove the field from the active form
        this.activeForm.fields = this.activeForm.fields.filter((f) => f.id !== fieldId);

        // Save the updated form list
        this.saveForms();

        // Re-render the fields
        this.renderFields();
    }

    public deleteForm(formId: string): void {
        // Remove the form from the list
        this.forms = this.forms.filter((form) => form.id !== formId);

        // Save the updated list
        this.saveForms();

        // Re-render the form list
        this.renderFormList();

        // Hide the preview if the deleted form was being viewed
        const formPreviewContainer = document.getElementById('form-preview-container');
        if (formPreviewContainer) {
            formPreviewContainer.style.display = 'none';
        }
    }

    public renderForm(): void {
        if (!this.activeForm) return;

        const formContainer = document.getElementById('form-preview');
        if (!formContainer) return;

        formContainer.innerHTML = `<h2>${this.activeForm.name}</h2>`;

        const formElement = document.createElement('form');
        formElement.id = 'dynamic-form';

        this.activeForm.fields.forEach((field) => {
            const fieldWrapper = document.createElement('div');

            // Create label
            const labelElement = document.createElement('label');
            labelElement.textContent = field.label;
            labelElement.htmlFor = field.id;

            fieldWrapper.appendChild(labelElement);

            // Create input fields based on type
            if (field.type === 'text') {
                const input = document.createElement('input');
                input.type = 'text';
                input.name = field.id;
                input.id = field.id;
                input.required = true;
                fieldWrapper.appendChild(input);
            } else if (field.type === 'radio' || field.type === 'checkbox') {
                field.options?.forEach((option) => {
                    const input = document.createElement('input');
                    input.type = field.type;
                    input.name = field.id;
                    input.value = option;
                    input.id = `${field.id}-${option}`;

                    const optionLabel = document.createElement('label');
                    optionLabel.htmlFor = input.id;
                    optionLabel.textContent = option;

                    fieldWrapper.appendChild(input);
                    fieldWrapper.appendChild(optionLabel);
                });
            }

            formElement.appendChild(fieldWrapper);
        });

        // Add Submit Button
        const submitButton = document.createElement('button');
        submitButton.textContent = 'Submit';
        submitButton.type = 'submit';
        formElement.appendChild(submitButton);

        formContainer.appendChild(formElement);

        // Handle form submission
        formElement.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitForm(formElement.id, new FormData(formElement));
        });
    }

    public submitForm(formId: string, formData: FormData): void {
        const responses: { [key: string]: string | string[] } = {};

        // Convert FormData to object manually
        formData.forEach((value, key) => {
            responses[key] = typeof value === "string" ? value : "";
        });

        const newResponse: FormResponse = {
            formId,
            responses,
        };

        // Get existing responses from localStorage
        let storedResponses: FormResponse[] = LocalStorageHelper.getData<FormResponse[]>('responses') || [];
        storedResponses.push(newResponse);

        // Save updated responses
        LocalStorageHelper.saveData('responses', storedResponses);

        alert("Form submitted successfully!");
    }


    public previewForm(formId: string): void {
        const formContainer = document.getElementById('form-preview');
        const formPreviewContainer = document.getElementById('form-preview-container');
        if (!formContainer || !formPreviewContainer) return;

        const formToPreview = this.forms.find((form) => form.id === formId);
        if (!formToPreview) {
            formPreviewContainer.style.display = 'none'; // Hide if form not found
            return;
        }

        // Show preview container
        formPreviewContainer.style.display = 'block';

        // Clear previous content
        formContainer.innerHTML = `<h2>${formToPreview.name}</h2>`;

        // Create a form element
        const formElement = document.createElement('form');
        formElement.id = 'user-response-form';

        formToPreview.fields.forEach((field) => {
            const fieldWrapper = document.createElement('div');
            fieldWrapper.classList.add('form-field');

            // Label
            const labelElement = document.createElement('label');
            labelElement.textContent = field.label;
            labelElement.htmlFor = field.id;
            fieldWrapper.appendChild(labelElement);

            // Input fields based on type
            if (field.type === 'text') {
                const input = document.createElement('input');
                input.type = 'text';
                input.name = field.id;
                input.id = field.id;
                input.required = true;
                fieldWrapper.appendChild(input);
            } else if (field.type === 'radio' || field.type === 'checkbox') {
                const optionsContainer = document.createElement('div');
                optionsContainer.classList.add(field.type === 'radio' ? 'radio-group' : 'checkbox-group');

                field.options?.forEach((option) => {
                    const optionWrapper = document.createElement('div');
                    const input = document.createElement('input');
                    input.type = field.type;
                    input.name = field.id;
                    input.value = option;
                    input.id = `${field.id}-${option}`;

                    const optionLabel = document.createElement('label');
                    optionLabel.htmlFor = input.id;
                    optionLabel.textContent = option;

                    optionWrapper.appendChild(input);
                    optionWrapper.appendChild(optionLabel);
                    optionsContainer.appendChild(optionWrapper);
                });

                fieldWrapper.appendChild(optionsContainer);
            }

            formElement.appendChild(fieldWrapper);
        });

        // Submit button
        const submitButton = document.createElement('button');
        submitButton.textContent = 'Submit';
        submitButton.type = 'submit';

        formElement.appendChild(submitButton);
        formContainer.appendChild(formElement);

        // Handle form submission
        formElement.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitForm(formToPreview.id, new FormData(formElement));
        });
    }

    public goToFormDetails(formId: string): void {
        if (!formId) return;
        window.location.href = `form-details.html?formId=${formId}`;
    }
}

const app = new GoogleFormApp();
(window as any).app = app;