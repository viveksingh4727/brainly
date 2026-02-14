import { nanoid } from "nanoid";


export const generateHash = (len: number) => {
    return nanoid(len);
}