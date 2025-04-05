'use client';

import {
  ArrowDown,
  CreditCard,
  DollarSign,
  Image as PayImage,
  ShoppingCartIcon as Paypal,
} from 'lucide-react';
import {QRCodeSVG} from 'qrcode.react';
import {useState} from 'react';

import HeaderBox from '@/components/HeaderBox';
import {Button} from '@/components/ui/button';
import {Card, CardContent} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {cn} from '@/lib/utils';
import {RootState} from '@/redux/store';
import {Account} from '@/types';
import Image from 'next/image';
import {useSelector} from 'react-redux';

const depositMethods = [
  {id: 'check', label: 'Check', icon: PayImage},
  {id: 'crypto', label: 'Crypto (USDT)', icon: CreditCard},
  {id: 'paypal', label: 'PayPal', icon: Paypal},
  {id: 'cashapp', label: 'Cash App', icon: DollarSign},
  {id: 'cash', label: 'Cash Deposit', icon: ArrowDown},
];

const FundDepositSection = () => {
  const [selectedMethod, setSelectedMethod] = useState(depositMethods[0].id);
  const [checkImage, setCheckImage] = useState<string | null>(null);

  const accountDetails: any = useSelector((state: RootState) => state.accounts?.data?.data);

  const cryptoDetails = {
    address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    network: 'Tron (TRC20)',
  };

  const paypalDetails = {
    email: 'payments@horizonbank.com',
    username: '@examplepayments',
  };

  const cashAppDetails = {
    tag: '$examplecashapp',
  };

  const handleCheckImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCheckImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="border-0 w-full mt-4 md:mt-20 px-4">
      <HeaderBox
        verifyState
        title="Deposit Funds"
        subtext="Choose your preferred method to deposit funds"
      />
      <Card className="w-full mt-8">
        <CardContent>
          <Tabs defaultValue={selectedMethod} onValueChange={setSelectedMethod}>
            <TabsList className="grid w-full grid-cols-5">
              {depositMethods.map((method) => {
                const isActive = selectedMethod == method.id;
                return (
                  <TabsTrigger
                    key={method.id}
                    value={method.id}
                    className={cn('sidebar-link', {
                      'bg-bank-gradient': isActive,
                    })}>
                    <method.icon
                      className={cn({
                        'brightness-[3] invert-0 text-white': isActive,
                      })}
                    />

                    <p className={cn('sidebar-label', {'!text-white': isActive})}>
                      {' '}
                      {method.label}
                    </p>
                  </TabsTrigger>
                );
              })}
            </TabsList>
            <div className="mt-6">
              <TabsContent value="check">
                <div className="space-y-4">
                  <div className="flex items-center justify-center border-2 border-dashed rounded-md p-6">
                    {checkImage ? (
                      <Image
                        src={checkImage}
                        width={500}
                        height={500}
                        alt="Uploaded check"
                        className="max-w-full h-auto"
                      />
                    ) : (
                      <Label htmlFor="check-upload" className="cursor-pointer">
                        <PayImage className="h-12 w-12 text-gray-400" />
                        <span className="mt-2 block text-sm font-semibold text-gray-900">
                          Upload check image
                        </span>
                      </Label>
                    )}
                    <Input
                      id="check-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleCheckImageUpload}
                    />
                  </div>
                  {checkImage && (
                    <div className="flex justify-end">
                      <Button className="py-0.5 px-2 bg-[#3589FE] text-white">
                        Submit Check for Deposit
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="crypto">
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <QRCodeSVG value={cryptoDetails.address} size={200} />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold">USDT Deposit Address:</p>
                    <p className="text-sm break-all">{cryptoDetails.address}</p>
                    <p className="mt-2 font-semibold">Network:</p>
                    <p className="text-sm">{cryptoDetails.network}</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="paypal">
                <div className="space-y-4 text-center">
                  <Paypal className="h-12 w-12 mx-auto text-blue-500" />
                  <div>
                    <p className="font-semibold">PayPal Email:</p>
                    <p>{paypalDetails.email}</p>
                  </div>
                  <div>
                    <p className="font-semibold">PayPal Username:</p>
                    <p>{paypalDetails.username}</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="cashapp">
                <div className="space-y-4 text-center">
                  <DollarSign className="h-12 w-12 mx-auto text-green-500" />
                  <div>
                    <p className="font-semibold">Cash App Tag:</p>
                    <p className="text-2xl font-bold">{cashAppDetails.tag}</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="cash">
                <div className="space-y-4">
                  {accountDetails.map((a: Account) => (
                    <div key={a.$id} className="grid grid-col-3 md:grid-cols-4 gap-4 border-b">
                      <h2>{a.subType}</h2>

                      <div className="col-span-2 md:col-span-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-[8px]">
                            <Label>Account Number</Label>
                            <Input
                              value={a.accountNumber}
                              readOnly
                              className="border-none hover:border-none"
                            />
                          </div>
                          <div className="flex items-center">
                            <div className="text-[8px]">
                              <Label>Routing Number</Label>
                              <Input
                                value={a.routingNumber}
                                readOnly
                                className="border-none hover:border-none"
                              />
                            </div>
                            <span className="text-[10px] text-green-500 underline cursor-pointer">
                              Active
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div
                    className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4"
                    role="alert">
                    <p className="font-bold">Important:</p>
                    <p>Please use these details for cash deposits at your local bank branch.</p>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
export default FundDepositSection;
