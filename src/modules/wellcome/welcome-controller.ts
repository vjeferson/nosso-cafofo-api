import { Request, Response } from 'express';

export default class WellcomeController {

    constructor() { };

    async wellcome(request: Request, response: Response) {
        // try {
        //     const filters = request.query;

        //     if (!filters.subject || !filters.week_day || !filters.time) {
        //         return response.status(400).json({
        //             error: 'Missing filters', message: 'Missing filters to search classes',
        //         });
        //     }

        //     const service = new ClassesService();
        //     const classes = await service.find(filters);
            return response.status(200).send('Hello World!');
        // } catch (error) {
        //     return response.status(400).json({ error: 'Unexpected error while creating new class', message: error.message });
        // }
    }

}