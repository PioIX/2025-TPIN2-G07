"use client";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { jugadores } from "../fetch/fetch";
import { useSearchParams } from "next/navigation";

export default function Votacion() {

  const [userList, setUserList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const searchParams = useSearchParams();
  const sala = searchParams.get("sala");

  useEffect(() => {
    async function cargar() {
      const data = await jugadores({ idRoom: sala });
      setUserList(data);
    }
    cargar();
  }, [sala]);

  function votar() {
    if (selectedUser === null) return;
    alert("Votaste a: " + userList[selectedUser].nombre);
  }

  return (
    <>
      <div className={styles.body}>
        <div className={styles.container}>
          <h1 className={styles.title}>Votación</h1>

          <ul className={styles.lista}>
            {userList.map((usuario, index) => (
              <li key={usuario.idUser} className={styles.usuarioCard}>
                <label className={styles.opcion}>
                  <input type="radio" name="voto" onChange={() => setSelectedUser(index)}/>
                  <img src={usuario.fotoPerfil} className={styles.foto} />
                  <span>{usuario.nombre}</span>
                </label>
              </li>
            ))}
          </ul>

          <button className={styles.boton} onClick={votar}>Votar</button>
        </div>
      </div>
    </>
  );
}
