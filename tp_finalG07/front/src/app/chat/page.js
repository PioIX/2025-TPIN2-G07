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
// Solo necesitas 'jugadores', hemos eliminado 'traerJugadorPropio'
import { jugadores } from "../fetch/fetch"; 

export default function Chat() {
  const { socket } = useSocket();
  const [mensajeACT, setMensajeACT] = useState("");
  // ELIMINADO: jugadorPropio (usaremos 'id' de la URL)
  // ELIMINADO: jugadoresEnSala (usaremos 'userList')
  const [mensajes, setMensajes] = useState([]);
  const [userList, setUserList] = useState([]); // Esta será nuestra ÚNICA lista de jugadores
  const [impostor, setImpostor] = useState(false); // Inicia en false
  const [turnoPropio, setTurnoPropio] = useState(false); // Inicia en false, se calculará
  const [tamañoSala, setTamañoSala] = useState(0);
  const [index, setIndex] = useState(0); // El turno 0 es el primero

  const searchParams = useSearchParams();
  const nombre = searchParams.get("nombre");
  const sala = searchParams.get("sala");
  const usuario = searchParams.get("usuario"); // Este es el 'nombre' que se usa para el chat
  const idImpostor = searchParams.get("impostor");
  const id = searchParams.get("id"); // Este es el ID numérico del usuario actual
  const palabra = searchParams.get("palabra");

  // --- EFECTOS DE CARGA ---

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
  // Se ejecuta solo cuando la 'sala' cambia
  useEffect(() => {
    if (!sala) return; // No hacer nada si no hay sala

    async function listaJugadores() {
      try {
        const data = await jugadores({ idRoom: sala });
        setUserList(data); // Guardamos la lista de jugadores
        setTamañoSala(data.length); // Guardamos el tamaño para el backend
        console.log("Jugadores cargados:", data);
        console.log("Tamaño de sala seteado:", data.length);
      } catch (error) {
        console.error("Error al cargar jugadores:", error);
      }
    }
    listaJugadores();
  }, [sala]);

  // --- EFECTOS DE SOCKET ---

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
  // Este efecto SOLO actualiza el índice
  useEffect(() => {
    if (!socket) return;

    socket.on("cambioTurnoRecibir", (data) => {
      console.log(`RECIBIDO: Nuevo índice de turno es ${data.index}`);
      setIndex(data.index); // Actualizamos el estado del índice
    });

    return () => socket.off("cambioTurnoRecibir");
  }, [socket]);

  // 6. Efecto para CALCULAR si es mi turno
  // Esta es la lógica clave. Se recalcula cada vez que:
  // - La lista de jugadores cambia
  // - Mi ID cambia
  // - El índice del turno cambia
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
      // Usamos '==' para que JS compare valor (ej: 5 == "5" es true)
      if (jugadorDeTurno.idUser == id) {
        console.log("¡Es mi turno!");
        setTurnoPropio(true);
      } else {
        console.log("No es mi turno.");
        setTurnoPropio(false);
      }
    }
  }, [userList, id, index]); // <-- ¡Dependencias clave!

  // --- FUNCIONES ---

  // Función para enviar el mensaje y pasar el turno
  function enviarMensaje() {
    if (!socket || mensajeACT.trim() === "" || !turnoPropio) return;

    console.log("Enviando mensaje y pasando turno...");

    // 1. Enviar el mensaje
    socket.emit("sendMessage", {
      room: sala,
      nombre: usuario, // 'usuario' es el nombre, según tu código
      message: mensajeACT
    });

    // 2. Pedir al backend que cambie el turno
    socket.emit("cambioTurnoEnviar", {
      room: sala,
      tamañoSala: tamañoSala, // Usamos el estado 'tamañoSala'
      index: index         // Usamos el estado 'index' actual
    });

    // 3. Limpiar el input
    setMensajeACT("");
  }

  // --- RENDERIZADO ---

  return (
    <>
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
            {/* Ahora 'turnoPropio' se calcula correctamente */}
            {turnoPropio ? (
              <>
                <Input
                  tipo="chat"
                  placeholder="Es tu turno, escribí un mensaje..."
                  value={mensajeACT}
                  onChange={(e) => setMensajeACT(e.target.value)}
                  // Opcional: permitir enviar con Enter
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
              // Mensaje útil para saber de quién es el turno
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
              userList.map((jugador, i) => ( // 'i' es el índice del map
                <li 
                  key={jugador.idUser}
                  // Resaltamos al jugador que tiene el turno
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
                </li>
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