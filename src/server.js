import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import { sequelize } from './models/index.js';

import authRoutes from './routes/auth.routes.js';
import usersRoutes from './routes/user.routes.js';
import tagsRoutes from './routes/tag.routes.js';
import articlesRoutes from './routes/articles.routes.js';
import articlesTagsRoutes from './routes/articlesTags.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/tags', tagsRoutes);
app.use('/api/articles', articlesRoutes);
app.use('/api/articles-tags', articlesTagsRoutes);


app.get('/', (req, res) => {
  res.json({ message: 'API del Sistema de Gestión de Blog Personal funcionando' });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Ruta no encontrada.' });
});

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');

    await sequelize.sync();
    console.log('Modelos sincronizados con la base de datos.');

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error.message);
    process.exit(1);
  }
};

startServer();