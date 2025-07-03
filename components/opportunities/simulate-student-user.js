"use client"

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/lib/features/auth/authSlice';

// This component is for demonstration purposes only
// It simulates a logged-in student user so the Apply button will show
export function SimulateStudentUser() {
  const dispatch = useDispatch();
  
  useEffect(() => {
    // Simulate a logged-in student user
    const mockStudentUser = {
      id: 'student-123',
      name: 'John Student',
      email: 'student@example.com',
      roles: [
        { id: 1, name: 'student' }
      ],
      avatar: '/placeholder-user.jpg'
    };
    
    dispatch(setCredentials({
      user: mockStudentUser,
      accessToken: 'mock-token',
      isAuthenticated: true
    }));
  }, [dispatch]);
  
  return null; // This component doesn't render anything
}
