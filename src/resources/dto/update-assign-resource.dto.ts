import { PartialType } from "@nestjs/mapped-types";
import { AssignResourceDto } from "./assign-resource.dto";

export class UpdateAssignResourceDto extends PartialType(AssignResourceDto) {}