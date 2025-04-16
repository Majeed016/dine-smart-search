
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from '@/context/AuthContext';
import AuthLayout from '@/components/auth/AuthLayout';

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  role: z.string({
    required_error: "Please select a role.",
  }),
});

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "customer",
    },
  });
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    
    try {
      const success = await login(values.email, values.password, values.role);
      if (success) {
        navigate('/');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <AuthLayout
      title="Sign in to your account"
      subtitle={
        <>
          Or{" "}
          <Link to="/register" className="font-medium text-burgundy-800 hover:text-burgundy-700">
            create a new account
          </Link>
        </>
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="name@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Login as</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="restaurantManager">Restaurant Manager</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <a href="#" className="font-medium text-burgundy-800 hover:text-burgundy-700">
                Forgot your password?
              </a>
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-burgundy-800 hover:bg-burgundy-900"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></div>
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>
          
          <div className="text-center text-sm text-gray-500">
            <p>
              For demo purposes, use any email and password <strong>"password123"</strong> for existing accounts.
            </p>
            <p className="mt-1">
              Or register a new account with your own password.
            </p>
          </div>
        </form>
      </Form>
    </AuthLayout>
  );
};

export default Login;
