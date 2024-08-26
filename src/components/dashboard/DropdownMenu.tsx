// components/DropdownMenu.tsx
import {
  DropdownMenu as RadixDropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@radix-ui/react-dropdown-menu';
import { useState } from 'react';

interface DropdownMenuProps {
  onSelect: (value: string) => void;
  selectedOption: string;
  type: 'period' | 'service'; // Add type prop to differentiate
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  onSelect,
  selectedOption,
  type,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const options =
    type === 'period'
      ? ['Daily', 'Weekly', 'Monthly']
      : [
          'Medical Services',
          'Psychosocial support',
          'Police Services',
          'Hotline',
          'Case Management',
          'Protection/Shelter',
          'Futher Support Protection/Shelter',
          'Education/ Training Services',
          'Legal Aid',
          'Futher Support Medical Services',
          'Futher Support Psychosocial support',
          'Long Term Support Psychosocial support',
          'Livelihood services',
        ];

  return (
    <RadixDropdownMenu onOpenChange={(open) => setIsOpen(open)}>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center rounded bg-erefer-rose px-4 py-2 text-white">
          <span className="mr-2">
            {selectedOption ||
              `Select ${type === 'period' ? 'Period' : 'Service'}`}
          </span>
          {isOpen ? (
            <span>&#9650;</span> // Up arrow for open state
          ) : (
            <span>&#9660;</span> // Down arrow for closed state
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="h-auto min-w-32 rounded bg-white p-2 shadow">
        {options.map((option) => (
          <DropdownMenuItem
            key={option}
            className="h-auto w-auto cursor-pointer hover:bg-gray-200"
            onClick={() => onSelect(option)}
          >
            {option}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </RadixDropdownMenu>
  );
};

export default DropdownMenu;
