import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const GoBackButton = () => {
  const location = useLocation();
  
  // Don't show the button on these pages
  if (
    location.pathname === '/' || 
    location.pathname === '/login' ||
    location.pathname.match(/^\/admin\/user\/.*\/edit/) ||
    location.pathname.match(/^\/admin\/product\/.*\/edit/) ||
    location.pathname.match(/^\/product\//)
  ) {
    return null;
  }
  
  return (
    <Link to="#" onClick={() => window.history.back()} className='btn btn-light my-3'>
      Go Back
    </Link>
  );
};

export default GoBackButton;