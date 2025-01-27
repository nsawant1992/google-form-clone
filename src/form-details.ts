import { FormStructure } from './interfaces/form.interface.js';
import { LocalStorageHelper } from './storage/localStorageHelper.js';

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const formId = urlParams.get('formId');

    if (!formId) {
        document.getElementById('form-preview')!.innerHTML = "<p>Form not found.</p>";
        return;
    }

    const forms: FormStructure[] = LocalStorageHelper.getData<FormStructure[]>('forms') || [];
    const selectedForm = forms.find(form => form.id === formId);

    if (!selectedForm) {
        document.getElementById('form-preview')!.innerHTML = "<p>Form not found.</p>";
        return;
    }

    renderFormForSubmission(selectedForm);
});

function renderFormForSubmission(form: FormStructure): void {
    const formContainer = document.getElementById('form-preview');
    if (!formContainer) return;

    formContainer.innerHTML = `<h2>${form.name}</h2>`;

    const formElement = document.createElement('form');
    formElement.id = 'user-response-form';

    form.fields.forEach((field) => {
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

    // ✅ Add Submit button
    const submitButton = document.createElement('button');
    submitButton.textContent = 'Submit';
    submitButton.type = 'submit';

    formElement.appendChild(submitButton);
    formContainer.appendChild(formElement);

    // Handle form submission
    formElement.addEventListener('submit', (e) => {
        e.preventDefault();
        submitForm(form.id, new FormData(formElement));
    });
}

// Function to handle form submission
function submitForm(formId: string, formData: FormData): void {
    const responses: { [key: string]: string | string[] } = {};

    formData.forEach((value, key) => {
        responses[key] = typeof value === "string" ? value : "";
    });

    const newResponse = { formId, responses };

    // Save response to localStorage
    let storedResponses = LocalStorageHelper.getData<any[]>('responses') || [];
    storedResponses.push(newResponse);
    LocalStorageHelper.saveData('responses', storedResponses);

    alert("Form submitted successfully!");
}
