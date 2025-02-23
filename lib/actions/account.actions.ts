'use server';

import {CountryCode} from 'plaid';

import {plaidClient} from '../plaid';
import {formatDateT, parseStringify} from '../utils';

import {
  Account,
  Transaction,
  createCardProps,
  getAccountProps,
  getAccountsProps,
  getInstitutionProps,
} from '@/types';
import {getTransactionsById} from './transaction.actions';
import {getUserAccount, getUserAccounts, getUserCards, getUserTransactions} from './user.actions';

// Get multiple bank accounts
export const getAccounts = async ({userId}: getAccountsProps) => {
  try {
    // get accounts from db
    const userAccounts = await getUserAccounts({userId});

    const accounts = await Promise.all(
      userAccounts?.map(async (acc: any) => {
        return {
          $id: acc.$id,
          availableBalance: acc.availableBalance!,
          currentBalance: acc.currentBalance!,
          name: acc.name,
          subType: acc.subType,
          status: acc.status,
          fraudAlert: acc.fraudAlert ? 'true' : 'false',
          accountNumber: acc.accountNumber,
          routingNumber: acc.routingNumber,
          transferlimit: acc.transferlimit,
          mintransfer: acc.mintransfer,
          userId: acc.userId,
          createdAt: formatDateT(acc.$createdAt),
          updateAt: formatDateT(acc.$updatedAt),
        };
      })
    );

    const totalBanks = accounts.length;
    const totalCurrentBalance = accounts.reduce(
      (total, account) => total + account.currentBalance,
      0
    );
    const totalAvalaibleBalance = accounts.reduce(
      (total, account) => total + account.availableBalance,
      0
    );

    const userCards = await getUserCards({userId});
    const cards = await Promise.all(
      userCards?.map(async (c: createCardProps) => ({
        accountId: c.accountId,
        userId: c.userId,
        cvv: c.cvv,
        pin: c.pin,
        type: c.type,
        mask: c.mask,
      }))
    );

    // Get transactions from db
    const transactions = await getUserTransactions({userId});

    // Get current month and year
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Filter transactions for the current month using $createdAt
    const monthlyTransactions = transactions.filter((transaction: any) => {
      if (!transaction.$createdAt) return false; // Ensure $createdAt exists

      const transactionDate = new Date(transaction.$createdAt);
      return (
        transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear
      );
    });

    // Calculate total credit and total debit for the current month
    const totalCredit = monthlyTransactions.reduce(
      (total: number, transaction: any) =>
        transaction.type === 'credit' ? total + transaction.amount : total,
      0
    );

    const totalDebit = monthlyTransactions.reduce(
      (total: number, transaction: any) =>
        transaction.type === 'debit' ? total + transaction.amount : total,
      0
    );

    return parseStringify({
      data: accounts,
      transactions,
      cards,
      totalBanks,
      totalAvalaibleBalance,
      totalCurrentBalance,
      totalCredit,
      totalDebit,
    });
  } catch (error) {
    console.error('An error occurred while getting the accounts:', error);
  }
};

// Get one bank account
export const getAccount = async ({accountId}: getAccountProps) => {
  try {
    // get bank from db
    const userAccount: Account = await getUserAccount({documentId: accountId});

    const account: Account = {
      $id: accountId,
      availableBalance: userAccount.availableBalance!,
      currentBalance: userAccount.currentBalance!,
      name: userAccount.name,
      subType: userAccount.subType! as string,
      active: userAccount.active,
      fraudAlert: userAccount.fraudAlert,
      accountNumber: userAccount.accountNumber,
      routingNumber: userAccount.routingNumber,
      userId: userAccount.userId,
      transferlimit: userAccount.transferlimit,
      createdAt: userAccount.createdAt,
      mintransfer: userAccount.mintransfer,
    };

    // get transfer transactions from appwrite
    const transactionsData = await getTransactionsById({
      accountId: accountId,
    });

    const debitAndCreditTransactions = transactionsData.documents.map(
      (transferData: Transaction) => ({
        $id: transferData.$id,
        senderAccountId: transferData.senderAccountId,
        amount: transferData.amount!,
        description: transferData.description,
        $createdAt: transferData.$createdAt,
        type: transferData.type,
        status: transferData.status,
      })
    );

    // sort transactions by date such that the most recent transaction is first
    const allTransactions = [...debitAndCreditTransactions].sort(
      (a, b) => new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime()
    );

    return parseStringify({
      data: account,
      transactions: allTransactions.filter((item) => item && item.$id),
    });
  } catch (error) {
    console.error('An error occurred while getting the account:', error);
  }
};

// Get bank info
export const getInstitution = async ({institutionId}: getInstitutionProps) => {
  try {
    const institutionResponse = await plaidClient.institutionsGetById({
      institution_id: institutionId,
      country_codes: ['US'] as CountryCode[],
    });

    const intitution = institutionResponse.data.institution;

    return parseStringify(intitution);
  } catch (error) {
    console.error('An error occurred while getting the accounts:', error);
  }
};
