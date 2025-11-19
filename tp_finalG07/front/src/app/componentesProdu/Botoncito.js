'use client'

export default function Botoncito(props) {
    return <>
    <button className={props.className} onClick={props.onClick}>{props.text}</button>
    </>
}