import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import './styles.css';

const GeneralModal = ({ isOpen, onClose, title, children, footerActions }) => {
    if (!isOpen) return null;

    return (
        <Modal
            show={isOpen}
            onHide={onClose}
            centered
            dialogClassName="custom-modal"
        >
            <Modal.Header closeButton className="custom-modal-header">
            <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="custom-modal-body">
            {children}
            </Modal.Body>
            <Modal.Footer className="custom-modal-footer">
            {footerActions}
            </Modal.Footer>
        </Modal>
    );
};

export default GeneralModal;
