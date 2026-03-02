import Post from './post.model.js';

// Crear publicación
export const createPost = async (req, res) => {
  try {
    const { title, category, content } = req.body;
    const author = req.user.id;

    const post = new Post({ title, category, content, author });
    await post.save();

    res.status(201).json({ success: true, message: 'Publicación creada', data: post });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al crear publicación', error: error.message });
  }
};

// Editar publicación
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, content } = req.body;

    const post = await Post.findById(id);
    if (!post) 
      return res.status(404).json({ success: false, message: 'Publicación no encontrada' });

    // Comparación segura de ObjectId con string usando equals()
    if (!post.author.equals(req.user.id)) {
      console.log('post.author:', post.author);
      console.log('req.user.id:', req.user.id);
      return res.status(403).json({ success: false, message: 'No puedes editar esta publicación' });
    }

    if (title) post.title = title;
    if (category) post.category = category;
    if (content) post.content = content;
    post.updatedAt = new Date();

    await post.save();

    res.status(200).json({ success: true, message: 'Publicación actualizada', data: post });
  } catch (error) {
    console.error('Error en updatePost:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar publicación', error: error.message });
  }
};

// Eliminar publicación
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ success: false, message: 'Publicación no encontrada' });

    // Comparación segura ObjectId vs string
    if (!post.author.equals(req.user.id)) {
      console.log('post.author:', post.author);
      console.log('req.user.id:', req.user.id);
      return res.status(403).json({ success: false, message: 'No puedes eliminar esta publicación' });
    }

    await post.deleteOne();

    res.status(200).json({ success: true, message: 'Publicación eliminada' });
  } catch (error) {
    console.error('Error en deletePost:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar publicación', error: error.message });
  }
};