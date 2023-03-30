import { Request, Response, NextFunction } from "express";
import { CommonResponse, ResponseError } from "../types/response";

export const ErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const error = new ResponseError({
    status: err.status || 500,
    msg: err.message || err.msg || "No message",
    reason: err.reason || err.stack || "Somebody failed",
    url: req.originalUrl,
    ip: req.ip,
    validationErrors: [],
  });

  res.status(error.status);
  res.json(new CommonResponse({ status: false, error }));
};


const { graphql } = require('graphql');

export const errorHandlerMiddleware = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await graphql({        
        source: req.body.query,
        variableValues: req.body.variables,
        operationName: req.body.operationName,
        contextValue: { req, res },
      });

      if (result.errors) {
        const errors = result.errors.map((error: any) => ({
          message: error.message,
          locations: error.locations,
          path: error.path,
        }));
        res.status(400).json({ errors });
      } else {
        res.json({ data: result.data });
      }
    } catch (err) {
      next(err);
    }
  };
}