import Ajv from 'ajv'
import addFormats from 'ajv-formats'

const ajv = new Ajv({ allErrors: true })
addFormats(ajv)

export function validateSchema(schema: object, data: unknown): { valid: boolean; errors: string | null } {
    const validate = ajv.compile(schema)
    const valid = validate(data)

    if (!valid) {
        const errors = validate.errors?.map(e => `${e.instancePath} ${e.message}`).join(', ')
        return { valid: false, errors: errors || 'Unknown error' }
    }

    return { valid: true, errors: null }
}