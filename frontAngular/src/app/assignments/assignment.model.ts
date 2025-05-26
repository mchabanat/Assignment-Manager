export class Assignment {
  _id?: string;
  id?: number;
  name!: string;
  dueDate!: string;
  submitted!: boolean;
  author!: string;
  subject?: {
    name: string;
    image: string;
    professor?: {
      name: string;
      photo: string;
    }
  };
  grade?: number | null;
  remarks?: string;
}
