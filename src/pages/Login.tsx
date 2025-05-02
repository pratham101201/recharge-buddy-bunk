
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { UserRound, Lock } from 'lucide-react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase"; // ✅ Adjust path as needed
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { toast } = useToast();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const user = userCred.user;

      toast({
        title: "Login Successful",
        description: `Welcome back, ${user.email}`,
      });

      navigate("/");// ✅ Redirect to home or dashboard

    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md space-y-8">
        <CardHeader>
          <div className="flex flex-col items-center justify-center">
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight">
              Welcome to <span className="gradient-text">EV Recharge</span>
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Sign in to access your account
            </p>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserRound className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="pl-10"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="pl-10"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Button type="submit" className="w-full bg-gradient-to-r from-evblue-500 to-evgreen-500 hover:from-evblue-600 hover:to-evgreen-600">
                Sign in
              </Button>
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <p className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="/Signup" className="font-medium text-evblue-600 hover:text-evblue-500">
              Sign up
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;

