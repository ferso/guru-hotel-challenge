import { Field, ID } from "type-graphql";
import { Column, PrimaryGeneratedColumn } from "typeorm";

export enum RolesType {
  user = "user",
  admin = "admin",
}
export interface UserProps {
  id?: string;
  name?: string;
  email: string;
  token?: string;
  password?: string;
  role?: RolesType;
}
export class User {
  id?: string;
  name: string;
  email: string;
  token?: string;
  role?: RolesType;
  private password?: string;

  constructor(props?: UserProps) {
    this.setId(props.id);
    this.setName(props.name);
    this.setEmail(props.email);
    this.setPassword(props.password);
    this.setToken(props.token);
    this.setRole(RolesType[props.role]);
  }
  setId(id: string) {
    this.id = id;
  }

  setName(name: string) {
    this.name = name;
  }

  setEmail(email: string) {
    this.email = email;
  }

  setPassword(password: string) {
    this.password = password;
  }
  getPassword() {
    return this.password;
  }

  setToken(token: string) {
    this.token = token;
  }

  getToken(): string {
    return this.token;
  }
  setRole(role: RolesType) {
    this.role = role;
  }
  serialize() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      role: this.role,
    };
  }
}
