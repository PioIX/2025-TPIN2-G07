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

// Variables de estado (pueden ser luego dinámicas según el rol del jugador)
let propietario = true;
let impostor = false;

export default function Chat() {
  const { socket, isconnected } = useSocket();
  const [mensajeACT, setMensajeACT] = useState("");
  const [mensajes, setMensajes] = useState([]);
  const [userList, setUserList] = useState([]);
  const searchParams = useSearchParams();
  const nombre = searchParams.get("nombre");
  const sala = searchParams.get("sala");

  console.log(`🧑‍🚀 Usuario ${nombre} ingresó a la sala ${sala}`);

  // 🔹 Trae lista de jugadores desde el backend
  useEffect(() => {
    async function jugadores() {
      try {
        const res = await fetch("http://localhost:4000/jugadores", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);

        const data = await res.json();
        console.log("🎮 Jugadores obtenidos:", data);
        setUserList(data.mensaje || []);
      } catch (error) {
        console.error("❌ Error al conectar con el servidor:", error);
      }
    }

    jugadores();
  }, []);

  // 🔹 Escucha nuevos mensajes desde el socket
  useEffect(() => {
    if (!socket) return;

    socket.on("newMessage", (data) => {
      console.log(
        `💬 Nuevo mensaje en sala ${data.room}: ${data.message.message}`
      );
      setMensajes((prev) => [...prev, data.message.message]);
    });

    // Limpieza al desmontar
    return () => socket.off("newMessage");
  }, [socket]);

  // 🔹 Conexión del usuario a la sala
  useEffect(() => {
    if (!socket) return;
    if (socket && socket.emit) {
      socket.emit("joinRoom", { room: sala });
      console.log("✅ Usuario unido a la sala:", sala);
    } else {
      console.warn("⚠️ Socket no disponible al intentar joinRoom");
    }
  }, [socket, sala]);

  // 🔹 Envía mensaje
  function enviarMensaje() {
    if (socket && socket.emit && mensajeACT.trim() !== "") {
      socket.emit("sendMessage", { message: mensajeACT });
      setMensajes((prev) => [...prev, mensajeACT]); // se muestra también localmente
      setMensajeACT(""); // limpia el input
    } else {
      console.warn("⚠️ No se puede enviar mensaje vacío o sin conexión.");
    }
  }

  // 🔹 Captura input de mensaje
  function manejarCambio(event) {
    setMensajeACT(event.target.value);
  }

  return (
    <>
      <div className={styles.container}>
        <main className={styles.chatArea}>
          {/* ROL DEL JUGADOR */}
          <div
            className={clsx(styles.role, {
              [styles.roleImpostor]: impostor,
              [styles.roleJugador]: !impostor,
            })}
          >
            Tu rol es:{" "}
            <span>{impostor ? "Impostor" : "Jugador y tu palabra es: Pepe"}</span>
          </div>

          {/* MENSAJES */}
          <div className={styles.messages}>
            {mensajes.length > 0 ? (
              mensajes.map((mensaje, index) => (
                <Mensaje
                  key={index}
                  className={clsx(styles.message, {
                    [styles.messagePropioImpostor]: propietario && impostor,
                    [styles.messageOtroImpostor]: !propietario && impostor,
                    [styles.messagePropioJugador]: propietario && !impostor,
                    [styles.messageOtroJugador]: !propietario && !impostor,
                  })}
                  text={mensaje}
                />
              ))
            ) : (
              <p>No hay mensajes todavía.</p>
            )}
          </div>

          {/* INPUT Y BOTÓN DE ENVÍO */}
          <div className={styles.inputRow}>
            <Input
              tipo="chat"
              placeholder="Escribí un mensaje..."
              value={mensajeACT}
              onChange={manejarCambio}
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

        {/* SIDEBAR DE JUGADORES */}
        <aside className={styles.sidebar}>
          <h2>Jugadores</h2>
          <ul className={styles.playerList}>
            {userList.length > 0 ? (
              userList.map((usuario) => (
                <Usuario
                  key={usuario.idUser}
                  className={styles.player}
                  text={usuario.nombreUser}
                  nombre={usuario.nombreUser}
                />
              ))
            ) : (
              <p>No hay jugadores conectados.</p>
            )}
          </ul>
        </aside>
      </div>
    </>
  );
}
