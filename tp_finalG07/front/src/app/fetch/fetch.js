export async function jugadores(dato) {
  try {
    // consoles para debug
    console.log("👉 Enviando:", dato);
    console.log("🌐 Contactando backend en: http://localhost:4000/jugadores");

    const res = await fetch("http://localhost:4000/jugadores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dato),
    });

    const data = await res.json();
    // confima el formato de data y sino lo transforma en array vacio,
    //  evita que el map desp no funque
    return Array.isArray(data.mensaje) ? data.mensaje : [];

  } catch (error) {
    console.error("Error jugadores:", error);
    return [];
  }
}


export async function crearUsuario(dato) {
  const response = await fetch(`http://localhost:4000/crearUsuario`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dato)
  })
  const data = await response.json();
  return data;
}


export async function buscarUsuario(dato) {
  const response = await fetch(`http://localhost:4000/buscarUsuario`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dato)
  })
  const data = await response.json();
  return data;
}


export async function crearSala(dato) {
  console.log(dato)
  const response = await fetch(`http://localhost:4000/crearSala`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dato)
  })
  const data = await response.json();
  return data;
}


export async function buscarSala(dato) {
  const response = await fetch(`http://localhost:4000/buscarSala`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dato)
  })
  const data = await response.json();
  return data;
}

export async function agregarASala(dato) {
  console.log("DATO ES", dato)
  const response = await fetch(`http://localhost:4000/agregarASala`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dato),
  });
  const data = await response.json();
  return data;
}


export async function obtenerDeSala(dato) {
  const response = await fetch(`http://localhost:4000/salasxusuarios`, {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dato),
  });
  const data = await response.json();
  return data;
}

export async function buscarEnSala(dato) {
  const response = await fetch(`http://localhost:4000/buscarEnSala`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dato),
  });
  const data = await response.json();
  return data;
}


export async function definirImpostor(dato) {
  const response = await fetch(`http://localhost:4000/actualizarImpostor`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dato),
  });
  const data = await response.json();
  return data;
}


export async function palabraAleatoria(dato) {
  const response = await fetch(`http://localhost:4000/palabraAleatoria`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dato),
  });
  const data = await response.json();
  return data;
}
