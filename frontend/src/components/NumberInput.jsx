/**
 * Number Input - Numeric values ke liye
 * FMS - Vipin Chaturvedi
 */

export default function NumberInput({ value, onChange, min = 0, step = 'any', className = '', ...restProps }) {
  const handleChange = (event) => {
    onChange(event.target.value);
  };

  return (
    <input
      type="number"
      value={value}
      min={min}
      step={step}
      onChange={handleChange}
      className={`border rounded px-3 py-2 ${className}`}
      {...restProps}
    />
  );
}
