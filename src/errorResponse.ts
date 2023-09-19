import { Request, Response, NextFunction } from "express";

interface ErrorResponse {
  message: string;
  data?: any;
}

const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log(error);

  const status: number = error.statusCode || 500;
  const message: string = error.message;
  const data: any = error.data;

  const errorResponse: ErrorResponse = {
    message: message,
  };

  if (data) {
    errorResponse.data = data;
  }

  res.status(status).json(errorResponse);
};

export default errorHandler;
