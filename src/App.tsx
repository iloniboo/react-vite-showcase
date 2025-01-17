import { useDispatch ,useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { AuthForm } from '@/components/auth/AuthForm';
import { TodoList } from '@/components/todo/TodoList';
import { TodoForm } from '@/components/todo/TodoForm';
import { ThemeProvider } from '@/components/theme-provider';
import { ModeToggle } from '@/components/mode-toggle';
import { jwtDecode } from 'jwt-decode';
import { useEffect } from 'react';
import { check, logout } from './lib/redux/slices/authSlice';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { Toaster } from 'sonner';

function App() {
  const {isLoggedIn}= useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    // Validate token and update isLoggedIn state
    const token = localStorage.getItem('token');
    console.log("token", token)
    if (token) {
      try {
        // Decode the token
        const decoded: { exp: number } = jwtDecode(token);
        // Check if token is expired
        console.log(Date.now())
        const isTokenExpired = decoded.exp < Math.floor(Date.now() / 1000);;
        console.log("decoded token:", decoded, isTokenExpired)
        if (!isTokenExpired) {
          dispatch(check(true));

        } else {
          localStorage.removeItem('token'); // Remove expired token
          alert("Token expired!")
        }
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('token'); // Remove invalid token
      }
    }
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="min-h-screen bg-background">
        <Toaster position="top-right"/>
        <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
          {isLoggedIn && (
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center space-x-4">
                <h2 className="text-lg font-semibold">Welcome!</h2>
              </div>
              <div className="flex items-center space-x-2">
                <ModeToggle />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleLogout}
                  className="ml-2"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
          {!isLoggedIn && (
            <div className="flex justify-end mb-4">
              <ModeToggle />
            </div>
          )}
          <main className="flex-1">
            {isLoggedIn ? (
              <div className="space-y-6 max-w-4xl mx-auto">
                <TodoForm />
                <TodoList />
              </div>
            ) : (
              <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
                <AuthForm />
              </div>
            )}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;