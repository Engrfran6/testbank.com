'use client';

import CustomInput from '@/components/CustomInput';
import {Button} from '@/components/ui/button';
import {Form} from '@/components/ui/form';
import {Label} from '@/components/ui/label';
import {useToast} from '@/hooks/use-toast';
import {ImageUploader} from '@/lib/actions/image.action';
import {updateUser} from '@/lib/actions/user.actions';
import {RootState} from '@/redux/store';
import {zodResolver} from '@hookform/resolvers/zod';
import {Loader2} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {useSelector} from 'react-redux';
import {z} from 'zod';

const page = () => {
  const {toast} = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const userId = useSelector((state: RootState) => state.user.user?.$id);

  const authFormSchema = () =>
    z.object({
      ssn: z.string().min(10).max(10),
      nextOfKin: z.string().min(3),
      nextOfKinRelationship: z.string().min(3),
      nextOfKinAddress: z.string().min(3).max(50),
      photoId: z.instanceof(FileList).refine((files) => files.length > 0, 'Selfie is required'),
      ssnPhoto: z.instanceof(FileList).refine((files) => files.length > 0, 'SSN photo is required'),
      idCard: z.instanceof(FileList).refine((files) => files.length > 0, 'ID card is required'),
      proofOfAddress: z
        .instanceof(FileList)
        .refine((files) => files.length > 0, 'Proof of address is required'),
    });

  const formSchema = authFormSchema();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ssn: '',
      nextOfKin: '',
      nextOfKinRelationship: '',
      nextOfKinAddress: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    const photoId = data.photoId[0];
    const ssnPhoto = data.ssnPhoto[0];
    const idCard = data.idCard[0];
    const proofOfAddress = data.proofOfAddress[0];

    let photoIdUrl: string | null = null;
    let ssnPhotoUrl: string | null = null;
    let idCardUrl: string | null = null;
    let proofOfAddressUrl: string | null = null;

    try {
      if (photoId) photoIdUrl = await ImageUploader(photoId);
      if (ssnPhoto) ssnPhotoUrl = await ImageUploader(ssnPhoto);
      if (idCard) idCardUrl = await ImageUploader(idCard);
      if (proofOfAddress) proofOfAddressUrl = await ImageUploader(proofOfAddress);

      const userData = {
        ssn: data.ssn,
        nextOfKin: data.nextOfKin,
        nextOfKinRelationship: data.nextOfKinRelationship,
        nextOfKinAddress: data.nextOfKinAddress,
        photoId: photoIdUrl,
        ssnPhoto: ssnPhotoUrl,
        idCard: idCardUrl,
        proofOfAddress: proofOfAddressUrl,
        verification: 'Verified',
      };

      const newUser = await updateUser({userId: userId as string, updates: userData});

      console.log('stting data=========>', userData);
      console.log('setup data on success=========>', newUser);

      if (newUser?.verification === 'Verified') {
        router.push('/dashboard/client');
      } else {
        return setError(
          'Error: OOPS! we are unable to verify details at the moment, Please try again later!'
        );
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An error occurred while updating your profile. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="mt-6 px-4 w-full md:w-1/2">
      <header className="flex flex-col gap-5 md:gap-8 mb-5">
        <div className="flex flex-col gap-1 md:gap-3">
          <h1 className="text-24 lg:text-36 font-semibold text-gray-900">
            Finish setting up your account
          </h1>
          <p className="text-16 font-normal text-gray-600">Please enter your details</p>
        </div>
      </header>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <CustomInput
            control={form.control}
            name="ssn"
            label="SSN"
            placeholder="Enter your ssn"
            disabled={isLoading}
          />
          <CustomInput
            control={form.control}
            name="nextOfKin"
            label="Next Of Kin"
            placeholder="Enter name of next of kin"
            disabled={isLoading}
          />
          <CustomInput
            control={form.control}
            name="nextOfKinRelationship"
            label="Next Of Kin Relationship"
            placeholder="Enter your Relationship next of Kin"
            disabled={isLoading}
          />
          <CustomInput
            control={form.control}
            name="nextOfKinAddress"
            label="Next Of Kin Address"
            placeholder="Enter address next of Kin"
            disabled={isLoading}
          />

          <div className="flex flex-col gap-2">
            <Label htmlFor="photoId">Upload selfie</Label>
            <input type="file" id="photoId" {...form.register('photoId')} disabled={isLoading} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="ssnPhoto">Upload SSN Image</Label>
            <input type="file" id="ssnPhoto" {...form.register('ssnPhoto')} disabled={isLoading} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="idCard">Upload ID Photo</Label>
            <input type="file" id="idCard" {...form.register('idCard')} disabled={isLoading} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="proofOfAddress">Upload proof Of Address</Label>
            <input
              type="file"
              id="proofOfAddress"
              {...form.register('proofOfAddress')}
              disabled={isLoading}
            />
          </div>

          <span>{error}</span>

          <div className="flex flex-col gap-4">
            <Button type="submit" disabled={isLoading} className="form-btn">
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" /> &nbsp; Loading...
                </>
              ) : (
                'Finish setup'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
};

export default page;
