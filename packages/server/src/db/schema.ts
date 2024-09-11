import { engine } from "./engine"

async function deleteSchema(name: string, cascade: boolean = false) {
    const sql = `DROP SCHEMA ${name} ${cascade ? 'CASCADE' : ''};`
    const result = await engine.execute(sql)

    return result
}

export const schema = {
    deleteSchema
}