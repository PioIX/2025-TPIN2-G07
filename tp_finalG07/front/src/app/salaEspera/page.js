"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import Title from "../componentes/Title";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { agregarASala, buscarEnSala, definirImpostor, palabraAleatoria } from "../fetch/fetch";
import Boton from "../componentes/Boton";
import { useSocket } from "../hooks/useSocket";

let siempre = true;

export default function salaEspera() {
  const { socket, isConnected } = useSocket();
  const [segundos, setSegundos] = useState(0);
  const [idIntervalo, setIdIntervalo] = useState(null);
  const [jugadores, setJugadores] = useState([]);
  const [idImpostor, setIdImpostor] = useState([]);
  const [palabrita, setPalabrita] = useState("");
  const [comenzar, setComenzar] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const nombre = searchParams.get("nombre");
  const sala = searchParams.get("sala");
  const id = searchParams.get("id");
  const admin = searchParams.get("admin")
  const usuario = searchParams.get("usuario")



  useEffect(() => {
    if (!socket) return;
    if (admin == "TRUE") return;
    socket.on("iniciando", (data) => {
      function iniciar() {
        console.log(data.msg)
        setPalabrita(data.palabrita)
        setIdImpostor(data.idImpostor)
        router.push(`./chat?usuario=${usuario}&nombre=${nombre}&sala=${sala}&id=${id}&admin=${admin}&impostor=${data.idImpostor}&encriptaciónSecretaEdgy=asdpfioewvuoqgfu05v8uq34fvu2340568tu2n0guj6f293umn06t5ijt9384kuy3409kb3lvbu6834908tvuwe309gv82b&palabra=${data.palabrita}`);
      }
      iniciar()
    })
  }, [socket]);



  useEffect(() => {
    console.log(`el usuario ${nombre} ingresó a la sala ${sala}`)
    async function armadorDeSalas() {
      await agregarASala({ idUser: id, idRoom: sala, esAdmin: admin });
    }
    armadorDeSalas()
    if (!socket) return;
    if (isConnected) {
      socket.emit("joinRoom", { room: sala });
    }
  }, [isConnected]);

  useEffect(() => {
    console.log("DATOSSS",comenzar, admin)
    if (comenzar) {
      if (admin == "TRUE") {
        if (segundos === 1) {

          async function buscaSalas() {
            const lista = await buscarEnSala({ idRoom: sala });
            setJugadores(lista);
            if (lista.length > 0) {
              const randomIndex = Math.floor(Math.random() * lista.length);
              const impostorinador = lista[randomIndex];
              const respuesta = await definirImpostor({
                idUser: impostorinador.idUser,
                idRoom: sala
              });
              const res = await palabraAleatoria();
              console.log("Respuesta definir impostor: ", respuesta);
              console.log("Respuesta palabra aleatoria: ", res);
              setIdImpostor(respuesta.impostor);
              setPalabrita(res[0].palabra);
              socket.emit("comenzarPartida", { room: sala, idImpostor: respuesta.impostor, palabrita: res[0].palabra });
              console.log("Palabra asignada: ", res[0].palabra);

            }
          }
          buscaSalas();
        }

      }

      if (segundos === 3) {
       router.push(`./chat?usuario=${usuario}&nombre=${nombre}&sala=${sala}&id=${id}&admin=${admin}&impostor=${idImpostor}&encriptaciónSecretaEdgy=asdpfioewvuoqgfu05v8uq34fvu2340568tu2n0guj6f293umn06t5ijt9384kuy3409kb3lvbu6834908tvuwe309gv82b&palabra=${palabrita}`);
      }
    }

  }, [comenzar, segundos]);

  function iniciar() {
    setComenzar(true)
    const intervalo = setInterval(() => {
      setSegundos((prevSegundos) => prevSegundos + 1);
    }, 1000);

    setIdIntervalo(intervalo);
    return () => {
      clearInterval(intervalo);
    };

  }

  return (
    <>
      <div className={styles.bodySala}>
        <div className={styles.container1}>
          <Title
            className={styles.titleSala}
            text={"Esperando jugadores..."}
          ></Title>
          {admin == "TRUE" ? <>
            {comenzar ? <h2 className={styles.temporizador}>Temporizador: {segundos}s</h2> : <h2 className={styles.temporizador}>Haz click para comenzar la partida</h2>}
            <Boton className={styles.botonSala} onClick={iniciar} text="iniciar partida"> </Boton></> : <h2 className={styles.temporizador}>espera a que el host comience la partida</h2>}
        </div>
      </div>
    </>
  );
};
