import { Button } from '@/components/ui/button';
import { ReactNode } from 'react';

const AuthenticateButton = ( { onClick, children }: { onClick: () => void, children: ReactNode }) => {
  return (
    <Button onClick={onClick}>{children}</Button>
  );
};

export default AuthenticateButton;