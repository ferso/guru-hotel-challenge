import { RolesType } from "../enums/roles-type";
import { CreateUserEvent } from "../events/create-user.event";
import { AggregateRoot } from "./aggregate-root";

export interface UserProps {
  id?: string;
  name?: string;
  email: string;
  token?: string;
  password?: string;
  role?: RolesType;
}

export class User extends AggregateRoot {
  name: string;
  email: string;
  token?: string;
  role?: RolesType;
  private password?: string;

  constructor(props?: UserProps) {
    super();
    this.setId(props.id);
    this.setName(props.name);
    this.setEmail(props.email);
    this.setToken(props.token);
    this.setPassword(props.password);
    this.setRole(RolesType[props.role]);
  }
  setName(name: string) {
    this.name = name;
  }
  setId(id: string) {
    this.id = id;
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

  protectPassword() {
    this.password = null;
  }

  async create(): Promise<void> {
    await this.emit(new CreateUserEvent(this));
  }
}
