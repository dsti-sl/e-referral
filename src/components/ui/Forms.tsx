import React, { useState } from 'react';

export interface FormsField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'email' | 'password' | 'date';
  placeholder: string;
  required: boolean;
}

interface FormsProps {
  fields: FormsField[];
  onSave: (data: { [key: string]: any }) => void;
}

const Forms: React.FC<FormsProps> = ({ fields, onSave }) => {
  const [formState, setFormState] = useState<{ [key: string]: any }>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormState({
      ...formState,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formState);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="mt-8 flex flex-col space-y-4">
        {fields.map((field) => (
          <div key={field.id} className="flex flex-col">
            <label htmlFor={field.id} className="text-gray-700">
              {field.label}
            </label>
            {field.type === 'textarea' ? (
              <textarea
                id={field.id}
                placeholder={field.placeholder}
                required={field.required}
                onChange={handleChange}
                className="min-h-[100px] w-full resize-none rounded-[7px] border border-gray-300 p-2 text-sm text-gray-700"
              />
            ) : (
              <input
                id={field.id}
                type={field.type}
                placeholder={field.placeholder}
                required={field.required}
                onChange={handleChange}
                className="rounded border border-gray-300 p-2 text-sm text-gray-700"
              />
            )}
          </div>
        ))}
        <div className="flex justify-end space-x-4">
          <button
            type="submit"
            className="w-6/12 rounded bg-erefer-rose px-4 py-2 text-white hover:bg-red-400 focus:outline-none"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => {}} // Add a cancel handler function
            className="w-6/12 rounded border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100 focus:outline-none"
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  );
};

export default Forms;
