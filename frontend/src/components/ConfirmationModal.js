// ConfirmationModal.js
import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ConfirmationModal = ({ show, onClose, onConfirm, title, body }) => {
    return (
        <Modal show={show} onHide={onClose} centered dialogClassName="custom-modal">
            <Modal.Header closeButton>
                <Modal.Title className="custom-modal-title">{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>{body}</p>
            </Modal.Body>
            <Modal.Footer>
                <div className="btn-container">
                    <Button className="btn-secondary" onClick={onClose}>Cancelar</Button>
                    <Button className="btn-danger" onClick={onConfirm}>Eliminar</Button>
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default ConfirmationModal;
