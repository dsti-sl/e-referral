// 'use client';
// import React, { useState } from 'react';
// import Swal from 'sweetalert2';
// import { isValidUrl } from '@/utils/helpers';

// export interface FormsField {
//   id: string;
//   label: string;
//   type:
//     | 'text'
//     | 'textarea'
//     | 'number'
//     | 'email'
//     | 'password'
//     | 'date'
//     | 'checkbox'
//     | 'radio'
//     | 'select';
//   placeholder?: string;
//   required?: boolean;
//   options?: { label: string; value: string; labelDescription?: string }[];
// }

// interface FormsProps {
//   fields: FormsField[];
//   onSave: (data: { [key: string]: any }) => void;
//   onClose: () => void;
// }

// const Forms: React.FC<FormsProps> = ({ fields, onSave, onClose }) => {
//   const [formState, setFormState] = useState<{ [key: string]: any }>({});
//   const [dynamicFields, setDynamicFields] = useState<FormsField[]>([]);
//   const [errors, setErrors] = useState<{ [key: string]: string }>({});

//   // Handle form field changes
//   const handleChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
//     >,
//   ) => {
//     const { name, value, type, checked }: any = e.target;

//     // Update form state
//     setFormState((prevState) => ({
//       ...prevState,
//       [name]: type === 'checkbox' ? checked : value,
//     }));

//     // Clear errors for the updated field
//     if (errors[name]) {
//       setErrors((prevErrors) => ({
//         ...prevErrors,
//         [name]: '',
//       }));
//     }

//     // Handle dynamic fields based on checkbox selections
//     toggleDynamicField(name, checked);
//   };

//   // Add or remove dynamic fields based on the checkbox state
//   const toggleDynamicField = (name: string, checked: boolean) => {
//     const dynamicFieldMap: { [key: string]: FormsField } = {
//       terminate: {
//         id: 'terminator',
//         label: 'Terminate URL*',
//         type: 'text',
//         placeholder: 'Enter terminate URL',
//         required: true,
//       },
//       validate: {
//         id: 'validator',
//         label: 'Validate URL*',
//         type: 'text',
//         placeholder: 'Enter validate URL',
//         required: true,
//       },
//     };

//     if (dynamicFieldMap[name]) {
//       setDynamicFields((prevFields) =>
//         checked
//           ? [...prevFields, dynamicFieldMap[name]]
//           : prevFields.filter((field) => field.id !== `${name}Url`),
//       );
//     }
//   };

//   // Validate the form fields
//   const validateForm = () => {
//     const newErrors: { [key: string]: string } = {};

//     if (!formState.message) {
//       newErrors.message = 'Message cannot be empty';
//     }

//     if (!formState.name) {
//       newErrors.name = 'Name cannot be empty';
//     }

//     if (
//       formState.priority === undefined ||
//       !Number.isInteger(+formState.priority)
//     ) {
//       newErrors.priority = 'Priority must be a whole number';
//     }

//     return newErrors;
//   };

//   // Handle form submission
//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     // Validate form fields
//     const validationErrors = validateForm();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }

//     // Validate URLs if provided
//     if (formState.terminate && !isValidUrl(formState.terminateUrl)) {
//       Swal.fire('Invalid URL', 'Please enter a valid Terminate URL', 'error');
//       return;
//     }

//     if (formState.validate && !isValidUrl(formState.validateUrl)) {
//       Swal.fire('Invalid URL', 'Please enter a valid Validate URL', 'error');
//       return;
//     }

//     // Save the form data
//     onSave(formState);
//   };

//   const allFields = [...fields, ...dynamicFields];

//   return (
//     <form onSubmit={handleSubmit} className="mt-8 flex flex-col space-y-4">
//       {allFields.map((field) => (
//         <div key={field.id} className="flex flex-col">
//           <label htmlFor={field.id} className="text-gray-700">
//             {field.label}
//           </label>
//           {renderField(field)}
//         </div>
//       ))}
//       <div className="flex justify-end space-x-4">
//         <button
//           type="submit"
//           className="w-6/12 rounded bg-erefer-rose px-4 py-2 text-white hover:bg-red-400 focus:outline-none"
//         >
//           Save
//         </button>
//         <button
//           type="button"
//           onClick={onClose}
//           className="w-6/12 rounded border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100 focus:outline-none"
//         >
//           Cancel
//         </button>
//       </div>
//     </form>
//   );

//   // Render form fields based on type
//   function renderField(field: FormsField) {
//     switch (field.type) {
//       case 'textarea':
//         return (
//           <textarea
//             id={field.id}
//             name={field.id}
//             placeholder={field.placeholder}
//             required={field.required}
//             onChange={handleChange}
//             className="min-h-[100px] w-full resize-none rounded-[7px] border border-gray-300 p-2 text-sm text-gray-700"
//           />
//         );
//       case 'checkbox':
//         return (
//           <div className="flex space-x-4">
//             {field.options?.map((option) => (
//               <div key={option.value} className="flex items-center space-x-2">
//                 <input
//                   type="checkbox"
//                   id={`${field.id}-${option.value}`}
//                   name={field.id}
//                   value={option.value}
//                   onChange={handleChange}
//                   className="form-checkbox"
//                 />
//                 <label
//                   htmlFor={`${field.id}-${option.value}`}
//                   className="text-gray-700"
//                 >
//                   {option.label}{' '}
//                   <span className="text-ellipsis text-xs">
//                     {option.labelDescription}
//                   </span>
//                 </label>
//               </div>
//             ))}
//           </div>
//         );
//       case 'select':
//         return (
//           <select
//             id={field.id}
//             name={field.id}
//             required={field.required}
//             onChange={handleChange}
//             className="rounded border border-gray-300 p-2 text-sm text-gray-700"
//           >
//             <option value="">Select {field.id}</option>
//             {field.options?.map((option) => (
//               <option key={option.value} value={option.value}>
//                 {option.label}
//               </option>
//             ))}
//           </select>
//         );
//       default:
//         return (
//           <input
//             id={field.id}
//             name={field.id}
//             type={field.type}
//             placeholder={field.placeholder}
//             required={field.required}
//             onChange={handleChange}
//             className="rounded border border-gray-300 p-2 text-sm text-gray-700"
//           />
//         );
//     }
//   }
// };

