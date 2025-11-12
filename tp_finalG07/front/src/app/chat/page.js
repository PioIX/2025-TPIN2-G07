"use client";
//Hay que corregir que no se pueden unir usu el mismo error de antes si te unis 
// te dice q no existe la sala y si creas que ya existe (eso esta bien) lo marca en buscarSala
// fijarse nombre de usu que lo pone comoo el nombre de la sala, deberia estae en el back
import { use, useEffect, useState } from "react";
import clsx from "clsx";
import Usuario from "../componentes/Usuario";
import styles from "./page.module.css";
import Boton from "../componentes/Boton";
import Input from "../componentes/Input";
import { useSocket } from "../hooks/useSocket";
import Mensaje from "../componentes/Mensaje";
import { useSearchParams } from "next/navigation";
import { jugadores, traerJugadorPropio } from "../fetch/fetch";




export default function Chat() {
  const { socket } = useSocket();
  const [mensajeACT, setMensajeACT] = useState("");
  const [jugadorPropio, setJugadorPropio] = useState(0);
  const [mensajes, setMensajes] = useState([]);
  const [userList, setUserList] = useState([]);
  const [impostor, setImpostor] = useState(true);
  const [turnoPropio, setTurnoPropio] = useState(true);
  const [tamañoSala, setTamañoSala] = useState(0);
  const [turno, setTurno] = useState(0);
  const searchParams = useSearchParams();
  const [index, setIndex] = useState(0);
  const nombre = searchParams.get("nombre");
  const sala = searchParams.get("sala");
  const usuario = searchParams.get("usuario");
  const idImpostor = searchParams.get("impostor");
  const id = searchParams.get("id");
  const palabra = searchParams.get("palabra")
  const [jugadoresEnSala, setJugadoresEnSala] = useState([]);
  async function cargarJugadores() {
    setJugadoresEnSala(await jugadores({ idRoom: sala }));
  }
  
  
  useEffect(() => {
    console.log(`🧑‍🚀 Usuario ${nombre} ingresó a la sala ${sala}`);
    console.log(`ID Impostor: ${idImpostor}, ID Usuario: ${id}`);
    if (id != idImpostor) {
      setImpostor(false);
      console.log("impostor", impostor);
    }
    else { setImpostor(true) }
    async function cargarJugadores() {
      let jugadoresEnSala = await jugadores({ idRoom: sala });
      setTamañoSala(jugadoresEnSala.length);
      console.log("el tamaño de la sala es de:", tamañoSala);
      setJugadorPropio(await traerJugadorPropio({idUser: id}))
    }
    cargarJugadores();
  }, [, usuario, idImpostor]);

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
      nombre: usuario,
      message: mensajeACT
    });
    socket.emit("cambioTurnoEnviar", { room: sala, tamañoSala: tamañoSala, index: index });
  }

  useEffect(() => {    
if (!socket) return;
socket.on("cambioTurnoRecibir", (data) => {
    console.log("Turno de: " + jugadoresEnSala[data.index], " me llego: ", data)
    setIndex(data.index)
      if (jugadoresEnSala[data.index] = jugadoresEnSala[jugadorPropio.idUser]){
        setTurnoPropio(true)
      }
      else (setTurnoPropio(false))

    
})}, [socket]);


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
          <span>{impostor ? "Impostor" : `Jugador y tu palabra es: ${palabra}`}</span>
        </div>

        <div className={styles.messages}>
          {mensajes.map((msg, index) => (
            <Mensaje
              key={index}
              className={clsx(styles.message, {
                [styles.messagePropioImpostor]: msg.nombre === usuario && impostor,
                [styles.messageOtroImpostor]: msg.nombre !== usuario && impostor,
                [styles.messagePropioJugador]: msg.nombre === usuario && !impostor,
                [styles.messageOtroJugador]: msg.nombre !== usuario && !impostor,
              })}
              text={`${msg.texto}`}
              nombre={`${msg.nombre}`}
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
