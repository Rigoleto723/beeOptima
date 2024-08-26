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
            <Modal.Title className="custom-modal-title" >{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="custom-modal-body">
            {children}
            </Modal.Body>
            <Modal.Footer className="custom-modal-footer">
            <div className="btn-container">
                <Button className="btn-secondary" onClick={onClose}>Cancelar</Button>
                <Button className="btn-done">{footerActions}</Button>
            </div>
            
            </Modal.Footer>
        </Modal>
    );
};

export default GeneralModal;
