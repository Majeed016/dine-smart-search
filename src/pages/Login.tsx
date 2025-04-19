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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useAuth } from '@/context/AuthContext';
import AuthLayout from '@/components/auth/AuthLayout';
import { toast } from '@/components/ui/use-toast';

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
      const demoPassword = "password123";
      
      const passwordToUse = values.password === demoPassword ? demoPassword : values.password;
      
      const success = await login(values.email, passwordToUse, values.role);
      if (success) {
        toast({
          title: "Login successful",
          description: "You are now logged in",
        });
        
        switch (values.role) {
          case 'admin':
            navigate('/admin');
            break;
          case 'restaurantManager':
            navigate('/restaurant-manager');
            break;
          default:
            navigate('/');
        }
      } else {
        toast({
          title: "Login failed",
          description: "Please check your credentials and try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDemoLogin = (role: string) => {
    form.setValue("email", `demo-${role}@example.com`);
    form.setValue("password", "password123");
    form.setValue("role", role);
    
    form.handleSubmit(onSubmit)();
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
          
          <div className="text-center text-sm text-gray-500 space-y-4">
            <p>
              For demo purposes, use any email and password <strong>"password123"</strong> for existing accounts.
            </p>
            <p>
              Or use quick login buttons below:
            </p>
            <div className="grid grid-cols-3 gap-2 mt-2">
              <Button 
                type="button" 
                variant="outline" 
                className="text-xs"
                onClick={() => handleDemoLogin('customer')}
                disabled={isLoading}
              >
                Customer Demo
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="text-xs"
                onClick={() => handleDemoLogin('restaurantManager')}
                disabled={isLoading}
              >
                Manager Demo
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="text-xs"
                onClick={() => handleDemoLogin('admin')}
                disabled={isLoading}
              >
                Admin Demo
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </AuthLayout>
  );
};

export default Login;
