'use server';

import {createAdminClient} from '@/lib/appwrite';
import {generateRandomAmount, generateReceiverAccountId, parseStringify} from '@/lib/utils';
import {faker} from '@faker-js/faker';
import {ID} from 'node-appwrite';

const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_TRANSACTION_COLLECTION_ID: TRANSACTION_COLLECTION_ID,
} = process.env;

interface Transaction {
  description: string;
  type: string;
  email: string;
  channel: string;
  category: string;
  accountNo: string;
  routingNo: string;
  recipientName: string;
  recipientBank: string;
  amount: number;
  receiverAccountId: string;
  senderAccountId: string;
  userId: string;
  $createdAt: string;
  status: string;
}

interface InputProps {
  totalNumberOfTransactions: number;
  primaryTransactionCountry: string;
  secondaryTransactionCountry?: string;
  transactionType: string;
  minAmount: number;
  maxAmount: number;
  month: number;
  year: number;
}

type senderInfoProps = {
  userId: string;
  firstname: string;
  lastname: string;
  email: string;
};

type senderAccountProps = {
  $id: string;
  accountNumber: string;
  routingNumber: string;
};

interface Generatorinputdata {
  inputdata: InputProps;
  senderInfo: senderInfoProps;
  senderAccount: senderAccountProps;
}

const banksByCountry: {[key: string]: {bank: string; routing: string}[]} = {
  'United States': [
    {bank: 'Chase', routing: '9876546'},
    {bank: 'Bank of America', routing: '9876546'},
    {bank: 'Wells Fargo', routing: '9876546'},
    {bank: 'Citibank', routing: '9876546'},
    {bank: 'US Bank', routing: '9876546'},
  ],
  'United Kingdom': [
    {bank: 'Barclays', routing: '9876546'},
    {bank: 'HSBC', routing: '9876546'},
    {bank: 'Lloyds Bank', routing: '9876546'},
    {bank: 'NatWest', routing: '9876546'},
    {bank: 'Santander UK', routing: '9876546'},
  ],
  Canada: [
    {bank: 'RBC Royal Bank', routing: '828827'},
    {bank: 'TD Canada Trust', routing: '828827'},
    {bank: 'Scotiabank', routing: '828827'},
    {bank: 'BMO Bank of Montreal', routing: '828827'},
    {bank: 'CIBC', routing: '828827'},
  ],
  // Add more countries, banks, and routing numbers as needed
};

function getRandomBankAndRouting(country: string): {bank: string; routing: string} {
  const banks = banksByCountry[country] || banksByCountry['United States']; // Fallback to 'United States'

  // Check if the banks array is empty
  if (!banks || banks.length === 0) {
    throw new Error(`No banks found for country: ${country}`);
  }

  // Randomly select a bank and routing number
  const randomIndex = Math.floor(Math.random() * banks.length);
  return banks[randomIndex];
}

export async function generateTransactions({
  inputdata,
  senderInfo,
  senderAccount,
}: Generatorinputdata): Promise<Transaction[]> {
  const transactions: Transaction[] = [];

  for (let i = 0; i < inputdata.totalNumberOfTransactions; i++) {
    const isDebit = inputdata.transactionType === 'debit';
    const isCredit = inputdata.transactionType === 'credit';
    const isBoth = inputdata.transactionType === 'both';

    const currentType =
      isBoth && i % 2 === 0 ? 'debit' : isBoth ? 'credit' : inputdata.transactionType;

    const isInternational = inputdata.secondaryTransactionCountry && Math.random() < 0.3;
    const transactionCountry =
      (isInternational
        ? inputdata.secondaryTransactionCountry
        : inputdata.primaryTransactionCountry) ?? 'United States';

    const randomBank = getRandomBankAndRouting(transactionCountry);

    console.log('get random bank and its routing number====>', randomBank);

    const randomAmount = generateRandomAmount(inputdata.minAmount, inputdata.maxAmount);

    const transaction: Transaction = {
      description: faker.finance.transactionDescription(),
      type: currentType as 'debit' | 'credit',
      email: senderInfo.email,
      channel: faker.helpers.arrayElement([
        'ACCOUNT_COLLECTION_ID-we',
        'ACCOUNT_COLLECTION_ID-mobile',
        'atm',
        'in-person',
        'wire',
        'ACH transfer',
      ]),
      category: faker.helpers.arrayElement([
        'shopping',
        'food',
        'transport',
        'logistics / delivery',
        'utilities',
        'entertainment',
        'travel',
        'donations',
      ]),
      accountNo:
        currentType === 'debit' ? senderAccount.accountNumber : faker.finance.accountNumber(),
      // routingNo: currentType === 'debit' ? senderAccount.routingNumber : randomBank?.routing || '',
      routingNo: currentType === 'debit' ? 'Horizon Bank LLC' : randomBank.routing,
      recipientName:
        currentType === 'debit'
          ? senderInfo.firstname + ' ' + senderInfo.lastname
          : faker.finance.accountName(),
      // recipientBank: currentType === 'debit' ? 'Horizon Bank LLC Na' : randomBank?.bank || '',
      recipientBank: currentType === 'debit' ? 'Horizon Bank LLC' : randomBank.bank,
      amount: randomAmount,
      receiverAccountId:
        currentType === 'debit' ? generateReceiverAccountId(11) : senderAccount.$id,
      senderAccountId: currentType === 'debit' ? senderAccount.$id : generateReceiverAccountId(11),
      userId: senderInfo.userId,
      // $createdAt: generateOneRandomDateWithConstraints(inputdata.month, inputdata.year, state),
      $createdAt: '10-1-2000',
      status: faker.helpers.arrayElement(['pending', 'approved', 'declined']),
    };

    transactions.push(transaction);
  }

  return transactions;
}

export const saveTransactionsToAppwrite = async (transactions: Transaction[]) => {
  try {
    const {database} = await createAdminClient();

    await Promise.all(
      transactions.map((transaction: Transaction) =>
        database.createDocument(DATABASE_ID!, TRANSACTION_COLLECTION_ID!, ID.unique(), {
          ...transaction,
        })
      )
    );

    return parseStringify(transactions);
  } catch (error) {
    console.error('Error saving transaction:', error);
    throw new Error('Failed to save transactions to Appwrite');
  }
};

// export async function saveTransactionsToAppwrite(transactions: Transaction[]): Promise<void> {
//   try {
//     const {database} = await createAdminClient();

//     // Convert transactions to plain JSON objects
//     const plainTransactions = transactions.map((transaction) =>
//       JSON.parse(JSON.stringify(transaction))
//     );

//     await Promise.all(
//       plainTransactions.map((transaction) =>
//         database.createDocument(DATABASE_ID!, TRANSACTION_COLLECTION_ID!, ID.unique(), {
//           ...transaction,
//         })
//       )
//     );

//     return; // No need to return transactions
//   } catch (error) {
//     console.error('Error saving transaction:', error);
//     throw new Error('Failed to save transactions to Appwrite');
//   }
// }
