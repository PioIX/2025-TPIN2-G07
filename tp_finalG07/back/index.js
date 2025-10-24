var express = require('express'); //Tipo de servidor: Express
var bodyParser = require('body-parser'); //Convierte los JSON
var cors = require('cors');
const { realizarQuery } = require('./modulos/mysql');

var app = express(); //Inicializo express
var port = process.env.PORT || 4000; //Ejecuto el servidor en el puerto 3000

// Convierte una petición recibida (POST-GET...) a objeto JSON
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
// Puerto por el que estoy ejecutando la página Web

const session = require('express-session');
// Para el manejo de las variables de sesión

const server = app.listen(port, () => {
	console.log(`Servidor NodeJS corriendo en http://localhost:${port}/`);
});;

const io = require('socket.io')(server, {
	cors: {
		// IMPORTANTE: REVISAR PUERTO DEL FRONTEND
		origin: ["http://localhost:3000", "http://localhost:3001"], // Permitir el origen localhost:3000
		methods: ["GET", "POST", "PUT", "DELETE"],  	// Métodos permitidos
		credentials: true                           	// Habilitar el envío de cookies
	}
});

const sessionMiddleware = session({
	//Elegir tu propia key secreta
	secret: "supersarasa",
	resave: false,
	saveUninitialized: false
});

app.use(sessionMiddleware);

io.use((socket, next) => {
	sessionMiddleware(socket.request, {}, next);
});

//Ahora van los eventos

io.on("connection", (socket) => {
	const req = socket.request;

	socket.on('joinRoom', data => {
		console.log("🚀 ~ io.on ~ req.session.room:", req.session.room)
		if (req.session.room != undefined)
		socket.leave(req.session.room);
		req.session.room = data.room;
		socket.join(req.session.room);

		io.to(req.session.room).emit('chat-messages', { user: req.session.user, room: req.session.room });
	});

	socket.on('pingAll', data => {
		console.log("PING ALL: ", data);
		io.emit('pingAll', { event: "Ping to all", message: data });
	});

	socket.on('sendMessage', data => {
		io.to(req.session.room).emit('newMessage', { room: req.session.room, message: data });
	});

	socket.on('disconnect', () => {
		console.log("Disconnect");
	})
});

app.get('/', function (req, res) {
    res.status(200).send({
        message: 'GET Home route working fine!'
    });
});

app.get('/traerUsuarios', async function (req, res) {
    try {
        let respuesta = await realizarQuery(`SELECT * FROM Usuarios WHERE username = "${req.query.username}"`)
        res.send({ mensaje: respuesta })
    } catch (error) {
        res.send({ mensaje: "error", error })
    }
})

app.post('/crearUsuario', async function (req, res) {
    try {
        check = await realizarQuery(`SELECT * FROM Usuarios WHERE username = "${req.body.username}"`)
        if (check.length > 0) {
            res.send({ mensaje: "El usuario ya existe" })
        } else {
            await realizarQuery(`INSERT INTO Usuarios (username, password, record) VALUES/n
            ('${req.body.username}', '${req.body.password}', ${req.body.record})`)
            res.send(await realizarQuery(`SELECT id_usuario FROM Usuarios WHERE username = '${req.body.username}'`))
        }

    } catch (error) {
        res.send({ mensaje: "error", error })
    }

})

app.get('/prueba', async function (req, res) {
	res.send({ mensaje:await realizarQuery(`SELECT * FROM Users`)});
});

app.get('/usuarios', async function (req, res) {
	res.send({ mensaje:await realizarQuery(`SELECT * FROM Usuarios`)});
});

app.get('/jugadores', async function (req, res) {
	res.send({ mensaje:await realizarQuery(`SELECT * FROM Usuarios`)});
});