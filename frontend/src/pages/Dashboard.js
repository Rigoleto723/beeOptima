import { IconPencil, IconPlus, IconTrash, IconBuildingStore, IconRotateClockwise } from '@tabler/icons-react';
import React, { useState, useEffect } from 'react';
import './styles.css';
import ConfirmationModal from '../components/ConfirmationModal';
import GeneralModal from '../components/GeneralModal';
import RouteLayout from '../layouts/RouteLayout';

const HeaderBtn = ({ onClick }) => (
    <div className='h-full flex flex-row items-center pr-4'>
        <button className='add-button' onClick={onClick}><IconBuildingStore />Generar Reporte</button>
    </div>
)

function Dashboard() {
}
export default Dashboard;