'use client';

import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';

export function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <Button
      variant={'outline'}
      size={'default'}
      onClick={async () => {
        setIsLoading(true);
        // const response = await fetch('/logout', {
        // 	method: 'POST',
        // 	headers: {
        // 		'Content-Type': 'application/json',
        // 	},
        // });
        // if (response.ok) {
        // 	console.log('Logout successful, response:', response);
        // 	window.location.href = '/';
        // } else {
        // 	console.error('Logout failed');
        // }
        window.location.href = '/logout';
      }}
    >
      Logout
      {isLoading && <Loader2 className="ml-2 mr-2 h-4 w-4 animate-spin" />}
    </Button>
  );
}
