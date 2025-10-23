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
    const [contraseña, setContraseña] = useState("");

    function iniciar() {
        console.log("entrando a la pag")
        if (nombre !== "" && sala !== "") {
            router.push(`./chat?nombre=${nombre}&sala=${sala}`)
             console.log("debería estar pusheando")
        }
    }
    function nombrarUsuario(event) {
        setNombre(event.target.value)
    }
    function nombrarSala(event) {
        setSala(event.target.value)
    }
    function cambiarContraseña(event) {
        setContraseña(event.target.value)
    }
    return <>
        <div className={styles.body}>
            <div className={styles.modalContent}>
                <Title className={styles.titleLobby} text={"¿Qué queres hacer?"}></Title>
                <ul className={styles.list}>
                    <li><Input className={styles.inputLobby} placeholder={"Nombre de Sala"} onChange={nombrarUsuario}></Input></li>
                    <li><Input className={styles.inputLobby} placeholder={"Número de Sala"} onChange={nombrarSala}></Input></li>
                    <li><Input className={styles.butonLobby} placeholder={"Contraseña"} onChange={cambiarContraseña}></Input></li>
                </ul>
                <Boton className={styles.butonLobby} text={"Jugar"} onClick={iniciar}></Boton>
            </div>
        </div>
    </>

};
