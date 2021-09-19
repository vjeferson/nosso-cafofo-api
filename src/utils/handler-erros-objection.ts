import { Response } from 'express';

import {
    ValidationError,
    NotFoundError,
    DBError,
    UniqueViolationError,
    NotNullViolationError,
    ForeignKeyViolationError,
    CheckViolationError,
    DataError
} from 'objection';

export default function errorHandlerObjection(err: any, response: Response) {
    if (err instanceof ValidationError) {
        switch (err.type) {
            case 'ModelValidation':
                response.status(400).send({
                    message: err.message,
                    type: err.type,
                    data: err.data
                });
                break;
            case 'RelationExpression':
                response.status(400).send({
                    message: err.message,
                    type: 'RelationExpression',
                    data: {}
                });
                break;
            case 'UnallowedRelation':
                response.status(400).send({
                    message: err.message,
                    type: err.type,
                    data: {}
                });
                break;
            case 'InvalidGraph':
                response.status(400).send({
                    message: err.message,
                    type: err.type,
                    data: {}
                });
                break;
            default:
                response.status(400).send({
                    message: err.message,
                    type: 'UnknownValidationError',
                    data: {}
                });
                break;
        }
    } else if (err instanceof NotFoundError) {
        response.status(404).send({
            message: err.message,
            type: 'NotFound',
            data: {}
        });
    } else if (err instanceof UniqueViolationError) {
        response.status(409).send({
            message: err.message,
            type: 'UniqueViolation',
            data: {
                columns: err.columns,
                table: err.table,
                constraint: err.constraint
            }
        });
    } else if (err instanceof NotNullViolationError) {
        response.status(400).send({
            message: err.message,
            type: 'NotNullViolation',
            data: {
                column: err.column,
                table: err.table
            }
        });
    } else if (err instanceof ForeignKeyViolationError) {
        response.status(409).send({
            message: err.message,
            type: 'ForeignKeyViolation',
            data: {
                table: err.table,
                constraint: err.constraint
            }
        });
    } else if (err instanceof CheckViolationError) {
        response.status(400).send({
            message: err.message,
            type: 'CheckViolation',
            data: {
                table: err.table,
                constraint: err.constraint
            }
        });
    } else if (err instanceof DataError) {
        response.status(400).send({
            message: err.message,
            type: 'InvalidData',
            data: {}
        });
    } else if (err instanceof DBError) {
        response.status(500).send({
            message: err.message,
            type: 'UnknownDatabaseError',
            data: {}
        });
    } else {
        response.status(500).send({
            message: err.message,
            type: 'UnknownError',
            data: {}
        });
    }
}