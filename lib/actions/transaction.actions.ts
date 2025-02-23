'use server';

import {CreateTransactionProps, getTransactionsByIdProps, getTransactionsProps} from '@/types';
import {ID, Query} from 'node-appwrite';
import {createAdminClient} from '../appwrite';
import {parseStringify} from '../utils';

const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_TRANSACTION_COLLECTION_ID: TRANSACTION_COLLECTION_ID,
} = process.env;

export const createTransaction = async (transaction: CreateTransactionProps) => {
  try {
    const {database} = await createAdminClient();

    const newTransaction = await database.createDocument(
      DATABASE_ID!,
      TRANSACTION_COLLECTION_ID!,
      ID.unique(),
      {
        ...transaction,
      }
    );

    return parseStringify(newTransaction);
  } catch (error) {
    console.log(error);
  }
};

export const getTransactionsById = async ({accountId}: getTransactionsByIdProps) => {
  try {
    const {database} = await createAdminClient();

    const senderTransactions = await database.listDocuments(
      DATABASE_ID!,
      TRANSACTION_COLLECTION_ID!,
      [Query.equal('senderAccountId', accountId)]
    );

    const receiverTransactions = await database.listDocuments(
      DATABASE_ID!,
      TRANSACTION_COLLECTION_ID!,
      [Query.equal('receiverAccountId', accountId), Query.orderDesc('$createdAt')]
    );

    const transactions = {
      total: senderTransactions.total + receiverTransactions.total,
      documents: [...senderTransactions.documents, ...receiverTransactions.documents],
    };

    return parseStringify(transactions);
  } catch (error) {
    console.log(error);
  }
};

export const getTransactions = async ({accountId}: getTransactionsProps) => {
  let hasMore = true;
  let transactions: any = [];
  let offset = 0;
  const limit = 10; // Number of documents to fetch per request (adjust as needed)

  try {
    const {database} = await createAdminClient();

    while (hasMore) {
      // Fetch a chunk of transactions using limit and offset
      const response = await database.listDocuments(DATABASE_ID!, TRANSACTION_COLLECTION_ID!, [
        Query.equal('senderAccountId', accountId), // Filter by accountId
        Query.limit(limit), // Limit number of documents fetched
        Query.offset(offset), // Skip documents for pagination
        Query.orderDesc('$createdAt'),
      ]);

      // Map the transactions to your desired structure
      transactions = response.documents.map((transaction: any) => ({
        $id: transaction.$id,
        name: transaction.name,
        type: transaction.type,
        amount: transaction.amount,
        pending: transaction.pending,
        $createdAt: transaction.$createdAt,
      }));

      // Add the fetched transactions to the main array
      transactions = [...transactions];

      // Check if there are more documents to fetch
      hasMore = response.documents.length === limit;

      // Increment the offset for the next page
      offset += limit;
    }

    return parseStringify(transactions); // Return formatted transactions
  } catch (error) {
    console.error('An error occurred while fetching transactions:', error);
    return [];
  }
};

export const getAdminTransactions = async (senderAccountId: string) => {
  try {
    const {database} = await createAdminClient();

    // Fetch a chunk of transactions using limit and offset
    const transactions = await database.listDocuments(DATABASE_ID!, TRANSACTION_COLLECTION_ID!, [
      Query.equal('senderAccountId', [senderAccountId]),
      Query.orderDesc('$createdAt'),
    ]);

    return parseStringify(transactions.documents); // Return formatted transactions
  } catch (error) {
    console.error('An error occurred while fetching transactions:', error);
    return [];
  }
};

export const deleteTransaction = async ({documentId}: {documentId: string}) => {
  try {
    const {database} = await createAdminClient();

    await database.deleteDocument(DATABASE_ID!, TRANSACTION_COLLECTION_ID!, documentId);

    return {message: 'transaction deleted successfully'};
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return {error: 'Failed to delete transaction'};
  }
};

export const updateTransaction = async ({
  documentId,
  updates,
}: {
  documentId: string;
  updates: Partial<CreateTransactionProps>;
}) => {
  try {
    const {database} = await createAdminClient();

    const updatedAccount = await database.updateDocument(
      DATABASE_ID!,
      TRANSACTION_COLLECTION_ID!!,
      documentId,
      updates
    );

    return parseStringify(updatedAccount);
  } catch (error) {
    console.error('Error updating transaction:', error);
    return {error: 'Failed to update transaction'};
  }
};

export const createAdminTransactionByAccountId = async (
  accountId: string,
  transaction: CreateTransactionProps
) => {
  try {
    const {database} = await createAdminClient();

    const newTransaction = await database.createDocument(
      DATABASE_ID!,
      TRANSACTION_COLLECTION_ID!,
      ID.unique(),
      {
        accountId,
        ...transaction,
      }
    );

    return parseStringify(newTransaction);
  } catch (error) {
    console.log(error);
  }
};
