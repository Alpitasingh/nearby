export default function FormInput({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  as = "input",
  children,
  required = false,
  className = "",
  min,
  step,
}) {
  const Tag = as;
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="text-pink-500 ml-0.5">*</span>}
        </label>
      )}
      {as === "select" ? (
        <select className="input-glass" value={value} onChange={onChange} required={required}>
          {children}
        </select>
      ) : as === "textarea" ? (
        <textarea
          className="input-glass resize-y"
          style={{ minHeight: 110, lineHeight: 1.65 }}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
        />
      ) : (
        <input
          type={type}
          className="input-glass"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          min={min}
          step={step}
        />
      )}
    </div>
  );
}
