import Comment from './comment.model.js';

// Crear comentario
export const createComment = async (req, res) => {
  try {
    const { post, content } = req.body;
    const author = req.user.id;

    const comment = new Comment({ post, author, content });

    res.status(201).json({ success: true, message: 'Comentario creado', data: comment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al crear comentario', error: error.message });
  }
};

// Editar comentario
export const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const comment = await Comment.findById(id);
    if (!comment) return res.status(404).json({ success: false, message: 'Comentario no encontrado' });
    if (comment.author.toString() !== req.user.id)
      return res.status(403).json({ success: false, message: 'No puedes editar este comentario' });

    comment.content = content;
    comment.updatedAt = new Date();

    await comment.save();

    res.status(200).json({ success: true, message: 'Comentario actualizado', data: comment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al actualizar comentario', error: error.message });
  }
};

// Eliminar comentario
export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);
    if (!comment) return res.status(404).json({ success: false, message: 'Comentario no encontrado' });
    if (comment.author.toString() !== req.user.id)
      return res.status(403).json({ success: false, message: 'No puedes eliminar este comentario' });

    await comment.remove();

    res.status(200).json({ success: true, message: 'Comentario eliminado' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al eliminar comentario', error: error.message });
  }
};
