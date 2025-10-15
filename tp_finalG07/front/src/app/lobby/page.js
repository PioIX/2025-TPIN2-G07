'use client'

import { useEffect, useState } from 'react'
import clsx from 'clsx';
import styles from './page.module.css'
import Boton from '../componentes/Boton';
import Title from '../componentes/Title';
import { useSocket } from '../hooks/useSocket';



export default function Lobby() {
    return <>
        <div className={styles.body}>
            <Boton text={"Abrir Opciones"}></Boton>

            
                <div className="modal-content">
                    <Title className={} text={"Que queres hacer"}></Title>
                    <Boton text={"Ingresar a una sala"}></Boton>
                    <Boton text={"Crear una sala"}></Boton>
                </div>
           
        </div>
    </>

};
