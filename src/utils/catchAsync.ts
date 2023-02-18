import {
  type Request,
  type Response,
  type NextFunction,
  type RequestHandler,
} from 'express'

type asyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>

const catchAsync =
  (v: asyncRequestHandler): RequestHandler =>
  (req, res, next) => {
    v(req, res, next).catch(next)
  }

export { catchAsync as default }
