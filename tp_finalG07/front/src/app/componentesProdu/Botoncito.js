'use client'

export default function Boton(props) {
    return <>
    <button className={props.className} onClick={props.onClick}>{props.text}</button>
    </>
}