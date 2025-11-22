"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import Usuario from "../componentes/Usuario";
import styles from "./page.module.css";
import Boton from "../componentes/Boton";
import Input from "../componentes/Input";
import { useSocket } from "../hooks/useSocket";
import Mensaje from "../componentes/Mensaje";
import { useSearchParams, useRouter } from "next/navigation";
import { jugadores } from "../fetch/fetch";

export default function Chat() {
  const { socket } = useSocket();
  const router = useRouter();
  
  const [mensajeACT, setMensajeACT] = useState("");
  const [mensajes, setMensajes] = useState([]);
  const [userList, setUserList] = useState([]);
  const [impostor, setImpostor] = useState(false);
  const [turnoPropio, setTurnoPropio] = useState(false);
  const [tamañoSala, setTamañoSala] = useState(0);
  const [index, setIndex] = useState(0);
  
  // Estados para la lógica de votación
  const [votacion, setVotacion] = useState(false);
  const [yaVote, setYaVote] = useState(false);
  const [votos, setVotos] = useState([]);

  const searchParams = useSearchParams();
  const nombre = searchParams.get("nombre");
  const sala = searchParams.get("sala");
  const usuario = searchParams.get("usuario");
  const idImpostor = searchParams.get("impostor");
  const id = searchParams.get("id");
  const palabra = searchParams.get("palabra");

  let totalVotos = 0;
  if (votos) {
    votos.forEach((v) => {
      totalVotos += (v.votado || 0);
    });
  }

  const esperandoVotos = votacion && (totalVotos < tamañoSala) && tamañoSala > 0;

  useEffect(() => {
    if (votacion && tamañoSala > 0 && totalVotos >= tamañoSala) {
        console.log("🗳️ Todos han votado. Procesando resultados...");
        const timer = setTimeout(() => {
            const votosOrdenados = [...votos].sort((a, b) => (b.votado || 0) - (a.votado || 0));
            const expulsado = votosOrdenados[0];
            if (String(expulsado.idUser) === String(id)) {
                alert("Has sido expulsado de la nave.");
                router.push('./jugar'); 
            } else {
                const nuevaLista = userList.filter(u => String(u.idUser) !== String(expulsado.idUser));
                
                setUserList(nuevaLista);
                setTamañoSala(nuevaLista.length);
                setIndex(0); 
                setMensajes([]); 
                setVotacion(false);
                setYaVote(false);
                
                const votosReiniciados = nuevaLista.map((jugador, i) => ({
                    key: i,
                    idUser: jugador.idUser,
                    votado: 0,
                }));
                setVotos(votosReiniciados);
                
                alert(`El jugador ${expulsado.idUser} fue expulsado. ¡Comienza nueva ronda!`);
            }
        }, 2000);

        return () => clearTimeout(timer);
    }
  }, [totalVotos, votacion, tamañoSala, votos, userList, id, router]);


  // 1. Efecto Rol
  useEffect(() => {
    if (id === idImpostor) {
      setImpostor(true);
    } else {
      setImpostor(false);
    }
  }, [id, idImpostor, nombre, sala]);

  // 2. Efecto Cargar Jugadores
  useEffect(() => {
    if (!sala) return;

    async function listaJugadores() {
      try {
        const data = await jugadores({ idRoom: sala });
        setUserList(data);
        setTamañoSala(data.length);
        
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

  // 3. Efecto Join Room
  useEffect(() => {
    if (!socket || !sala) return;
    socket.emit("joinRoom", { room: sala });
  }, [socket, sala]);

  // 4. Efecto Recibir Mensajes
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

  // 5. Efecto Recibir Turno
  useEffect(() => {
    if (!socket) return;
    socket.on("cambioTurnoRecibir", (data) => {
      setIndex(data.index);
    });
    return () => socket.off("cambioTurnoRecibir");
  }, [socket]);

  // 6. Efecto Calcular Turno Propio
  useEffect(() => {
    if (userList.length > 0) {
      const jugadorDeTurno = userList[index];
      if (!jugadorDeTurno) {
        setTurnoPropio(false);
        return;
      }
      if (jugadorDeTurno.idUser == id) {
        setTurnoPropio(true);
      } else {
        setTurnoPropio(false);
      }
    }
  }, [userList, id, index]);

  // 7. Detectar Fin de Ronda (activa votación)
  useEffect(() => {
    if (tamañoSala > 0 && mensajes.length >= tamañoSala) {
        setVotacion(true);
    }
  }, [mensajes, tamañoSala]);

  // 8. Escuchar Resultados Votación
  useEffect(() => {
    if (!socket) return;
    socket.on("resultados", ({ resultado }) => {
      setVotos(resultado);
    });
    return () => socket.off("resultados");
  }, [socket]);


  function enviarMensaje() {
    if (!socket || mensajeACT.trim() === "" || !turnoPropio || esperandoVotos) return;

    socket.emit("sendMessage", {
      room: sala,
      nombre: usuario,
      message: mensajeACT
    });

    socket.emit("cambioTurnoEnviar", {
      room: sala,
      tamañoSala: tamañoSala,
      index: index
    });
    
    setMensajeACT("");
  }

  function usuarioVotado(jugador) {
    setYaVote(true); 
    
    socket.emit("usuarioVotado", {
      room: sala,
      idUser: jugador.idUser,
      votos: votos
    });
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
          <span>{impostor ? "Impostor" : `Jugador y tu palabra es: ${palabra}`}</span>
        </div>

        <div className={styles.messages}>
          {mensajes.map((msg, idx) => (
            <Mensaje
              key={idx}
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
          {esperandoVotos ? (
            <div style={{ 
                width: '100%', 
                textAlign: 'center', 
                padding: '10px', 
                backgroundColor: 'rgba(0,0,0,0.6)', 
                borderRadius: '8px',
                color: '#fff',
                fontWeight: 'bold',
                border: '1px solid #555'
            }}>
                {yaVote 
                    ? `Esperando que todos terminen de votar (${totalVotos}/${tamañoSala})...` 
                    : "⚠️ ¡Ronda finalizada! Debes votar a alguien de la lista."}
            </div>
          ) : turnoPropio ? (
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
                  borderRadius: '4px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <Usuario
                  className={styles.player}
                  text={jugador.nombre}
                  nombre={jugador.nombre}
                />
                {votacion && !yaVote ? (
                  <Boton 
                    className={styles.botonVotar} 
                    text="Votar" 
                    onClick={() => usuarioVotado(jugador)}
                  />
                ) : null}
                
                {votacion && (
                   <span style={{ fontSize: '0.8em', marginLeft: '10px', color: '#aaa' }}>
                     {votos.find(v => v.idUser === jugador.idUser)?.votado || 0} votos
                   </span>
                )}
              </li>
            ))
          ) : (
            <p>No hay jugadores conectados.</p>
          )}
        </ul>
      </aside>
    </div>
  );
}