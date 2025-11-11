'use client'

import { useState } from 'react'
import styles from './page.module.css'
import Boton from '../componentes/Boton';
import Title from '../componentes/Title';
import Input from '../componentes/Input';
import { useRouter } from 'next/navigation';
import { useSearchParams } from "next/navigation";
import { buscarSala, crearSala } from '../fetch/fetch';

export default function Lobby() {
    const router = useRouter();
    const [nombre, setNombre] = useState("");
    const [sala, setSala] = useState("");
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const usuario = searchParams.get("usuario");
    async function unirse() {
        if (nombre !== "" && sala !== "") {
            const respuesta = await buscarSala({ nombreRoom: nombre, idRoom: sala });
            console.log("conectandose a la sala", respuesta);
            if (respuesta.sala != undefined) {
                router.push(`./salaEspera?usuario=${usuario}&nombre=${nombre}&sala=${sala}&id=${id}&admin=FALSE`)
                socket.emit("entrar_sala", { idRoom: sala, idUser: id });
                console.log("entrar_sala", { idRoom: sala, idUser: id });
            }
            else { alert("La sala no existe") };
        }
    }
    async function crear() {
        if (nombre !== "" && sala !== "") {
            const respuesta = await buscarSala({ nombreRoom: nombre, idRoom: sala });
            console.log(respuesta);
            if (respuesta.crearSala) {
                let respuestaCrear = await crearSala({ nombreRoom: nombre, idRoom: sala })
                if (respuestaCrear.avanzar) {
                    router.push(`./salaEspera?usuario=${usuario}&nombre=${nombre}&sala=${sala}&id=${id}&admin=TRUE`)
                    socket.emit("entrar_sala", { idRoom: sala, idUser: id });
                    console.log("entrar_sala", { idRoom: sala, idUser: id });
                }
                else {

                    alert("La sala ya existe")
                }
            }
            else {
                alert("ya existe una sala con ese numero, o falta llenar un input")
            };
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
