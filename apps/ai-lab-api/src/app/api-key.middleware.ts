import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class ApiKeyMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    if (req.path.startsWith('/v1/')) {
      console.log('API key middleware');
      const apiKey = req.headers['x-api-key'] as string;

      console.log('API key: ', apiKey);

      if (!apiKey || apiKey !== process.env.API_KEY) {
        return res.status(401).json({
          status: 'error',
          message: 'Unauthorized: Invalid API key',
        });
      }
    }

    next();
  }
}
