import { Router } from 'express'
import { getAllLoanHandler } from '../handlers/loan.handler.js'
import { catchError } from '../middlewares/catch-error.js'
import { limiter } from '../middlewares/rate-limiter.js'

const loanRouter: Router = Router()

loanRouter.get('/all-loans', limiter, catchError(getAllLoanHandler))

export default loanRouter
