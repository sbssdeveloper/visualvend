import { useState } from 'react';
import DocumentPicker from 'react-native-document-picker';
const useDocumentPicker = () => {
  const [document, setDocument] = useState(null);
  const [error, setError] = useState(null);

  const selectDocument = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      setDocument(res);
      setError(null);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        setError(null);
      } else {
        // Unknown error
        setError(err);
      }
      setDocument(null);
    }
  };

  return {
    document,
    error,
    selectDocument,
  };
};

export default useDocumentPicker;
