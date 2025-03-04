/* eslint-disable no-prototype-builtins */
import {AccountTypes, CategoryCount, Transaction} from '@/types';
import {type ClassValue, clsx} from 'clsx';
import qs from 'query-string';
import {twMerge} from 'tailwind-merge';
import {z} from 'zod';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// FORMAT DATE TIME
export const formatDateTime = (dateString: Date) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short', // abbreviated weekday name (e.g., 'Mon')
    month: 'short', // abbreviated month name (e.g., 'Oct')
    day: 'numeric', // numeric day of the month (e.g., '25')
    hour: 'numeric', // numeric hour (e.g., '8')
    minute: 'numeric', // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };

  const dateDayOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short', // abbreviated weekday name (e.g., 'Mon')
    year: 'numeric', // numeric year (e.g., '2023')
    month: '2-digit', // abbreviated month name (e.g., 'Oct')
    day: '2-digit', // numeric day of the month (e.g., '25')
  };

  const dateOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric', // numeric day of the month (e.g., '25')
    month: 'short', // abbreviated month name (e.g., 'Oct')
    year: 'numeric', // numeric year (e.g., '2023')
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric', // numeric hour (e.g., '8')
    minute: 'numeric', // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };

  const formattedDateTime: string = new Date(dateString).toLocaleString('en-US', dateTimeOptions);

  const formattedDateDay: string = new Date(dateString).toLocaleString('en-US', dateDayOptions);

  const formattedDate: string = new Date(dateString).toLocaleString('en-US', dateOptions);

  const formattedTime: string = new Date(dateString).toLocaleString('en-US', timeOptions);

  return {
    dateTime: formattedDateTime,
    dateDay: formattedDateDay,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};

export function formatDateT(dateString: string): string {
  const date = new Date(dateString);

  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };

  const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);

  // Adjust the format to "12 May 2000 10:30 PM"
  return formattedDate.replace(/,/, ''); // Removes the comma after the date
}

export function formatAmount(amount: number): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });

  return formatter.format(amount);
}

export const parseStringify = (value: any) => JSON.parse(JSON.stringify(value));

export const removeSpecialCharacters = (value: string) => {
  return value.replace(/[^\w\s]/gi, '');
};

interface UrlQueryParams {
  params: string;
  key: string;
  value: string;
}

export function formUrlQuery({params, key, value}: UrlQueryParams) {
  const currentUrl = qs.parse(params);

  currentUrl[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    {skipNull: true}
  );
}

export function getAccountTypeColors(type: AccountTypes) {
  switch (type) {
    case 'depository':
      return {
        bg: 'bg-blue-25',
        lightBg: 'bg-blue-100',
        title: 'text-blue-900',
        subText: 'text-blue-700',
      };

    case 'credit':
      return {
        bg: 'bg-success-25',
        lightBg: 'bg-success-100',
        title: 'text-success-900',
        subText: 'text-success-700',
      };

    default:
      return {
        bg: 'bg-green-25',
        lightBg: 'bg-green-100',
        title: 'text-green-900',
        subText: 'text-green-700',
      };
  }
}

export function countTransactionCategories(transactions: Transaction[]): CategoryCount[] {
  const categoryCounts: {[category: string]: number} = {};
  let totalCount = 0;

  // Iterate over each transaction
  transactions &&
    transactions.forEach((transaction) => {
      // Extract the category from the transaction
      const category = transaction.category;

      // If the category exists in the categoryCounts object, increment its count
      if (categoryCounts.hasOwnProperty(category)) {
        categoryCounts[category]++;
      } else {
        // Otherwise, initialize the count to 1
        categoryCounts[category] = 1;
      }

      // Increment total count
      totalCount++;
    });

  // Convert the categoryCounts object to an array of objects
  const aggregatedCategories: CategoryCount[] = Object.keys(categoryCounts).map((category) => ({
    name: category,
    count: categoryCounts[category],
    totalCount,
  }));

  // Sort the aggregatedCategories array by count in descending order
  aggregatedCategories.sort((a, b) => b.count - a.count);

  return aggregatedCategories;
}

export function extractCustomerIdFromUrl(url: string) {
  // Split the URL string by '/'
  const parts = url.split('/');

  // Extract the last part, which represents the customer ID
  const customerId = parts[parts.length - 1];

  return customerId;
}

export function encryptId(id: string) {
  return btoa(id);
}

export function decryptId(id: string) {
  return atob(id);
}

export const getTransactionStatus = (date: Date, status: string) => {
  const today = new Date();
  const twoDaysAgo = new Date(today);
  twoDaysAgo.setDate(today.getHours() - 1 / 2);

  return date > twoDaysAgo ? 'Processing' : status;
};

export const authFormSchema = (type: string) =>
  z.object({
    // sign up
    firstName: type === 'sign-in' ? z.string().optional() : z.string().min(3),
    lastName: type === 'sign-in' ? z.string().optional() : z.string().min(3),
    address1: type === 'sign-in' ? z.string().optional() : z.string().max(50),
    city: type === 'sign-in' ? z.string().optional() : z.string().max(20),
    state: type === 'sign-in' ? z.string().optional() : z.string().min(2).max(20),
    postalCode: type === 'sign-in' ? z.string().optional() : z.string().min(3).max(6),
    // dateOfBirth: type === 'sign-in' ? z.string().optional() : z.string().min(3),
    // ssn: type === 'sign-in' ? z.string().optional() : z.string().min(10).max(10),
    phone: type === 'sign-in' ? z.string().optional() : z.string().min(10).max(11),
    country: type === 'sign-in' ? z.string().optional() : z.string().min(2).max(20),
    // both
    email: z.string().email(),
    password: z.string().min(8),
  });

