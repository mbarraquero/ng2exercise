import { PostType } from './constants.model';
import { IUser } from './user.model';

export interface IPost {
    id: number;
    user: IUser;
    likes: IUser[],
    content: string;
    type: PostType;
    date: Date;
    replies: IPost[];
}