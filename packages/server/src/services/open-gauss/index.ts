import Elysia from "elysia";
import { TableService } from "./table";
import { SchemaService } from "./schema";

export const OpenGaussService = new Elysia().use(TableService).use(SchemaService)