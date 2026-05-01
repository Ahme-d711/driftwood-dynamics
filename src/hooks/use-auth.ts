import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../api/auth.service';
import { useAuthStore } from '../store/use-auth-store';
import { LoginCredentials, AuthResponse, User } from '../types/api';

/**
 * Custom hooks for Authentication using TanStack Query
 * Separates server state management from UI components
 */

export const useCurrentUser = () => {
  const { setAuth } = useAuthStore();

  return useQuery<User>({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const user = await authService.getCurrentUser();
      setAuth(user); // Sync with Zustand
      return user;
    },
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  const { setAuth } = useAuthStore();

  return useMutation<AuthResponse, Error, LoginCredentials>({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (data) => {
      setAuth(data.user);
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const { clearAuth } = useAuthStore();

  return useMutation<void, Error, void>({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      clearAuth();
      queryClient.clear(); // Clear all cache on logout
    },
  });
};

