
import React from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '@/components/auth/AuthLayout';
import RegisterForm from '@/components/auth/RegisterForm';

const Register = () => {
  return (
    <AuthLayout 
      title="Create your account"
      subtitle={
        <>
          Or{" "}
          <Link to="/login" className="font-medium text-burgundy-800 hover:text-burgundy-700">
            sign in to your existing account
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthLayout>
  );
};

export default Register;
