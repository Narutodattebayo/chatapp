export as namespace IUser;

import { Document } from "mongoose";

export interface User extends Document {
  name:string,
  email:string,
  password:string,
  countryCode:string,
  image:string,
  phoneNo:string
}

interface UserDevice {
    id?: string,
    name?: string,
    platform?: string,
    token?: string,
    version?: string
}

export interface UserSession extends Document {
    device?: UserDevice,
    isActive: boolean,
    userId: User['_id'],
}

export namespace Request {
    export interface CreateUser {
        name: User['name'],
        email: User['email'],
        password: User['password'],
        countryCode:User['countryCode'],
        image:User['image'],
        phoneNo:User['phoneNo']
    }
}