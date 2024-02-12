import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@bxav/ui-components';

const InsufficientTokenAlert = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const handleBuyTokens = async (event: any) => {
    event.preventDefault();

    const response = await fetch('/api/users/stripe');

    const session = await response.json();
    if (session) {
      window.location.href = session.url;
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Insufficient Token</AlertDialogTitle>
          <AlertDialogDescription>
            You have insufficient tokens to complete this request. Please try
            another model or buy more tokens!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleBuyTokens}>
            Buy some tokens
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export { InsufficientTokenAlert };
