import Image from 'next/image';
import React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from './ui/select'; // Adjust the import path based on your project structure

export interface Option {
  value: string; // Unique identifier for the option
  label: string; // Display text for the option
  icon?: string; // Optional icon URL
  subText?: string; // Optional subtext or additional information
}

interface GenericSelectProps {
  defaultValue?: string;
  options: Option[];
  onValueChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  align?: 'start' | 'center' | 'end';
}

const GenericSelect: React.FC<GenericSelectProps> = ({
  defaultValue,
  options,
  onValueChange,
  placeholder = 'Select an option',
  label,
  className = '',
  align = 'end',
}) => {
  return (
    <Select defaultValue={defaultValue} onValueChange={onValueChange}>
      <SelectTrigger className={`flex w-full bg-white gap-3 md:w-[300px] ${className}`}>
        {options.find((option) => option.value === defaultValue)?.icon && (
          <Image
            src={options.find((option) => option.value === defaultValue)?.icon!}
            width={20}
            height={20}
            alt="icon"
          />
        )}
        <p className="line-clamp-1 w-full text-left">
          {options.find((option) => option.value === defaultValue)?.label || placeholder}
        </p>
      </SelectTrigger>
      <SelectContent className={`w-full bg-white md:w-[300px] ${className}`} align={align}>
        <SelectGroup>
          {label && <SelectLabel className="py-2 font-normal text-gray-500">{label}</SelectLabel>}
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value} className="cursor-pointer border-t">
              <div className="flex flex-col">
                <p className="text-16 font-medium">{option.label}</p>
                {option.subText && (
                  <p className="text-14 font-medium text-blue-600">{option.subText}</p>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default GenericSelect;
