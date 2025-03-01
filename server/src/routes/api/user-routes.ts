import { Router } from 'express';
import {
  createUser,
  login,
  getSingleUser,
  saveBook,
  deleteBook,
} from '../../controllers/user-controller';
import { authenticateToken } from '../../services/auth';

const router = Router();

/**
 * NOTE:
 * We define the route handlers to return Promise<void>,
 * then call our controller functions which themselves
 * handle the response. We do NOT return the response from
 * these route handlers, we simply await and then return void.
 */

router.post('/', async (req, res, next): Promise<void> => {
  try {
    await createUser(req, res);
  } catch (err) {
    next(err);
  }
});

router.put('/', authenticateToken, async (req, res, next): Promise<void> => {
  try {
    await saveBook(req, res);
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next): Promise<void> => {
  try {
    await login(req, res);
  } catch (err) {
    next(err);
  }
});

router.get('/me', authenticateToken, async (req, res, next): Promise<void> => {
  try {
    await getSingleUser(req, res);
  } catch (err) {
    next(err);
  }
});

router.delete('/books/:bookId', authenticateToken, async (req, res, next): Promise<void> => {
  try {
    await deleteBook(req, res);
  } catch (err) {
    next(err);
  }
});

export default router;
