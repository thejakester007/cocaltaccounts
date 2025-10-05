'use client';

import { Listbox, Transition } from '@headlessui/react';
import React, { Fragment } from 'react';

export type SelectOption<T extends string = string> = { id: T; label: string };

type Props<T extends string = string> = {
  value: T;
  onChange: (v: T) => void;
  options: SelectOption<T>[];
  className?: string;         // wrapper width/layout
  buttonClassName?: string;   // button styles override if needed
};

const CARET = (
  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08z"/>
  </svg>
);

export default function Select<T extends string = string>({
  value,
  onChange,
  options,
  className = 'w-48',
  buttonClassName,
}: Props<T>) {
  const current = options.find(o => o.id === value)?.label ?? '';

  return (
    <Listbox value={value} onChange={onChange}>
      <div className={`relative ${className}`}>
        {/* Button */}
        <Listbox.Button
          className={[
            'w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-left',
            'text-neutral-100 outline-none hover:border-white/20 focus:border-blue-500',
            'pr-9', // space for caret
            buttonClassName || '',
          ].join(' ')}
        >
          <span className="block truncate">{current}</span>
          <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-white/70">
            {CARET}
          </span>
        </Listbox.Button>

        {/* Options */}
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Listbox.Options
            className="
              absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg
              border border-white/10 bg-neutral-900/95 p-1 shadow-lg backdrop-blur
              focus:outline-none
            "
          >
            {options.map(opt => (
              <Listbox.Option
                key={opt.id}
                value={opt.id}
                className={({ active, selected }) =>
                  [
                    'cursor-pointer select-none rounded-md px-3 py-2 text-sm',
                    active ? 'bg-white/10' : '',
                    selected ? 'text-blue-400' : 'text-neutral-100',
                  ].join(' ')
                }
              >
                {opt.label}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}