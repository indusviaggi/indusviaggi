import React, { useState } from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis
} from '@/components/ui/pagination';

interface PaginationWrapperProps {
  totalItems: number;
  pageSize?: number;
  children: (pageItems: { page: number; pageSize: number; startIdx: number; endIdx: number }) => React.ReactNode;
}

const PaginationWrapper: React.FC<PaginationWrapperProps> = ({ totalItems, pageSize = 5, children }) => {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startIdx = (page - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, totalItems);

  // Helper to generate page numbers with ellipsis for large page sets
  const getPageButtons = () => {
    const buttons = [];
    if (totalPages <= 3) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              isActive={page === i}
              onClick={e => {
                e.preventDefault();
                setPage(i);
              }}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Always show first page
      buttons.push(
        <PaginationItem key={1}>
          <PaginationLink
            href="#"
            isActive={page === 1}
            onClick={e => {
              e.preventDefault();
              setPage(1);
            }}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );
      // Show ellipsis if needed
      if (page > 2) {
        buttons.push(
          <PaginationItem key="start-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      for (let i = Math.max(1, page); i <= Math.min(totalPages, page); i++) {
        if (i === 1 || i === totalPages) continue;
        buttons.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              isActive={page === i}
              onClick={e => {
                e.preventDefault();
                setPage(i);
              }}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
      // Show ellipsis if needed
      if (page < totalPages - 2) {
        buttons.push(
          <PaginationItem key="end-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      // Always show last page
      buttons.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            href="#"
            isActive={page === totalPages}
            onClick={e => {
              e.preventDefault();
              setPage(totalPages);
            }}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    return buttons;
  };

  return (
    <>
      {children({ page, pageSize, startIdx, endIdx })}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={e => {
                    e.preventDefault();
                    if (page > 1) setPage(page - 1);
                  }}
                  className={page === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
              {getPageButtons()}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={e => {
                    e.preventDefault();
                    if (page < totalPages) setPage(page + 1);
                  }}
                  className={page === totalPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </>
  );
};

export default PaginationWrapper;
