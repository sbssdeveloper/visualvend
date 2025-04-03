import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const showSuccessToast = (message) => {
  toast.success(message, {
    position: 'top-right',
  });
};

export const showErrorToast = (message) => {
  toast.error(message, {
    position: 'top-right',
  });
};

export const showWarningToast = (message) => {
  toast.warning(message, {
    position: 'top-right',
  });
};

export const showInfoToast = (message) => {
  toast.info(message, {
    position: 'top-right',
  });
};
