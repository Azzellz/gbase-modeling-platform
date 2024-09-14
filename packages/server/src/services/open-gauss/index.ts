import Elysia from "elysia";
import { TableService } from "./table";
import { SchemaService } from "./schema";
import { StatusService } from "./status";
import { Plugins } from "@/plugins";

export const OpenGaussService = new Elysia().use(Plugins.Auth).use(TableService).use(SchemaService).use(StatusService)