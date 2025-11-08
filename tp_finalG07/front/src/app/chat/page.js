"use client";
//Hay que corregir que no se pueden unir usu el mismo error de antes si te unis 
// te dice q no existe la sala y si creas que ya existe (eso esta bien) lo marca en buscarSala
// fijarse nombre de usu que lo pone comoo el nombre de la sala, deberia estae en el back
import { useEffect, useState } from "react";
import clsx from "clsx";
import Usuario from "../componentes/Usuario";
import styles from "./page.module.css";
import Boton from "../componentes/Boton";
import Input from "../componentes/Input";
import { useSocket } from "../hooks/useSocket";
import Mensaje from "../componentes/Mensaje";
import { useSearchParams } from "next/navigation";
import { jugadores } from "../fetch/fetch";

let propietario = true;
let impostor = true;

export default function Chat() {
  const { socket } = useSocket();
  const [mensajeACT, setMensajeACT] = useState("");
  const [mensajes, setMensajes] = useState([]);
  const [userList, setUserList] = useState([]);

  const searchParams = useSearchParams();
  const nombre = searchParams.get("nombre");
  const sala = searchParams.get("sala");

  console.log(`🧑‍🚀 Usuario ${nombre} ingresó a la sala ${sala}`);

  // Carga de jugadores
  useEffect(() => {
    async function listaJugadores() {
      const data = await jugadores({ idRoom: sala });
      setUserList(data);
    }
    listaJugadores();
  }, [sala]);

  // Recibir mensajes
  useEffect(() => {
    if (!socket) return;

    socket.on("newMessage", (data) => {
      setMensajes((prev) => [
        ...prev,
        { nombre: data.nombre, texto: data.message }
      ]);
    });

    return () => socket.off("newMessage");
  }, [socket]);

  // Unión a la sala
  useEffect(() => {
    if (!socket) return;
    socket.emit("joinRoom", { room: sala });
  }, [socket, sala]);

  function enviarMensaje() {
    if (!socket || mensajeACT.trim() === "") return;

    socket.emit("sendMessage", {
      room: sala,
      nombre,
      message: mensajeACT
    });

    setMensajeACT("");
  }

  return (
    <div className={styles.container}>
      <main className={styles.chatArea}>
        <div
          className={clsx(styles.role, {
            [styles.roleImpostor]: impostor,
            [styles.roleJugador]: !impostor,
          })}
        >
          Tu rol es:{" "}
          <span>{impostor ? "Impostor" : "Jugador y tu palabra es: Pepe"}</span>
        </div>

        <div className={styles.messages}>
          {mensajes.map((msg, index) => (
            <Mensaje
              key={index}
              className={clsx(styles.message, {
                [styles.messagePropioImpostor]: msg.nombre === nombre && impostor,
                [styles.messageOtroImpostor]: msg.nombre !== nombre && impostor,
                [styles.messagePropioJugador]: msg.nombre === nombre && !impostor,
                [styles.messageOtroJugador]: msg.nombre !== nombre && !impostor,
              })}
              text={`${msg.nombre}: ${msg.texto}`}
            />
          ))}
        </div>

        <div className={styles.inputRow}>
          <Input
            tipo="chat"
            placeholder="Escribí un mensaje..."
            value={mensajeACT}
            onChange={(e) => setMensajeACT(e.target.value)}
          />
          <Boton
            className={clsx({
              [styles.botonImpostor]: impostor,
              [styles.botonJugador]: !impostor,
            })}
            text="Enviar"
            onClick={enviarMensaje}
          />
        </div>
      </main>

      <aside className={styles.sidebar}>
        <h2>Jugadores</h2>
        <ul className={styles.playerList}>
          {userList.length > 0 ? (
            userList.map((usuario) => (
              <Usuario
                key={usuario.idUser}
                className={styles.player}
                text={usuario.nombre}
                nombre={usuario.nombre}
              />
            ))
          ) : (
            <p>No hay jugadores conectados.</p>
          )}
        </ul>
      </aside>
    </div>
  );
} 
