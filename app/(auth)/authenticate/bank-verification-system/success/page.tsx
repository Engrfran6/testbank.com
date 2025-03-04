import {Button} from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {CheckCircle} from 'lucide-react';
import Link from 'next/link';

export default function VerificationSuccessPage() {
  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-700">
            Verification Successful
          </CardTitle>
          <CardDescription>All required codes have been verified successfully.</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-600">
            Your transaction has been approved and is being processed. You should receive a
            confirmation email shortly.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link href="/dashboard/client">Return to Home</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
