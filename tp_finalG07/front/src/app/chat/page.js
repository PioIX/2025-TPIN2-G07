"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import Usuario from "../componentes/Usuario";
import styles from "./page.module.css";
import Boton from "../componentes/Boton";
import Input from "../componentes/Input";
import { useSocket } from "../hooks/useSocket";
import Mensaje from "../componentes/Mensaje";
import { useSearchParams } from "next/navigation";
let propietario = true;
let impostor = false;





export default function Chat() {
  const { socket, isconnected } = useSocket();
  const [message, setMessage] = useState("");
  const [salaACT, setSalaACT] = useState(0);
  const [mensajeACT, setmensajeACT] = useState("");
  const [mensajes, setMensajes] = useState([]);
  const [isPopupOpen, setPopupOpen] = useState(false);

  const searchParams = useSearchParams()
  const nombre = searchParams.get("nombre");
  const sala = searchParams.get("sala");
  console.log(`el usuario ${nombre} ingresó a la sala ${sala}`)




  useEffect(() => {
    if (!socket) return;
    socket.on("newMessage", (data) => {
      console.log(
        "Nuevo mensaje en la sala " + data.room + ": " + data.message.message
      );
      setMensajes((prevMensajes) => [...prevMensajes, data.message.message]);
    });
  }, [socket]);

  useEffect(() => {
    const nombre = searchParams.get("nombre");
    const sala = searchParams.get("sala");
    if (!socket) return;
    if (socket && socket.emit) {
      socket.emit("joinRoom", { room: sala });
      console.log("andando");
    } else {
      console.warn('socket no disponible al intentar joinRoom', socket);
    }
  }, [socket]);

  function enviarMensaje() {
    if (socket && socket.emit) {
      socket.emit("sendMessage", { message: mensajeACT });
    } else {
      console.warn('socket no disponible al intentar enviar mensaje', socket);
    }
  }

  function mensaje(event) {
    setmensajeACT(event.target.value);
  }
  let hola = true;
  return (
    <>
      <div className={styles.container}>
        <main className={styles.chatArea}>
          <div className={clsx(styles.role, {
            [styles.roleImpostor]: impostor,
            [styles.roleJugador]: !impostor
          })}>
            Tu rol es:{' '} <span>{impostor ? 'Impostor' : 'Jugador y tu palabra es: Pepe'}</span>
          </div>
          <div className={styles.messages}>
            {mensajes
              ? mensajes.map((mensaje, index) => (
                <Mensaje className={clsx(styles.message, {
                  [styles.messagePropioImpostor]: propietario && impostor,
                  [styles.messageOtroImpostor]: !propietario && impostor,
                  [styles.messagePropioJugador]: propietario && !impostor,
                  [styles.messageOtroJugador]: !propietario && !impostor
                })} key={index} texto={mensaje} />
              ))
              : "error"}
          </div>
          <div className={styles.inputRow}>
            <Input
              tipo="chat"
              placeholder="Escribí un mensaje..."
              onChange={mensaje}
            />
            <Boton
              className={clsx({
                [styles.botonImpostor]: impostor,
                [styles.botonJugador]: !impostor
              })}
              text="Enviar"
              onClick={enviarMensaje}
            />
          </div>
        </main>
      </div>
      /**
      <div className={styles.container}>
        <aside className={styles.sidebar}>
          <h2>Jugadores</h2>
          <ul className={styles.playerList}>
            <div className={styles.player}>Tu</div>
            <div className={styles.player}>
              Jugador 1 lo mismo con un props poner nombre de Usuario
            </div>
            <div className={styles.player}>Jugador 3</div>
            <div className={styles.player}>Jugador 4</div>
            <div className={styles.player}>Jugador 5</div>
            <div className={styles.player}>Jugador 6</div>
          </ul>
        </aside>
      </div>
      **/
    </>
  );
}
