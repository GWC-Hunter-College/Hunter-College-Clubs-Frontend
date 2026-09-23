import { useRef, useState } from "react";
import type { ChangeEvent, InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import { IconSearch, IconPhotoPlus, IconX, IconChevronDown, IconAlertTriangle } from "@tabler/icons-react";
import classes from "./Inputs.module.css";
import { SoonPill } from "./Pills";

export function SearchField({
  compact,
  ...rest
}: { compact?: boolean } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={`${classes.searchField} ${compact ? classes.compact : ""}`}>
      <IconSearch size={compact ? 18 : 20} aria-hidden="true" />
      <input type="search" className="text-body-m" {...rest} />
    </div>
  );
}

type FieldProps = {
  label: string;
  required?: boolean;
  icon?: ReactNode;
  helperText?: string;
  errorText?: string;
  id: string;
} & InputHTMLAttributes<HTMLInputElement>;

export function Field({ label, required, icon, helperText, errorText, id, ...rest }: FieldProps) {
  return (
    <div className={classes.fieldWrap}>
      <label htmlFor={id} className={`${classes.fieldLabel} text-body-m-strong`}>
        {label} {required && <span className={classes.required}>*</span>}
      </label>
      <div className={`${classes.inputRow} ${errorText ? classes.invalid : ""}`}>
        {icon}
        <input id={id} className="text-body-m" aria-invalid={Boolean(errorText)} {...rest} />
      </div>
      {errorText ? (
        <span className={`${classes.errorText} text-caption`}>{errorText}</span>
      ) : helperText ? (
        <span className={`${classes.helperText} text-caption`}>{helperText}</span>
      ) : null}
    </div>
  );
}

type TextareaFieldProps = {
  label: string;
  helperText?: string;
  id: string;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

export function TextareaField({ label, helperText, id, ...rest }: TextareaFieldProps) {
  return (
    <div className={classes.fieldWrap}>
      <label htmlFor={id} className="text-body-m-strong">
        {label}
      </label>
      <textarea id={id} className={`${classes.textarea} text-body-m`} {...rest} />
      {helperText && <span className={`${classes.helperText} text-caption`}>{helperText}</span>}
    </div>
  );
}

type DropzoneProps = {
  label: string;
  prompt?: string;
  help?: string;
  file: File | null;
  onChange: (file: File | null) => void;
};

export function Dropzone({ label, prompt = "Drop a file here, or click to upload", help, file, onChange }: DropzoneProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFiles = (f: File | null) => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(f ? URL.createObjectURL(f) : null);
    onChange(f);
  };

  return (
    <div className={classes.fieldWrap}>
      <span className="text-body-m-strong">{label}</span>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg"
        hidden
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          handleFiles(e.currentTarget.files?.[0] ?? null);
          e.currentTarget.value = "";
        }}
      />
      {file && previewUrl ? (
        <div className={classes.dropzonePreview}>
          <img src={previewUrl} alt="" />
          <span className="text-body-m" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {file.name}
          </span>
          <button
            type="button"
            className={classes.dropzoneRemove}
            aria-label="Remove image"
            onClick={() => handleFiles(null)}
          >
            <IconX size={18} />
          </button>
        </div>
      ) : (
        <button type="button" className={classes.dropzone} onClick={() => inputRef.current?.click()}>
          <IconPhotoPlus size={32} aria-hidden="true" />
          <span className="text-body-m-strong">{prompt}</span>
          {help && <span className={`${classes.helperText} text-caption`}>{help}</span>}
        </button>
      )}
    </div>
  );
}

type LockedOptionRowProps = {
  icon: ReactNode;
  title: string;
  sub: string;
  secondary?: boolean;
};

/** "More photos" / "Co-hosting clubs" rows: expand to a "not available yet" notice on click. */
export function LockedOptionRow({ icon, title, sub, secondary }: LockedOptionRowProps) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        type="button"
        className={`${classes.lockedRow} ${secondary ? classes.secondary : ""}`}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {icon}
        <span className={classes.lockedRowText}>
          <span className="text-body-m-strong" style={{ color: "var(--text-secondary)" }}>
            {title}
          </span>
          <span className={`${classes.helperText} text-caption`}>{sub}</span>
        </span>
        <SoonPill />
        <IconChevronDown size={18} aria-hidden="true" />
      </button>
      {open && (
        <div className={`${classes.lockedNotice} text-caption`}>
          <IconAlertTriangle size={16} aria-hidden="true" />
          This feature isn&rsquo;t available yet.
        </div>
      )}
    </div>
  );
}
