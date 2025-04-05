'use client';

import CustomInput from '@/components/CustomInput';
import {Button} from '@/components/ui/button';
import {Form, FormLabel} from '@/components/ui/form';
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

const Page = () => {
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
      idCardFront: z
        .instanceof(FileList)
        .refine((files) => files.length > 0, 'ID card front is required'),
      idCardBack: z
        .instanceof(FileList)
        .refine((files) => files.length > 0, 'ID card back is required'),
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
    const idCardFront = data.idCardFront[0];
    const idCardBack = data.idCardBack[0];
    const proofOfAddress = data.proofOfAddress[0];

    let photoIdUrl: string | null = null;
    let ssnPhotoUrl: string | null = null;
    let idCardFrontUrl: string | null = null;
    let idCardBackUrl: string | null = null;
    let proofOfAddressUrl: string | null = null;

    try {
      if (photoId) photoIdUrl = await ImageUploader(photoId);
      if (ssnPhoto) ssnPhotoUrl = await ImageUploader(ssnPhoto);
      if (idCardFront) idCardFrontUrl = await ImageUploader(idCardFront);
      if (idCardBack) idCardBackUrl = await ImageUploader(idCardBack);
      if (proofOfAddress) proofOfAddressUrl = await ImageUploader(proofOfAddress);

      const userData = {
        ssn: data.ssn,
        nextOfKin: data.nextOfKin,
        nextOfKinRelationship: data.nextOfKinRelationship,
        nextOfKinAddress: data.nextOfKinAddress,
        photoId: photoIdUrl,
        ssnPhoto: ssnPhotoUrl,
        idCardFront: idCardFrontUrl,
        idCardBack: idCardBackUrl,
        proofOfAddress: proofOfAddressUrl,
        verification: 'Verified',
      };

      const verifiedUser = await updateUser({userId: userId as string, updates: userData});

      if (verifiedUser?.verification === 'Verified') {
        router.push('/dashboard/client');
      } else {
        return setError(
          'Error: OOPS! we are unable to verify your details at the moment, Please try again later!'
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
    <section className="mx-auto px-4 w-full md:w-[60%] mt-8 md:mt-20">
      <header className="flex flex-col gap-5 md:gap-8 mb-5">
        <div className="flex flex-col gap-1 md:gap-3">
          <h1 className="text-24 lg:text-36 font-semibold text-gray-900">
            Finish setting up your account
          </h1>
          <p className="text-16 font-normal text-gray-600">Please enter your details</p>
        </div>
      </header>

      <div>
        {isLoading ? (
          <div className="flex items-center justify-center h-screen">
            <span className="flex gap-1 items-center text-xl font-medium text-blue-700">
              <Loader2 className="animate-spin" />
              Loading...
            </span>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-4 md:grid-cols-2 grid-cols-1">
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
              </div>
              <div className="grid gap-4 md:grid-cols-2 grid-cols-1">
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
              </div>

              <div className="grid gap-4 md:grid-cols-2 grid-cols-1">
                <div className="flex flex-col gap-2">
                  <FormLabel htmlFor="photoId">
                    <span className="text-sm text-gray-800"> Selfie</span>
                    <span className="italic text-[12px] text-purple-400">
                      (Passport photograph)
                    </span>
                  </FormLabel>
                  <input
                    type="file"
                    id="photoId"
                    {...form.register('photoId')}
                    disabled={isLoading}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <FormLabel htmlFor="ssnPhoto">
                    <span className="text-sm text-gray-800"> SSN card</span>{' '}
                    <span className="italic text-[12px] text-purple-400">(Front only)</span>
                  </FormLabel>
                  <input
                    type="file"
                    id="ssnPhoto"
                    {...form.register('ssnPhoto')}
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2 grid-cols-1">
                <div className="flex flex-col gap-2">
                  <FormLabel htmlFor="idCard">
                    <span className="text-sm text-gray-800">
                      Driver&apos;s License / Passport ID - (Front)
                    </span>
                    <span className="italic text-[12px] text-purple-400">(Must be valid)</span>
                  </FormLabel>
                  <input
                    type="file"
                    id="idCardfront"
                    {...form.register('idCardFront')}
                    disabled={isLoading}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <FormLabel htmlFor="idCard">
                    <span className="text-sm text-gray-800">
                      {' '}
                      Driver&apos;s License / Passport ID - (Back)
                    </span>
                    <span className="italic text-[12px] text-purple-400">(Must be valid)</span>
                  </FormLabel>
                  <input
                    type="file"
                    id="idCardback"
                    {...form.register('idCardBack')}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <FormLabel htmlFor="proofOfAddress">
                  <span className="text-sm text-gray-800"> Proof Of Address </span>
                  <span className="italic text-[12px] text-purple-400">
                    (Utility / Electricity bill)
                  </span>
                </FormLabel>
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
        )}
      </div>
    </section>
  );
};

export default Page;
