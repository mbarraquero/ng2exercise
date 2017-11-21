export interface IUser {
    id: number;
    userName: string;
    password: string;
    fullName: string;
    friends: IUser[];
    requests: IUser[];
    pic: string;
}