import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const position = "top-right";
const autoClose = 5000;

export function notifyError(message) {
    toast.error(message, {
        position: position,
        autoClose: autoClose,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    });
}

export function notifySuccess(message) {
    toast.success(message, {
        position: position,
        autoClose: autoClose,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    });
}