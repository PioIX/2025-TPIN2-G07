'use client'

import { useEffect, useState } from 'react'
import clsx from 'clsx';
import Usuario from '../componentes/Usuario';
import styles from './page.module.css'
import Boton from '../componentes/Boton';
import Input from '../componentes/Input';
import { useSocket } from '../hooks/useSocket';
import Mensaje from '../componentes/Mensaje';


export default function Chat() {
    const [userList, setUserList] = useState([]);
    const { socket, isconnected } = useSocket()
    const [message, setMessage] = useState("");
    const [salaACT, setSalaACT] = useState(0)
    const [mensajeACT, setmensajeACT] = useState("");
    const [mensajes, setMensajes] = useState([]);
    function pingAll() {
        socket.emit("pingAll", { msg: "Hola desde mi compu" });
    }

    function unirseASala() {
        socket.emit("joinRoom", { room: salaACT })
        console.log("andando");
    }
    useEffect(() => {
        if (!socket) return;
        socket.on("newMessage", (data) => {
            console.log("Nuevo mensaje en la sala " + data.room + ": " + data.message.message);
            setMensajes((prevMensajes) => [...prevMensajes, data.message.message]);
        })
    }, [socket]);

    function elegirSala(event) {
        setSalaACT(event.target.value)
    }

    function enviarMensaje() {
        socket.emit("sendMessage", { message: mensajeACT })
    };

    function mensaje(event){
    setmensajeACT(event.target.value)
    };
    let hola = true;
    return <>
        <div className={styles.bodyChat}>
            <Boton className={styles.botonChat} text={"Ping a todos"} onClick={pingAll} />
            <Boton className={styles.botonChat} text={"Unirse a una sala"} onClick={unirseASala} />
            <Boton className={styles.botonChat} text={"Enviar mensaje"} onClick={enviarMensaje} />
            <h2 className={styles.subtitulo}>sala</h2>
            <Input className={styles.inputChat} onChange={elegirSala} />
            <h2 className={styles.subtitulo}>mensaje</h2>
            <Input  className={styles.inputChat} onChange={mensaje} />
            {mensajes ? mensajes.map((mensaje, index) => (
                <Mensaje key={index} text={mensaje} />
            )) : "error"}
        </div>
    </>;

}