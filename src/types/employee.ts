import { User } from "./user";
import { Theater } from "./theater";

export interface Employee {
    id?: number;
    code: string;
    salary: number;
    hireAt: string;

    // User
    username: string;
    email: string;
    fullname: string;
    phone: string;
    gender: string;
    dob: string;
    nationality: string;
    role: string;

    userId: number;
    theaterId: number;
    theaterName?: string;
    managerId: number | null;
    managerName?: string;
    status?: string;
}