import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/Button';
import { Icon } from '@/Components/ui/Icon';

export const Pagination = ({ currentPage, totalPages, onPageChange, className }) => {
  return (
    <nav className={cn("flex items-center justify-center space-x-1", className)}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        <Icon name="chevron_left" />
      </Button>
      
      {[...Array(totalPages)].map((_, i) => {
        const page = i + 1;
        // Basic logic for showing pages
        if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
          return (
            <Button
              key={page}
              variant={currentPage === page ? "success" : "ghost"}
              className={cn(
                "w-10 h-10 rounded-xl font-bold text-sm",
                currentPage === page ? "text-white" : "text-secondary hover:bg-surface-container-highest"
              )}
              onClick={() => onPageChange(page)}
            >
              {page}
            </Button>
          );
        }
        if (page === currentPage - 2 || page === currentPage + 2) {
          return <span key={page} className="px-2 text-outline">...</span>;
        }
        return null;
      })}

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        <Icon name="chevron_right" />
      </Button>
    </nav>
  );
};
