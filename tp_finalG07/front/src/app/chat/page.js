"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import Usuario from "../componentes/Usuario";
import styles from "./page.module.css";
import Boton from "../componentes/Boton";
import Input from "../componentes/Input";
import { useSocket } from "../hooks/useSocket";
import Mensaje from "../componentes/Mensaje";

let propietario= true;
let impostor= false;


export default function Chat() {
  const [userList, setUserList] = useState([]);
  const { socket, isconnected } = useSocket();
  const [message, setMessage] = useState("");
  const [salaACT, setSalaACT] = useState(0);
  const [mensajeACT, setmensajeACT] = useState("");
  const [mensajes, setMensajes] = useState([]);
  const [isPopupOpen, setPopupOpen] = useState(false);

  function pingAll() {
    socket.emit("pingAll", { msg: "Hola desde mi compu" });
  }

  function unirseASala() {
    socket.emit("joinRoom", { room: salaACT });
    console.log("andando");
  }
  useEffect(() => {
    if (!socket) return;
    socket.on("newMessage", (data) => {
      console.log(
        "Nuevo mensaje en la sala " + data.room + ": " + data.message.message
      );
      setMensajes((prevMensajes) => [...prevMensajes, data.message.message]);
    });
  }, [socket]);

  function elegirSala(event) {
    setSalaACT(event.target.value);
  }

  function enviarMensaje() {
    socket.emit("sendMessage", { message: mensajeACT });
  }

  function mensaje(event) {
    setmensajeACT(event.target.value);
  }
  let hola = true;
  return (
    <>
      <div className={styles.container}>
        <main className={styles.chatArea}>
          <div className={clsx(styles.role,{
            [styles.roleImpostor]: impostor,
            [styles.roleJugador] : !impostor
          })}>
            Tu rol es:{' '} <span>{impostor ? 'Impostor' : 'Jugador y tu palabra es: Pepe'}</span>
          </div>
          <div className={styles.messages}>
            {mensajes
              ? mensajes.map((mensaje, index) => (
                  <Mensaje className={clsx(styles.message,{
                    [styles.messagePropioImpostor] : propietario && impostor,
                    [styles.messageOtroImpostor] : !propietario && impostor,
                    [styles.messagePropioJugador] : propietario && !impostor,
                    [styles.messageOtroJugador] : !propietario && !impostor
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
                [styles.botonImpostor] : impostor,
                [styles.botonJugador] : !impostor
              })}
              text="Enviar"
              onClick={enviarMensaje}
            />
            <Input onChange={elegirSala} />
            <Boton
              className={clsx({
                [styles.botonImpostor] : impostor,
                [styles.botonJugador] : !impostor
              })}
              text={"Unirse a una sala"}
              onClick={unirseASala}
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
