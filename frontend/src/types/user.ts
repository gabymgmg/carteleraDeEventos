export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  businessName?: string;
  description?: string;
  businessAddress?: string;
}
