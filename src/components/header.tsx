import type { FC } from 'react';
import Link from 'next/link';
import { UtensilsCrossed, Info } from 'lucide-react'; // Added Info icon

interface HeaderProps {}

const Header: FC<HeaderProps> = ({}) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-gradient-to-b from-card via-card to-secondary/10 dark:from-background dark:via-black/10 dark:to-black/20 shadow-sm backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" passHref>
          <div className="flex items-center gap-2 cursor-pointer group">
            <UtensilsCrossed className="h-7 w-7 sm:h-8 sm:w-8 text-primary transition-transform duration-300 group-hover:rotate-[-15deg]" />
            <h1 className="text-xl sm:text-2xl font-bold text-foreground transition-colors duration-300 group-hover:text-primary">
              Food Link
            </h1>
          </div>
        </Link>
        
        <nav className="flex items-center gap-2 sm:gap-4">
          <Link href="/about" passHref>
            <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-3 sm:h-10 sm:px-4 py-2 text-muted-foreground hover:text-accent-foreground">
              <Info className="h-4 w-4 mr-1.5 sm:mr-2" />
              <span className="hidden sm:inline">Acerca de Nosotros</span>
              <span className="sm:hidden">Info</span>
            </button>
          </Link>
          {/* Future: User profile/login button could go here */}
          {/* <Button variant="outline" size="sm">
            <User className="h-4 w-4 mr-2" />
            Iniciar Sesión
          </Button> */}
        </nav>
      </div>
    </header>
  );
};

export default Header;
