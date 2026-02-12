export interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: 'Concierto' | 'Teatro' | 'Deportes' | 'Feria';
  imageUrl?: string;
  owner: string | { _id: string; name: string; email: string };
  createdAt: string;
}
