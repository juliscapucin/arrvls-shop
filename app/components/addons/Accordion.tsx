'use client';

import {useEffect, useState} from 'react';

import {IconChevron} from '~/components/icons';

type AccordionProps = {
  title?: string;
  items: {title: string; content: string[]}[];
};

export default function Accordion({title, items}: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    function closeOnEsc(e: KeyboardEvent | MouseEvent) {
      if (e instanceof KeyboardEvent && e.key === 'Escape') {
        setOpenIndex(null);
      }
    }
    function closeOnClickOutside(e: MouseEvent) {
      if (!(e.target as HTMLElement).closest('.accordion-item')) {
        setOpenIndex(null);
      }
    }
    document.addEventListener('click', closeOnClickOutside);
    document.addEventListener('keydown', closeOnEsc);
    return () => {
      document.removeEventListener('keydown', closeOnEsc);
      document.removeEventListener('click', closeOnClickOutside);
    };
  }, []);

  return (
    <div className="container mx-auto my-16 px-4">
      {title && <h2 className="heading-display mb-8">{title}</h2>}
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={item.title}
            className="accordion-item overflow-hidden border-t border-accent last:border-b"
          >
            {/* Header */}
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)} // Toggle open state
              aria-expanded={isOpen}
              aria-controls={`accordion-content-${index}`}
              id={`accordion-header-${index}`}
              className="group relative flex w-full cursor-pointer items-center justify-between pl-1 pr-2 py-6 text-left text-title-large text-secondary transition duration-600 hover:bg-accent focus:bg-accent"
            >
              {item.title}

              {/* Chevron Icon */}
              <span className="flex h-8 w-8 items-center justify-center text-secondary">
                <IconChevron direction={isOpen ? 'down' : 'up'} />
              </span>
            </button>

            {/* Content Area */}
            <div
              className={`overflow-hidden bg-primary transition-[height] duration-300 ${isOpen ? 'h-fit' : 'h-0'}`}
            >
              {item.content.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 30)}
                  className="mx-1 my-8 text-justify text-secondary"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
