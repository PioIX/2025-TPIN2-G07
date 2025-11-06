"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import Title from "../componentes/Title";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { agregarASala, buscarEnSala, definirImpostor } from "../fetch/fetch";


let siempre = true;

export default function salaEspera() {

  const [segundos, setSegundos] = useState(0);
  const [idIntervalo, setIdIntervalo] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const nombre = searchParams.get("nombre");
  const sala = searchParams.get("sala");
  const id = searchParams.get("id");
  const admin = searchParams.get("admin")



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
    if (segundos == 10) {
      if (admin) {
        async function buscaSalas() {
          let jugadores = await buscarEnSala({ idRoom: sala })
          const impostorinador = jugadores[Math.floor(Math.random() * (jugadores.length))]
          
        
        definirImpostor({idUser: impostorinador});
      }
      buscaSalas()
    }
    router.push(`./chat?nombre=${nombre}&sala=${sala}&id=${id}&admin=${admin}`);
      console.log("debería estar pusheando")
  }}, [segundos])


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