export function getDaysLeft(endDate: Date): string {
  const today = new Date();
  const diffTime = endDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return '1d left';
  if (diffDays < 0) return 'Expired';
  return `${diffDays}d left`;
}

// export function maskEmail(email: string): string {
//   const [username, domain] = email.split('@');
//   if (username.length <= 2) {
//     // Handle short usernames
//     return `${username[0]}*****@${domain}`;
//   }
//   const maskedUsername = `${username[0]}*****${username.slice(-1)}`;
//   return `${maskedUsername}@${domain}`;
// }

export function maskEmail(email: string): string {
  // Check if email is undefined or not a string
  if (!email || typeof email !== 'string') {
    return '';
  }

  const [username, domain] = email.split('@');

  // Check if the split resulted in valid parts
  if (!username || !domain) {
    return '';
  }

  if (username.length <= 2) {
    // Handle short usernames
    return `${username[0]}*****@${domain}`;
  }

  // Default masking logic
  const maskedUsername = username[0] + '*'.repeat(username.length - 2) + username.slice(-1);
  return `${maskedUsername}@${domain}`;
}

export function maskSSN(ssn: string): string {
  if (ssn.length < 4) {
    throw new Error('Invalid SSN format');
  }
  return `***-**-${ssn.slice(-4)}`;
}

export function maskPhone(phone: string): string {
  // Ensure the input is a string and has at least 4 characters
  if (typeof phone !== 'string' || phone.length < 4) {
    throw new Error('Invalid phone number');
  }

  // Extract the last 4 digits
  const lastFourDigits = phone.slice(-4);

  // Mask the rest of the phone number with asterisks
  const maskedPart = '*'.repeat(phone.length - 4);

  // Combine the masked part and the last 4 digits
  return maskedPart + lastFourDigits;
}

export function maskCardNumber(cardNumber: string): string {
  if (cardNumber.length < 16) {
    throw new Error('Invalid card number format');
  }
  return cardNumber.slice(0, -4).replace(/\d/g, '●') + cardNumber.slice(-4);
}

export function generateAccountNumber(): string {
  // Start with '200' and generate the remaining 8 digits
  const randomPart = Math.floor(Math.random() * 10_000_000)
    .toString()
    .padStart(8, '0');
  return `200${randomPart}`;
}

export function generateCardDetails(cardType: 'Visa' | 'MasterCard') {
  // Helper function to generate random numbers of a specific length
  const getRandomNumber = (length: number) => {
    return Array.from({length}, () => Math.floor(Math.random() * 10)).join('');
  };

  // Generate card number
  let cardNumber = '';
  if (cardType === 'Visa') {
    cardNumber = '4' + getRandomNumber(15); // Visa starts with 4
  } else if (cardType === 'MasterCard') {
    const masterCardPrefix = Math.floor(Math.random() * 5) + 51; // MasterCard prefixes: 51-55
    cardNumber = masterCardPrefix + getRandomNumber(14);
  }

  // Generate CVV (3 digits)
  const cvv = getRandomNumber(3);

  // Generate default PIN (4 digits)
  const pin = getRandomNumber(4);

  return {
    cardType,
    cardNumber,
    cvv,
    pin,
  };
}

export function generateReceiverAccountId(length: number): string {
  const characters = '0123456789abcdef'; // Hexadecimal characters
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export function generateRandomAmount(min: number, max: number): number {
  if (min > max) {
    throw new Error('Min value should not be greater than max value');
  }
  const scale = Math.random();
  if (scale < 0.2) {
    return Math.floor(Math.random() * Math.min(100, max - min + 1)) + min;
  } else if (scale < 0.5) {
    return Math.floor(Math.random() * Math.min(1000, max - min + 1)) + min;
  } else {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

export function generateOneRandomDateWithConstraints(
  month: number,
  year: number,
  state: {
    weekCounts: number[];
    dateFrequency: Record<number, number>;
    lastGeneratedDate: Date | null;
  }
): Date {
  const daysInMonth = new Date(year, month, 0).getDate();
  const getWeekday = (day: number): number => new Date(year, month - 1, day).getDay();
  let attempts = 0;
  const maxAttempts = 1000000; // Increased maximum attempts

  while (attempts < maxAttempts) {
    const randomDay = Math.floor(Math.random() * daysInMonth) + 1;
    const weekday = getWeekday(randomDay);

    const isGapSatisfied =
      !state.lastGeneratedDate || Math.abs(randomDay - state.lastGeneratedDate.getDate()) >= 1; // Reduced gap

    const isWeekLimitSatisfied = state.weekCounts[weekday] >= 1 && state.weekCounts[weekday] < 6; // Increased limit

    const isDateRepetitionSatisfied =
      !state.dateFrequency[randomDay] || state.dateFrequency[randomDay] < 5; // Increased repetition limit

    if (isGapSatisfied && isWeekLimitSatisfied && isDateRepetitionSatisfied) {
      const newDate = new Date(year, month - 1, randomDay);
      state.lastGeneratedDate = newDate;
      state.weekCounts[weekday]++;
      state.dateFrequency[randomDay] = (state.dateFrequency[randomDay] || 0) + 1;
      return newDate;
    }
    attempts++;
  }

  throw new Error('Failed to generate a date within the given constraints');
}

export const generatePin = (length: 4 | 6 = 4): string => {
  if (![4, 6].includes(length)) throw new Error('Length must be 4 or 6');

  return Math.floor(
    Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1)
  ).toString();
};
