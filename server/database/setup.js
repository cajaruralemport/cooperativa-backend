const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./server/database/cooperativa.db');

db.serialize(() => {
  // Tabla de usuarios
  db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT,
      correo TEXT UNIQUE,
      numero_cuenta TEXT UNIQUE,
      contraseña TEXT
    )
  `);

  // Tabla de préstamos
  db.run(`
    CREATE TABLE IF NOT EXISTS prestamos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      id_usuario INTEGER,
      monto REAL,
      fecha_prestamo TEXT,
      plazo_meses INTEGER,
      interes REAL,
      estado TEXT,
      FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
    )
  `);

  // Tabla de estados de cuenta
  db.run(`
    CREATE TABLE IF NOT EXISTS estados_cuenta (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fecha TEXT,
      descripcion TEXT,
      tipo TEXT,
      saldo_anterior REAL,
      saldo_actual REAL,
      id_prestamo INTEGER,
      FOREIGN KEY (id_prestamo) REFERENCES prestamos(id)
    )
  `);

  console.log("✅ Tablas creadas o ya existentes");
});

module.exports = db;