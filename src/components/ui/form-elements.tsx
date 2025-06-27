import React from "react";
import { Label } from "./label";
import { Input } from "./input";
import { Button } from "./button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { Textarea } from "./textarea";

interface FormFieldProps {
  label: string;
  name: string;
  type?: "text" | "email" | "password" | "number" | "date";
  placeholder?: string;
  value: string | number;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
  error
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-gray-700 dark:text-gray-300">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <Input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${error ? 'border-red-500 focus:border-red-500' : ''}`}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

interface SelectFieldProps {
  label: string;
  name: string;
  value: string;
  onValueChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
  error?: string;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  name,
  value,
  onValueChange,
  options,
  placeholder,
  required = false,
  error
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-gray-700 dark:text-gray-300">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className={`${error ? 'border-red-500 focus:border-red-500' : ''}`}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

interface TextareaFieldProps {
  label: string;
  name: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  required?: boolean;
  error?: string;
}

export const TextareaField: React.FC<TextareaFieldProps> = ({
  label,
  name,
  placeholder,
  value,
  onChange,
  rows = 3,
  required = false,
  error
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-gray-700 dark:text-gray-300">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <Textarea
        id={name}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className={`${error ? 'border-red-500 focus:border-red-500' : ''}`}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

interface FormActionsProps {
  onCancel: () => void;
  onSubmit: () => void;
  submitText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

export const FormActions: React.FC<FormActionsProps> = ({
  onCancel,
  onSubmit,
  submitText = "Save",
  cancelText = "Cancel",
  isLoading = false
}) => {
  return (
    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
      <Button
        variant="outline"
        onClick={onCancel}
        disabled={isLoading}
        className="text-gray-600 dark:text-gray-300"
      >
        {cancelText}
      </Button>
      <Button
        onClick={onSubmit}
        disabled={isLoading}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
      >
        {isLoading ? "Saving..." : submitText}
      </Button>
    </div>
  );
}; 