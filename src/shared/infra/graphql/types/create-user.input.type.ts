import { ArgsType, Field, InputType } from "type-graphql";
import {
  MaxLength,
  IsEmail,
  IsString,
  MinLength,
  Matches,
} from "class-validator";
import { RolesType } from "src/shared/domain/enums/roles-type";

@ArgsType()
export class CreateUserInput {
  @Field()
  name: string;
  @Field()
  @IsEmail()
  email: string;
  @Field()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  password: string;
  @Field((type) => RolesType)
  role: string;
}