// export default Forms;

'use client';
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { isValidUrl } from '@/utils/helpers';

export interface FormsField {
  id: string;
  label: string;
  type:
    | 'text'
    | 'textarea'
    | 'number'
    | 'email'
    | 'password'
    | 'date'
    | 'checkbox'
    | 'radio'
    | 'select';
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: string; labelDescription?: string }[];
}

interface FormsProps {
  fields: FormsField[];
  onSave: (data: { [key: string]: any }) => void;
  onClose: () => void;
}

const Forms: React.FC<FormsProps> = ({ fields, onSave, onClose }) => {
  const [formState, setFormState] = useState<{ [key: string]: any }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Handle form field changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type, checked }: any = e.target;

    // Update form state
    setFormState((prevState) => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear errors for the updated field
    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: '',
      }));
    }

    // Handle dynamic fields based on checkbox selections
    toggleDynamicField(name, checked);
  };

  // Add or remove dynamic fields based on the checkbox state
  const toggleDynamicField = (name: string, checked: boolean) => {
    // Remove URL fields if checkbox is unchecked
    if (!checked) {
      setFormState((prevState) => ({
        ...prevState,
        [`${name}Url`]: undefined,
      }));
    }
  };

  // Validate the form fields
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formState.message) {
      newErrors.message = 'Message cannot be empty';
    }

    if (!formState.name) {
      newErrors.name = 'Name cannot be empty';
    }

    if (
      formState.priority === undefined ||
      !Number.isInteger(+formState.priority)
    ) {
      newErrors.priority = 'Priority must be a whole number';
    }

    return newErrors;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form fields
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Validate URLs if the respective checkbox is checked
    if (
      formState.terminate &&
      formState.terminateUrl &&
      !isValidUrl(formState.terminateUrl)
    ) {
      Swal.fire('Invalid URL', 'Please enter a valid Terminate URL', 'error');
      return;
    }

    if (
      formState.validate &&
      formState.validateUrl &&
      !isValidUrl(formState.validateUrl)
    ) {
      Swal.fire('Invalid URL', 'Please enter a valid Validate URL', 'error');
      return;
    }

    // Save the form data
    onSave(formState);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex flex-col space-y-4">
      {fields.map((field) => (
        <div key={field.id} className="flex flex-col">
          <label htmlFor={field.id} className="text-gray-700">
            {field.label}
          </label>
          {renderField(field)}
        </div>
      ))}

      {/* Display dynamic fields based on checkbox selection */}
      {formState.terminate && (
        <div className="flex flex-col">
          <label htmlFor="terminateUrl" className="text-gray-700">
            Terminate URL*
          </label>
          <input
            id="terminateUrl"
            name="terminateUrl"
            type="text"
            placeholder="Enter terminate URL"
            onChange={handleChange}
            className="rounded border border-gray-300 p-2 text-sm text-gray-700"
          />
        </div>
      )}

      {formState.validate && (
        <div className="flex flex-col">
          <label htmlFor="validateUrl" className="text-gray-700">
            Validate URL*
          </label>
          <input
            id="validateUrl"
            name="validateUrl"
            type="text"
            placeholder="Enter validate URL"
            onChange={handleChange}
            className="rounded border border-gray-300 p-2 text-sm text-gray-700"
          />
        </div>
      )}

      <div className="flex justify-end space-x-4">
        <button
          type="submit"
          className="w-6/12 rounded bg-erefer-rose px-4 py-2 text-white hover:bg-red-400 focus:outline-none"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onClose}
          className="w-6/12 rounded border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100 focus:outline-none"
        >
          Cancel
        </button>
      </div>
    </form>
  );

  // Render form fields based on type
  function renderField(field: FormsField) {
    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            id={field.id}
            name={field.id}
            placeholder={field.placeholder}
            required={field.required}
            onChange={handleChange}
            className="min-h-[100px] w-full resize-none rounded-[7px] border border-gray-300 p-2 text-sm text-gray-700"
          />
        );
      case 'checkbox':
        return (
          <div className="flex space-x-4">
            {field.options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`${field.id}-${option.value}`}
                  name={option.value}
                  onChange={handleChange}
                  className="form-checkbox"
                />
                <label
                  htmlFor={`${field.id}-${option.value}`}
                  className="text-gray-700"
                >
                  {option.label}{' '}
                  <span className="text-ellipsis text-xs">
                    {option.labelDescription}
                  </span>
                </label>
              </div>
            ))}
          </div>
        );
      case 'select':
        return (
          <select
            id={field.id}
            name={field.id}
            required={field.required}
            onChange={handleChange}
            className="rounded border border-gray-300 p-2 text-sm text-gray-700"
          >
            <option value="">Select {field.id}</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      default:
        return (
          <input
            id={field.id}
            name={field.id}
            type={field.type}
            placeholder={field.placeholder}
            required={field.required}
            onChange={handleChange}
            className="rounded border border-gray-300 p-2 text-sm text-gray-700"
          />
        );
    }
  }
};

export default Forms;
