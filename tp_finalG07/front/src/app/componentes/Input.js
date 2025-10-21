'use client'

export default function Input(props) { 
    return <input type="text" value={props.value} onChange={props.onChange} placeholder={props.placeholder} />}