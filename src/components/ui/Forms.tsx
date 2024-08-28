'use client';
import React, { useState } from 'react';

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
    | 'radio'
    | 'select';
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: string }[]; // Add this for radio and dropdown options
}

interface FormsProps {
  fields: FormsField[];
  onSave: (data: { [key: string]: any }) => void;
  onClose: () => void;
}

const Forms: React.FC<FormsProps> = ({ fields, onSave, onClose }) => {
  const [formState, setFormState] = useState<{ [key: string]: any }>({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('data =>', formState);
    onSave(formState);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex flex-col space-y-4">
      {fields.map((field) => (
        <div key={field.id} className="flex flex-col">
          <label htmlFor={field.id} className="text-gray-700">
            {field.label}
          </label>
          {field.type === 'textarea' ? (
            <textarea
              id={field.id}
              name={field.id}
              placeholder={field.placeholder}
              required={field.required}
              onChange={handleChange}
              className="min-h-[100px] w-full resize-none rounded-[7px] border border-gray-300 p-2 text-sm text-gray-700"
            />
          ) : field.type === 'radio' && field.options ? (
            <div className="flex space-x-4">
              {field.options.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={`${field.id}-${option.value}`}
                    name={field.id}
                    value={option.value}
                    onChange={handleChange}
                    className="form-radio"
                  />
                  <label
                    htmlFor={`${field.id}-${option.value}`}
                    className="text-gray-700"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          ) : field.type === 'select' && field.options ? (
            <select
              id={field.id}
              name={field.id}
              required={field.required}
              onChange={handleChange}
              className="rounded border border-gray-300 p-2 text-sm text-gray-700"
            >
              <option value="">Select {field.label}</option>
              {field.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              id={field.id}
              name={field.id}
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
          onClick={onClose}
          className="w-6/12 rounded border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100 focus:outline-none"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default Forms;
