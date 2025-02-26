import {authFormSchema} from '@/lib/utils';
import {FieldPath} from 'react-hook-form';

/* eslint-disable no-unused-vars */
declare type SearchParamProps = {
  params: {[key: string]: string};
  searchParams: {[key: string]: string | string[] | undefined};
};

// ========================================

declare type SignUpParams = {
  firstname: string;
  lastname: string;
  address1: string;
  city: string;
  state: string;
  postalCode: string;
  dateOfBirth?: string;
  ssn?: string;
  email: string;
  password: string;
};

declare type LoginUser = {
  email: string;
  password: string;
};

declare type User = {
  $id: string;
  email: string;
  firstname: string;
  lastname: string;
  name: string;
  address1: string;
  city: string;
  state: string;
  postalCode: string;
  photo: string;
  dateOfBirth: string;
  verification: string;
  ssn: string;
  userId: string;
  pin: string;
  phone: string;
  $updatedAt: string;
  verificationProcessed: boolean;
};

declare type NewUserParams = {
  userId: string;
  email: string;
  name: string;
  password: string;
};

declare interface Card {
  type: string;
  mask: string;
  pin: string;
  cvv: string;
  $id: string;
}

declare type Account = {
  $id: string;
  active: boolean;
  fraudAlert: boolean;
  availableBalance: number;
  currentBalance: number;
  name: string;
  subType: string;
  accountNumber: string;
  routingNumber: string;
  transferlimit: string;
  mintransfer: string;
  userId: string;
  createdAt: Date;
  status: string;
  message?: string;
};

declare type Transaction = {
  $id: string;
  amount: number;
  description: string;
  type: string;
  status: string;
  created: Date;
  category: string;

  receiverAccountId: string;
  senderAccountId: string;
  accountNo: string;
  routingNo: string;
  recipientBank: string;
  recipientName: string;
  email: string;
  amount: number;
  otp: string;
  $createdAt: Date;
};

// declare type Bank = {
//   $id: string;
//   accountId: string;
//   bankId: string;
//   accessToken: string;
//   fundingSourceUrl: string;
//   userId: string;
//   sharaebleId: string;
// };

declare type AccountTypes = 'depository' | 'credit' | 'loan ' | 'investment' | 'other';

declare type Category = 'Food and Drink' | 'Travel' | 'Transfer';

declare type CategoryCount = {
  name: string;
  count: number;
  totalCount: number;
};

declare type Receiver = {
  firstName: string;
  lastName: string;
};

declare type TransferParams = {
  sourceFundingSourceUrl: string;
  destinationFundingSourceUrl: string;
  amount: string;
};

declare type AddFundingSourceParams = {
  dwollaCustomerId: string;
  processorToken: string;
  bankName: string;
};

declare type NewDwollaCustomerParams = {
  firstName: string;
  lastName: string;
  email: string;
  type: string;
  address1: string;
  city: string;
  state: string;
  postalCode: string;
  dateOfBirth: string;
  ssn: string;
};

declare interface CreditCardProps {
  account: Account;
  card: Card;
  userName: string;
  showBalance?: boolean;
}

declare interface BankInfoProps {
  account: Account;
  accountId?: string;
  type: 'full' | 'card';
}

declare interface HeaderBoxProps {
  type?: 'title' | 'greeting';
  title: string;
  subtext: string;
  user?: User;
  verifyState: boolean;
}

declare interface MobileNavProps {
  user: User;
}

declare interface PageHeaderProps {
  topTitle: string;
  bottomTitle: string;
  topDescription: string;
  bottomDescription: string;
  connectBank?: boolean;
}

declare interface PaginationProps {
  page: number;
  totalPages: number;
}

declare interface PlaidLinkProps {
  user: User;
  variant?: 'primary' | 'ghost';
  dwollaCustomerId?: string;
}

// declare type User = sdk.Models.Document & {
//   accountId: string;
//   email: string;
//   name: string;
//   items: string[];
//   accessToken: string;
//   image: string;
// };

declare interface AuthFormProps {
  type: 'sign-in' | 'sign-up';
}

declare interface BankDropdownProps {
  accounts: Account[];
  setValue?: UseFormSetValue<any>;
  otherStyles?: string;
}

declare interface BankTabItemProps {
  account: Account;
  accountId?: string;
}

declare interface TotalBalanceBoxProps {
  accounts: Account[];
  totalAccounts: number;
  totalCurrentBalance: number;
  totalDeposits: number;
  totalWithdrawals: number;
}

declare interface FooterProps {
  user: User;
  type?: 'mobile' | 'desktop';
}

declare interface RightSidebarProps {
  user: User;
  transactions: Transaction[];
  accounts: Account[];
}

declare interface SiderbarProps {
  user: User;
}

declare interface RecentTransactionsProps {
  accounts: Account[];
  transactions: Transaction[];
  accountId: string;
  page: number;
}

declare interface TransactionHistoryTableProps {
  transactions: Transaction[];
  page: number;
}

declare interface CategoryBadgeProps {
  category: string;
}

declare interface TransactionTableProps {
  transactions: Transaction[];
}

declare interface CategoryProps {
  category: CategoryCount;
}

declare interface DoughnutChartProps {
  accounts: Account[];
}

declare interface PaymentTransferFormProps {
  accounts: Account[];
  user: User;
}

// Actions
declare interface getAccountsProps {
  userId: string;
}

declare interface getAccountProps {
  accountId: string;
}

declare interface getInstitutionProps {
  institutionId: string;
}

declare interface getTransactionsProps {
  accountId: string;
}

declare interface CreateFundingSourceOptions {
  customerId: string; // Dwolla Customer ID
  fundingSourceName: string; // Dwolla Funding Source Name
  plaidToken: string; // Plaid Account Processor Token
  _links: object; // Dwolla On Demand Authorization Link
}

declare interface CreateTransactionProps {
  receiverAccountId: string;
  senderAccountId: string;
  accountNo: string;
  routingNo: string;
  recipientBank: string;
  recipientName: string;
  email: string;
  amount: number;
  otp?: string;
}

declare interface createCardProps {
  userId: string;
  accountId: string;
  type: string;
  mask: string;
  cvv: string;
  pin: string;
}
declare interface getCardProps {
  userId: string;
}
declare interface getTransactionsByIdProps {
  accountId: string;
}

declare interface signInProps {
  email: string;
  password: string;
}

declare interface getUserInfoProps {
  userId: string;
}

declare interface exchangePublicTokenProps {
  publicToken: string;
  user: User;
}

declare interface createBankAccountProps {
  userId: string;
  subType?: string;
  accountNumber: string;
}

declare interface getBanksProps {
  userId: string;
}
declare interface getUserAccountProps {
  userId: string;
}

declare interface getBankProps {
  documentId: string;
}

declare interface getBankByAccountIdProps {
  accountId: string;
}

const formSchema = authFormSchema('sign-up');
declare interface customFormIputProps {
  control: control<z.infer<typeof formSchema>>;
  name: FieldPath<z.infer<typeof formSchema>>;
  label: string;
  placeholder: string;
  disabled: any;
}
