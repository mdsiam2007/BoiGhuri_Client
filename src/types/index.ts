export type BookCategory = 'Fiction' | 'Science' | 'History' | 'Kids' | 'Others';

export interface IBook {
  _id: string;
  title: string;
  author: string;
  category: BookCategory;
  image: string;
  description: string;
  totalCopies: number;
  userEmail: string;
  userName: string;
  createdAt: string;
  updatedAt?: string;
}

export interface IBorrow {
  _id: string;
  bookId: string | IBook;
  bookTitle: string;
  bookImage: string;
  userEmail: string;
  userName: string;
  borrowDate: string;
  returnDate: string;
  status: 'borrowed' | 'returned';
  createdAt: string;
}

export interface IReview {
  _id: string;
  bookId: string;
  userEmail: string;
  userName: string;
  userImage?: string;
  rating: number;
  comment: string;
  isEdited: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface IUser {
  id?: string;
  name: string;
  email: string;
  image?: string;
}
