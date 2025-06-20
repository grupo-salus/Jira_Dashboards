import React, { useState, useRef, useEffect } from "react";

type Option = {
  value: string;
  label: string;
};

interface CustomDropdownProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  buttonClassName?: string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  options,
  value,
  onChange,
  className,
  buttonClassName,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption =
    options.find((opt) => opt.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        className={buttonClassName}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>{selectedOption.label}</span>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-white">
          <svg
            className={`fill-current h-4 w-4 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </button>

      <div
        className={`absolute z-10 mt-2 w-full origin-top rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transition-all duration-150 ease-in-out transform ${
          isOpen
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
        role="listbox"
        aria-activedescendant={value}
      >
        <ul className="py-1">
          {options.map((option) => (
            <li
              key={option.value}
              id={option.value}
              role="option"
              aria-selected={option.value === value}
              className="px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CustomDropdown;
