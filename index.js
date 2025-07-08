const express = require('express');
const cors = require('cors');
const app = express();
const db = require('./server/database/connection');
const authRoutes = require('./server/routes/auth');
const prestamosRoutes = require('./server/routes/prestamos');

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/prestamos', prestamosRoutes);

app.get('/', (req, res) => {
  res.send('Servidor de la cooperativa funcionando 🎉');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
