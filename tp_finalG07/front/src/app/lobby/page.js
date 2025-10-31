'use client'

import { useEffect, useState } from 'react'
import clsx from 'clsx';
import styles from './page.module.css'
import Boton from '../componentes/Boton';
import Title from '../componentes/Title';
import { useSocket } from '../hooks/useSocket';
import Input from '../componentes/Input';
import { useRouter } from 'next/navigation';


export default function Lobby() {
    const router = useRouter();
    const [nombre, setNombre] = useState("");
    const [sala, setSala] = useState("");
    function unirse() {
        if (nombre !== "" && sala !== "") {
            router.push(`./salaEspera?nombre=${nombre}&sala=${sala}`);
        }
    }
    function crear() {
        if (nombre !== "" && sala !== "") {
            
            router.push(`./salaEspera?nombre=${nombre}&sala=${sala}`);
        }
    }
    function nombrarSala(event) {
        setNombre(event.target.value)
    }
    function numerarSala(event) {
        setSala(event.target.value)
    }
    return <>
        <div className={styles.body}>
            <div className={styles.modalContent}>
                <Title className={styles.titleLobby} text={"¿Qué queres hacer?"}></Title>
                <ul className={styles.list}>
                    <li><Input className={styles.inputLobby} placeholder={"Nombre de Sala"} onChange={nombrarSala}></Input></li>
                    <li><Input className={styles.inputLobby} placeholder={"Número de Sala"} onChange={numerarSala}></Input></li>
                </ul>
                <Boton className={styles.butonLobby} text={"unirse"} onClick={unirse}></Boton>
                <Boton className={styles.butonLobby} text={"crear"} onClick={crear}></Boton>
            </div>
        </div>
    </>

};
