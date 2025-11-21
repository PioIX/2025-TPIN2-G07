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
import { jugadores } from "../fetch/fetch";

export default function Chat() {
  const { socket } = useSocket();
  const [mensajeACT, setMensajeACT] = useState("");
  const [mensajes, setMensajes] = useState([]);
  const [userList, setUserList] = useState([]);
  const [impostor, setImpostor] = useState(false);
  const [turnoPropio, setTurnoPropio] = useState(false);
  const [tamañoSala, setTamañoSala] = useState(0);
  const [index, setIndex] = useState(0);
  const [votacion, setVotacion] = useState(false);
  const [votos, setVotos] = useState([]);
  const searchParams = useSearchParams();
  const nombre = searchParams.get("nombre");
  const sala = searchParams.get("sala");
  const usuario = searchParams.get("usuario"); // Este es el 'nombre' que se usa para el chat
  const idImpostor = searchParams.get("impostor");
  const id = searchParams.get("id"); // Este es el ID numérico del usuario actual
  const palabra = searchParams.get("palabra");

  // 1. Efecto para definir el rol (impostor o no)
  // Se ejecuta solo cuando cambian los IDs
  useEffect(() => {
    console.log(`🧑‍🚀 Usuario ${nombre} (ID: ${id}) ingresó a la sala ${sala}`);
    console.log(`ID Impostor: ${idImpostor}, Mi ID: ${id}`);

    // Comparamos el 'id' de la URL (string) con 'idImpostor' (string)
    if (id === idImpostor) {
      setImpostor(true);
      console.log("Rol asignado: IMPOSTOR");
    } else {
      setImpostor(false);
      console.log("Rol asignado: JUGADOR");
    }
  }, [id, idImpostor, nombre, sala]);

  // 2. Efecto para cargar jugadores
  useEffect(() => {
    if (!sala) return;

    async function listaJugadores() {
      try {
        const data = await jugadores({ idRoom: sala });
        setUserList(data);
        setTamañoSala(data.length);
        console.log("Jugadores cargados:", data);
        console.log("Tamaño de sala seteado:", data.length);
        // Construir el array de votos a partir de los datos recibidos y setearlo en estado
        const votosIniciales = data.map((jugador, i) => ({
          key: i,
          idUser: jugador.idUser,
          votado: 0,
        }));
        setVotos(votosIniciales);
      } catch (error) {
        console.error("Error al cargar jugadores:", error);
      }
    }
    listaJugadores();
  }, [sala]);


  // 3. Efecto para unirse a la sala
  useEffect(() => {
    if (!socket || !sala) return;
    socket.emit("joinRoom", { room: sala });
    console.log(`Socket uniéndose a la sala: ${sala}`);
  }, [socket, sala]);

  // 4. Efecto para recibir mensajes
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

  // 5. Efecto para RECIBIR el cambio de turno
  useEffect(() => {
    if (!socket) return;

    socket.on("cambioTurnoRecibir", (data) => {
      console.log(`RECIBIDO: Nuevo índice de turno es ${data.index}`);
      setIndex(data.index);
    });

    return () => socket.off("cambioTurnoRecibir");
  }, [socket]);

  // 6. Efecto para CALCULAR si es mi turno
  useEffect(() => {
    if (userList.length > 0) {
      // 1. Obtenemos el jugador que tiene el turno
      const jugadorDeTurno = userList[index];

      if (!jugadorDeTurno) {
        console.warn(`Índice de turno ${index} fuera de rango.`);
        setTurnoPropio(false);
        return;
      }

      console.log(`VERIFICANDO TURNO: Turno actual es de ${jugadorDeTurno.nombre} (ID: ${jugadorDeTurno.idUser}). Mi ID es ${id}.`);

      // 2. Comparamos el ID del jugador de turno (Number) con mi ID (String)
      if (jugadorDeTurno.idUser == id) {
        console.log("¡Es mi turno!");
        setTurnoPropio(true);
      } else {
        console.log("No es mi turno.");
        setTurnoPropio(false);
      }
    }
  }, [userList, id, index]);



  // Función para enviar el mensaje y pasar el turno
  function enviarMensaje() {
    if (!socket || mensajeACT.trim() === "" || !turnoPropio) return;

    console.log("Enviando mensaje y pasando turno...");

    // 1. Enviar el mensaje
    socket.emit("sendMessage", {
      room: sala,
      nombre: usuario,
      message: mensajeACT
    });

    // 2. Pedir al backend que cambie el turno
    socket.emit("cambioTurnoEnviar", {
      room: sala,
      tamañoSala: tamañoSala,
      index: index
    });


  }

  useEffect(() => {
    if (index >= tamañoSala) {
      setVotacion(true);
    }
  }, [index]);

  function usuarioVotado(jugador) {
    setVotacion(false);
    console.log(jugador)
    console.log(votos)
    socket.emit("usuarioVotado", {
      room: sala,
      idUser: jugador.idUser,
      votos: votos
    });

  }
  useEffect(() => {
    if (!socket) return;
    socket.on("resultados", ({ resultado }) => {
      setVotos(resultado);
      console.log("los votos son: ", resultado)
    });
    console.log("los votos son: ", votos)
    return () => socket.off("resultados");

  }, [socket]);

  return <>
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
          { }
          {turnoPropio ? (
            <>
              <Input
                tipo="chat"
                placeholder="Es tu turno, escribí un mensaje..."
                value={mensajeACT}
                onChange={(e) => setMensajeACT(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && enviarMensaje()}
              />
              <Boton
                className={clsx({
                  [styles.botonImpostor]: impostor,
                  [styles.botonJugador]: !impostor,
                })}
                text="Enviar"
                onClick={enviarMensaje}
              />
            </>
          ) : (
            <p style={{ color: '#ccc', width: '100%', textAlign: 'center' }}>
              Esperando a {userList[index] ? userList[index].nombre : '...'}
            </p>
          )}
        </div>
      </main>

      <aside className={styles.sidebar}>
        <h2>Jugadores</h2>
        <ul className={styles.playerList}>
          {userList.length > 0 ? (
            userList.map((jugador, i) => (
              <li
                key={jugador.idUser}
                style={{
                  backgroundColor: i === index ? '#444' : 'transparent',
                  padding: '4px',
                  borderRadius: '4px'
                }}
              >
                <Usuario
                  className={styles.player}
                  text={jugador.nombre}
                  nombre={jugador.nombre}
                />
                {votacion ? <Boton className={styles.botonVotar} text="Votar" onClick={() => usuarioVotado(jugador)}></Boton> : null}
              </li>
            ))
          ) : (
            <p>No hay jugadores conectados.</p>
          )}
        </ul>
      </aside>
    </div>
  </>

}