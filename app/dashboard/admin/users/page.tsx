'use client';

import {Layout} from '@/components/layout';
import {Button} from '@/components/ui/button';
import {useEffect, useState} from 'react';

import {DataTable} from '@/components/data-table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {useToast} from '@/hooks/use-toast';

import {ImageUploader} from '@/lib/actions/image.action';
import {
  deleteUserAccount,
  getAllUsers,
  signUp,
  updateUserAccount,
} from '@/lib/actions/user.actions';
import {formatDateTime} from '@/lib/utils';
import Image from 'next/image';

interface User {
  $id: string;
  firstname: string;
  lastname: string;
  email: string;
  password?: string;
  phone?: string;
  status: 'Active' | 'Inactive' | 'Suspended';
  address1?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  ssn?: string;
  dateOfBirth?: string;
  country: string;
  createdAt?: string;
  updatedAt?: string;
  userId: string;
  pin: string;
  verification: string;
  photoId?: string | React.ReactElement;
}

const columns: {header: string; accessor: keyof User}[] = [
  {header: 'Profile Image', accessor: 'photoId'},
  {header: 'First Name', accessor: 'firstname'},
  {header: 'Last Name', accessor: 'lastname'},
  {header: 'Email', accessor: 'email'},
  {header: 'Password', accessor: 'password'},
  {header: 'Address', accessor: 'address1'},
  {header: 'Postal Code', accessor: 'postalCode'},
  {header: 'City', accessor: 'city'},
  {header: 'State', accessor: 'state'},
  {header: 'Country', accessor: 'country'},
  {header: 'SSN', accessor: 'ssn'},
  {header: 'Date Of Birth', accessor: 'dateOfBirth'},
  {header: 'Verification', accessor: 'verification'},
  {header: 'Status', accessor: 'status'},
  {header: 'Login Pin', accessor: 'pin'},
  {header: 'Joined', accessor: 'createdAt'},
  {header: 'Updated', accessor: 'updatedAt'},
];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const {toast} = useToast();

  // Fetch all users on page load
  useEffect(() => {
    const fetchUsers = async () => {
      const allUsers = await getAllUsers();

      const formattedUsers = allUsers.map((user: any) => ({
        $id: user.$id,
        userId: user.userId,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        password: 'password',
        phone: user.phone,
        status: user.status,
        address1: user.address1,
        city: user.city,
        state: user.state,
        postalCode: user.postalCode,
        country: user.country,
        ssn: user.ssn,
        pin: user.pin,
        verification: user.verification,
        dateOfBirth: user.dateOfBirth,
        createdAt: formatDateTime(user.$createdAt).dateOnly,
        updatedAt: formatDateTime(user.$updatedAt).dateOnly,
        photoId: (
          <Image
            src={user.photoId || '/icons/avatar.png'}
            width={20}
            height={20}
            alt="image"
            className="h-10 w-10 rounded-full"
          />
        ),
      }));
      setUsers(formattedUsers);
    };

    fetchUsers();
  }, [users.length++]);

  const handleEdit = (user: User) => {
    setCurrentUser(user);
    setIsDialogOpen(true);
  };

  const handleDelete = async (user: User) => {
    try {
      const deletedUser = await deleteUserAccount({documentId: user.$id});
      if (deletedUser.message) {
        // Update users state
        setUsers(users.filter((u) => u.$id !== user.$id));

        // Display toast notification
        toast({
          variant: 'success', // Use a variant like "success" if it's not destructive
          title: 'User Deleted',
          description: deletedUser.message || 'The user has been successfully deleted.',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to delete user. Please try again.',
        });
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete user. Please try again.',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // Get the file from the form
    const file = formData.get('photoId') as File | null;

    let uploadPhotoUrl: string | null = null;

    // Trigger upload only if file exists
    if (file?.name && file.size) {
      uploadPhotoUrl = await ImageUploader(file);
    }

    const userData: any = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      firstname: formData.get('firstname') as string,
      lastname: formData.get('lastname') as string,
      address1: formData.get('address1') as string,
      city: formData.get('city') as string,
      state: formData.get('state') as string,
      postalCode: formData.get('postalCode') as string,
      country: formData.get('country') as string,
      phone: formData.get('phone') as string,
      ssn: formData.get('ssn') as string,
      dateOfBirth: formData.get('dateOfBirth') as string,
      status: formData.get('status') as string,
      verification: formData.get('verification') as string,
      photoId: uploadPhotoUrl as string,
    };

    try {
      if (currentUser) {
        const updatedFields: Partial<User> = {};
        for (const key in userData) {
          if (
            userData[key as keyof User] !== null &&
            currentUser[key as keyof User] !== userData[key as keyof User]
          ) {
            updatedFields[key as keyof User] = userData[key as keyof User];
          }
        }

        if (Object.keys(updatedFields).length > 0) {
          const updatedUser = await updateUserAccount({
            documentId: currentUser.$id,
            updates: updatedFields,
          });

          setUsers(users.map((user) => (user.$id === currentUser.$id ? updatedUser : user)));

          toast({
            variant: 'success',
            title: 'Successful',
            description: `This user details have been updated successfully!.`,
          });
        } else {
          toast({
            variant: 'default',
            title: 'No Changes Detected',
            description: 'No fields were updated.',
          });
        }
      } else {
        try {
          // Add new user
          const newUser = await signUp(userData);

          if (newUser) {
            toast({
              variant: 'success',
              title: 'Success!',
              description: 'User created successfully.',
            });
          }
        } catch (error) {
          console.log('Error', error);

          toast({
            variant: 'destructive',
            title: 'Failed to create user!',
            description: 'unable to create user, please try again later.',
          });
        }
      }

      setIsDialogOpen(false);
      setCurrentUser(null);
    } catch (error) {
      console.error('Error saving user:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An error occurred while saving the user. Please try again.',
      });
    }
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight pl-4">Users</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild className="mr-4">
            <Button onClick={() => setCurrentUser(null)}>Add New User</Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-200 border border-gray-700 max-sm:max-w-sm max-sm:max-h-[85vh] max-sm:overflow-y-auto ">
            <DialogHeader>
              <DialogTitle>{currentUser ? 'Edit User' : 'Add New User'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstname">First Name</Label>
                  <Input
                    id="firstname"
                    name="firstname"
                    defaultValue={currentUser?.firstname}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastname">Last Name</Label>
                  <Input
                    id="lastname"
                    name="lastname"
                    defaultValue={currentUser?.lastname}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address1"
                  name="address1"
                  type="text"
                  defaultValue={currentUser?.address1}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    type="text"
                    defaultValue={currentUser?.city}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">State</Label>
                  <Input
                    id="state"
                    name="state"
                    type="text"
                    defaultValue={currentUser?.state}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Postal Code</Label>
                  <Input
                    id="postalCode"
                    name="postalCode"
                    type="text"
                    defaultValue={currentUser?.postalCode}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    type="text"
                    defaultValue={currentUser?.country}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="email">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="text"
                    defaultValue={currentUser?.phone}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Date Of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="text"
                    defaultValue={currentUser?.dateOfBirth}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">SSN</Label>
                  <Input id="ssn" name="ssn" type="text" defaultValue={currentUser?.ssn} required />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={currentUser?.email || ''}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="text"
                  defaultValue={currentUser?.password || ''}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select name="status" defaultValue={currentUser?.status}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="opacity-100 bg-slate-50">
                      <SelectItem value="Active" className="cursor-pointer">
                        Active
                      </SelectItem>
                      <SelectItem value="Suspended" className="cursor-pointer">
                        Suspended
                      </SelectItem>
                      <SelectItem value="De-Activated" className="cursor-pointer">
                        De-activated
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="verification">verification</Label>
                  <Select name="verification" defaultValue={currentUser?.verification}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select verification" />
                    </SelectTrigger>
                    <SelectContent className="opacity-100 bg-slate-50 ">
                      <SelectItem value="Not Verified" className="cursor-pointer">
                        Not Verified
                      </SelectItem>
                      <SelectItem value="Verified" className="cursor-pointer">
                        Verified
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="email">Profile Photo</Label>
                  <input type="file" name="photoId" id="photoId" />
                </div>
              </div>
              <Button type="submit" className="px-4 py-2 border bg-blue-600 text-white">
                {currentUser ? ' Update user' : 'Create user'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <DataTable data={users} columns={columns} onEdit={handleEdit} onDelete={handleDelete} />
    </Layout>
  );
}
