import toast from "react-hot-toast";

// Track active toasts to prevent duplicates
const activeToasts = new Set<string>();

export const showToast = {
  success: (message: string) => {
    if (activeToasts.has(message)) return;

    activeToasts.add(message);
    const toastId = toast.success(message);

    // Remove from active set when toast dismisses
    setTimeout(() => {
      activeToasts.delete(message);
    }, 4000);

    return toastId;
  },

  error: (message: string) => {
    if (activeToasts.has(message)) return;

    activeToasts.add(message);
    const toastId = toast.error(message);

    // Remove from active set when toast dismisses
    setTimeout(() => {
      activeToasts.delete(message);
    }, 4000);

    return toastId;
  },

  loading: (message: string) => {
    if (activeToasts.has(message)) return;

    activeToasts.add(message);
    const toastId = toast.loading(message);

    return toastId;
  },

  dismiss: (toastId?: string) => {
    toast.dismiss(toastId);
  },

  dismissAll: () => {
    toast.dismiss();
    activeToasts.clear();
  },
};

export default showToast;
