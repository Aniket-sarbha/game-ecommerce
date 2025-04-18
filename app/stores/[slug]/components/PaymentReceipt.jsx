// components/PaymentReceipt.jsx
import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Format date function
const formatDate = (dateString) => {
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
  },
  headerText: {
    textAlign: 'right',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#4F46E5',
  },
  section: {
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6B7280',
  },
  value: {
    fontSize: 12,
    maxWidth: '60%',
    textAlign: 'right',
  },
  footer: {
    marginTop: 30,
    textAlign: 'center',
    fontSize: 10,
    color: '#9CA3AF',
  },
  successful: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    padding: 8,
    backgroundColor: '#D1FAE5',
    borderRadius: 4,
  },
  storeName: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#4F46E5',
    marginBottom: 10,
  },
});

// Create Document Component
const PaymentReceipt = ({ data }) => {
  const currentDate = formatDate(data.paymentDate || new Date());
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#4F46E5' }}>
              Moba Legends
            </Text>
            <Text style={{ fontSize: 10, color: '#6B7280', marginTop: 5 }}>
              www.mobalegends.in
            </Text>
          </View>
          <View style={styles.headerText}>
            <Text style={{ fontSize: 14, fontWeight: 'bold' }}>PAYMENT RECEIPT</Text>
            <Text style={{ fontSize: 10, color: '#6B7280', marginTop: 4 }}>
              {currentDate}
            </Text>
          </View>
        </View>

        <Text style={styles.title}>Payment Receipt</Text>
        
        <Text style={styles.successful}>Payment Successful</Text>

        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>Transaction ID</Text>
            <Text style={styles.value}>{data.transactionId}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Amount</Text>
            <Text style={styles.value}>{data.amount}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Customer Name</Text>
            <Text style={styles.value}>{data.userId || 'Guest User'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Payment For</Text>
            <Text style={styles.value}>{data.storeName || `Order for Store ${data.storeId}`}</Text>
          </View>
          {data.serverId && (
            <View style={styles.row}>
              <Text style={styles.label}>Server ID</Text>
              <Text style={styles.value}>{data.serverId}</Text>
            </View>
          )}
          {data.server && (
            <View style={styles.row}>
              <Text style={styles.label}>Server</Text>
              <Text style={styles.value}>{data.server}</Text>
            </View>
          )}
          {data.promoCode && (
            <View style={styles.row}>
              <Text style={styles.label}>Promo Code</Text>
              <Text style={styles.value}>{data.promoCode}</Text>
            </View>
          )}
          <View style={styles.row}>
            <Text style={styles.label}>Payment Date</Text>
            <Text style={styles.value}>{currentDate}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Status</Text>
            <Text style={styles.value}>Successful</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text>Thank you for your purchase!</Text>
          <Text style={{ marginTop: 5 }}>For any questions, please contact support@mobalegends.in</Text>
          <Text style={{ marginTop: 15 }}>© {new Date().getFullYear()} Moba Legends. All rights reserved.</Text>
        </View>
      </Page>
    </Document>
  );
};

export default PaymentReceipt;