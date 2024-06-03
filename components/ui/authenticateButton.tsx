import { Button } from '@/components/ui/button';

const AuthenticateButton = ( { onClick }: { onClick: () => void }) => {
  return (
    <Button onClick={onClick}>Authenticate</Button>
  );
};

export default AuthenticateButton;