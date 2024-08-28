'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';

export function LoginButton() {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <Button
      variant={'outline'}
      size={'default'}
      onClick={async () => {
        setIsLoading(true);
        window.location.href = '/login';
      }}
    >
      Sign In
      {isLoading && <Loader2 className="ml-2 mr-2 h-4 w-4 animate-spin" />}
    </Button>
  );
}
