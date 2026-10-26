import type { ReactNode } from "react";

interface FormFieldProps {
  label: string;
  id: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}

export default function FormField({ label, id, hint, error, children }: FormFieldProps) {
  return (
    <div className="form-field">
      <label className="field-label" htmlFor={id}>{label}</label>
      {children}
      {hint ? <p className="field-hint" id={`${id}-hint`}>{hint}</p> : null}
      {error ? <p className="field-error" role="alert">{error}</p> : null}
    </div>
  );
}
