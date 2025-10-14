
'use client'

export default function Boton(props) {
    return <>
    <button onClick={props.onClick}>{props.text}</button>
    </>
}