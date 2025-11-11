"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import Title from "../componentes/Title";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { agregarASala, buscarEnSala, definirImpostor, palabraAleatoria } from "../fetch/fetch";


let siempre = true;

export default function salaEspera() {

  const [segundos, setSegundos] = useState(0);
  const [idIntervalo, setIdIntervalo] = useState(null);
  const [jugadores, setJugadores] = useState([]);
  const [idImpostor, setIdImpostor] = useState([]);
  const [palabrita, setPalabrita] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const nombre = searchParams.get("nombre");
  const sala = searchParams.get("sala");
  const id = searchParams.get("id");
  const admin = searchParams.get("admin")
  const usuario = searchParams.get("usuario")
  




  useEffect(() => {
    console.log(`el usuario ${nombre} ingresó a la sala ${sala}`)
    async function armadorDeSalas() {
      await agregarASala({ idUser: id, idRoom: sala, esAdmin: admin });
    }
    armadorDeSalas()
    const intervalo = setInterval(() => {
      setSegundos((prevSegundos) => prevSegundos + 1);
    }, 1000);
    setIdIntervalo(intervalo);

    return () => {
      clearInterval(intervalo);
    };

  }, []);
  useEffect(() => {
  if (segundos === 7) {
    if (admin) {
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
          console.log("Palabra asignada: ", res[0].palabra);
        }
      }
      buscaSalas();
    }
  }

  if (segundos === 10) {
    router.push(`./chat?usuario=${usuario}&nombre=${nombre}&sala=${sala}&id=${id}&admin=${admin}&impostor=${idImpostor}&encriptaciónSecretaEdgy=asdpfioewvuoqgfu05v8uq34fvu2340568tu2n0guj6f293umn06t5ijt9384kuy3409kb3lvbu6834908tvuwe309gv82b&palabra=${palabrita}`);
  }
}, [segundos,palabrita]);

  return (
    <>
      <div className={styles.bodySala}>
        <div className={styles.container1}>
          <Title
            className={styles.titleSala}
            text={"Esperando jugadores..."}
          ></Title>
          <h2 className={styles.temporizador}>Temporizador: {segundos}s</h2>
        </div>
      </div>
    </>
  );
};
