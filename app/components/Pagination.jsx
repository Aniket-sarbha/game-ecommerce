// components/Pagination.jsx
import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];
  
  // Create array of page numbers to display
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }
  
  // Only show a window of 5 pages
  const getPageWindow = () => {
    const window = 2; // Show 2 pages before and after current page
    
    if (totalPages <= 5) return pages;
    
    const start = Math.max(1, currentPage - window);
    const end = Math.min(totalPages, currentPage + window);
    
    const result = [];
    
    if (start > 1) {
      result.push(1);
      if (start > 2) result.push('...');
    }
    
    for (let i = start; i <= end; i++) {
      result.push(i);
    }
    
    if (end < totalPages) {
      if (end < totalPages - 1) result.push('...');
      result.push(totalPages);
    }
    
    return result;
  };
  
  return (
    <div className="flex justify-center mt-8">
      <div className="flex space-x-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded-md ${
            currentPage === 1 
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
          }`}
        >
          Previous
        </button>
        
        {getPageWindow().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            className={`px-3 py-1 rounded-md ${
              page === currentPage
                ? 'bg-blue-500 text-white'
                : page === '...'
                ? 'bg-gray-100 text-gray-700 cursor-default'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          >
            {page}
          </button>
        ))}
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded-md ${
            currentPage === totalPages 
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;