'use client'

export default function Mensaje(props) {
    return <>
    <h3 className={props.className}>{props.nombre}</h3>
    <h4 className={props.className}>{props.text}</h4>
    </>
}