import { LocalStorageHelper } from './storage/localStorageHelper.js';
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const formId = urlParams.get('formId');
    if (!formId) {
        document.getElementById('form-preview').innerHTML = "<p>Form not found.</p>";
        return;
    }
    const forms = LocalStorageHelper.getData('forms') || [];
    const selectedForm = forms.find(form => form.id === formId);
    if (!selectedForm) {
        document.getElementById('form-preview').innerHTML = "<p>Form not found.</p>";
        return;
    }
    renderFormForSubmission(selectedForm);
});
function renderFormForSubmission(form) {
    const formContainer = document.getElementById('form-preview');
    if (!formContainer)
        return;
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
        }
        else if (field.type === 'radio' || field.type === 'checkbox') {
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
    //  Add Submit button
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
function submitForm(formId, formData) {
    // Retrieve form structure from localStorage to access field labels
    const forms = LocalStorageHelper.getData('forms') || [];
    const formStructure = forms.find(form => form.id === formId);
    if (!formStructure) {
        alert("Form structure not found!");
        return;
    }
    const responses = {};
    formData.forEach((value, key) => {
        // Find the corresponding field by ID
        const field = formStructure.fields.find(f => f.id === key);
        const label = field ? field.label : key; // Use field label if available
        // Handle multiple checkbox selections
        if (field?.type === 'checkbox') {
            if (!responses[label]) {
                responses[label] = [];
            }
            responses[label].push(value.toString());
        }
        else {
            responses[label] = value.toString();
        }
    });
    const newResponse = { formId, responses };
    // Save response to localStorage
    let storedResponses = LocalStorageHelper.getData('responses') || [];
    storedResponses.push(newResponse);
    LocalStorageHelper.saveData('responses', storedResponses);
    alert("Form submitted successfully!");
}
