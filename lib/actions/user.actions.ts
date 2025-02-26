'use server';

import {cookies} from 'next/headers';
import {ID, Query} from 'node-appwrite';
import {createAdminClient, createSessionClient} from '../appwrite';
import {generateAccountNumber, generateCardDetails, parseStringify} from '../utils';

import {
  Account,
  SignUpParams,
  User,
  createBankAccountProps,
  createCardProps,
  getBankByAccountIdProps,
  getBankProps,
  getBanksProps,
  getCardProps,
  getUserAccountProps,
  getUserInfoProps,
  signInProps,
} from '@/types';

const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
  APPWRITE_ACCOUNT_COLLECTION_ID: ACCOUNT_COLLECTION_ID,
  APPWRITE_TRANSACTION_COLLECTION_ID: TRANSACTION_COLLECTION_ID,
  APPWRITE_CARD_COLLECTION_ID: CARD_COLLECTION_ID,
} = process.env;

export const getUserInfo = async ({userId}: getUserInfoProps) => {
  try {
    const {database} = await createAdminClient();

    const user = await database.listDocuments(DATABASE_ID!, USER_COLLECTION_ID!, [
      Query.equal('userId', [userId]),
    ]);

    return parseStringify(user.documents[0]);
  } catch (error) {
    console.log(error);
  }
};

