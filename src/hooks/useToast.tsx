import { useToast as useToastPrimitive } from '../components/ui/toaster';
import React from 'react';

export const useToast = () => {
  const { toast } = useToastPrimitive();

  return {
    toast: (props: {
      title?: string;
      description?: string;
      variant?: 'default' | 'destructive';
    }) => {
      toast({
        ...props,
      });
    },  };
}; 