import { article } from '../models/index.js';

export const ownerMiddleware = async (req, res, next) => {
  try {
    const { id } = req.params;

    const foundArticle = await article.findByPk(id);

    if (!foundArticle) {
      return res.status(404).json({
        success: false,
        message: 'Artículo no encontrado.',
      });
    }

    // Aca lo que dice es 
    // ¿El ID del autor original del artículo (foundArticle.user_id) es estrictamente igual al ID del usuario que está logueado intentando hacer el cambio (req.user.id)?"
    const isOwner = foundArticle.user_id === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Acceso denegado. Solo el autor o un administrador pueden realizar esta acción.',
      });
    }

    // Para saber si el usuario era el dueño del artículo, tu middleware ya tuvo que ir a la base de datos a buscar el artículo con article.findByPk(id). 
    // Si guardas esa información en la petición (req.article = foundArticle), le estás diciendo a Express: 
    // "Oye, ya encontré el artículo en la base de datos. Guárdalo aquí en la mochila (req) para que el controlador no tenga que volver a buscarlo".
    req.article = foundArticle;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al verificar la propiedad del recurso.',
      error: error.message,
    });
  }
};