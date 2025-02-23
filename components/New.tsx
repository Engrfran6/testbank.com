import {Document, Page, PDFDownloadLink, Text, usePDF} from '@react-pdf/renderer';

const MyDocument = () => {
  return (
    <Document>
      <Page>
        <Text>This is working</Text>
      </Page>
    </Document>
  );
};

const App = () => {
  // this returns {loading,blob,url,error}
  const [pdf] = usePDF({
    document: <MyDocument />, // pass your document
  });

  return (
    <PDFDownloadLink document={<MyDocument />} fileName="Report Testing">
      {pdf.blob ? 'Download PDF' : 'Loading...'}
    </PDFDownloadLink>
  );
};

export default App;
