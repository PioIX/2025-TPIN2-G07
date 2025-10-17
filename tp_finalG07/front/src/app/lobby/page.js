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
                <div className={styles.modalContent}>
                    <Title className={styles.titleLobby} text={"¿Qué queres hacer?"}></Title>
                    <Boton className={styles.butonLobby} text={"Ingresar a una sala"}></Boton>
                    <Boton className={styles.butonLobby} text={"Crear una sala"}></Boton>
                </div>
           
        </div>
    </>

};
