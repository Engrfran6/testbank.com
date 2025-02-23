import {Account, User} from '@/types';
import {Document, Image, Page, StyleSheet, Text, View} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    padding: 40,
    fontSize: 10,
  },
  accountHeader: {
    backgroundColor: '#ffffff',
    padding: 40,
    display: 'flex',
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
    borderBottom: 1,
    borderBottomColor: '#cccccc',
    paddingBottom: 10,
  },
  headerLeft: {
    flexDirection: 'column',
  },
  headerRight: {
    width: 80,
    height: 80,
  },
  bankName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  accountInfo: {
    flexDirection: 'row',
    gap: 10,
    color: '#666666',
  },
  addressSection: {
    marginBottom: 30,
  },
  contactSection: {
    border: 1,
    borderColor: '#cccccc',
    padding: 15,
    marginBottom: 30,
  },
  contactTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  contactText: {
    marginBottom: 5,
  },
  mainContent: {
    flexDirection: 'row',
    gap: 20,
  },
  leftColumn: {
    flex: 2,
  },
  rightColumn: {
    flex: 1,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
    borderBottom: 1,
    borderBottomColor: '#cccccc',
    paddingBottom: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 8,
    color: '#666666',
  },
  bold: {
    fontWeight: 'bold',
  },
});

interface TransferReceiptProps {
  transaction: {
    senderAccountId: string;
    receiverAccountId: string;
    accountNo: string;
    routingNo: string;
    recipientName: string;
    recipientBank: string;
    amount: number;
    email: string;
  };
  user: User;
  accounts: Account[];
}

const TransferReceiptPDF = ({transaction, user, accounts}: TransferReceiptProps) => {
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const transactionId = Math.random().toString(36).slice(2, 9).toUpperCase();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.bankName}>
              Horizon Bank Transfer Receipt •{' '}
              {accounts.map((a) =>
                a.$id === transaction.senderAccountId && a.subType ? 'Savings' : 'Checking'
              )}
            </Text>
            <View style={styles.accountInfo}>
              <Text>Transaction ID: {transactionId}</Text>
              <Text>•</Text>
              <Text>{formattedDate}</Text>
              <Text>•</Text>
              <Text>Page 1 of 1</Text>
            </View>
          </View>
          <Image style={styles.headerRight} src="/placeholder.svg?height=80&width=80" />
        </View>
        <View style={styles.accountHeader}>
          {/* Sender Address */}
          <View style={styles.addressSection}>
            <Text>Sender ID: {user.name}</Text>
            <Text>Sender ID: {user.address1}</Text>
            <Text style={styles.bold}>{transaction.email}</Text>
            <Text>Sender ID: {transaction.senderAccountId}</Text>
          </View>
          {/* Contact Information */}
          <View style={styles.contactSection}>
            <Text style={styles.contactTitle}>Questions?</Text>
            <Text style={styles.contactText}>Available by phone 24 hours a day, 7 days a week</Text>
            <Text style={styles.contactText}>1-800-HORIZON (1-800-467-4966)</Text>
            <Text style={styles.contactText}>TTY: 1-800-877-4833</Text>
            <Text style={styles.contactText}>En español: 1-877-727-2932</Text>
            <Text style={styles.contactText}>Online: horizonbank.com</Text>
          </View>
        </View>

        <View style={styles.mainContent}>
          <View style={styles.leftColumn}>
            {/* Transfer Summary */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Transfer Summary</Text>
              <View style={styles.row}>
                <Text>Transfer Amount</Text>
                <Text style={styles.bold}>${transaction.amount.toFixed(2)}</Text>
              </View>
              <View style={styles.row}>
                <Text>Transfer Date</Text>
                <Text>{formattedDate}</Text>
              </View>
              <View style={styles.row}>
                <Text>Transfer Status</Text>
                <Text style={styles.bold}>Completed</Text>
              </View>
            </View>

            {/* Recipient Details */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recipient Details</Text>
              <View style={styles.row}>
                <Text>Recipient Name</Text>
                <Text>{transaction.recipientName}</Text>
              </View>
              <View style={styles.row}>
                <Text>Recipient Bank</Text>
                <Text>{transaction.recipientBank}</Text>
              </View>
              <View style={styles.row}>
                <Text>Account Number</Text>
                <Text>{transaction.accountNo}</Text>
              </View>
              <View style={styles.row}>
                <Text>Routing Number</Text>
                <Text>{transaction.routingNo}</Text>
              </View>
            </View>
          </View>

          <View style={styles.rightColumn}>
            {/* Account Information */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Account Information</Text>
              <Text style={styles.bold}>Account number: {'user account number here'}</Text>
              <Text style={styles.bold}>{`${user.firstname} ${user.lastname}`}</Text>
              <Text style={styles.bold}>Colorado account terms and conditions apply</Text>
              <Text style={styles.bold}>Transaction ID: {transactionId}</Text>
              <Text>For Direct Deposit use</Text>
              <Text>Routing Number (RTN): {'user routing number here'}</Text>
            </View>
          </View>
        </View>
        {/* Footer */}
        <View style={styles.footer}>
          <Text>Sheet Seq = 0000001</Text>
          <Text>Sheet 00001 of 00001</Text>
        </View>
      </Page>
    </Document>
  );
};

export default TransferReceiptPDF;
