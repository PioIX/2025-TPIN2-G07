'use client'


import { useEffect, useState } from 'react'
import clsx from 'clsx';
import Usuario from '../componentes/Usuario';
import styles from './page.module.css'
import Boton from '../componentes/Boton';
import Input from '../componentes/Input';
import { useSocket} from '../hooks/useSocket';
import Mensaje from '../componentes/Mensaje';




//map
const names = ['pepe', 'pedro', 'papo'];
const holaNames = names.map((name) => 'hola ' + name);

//fetch get
export async function traerUsuarios(){
    return await fetch(`http://localhost:4000/prueba`)
    .then(response => response.json())
    .then(data => {return data});
} 

//fetch post
export async function crearUsuario(dato){
    return await fetch(`http://localhost:4000/crearUsuario`, {
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify(dato)
    })
    .then(response => response.json())
    .then(data => {return data});
}

//recordar importar luego a traves de import { traerUsuarios } from '@/prueba'

//pagina + cosas aplicadas
export default function Prueba() {
    const [userList, setUserList] = useState([]);
    const {socket, isconnected} = useSocket()
    const [message, setMessage] = useState("");
    const [salaACT, setSalaACT] = useState(0)
    const [mensajeACT, setmensajeACT] = useState("");
    const [mensajes, setMensajes] = useState([]);
    
    useEffect(() => {
  async function fetchData() {
    const respuesta = await traerUsuarios();
    console.log(respuesta);           // muestra lo que llegó del servidor
    setUserList(respuesta.mensaje);         // actualiza el estado
  }
  fetchData();
}, []);

function pingAll() {
socket.emit("pingAll", { msg: "Hola desde mi compu" });
}

function unirseASala() {
socket.emit("joinRoom", { room: salaACT })
console.log("andando");
}

// Para ver el state actualizado cuando cambie:
useEffect(() => {
  console.log('userList actualizada:', userList);
}, [userList]);

useEffect(() => {    
if (!socket) return;
socket.on("newMessage", (data) => {
    console.log("Nuevo mensaje en la sala " + data.room + ": " + data.message.message);
    setMensajes((prevMensajes) => [...prevMensajes, data.message.message]);
})}, [socket]);

function elegirSala(event){
    setSalaACT(event.target.value)
}

function enviarMensaje(){
    socket.emit("sendMessage", { message: mensajeACT })
};

function mensaje(event){
    setmensajeACT(event.target.value)
}
 let hola = true;



    return <>



        <div>
            <Boton text={"Ping a todos"} onClick={pingAll} />
            <Boton text={"Unirse a una sala"} onClick={unirseASala} />
            <Boton text={"Enviar mensaje"} onClick={enviarMensaje} />
            <h2>sala</h2>
            <Input onChange={elegirSala} />
             <h2>mensaje</h2>
             <Input onChange={mensaje}/>
            <h1 className= {clsx({
                [styles.nombre]: hola,
                [styles.otro]: !hola
            })}>Lista de Usuarios</h1>
            {mensajes ? mensajes.map((mensaje, index) => (
                <Mensaje key={index} text={mensaje} />
            )) : "error"}
            
        </div>
    </>;
}