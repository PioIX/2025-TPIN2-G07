'use client'

export default function Mensaje(props) {
    return <>
    <h4 className={props.className}>{props.nombre}</h4>
    <h4 className={props.className}>{props.text}</h4>
    </>
}