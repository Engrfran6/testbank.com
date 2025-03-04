import {Button} from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {XCircle} from 'lucide-react';
import Link from 'next/link';

export default function VerificationFailurePage() {
  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <XCircle className="w-16 h-16 text-red-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-700">Verification Failed</CardTitle>
          <CardDescription>We couldn't verify one or more of the required codes.</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-600 mb-4">
            Your transaction could not be processed due to verification issues. Please check your
            codes and try again.
          </p>
          <p className="text-sm text-gray-500">
            If you continue to experience issues, please contact our support team for assistance.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center space-x-4">
          <Button asChild variant="outline">
            <Link href="/">Return to Home</Link>
          </Button>
          <Button asChild>
            <Link href="/authenticate/bank-verification-system/cot-code">Try Again</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
