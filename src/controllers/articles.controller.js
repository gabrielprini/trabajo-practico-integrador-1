export const getAllArticles = async (req, res) => {
  try {
    const articles = await article.findAll({
      where: { status: 'published' },
      include: [
        { association: 'author', attributes: ['id', 'username'] },
        { association: 'tags' },
      ],
    });

    return res.status(200).json({
      success: true,
      data: articles,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al obtener los artículos.',
      error: error.message,
    });
  }
};

export const getArticleById = async (req, res) => {
  try {
    const { id } = req.params;

    const foundArticle = await article.findByPk(id, {
      include: [
        { association: 'author', attributes: ['id', 'username'] },
        { association: 'tags' },
      ],
    });

    if (!foundArticle) {
      return res.status(404).json({
        success: false,
        message: 'Artículo no encontrado.',
      });
    }

    return res.status(200).json({
      success: true,
      data: foundArticle,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al obtener el artículo.',
      error: error.message,
    });
  }
};

export const getUserArticles = async (req, res) => {
  try {
    const articles = await article.findAll({
      where: { user_id: req.user.id, status: 'published' },
      include: { association: 'tags' },
    });

    return res.status(200).json({
      success: true,
      data: articles,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al obtener tus artículos.',
      error: error.message,
    });
  }
};

export const getUserArticleById = async (req, res) => {
  try {
    const { id } = req.params;

    const foundArticle = await article.findOne({
      where: { id, user_id: req.user.id },
      include: { association: 'tags' },
    });

    if (!foundArticle) {
      return res.status(404).json({
        success: false,
        message: 'Artículo no encontrado entre tus artículos.',
      });
    }

    return res.status(200).json({
      success: true,
      data: foundArticle,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al obtener el artículo.',
      error: error.message,
    });
  }
};

export const createArticle = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { title, content, excerpt, status } = req.body;

    const newArticle = await article.create({
      title,
      content,
      //
      excerpt: excerpt || null,
      status: status || 'published',
      user_id: req.user.id, // el autor siempre es el usuario autenticado
    });

    return res.status(201).json({
      success: true,
      message: 'Artículo creado correctamente.',
      data: newArticle,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al crear el artículo.',
      error: error.message,
    });
  }
};

export const updateArticle = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { title, content, excerpt, status } = req.body;

    await req.article.update({ title, content, excerpt, status });

    return res.status(200).json({
      success: true,
      message: 'Artículo actualizado correctamente.',
      data: req.article,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al actualizar el artículo.',
      error: error.message,
    });
  }
};

export const deleteArticle = async (req, res) => {
  try {
    // req.article ya viene cargado por ownerMiddleware
    const articleToDelete = req.article;

    // Eliminación en cascada: primero borramos todas las asociaciones
    // en la tabla intermedia ArticleTag que referencien a este artículo.
    await articleTag.destroy({ where: { article_id: articleToDelete.id } });

    // Luego eliminamos el artículo (eliminación lógica, porque Article
    // tiene paranoid: true → esto solo completa deleted_at).
    await articleToDelete.destroy();

    return res.status(200).json({
      success: true,
      message: 'Artículo eliminado correctamente, junto con sus etiquetas asociadas.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al eliminar el artículo.',
      error: error.message,
    });
  }
};