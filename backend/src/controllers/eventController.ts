import { Request, Response } from 'express';
import Event from '../models/Event';
import { v2 as cloudinary } from 'cloudinary';

export const createEvent = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'No autorizado' });

    // Si el storage funciona, Cloudinary pone la URL en req.file.path
    const finalImageUrl = req.file?.path || 'https://via.placeholder.com/400x200?text=No+Image';

    const event = new Event({
      ...req.body,
      imageUrl: finalImageUrl,
      owner: req.user._id,
    });

    const savedEvent = await event.save();
    res.status(201).json(savedEvent);
  } catch (error: any) {
    console.error("ERROR:", error);
    res.status(500).json({ message: 'Error al crear', error: error.message });
  }
};

export const getMyEvents = async (req: Request, res: Response) => {
  try {
    if (!req.user)
      return res.status(401).json({ message: 'Usuario no autenticado' });
    const events = await Event.find({ owner: req.user._id }).sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener tus eventos', error });
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'No autorizado' });

    const event = await Event.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!event) {
      return res.status(404).json({ message: 'Evento no encontrado o no autorizado' });
    }

    // Borramos de Cloudinary si no es un placeholder
    if (event.imageUrl && event.imageUrl.includes('cloudinary')) {
      try {
        const parts = event.imageUrl.split('/');
        const fileName = parts[parts.length - 1].split('.')[0];
        const publicId = `events_app/${fileName}`;
        await cloudinary.uploader.destroy(publicId);
      } catch (cloudErr) {
        console.error("Error al borrar en Cloudinary:", cloudErr);
      }
    }
    
    await event.deleteOne(); 
    res.json({ message: 'Evento eliminado con éxito' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error al eliminar', error: error.message });
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  try {
    if (!req.user)
      return res.status(401).json({ message: 'Usuario no autenticado' });
    const { id } = req.params;
    // Searching current event
    const currentEvent = await Event.findById(id);
    if (!currentEvent)
      return res.status(404).json({ message: 'Evento no encontrado' });
    // Verificación de autoría 
    if (currentEvent.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'No tienes permiso para editar este evento' });
    }
    const { title, description, date, location, category } = req.body;
    let finalImageUrl = currentEvent.imageUrl;
    if (req.file) {
      if (currentEvent.imageUrl && currentEvent.imageUrl.includes('cloudinary')) {
        try {
          const parts = currentEvent.imageUrl.split('/');
          const lastPart = parts[parts.length - 1]; 
          const publicId = `events_app/${lastPart.split('.')[0]}`;
          await cloudinary.uploader.destroy(publicId);
        } catch (clodinaryError) {
          console.error("Error borrando imagen vieja:", clodinaryError);
        }
      }

      finalImageUrl = req.file.path; // Update with new image URL
    }
    // Update event with new data
    const event = await Event.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      {
        title,
        description,
        date: new Date(date),
        location,
        category,
        imageUrl: finalImageUrl,
      },
      { new: true }
    );
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el evento', error });
  }
};

export const getEventById = async (req: Request, res: Response) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      'owner',
      'name email'
    );
    if (!event) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el evento', error });
  }
};

export const getAllEvents = async (req: Request, res: Response) => {
  try {
    const { category, search, location, date } = req.query;
    let query: any = {};
    if (category) query.category = category;
    if (search) query.title = { $regex: search, $options: 'i' }; // Case-insensitive search in title
    if (location) query.location = { $regex: location, $options: 'i' }; // Case-insensitive search in location
    if (date) query.date = { $gte: new Date(date as string) }; // Get events from a specific date onwards
    const events = await Event.find(query)
      .sort({ date: 1 })
      .populate('owner', 'name email');
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los eventos', error });
  }
};
