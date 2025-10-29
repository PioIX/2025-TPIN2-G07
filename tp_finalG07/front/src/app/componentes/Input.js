"use client";

import React from "react";
import clsx from "clsx";
// 👇 Ruta corregida (sube una carpeta y entra a /lobby/)
import styles from "../lobby/page.module.css";

export default function Input({ value, onChange, placeholder, className }) {
  return (
    <input type="text" onChange={onChange} placeholder={placeholder} className={clsx(styles.inputLobby, className)}
    />
  );
}
