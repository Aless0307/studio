import type { FC } from 'react';
import { UtensilsCrossed } from 'lucide-react'; // Example icon

interface HeaderProps {}

const Header: FC<HeaderProps> = ({}) => {
  return (
    <header className="border-b bg-card shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <UtensilsCrossed className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Food Link</h1>
        </div>
        {/* Add navigation or user actions here later */}
      </div>
    </header>
  );
};

export default Header;
