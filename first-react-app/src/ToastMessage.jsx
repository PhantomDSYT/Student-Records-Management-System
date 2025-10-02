import React from "react";
import {Toast, ToastContainer} from 'react-bootstrap'

const ToastMessage = ({ show, onClose, message, variant = 'success'}) => {
    return (
        <ToastContainer position="bottom-end" className="p-3">
            <Toast show={show} onClose={onClose} bg={variant} delay={3000} autohide>
                <Toast.Body className="text-white">{message}</Toast.Body>
            </Toast>
        </ToastContainer>
    );
};

export default ToastMessage;