export async function getLoggedInUser() {
  try {
    const {account} = await createSessionClient();
    const result = await account.get();

    const user = await getUserInfo({userId: result.$id});

    return parseStringify(user);
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function routeByRole() {
  const {account} = await createSessionClient();
  const result = await account.get();

  return result;
}

export const signIn = async ({email, password}: signInProps) => {
  try {
    const {account} = await createAdminClient();
    const session = await account.createEmailPasswordSession(email, password);

    (await cookies()).set('appwrite-session', session.secret, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
    });

    const user = await getUserInfo({userId: session.userId});

    return parseStringify(user);
  } catch (error) {
    console.error('Error', error);
  }
};

// export async function labelUpdate() {
//   const {account} = await createAdminClient();

//   const prefs = account.getPrefs();

//   const result = await account.updatePrefs({label: 'user'});

//   console.log('result from label', result);
//   console.log('pref from label', prefs);

//   return result;

export async function labelUpdate(userId: string) {
  try {
    // Use the session client instead of the admin client
    const {user} = await createAdminClient();

    const result = await user.updateLabels(userId, ['userytyt']); // Set labels to ['user']
    console.log('Labels updated successfully:', result);

    return result;
  } catch (error) {
    console.error('Error updating preferences:', error);
    throw error; // Re-throw the error for handling in the calling function
  }
}
// }

export const signUp = async ({password, ...userData}: SignUpParams) => {
  const {email, firstname, lastname} = userData;

  let newUserAccount;

  try {
    const {account, database, user} = await createAdminClient();

    newUserAccount = await account.create(ID.unique(), email, password, `${firstname} ${lastname}`);

    const userId = newUserAccount.$id;

    await user.updateLabels(userId, ['user']);

    if (!newUserAccount) throw new Error('Error creating user');

    const newUser = await database.createDocument(DATABASE_ID!, USER_COLLECTION_ID!, ID.unique(), {
      ...userData,
      userId: newUserAccount.$id,
    });

    const savingAccountNo = generateAccountNumber();
    const currentAccountNo = generateAccountNumber();

    const savingsAccount = await createUserAccount({
      userId: newUserAccount.$id,
      accountNumber: savingAccountNo,
    });
    if (!savingsAccount) return 'failed to create a savings account for this user';

    const checkingAccount = await createUserAccount({
      userId: newUserAccount.$id,
      accountNumber: currentAccountNo,
      subType: 'checking',
    });
    if (!checkingAccount) return 'failed to create a checking account for this user';

    const visacard = generateCardDetails('Visa');
    const mastercard = generateCardDetails('MasterCard');

    const savingCard = await createUserCard({
      userId: newUserAccount.$id,
      accountId: savingsAccount?.$id,
      type: mastercard.cardType,
      mask: mastercard.cardNumber,
      cvv: mastercard.cvv,
      pin: mastercard.pin,
    });

    if (!savingCard) return 'failed to create a saving account card for this account';

    const checkingCard = await createUserCard({
      userId: newUserAccount.$id,
      accountId: checkingAccount?.$id,
      type: visacard.cardType,
      mask: visacard.cardNumber,
      cvv: visacard.cvv,
      pin: visacard.pin,
    });

    if (!checkingCard) return 'failed to create a checking account card for this account';

    return parseStringify(newUser.$id);
  } catch (error) {
    console.error('Error', error);
  }
};

export const logoutAccount = async () => {
  try {
    const {account} = await createSessionClient();

    (await cookies()).delete('appwrite-session');

    await account.deleteSession('current');
  } catch (error) {
    return null;
  }
};

export const createUserCard = async ({
  userId,
  accountId,
  type,
  mask,
  cvv,
  pin,
}: createCardProps) => {
  try {
    const {database} = await createAdminClient();

    const accountCard = await database.createDocument(
      DATABASE_ID!,
      CARD_COLLECTION_ID!,
      ID.unique(),
      {
        userId,
        accountId,
        type,
        mask,
        cvv,
        pin,
      }
    );

    return parseStringify(accountCard);
  } catch (error) {
    console.log(error);
  }
};

export const getUserCards = async ({userId}: getCardProps) => {
  try {
    const {database} = await createAdminClient();

    const userCard = await database.listDocuments(DATABASE_ID!, CARD_COLLECTION_ID!, [
      Query.equal('userId', [userId]),
    ]);

    return parseStringify(userCard.documents);
  } catch (error) {
    console.log(error);
  }
};

export const getUserCardById = async (documentId: string) => {
  try {
    const {database} = await createAdminClient();

    const userCard = await database.listDocuments(DATABASE_ID!, CARD_COLLECTION_ID!, [
      Query.equal('$id', [documentId]),
    ]);

    return parseStringify(userCard.documents[0]);
  } catch (error) {
    console.log(error);
  }
};

export const createUserAccount = async ({
  userId,
  subType,
  accountNumber,
}: createBankAccountProps) => {
  try {
    const {database} = await createAdminClient();

    const bankAccount = await database.createDocument(
      DATABASE_ID!,
      ACCOUNT_COLLECTION_ID!,
      ID.unique(),
      {
        userId,
        subType,
        accountNumber,
      }
    );

    return parseStringify(bankAccount);
  } catch (error) {
    console.log(error);
  }
};

export const getUserAccounts = async ({userId}: getBanksProps) => {
  try {
    const {database} = await createAdminClient();

    const accounts = await database.listDocuments(DATABASE_ID!, ACCOUNT_COLLECTION_ID!, [
      Query.equal('userId', [userId]),
    ]);

    return parseStringify(accounts.documents);
  } catch (error) {
    console.log(error);
  }
};

export const getUserAccount = async ({documentId}: getBankProps) => {
  try {
    const {database} = await createAdminClient();

    const account = await database.listDocuments(DATABASE_ID!, ACCOUNT_COLLECTION_ID!, [
      Query.equal('$id', [documentId]),
    ]);

    return parseStringify(account.documents[0]);
  } catch (error) {
    console.log(error);
  }
};

export const getUserAccountByAccountId = async ({accountId}: getBankByAccountIdProps) => {
  try {
    const {database} = await createAdminClient();

    const account = await database.listDocuments(DATABASE_ID!, ACCOUNT_COLLECTION_ID!, [
      Query.equal('accountId', [accountId]),
    ]);

    if (account.total !== 1) return null;

    return parseStringify(account.documents[0]);
  } catch (error) {
    console.log(error);
  }
};

export const getUserTransactions = async ({userId}: getUserAccountProps) => {
  try {
    const {database} = await createAdminClient();

    const transactions = await database.listDocuments(DATABASE_ID!, TRANSACTION_COLLECTION_ID!, [
      Query.equal('userId', [userId]),
    ]);

    return parseStringify(transactions.documents);
  } catch (error) {
    console.log(error);
  }
};

export const deleteUserAccount = async ({documentId}: {documentId: string}) => {
  try {
    const {database} = await createAdminClient();

    await database.deleteDocument(DATABASE_ID!, USER_COLLECTION_ID!, documentId);

    return {message: 'User account deleted successfully'};
  } catch (error) {
    console.error('Error deleting user account:', error);
    return {error: 'Failed to delete user account'};
  }
};

export const updateUserAccount = async ({
  documentId,
  updates,
}: {
  documentId: string;
  updates: Partial<User>;
}) => {
  try {
    const {database} = await createAdminClient();

    const updatedAccount = await database.updateDocument(
      DATABASE_ID!,
      USER_COLLECTION_ID!!,
      documentId,
      updates
    );

    return parseStringify(updatedAccount);
  } catch (error) {
    console.error('Error updating user account:', error);
    return {error: 'Failed to update user account'};
  }
};

export const getAllUsers = async () => {
  try {
    const {database} = await createAdminClient();

    // Fetch all documents in the `USER_COLLECTION_ID` collection
    const users = await database.listDocuments(DATABASE_ID!, USER_COLLECTION_ID!, [
      Query.orderDesc('$createdAt'),
    ]);

    // Parse and return the documents
    return users.documents.map((doc) => parseStringify(doc));
  } catch (error) {
    console.error('Error fetching all users:', error);
    return [];
  }
};

export const deleteAccount = async ({documentId}: {documentId: string}) => {
  try {
    const {database} = await createAdminClient();

    await database.deleteDocument(DATABASE_ID!, ACCOUNT_COLLECTION_ID!, documentId);

    return {message: 'User account deleted successfully'};
  } catch (error) {
    console.error('Error deleting user account:', error);
    return {error: 'Failed to delete user account'};
  }
};

export const updateAccount = async ({
  documentId,
  updates,
}: {
  documentId: string;
  updates: Partial<Account>;
}) => {
  try {
    const {database} = await createAdminClient();

    const updatedAccount = await database.updateDocument(
      DATABASE_ID!,
      ACCOUNT_COLLECTION_ID!,
      documentId,
      updates
    );

    return parseStringify(updatedAccount);
  } catch (error) {
    return {error: 'Failed to update user account'};
  }
};

export const updateUser = async ({userId, updates}: {userId: string; updates: Partial<any>}) => {
  try {
    const {database} = await createAdminClient();

    const updatedUser = await database.updateDocument(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      userId,
      updates
    );

    return parseStringify(updatedUser);
  } catch (error) {
    console.error(error || {error: 'Failed to update user account info'});
  }
};

export const updateUserWithPin = async ({
  documentId,
  updates,
}: {
  documentId: string;
  updates: Partial<any>;
}) => {
  try {
    const {database} = await createAdminClient();

    const updatedUser = await database.updateDocument(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      documentId,
      updates
    );

    return parseStringify(updatedUser);
  } catch (error) {
    console.error(error || {error: 'Failed to update user account info'});
  }
};

export async function processUserVerification(user: User) {
  try {
    // const today = new Date().toISOString().split('T')[0];
    const {database} = await createAdminClient();

    const documentId = user.$id;

    if (user.verification === 'Verified' && !user.verificationProcessed === true) {
      // Update user record to prevent function from running again
      await database.updateDocument(DATABASE_ID!, USER_COLLECTION_ID!, documentId, {
        verificationProcessed: true,
      });

      console.log('Verification process executed successfully.');

      return true;
    }
  } catch (error) {
    console.error('Error processing verification:', error);
  }
  return false;
}
