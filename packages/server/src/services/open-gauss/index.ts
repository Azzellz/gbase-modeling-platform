import Elysia from "elysia";
import { TableService } from "./table";
import { SchemaService } from "./schema";
import { StatusService } from "./status";

export const OpenGaussService = new Elysia().use(TableService).use(SchemaService).use(StatusService)