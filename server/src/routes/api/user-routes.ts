import { Router } from 'express';
import { createUser, login, getSingleUser, saveBook, deleteBook } from '../../controllers/user-controller';
import { authenticateToken } from '../../services/auth';

const router = Router();

router.post('/', async (req, res, next) => {
  try {
    await createUser(req, res);
  } catch (err) {
    next(err);
  }
});

router.put('/', authenticateToken, async (req, res, next) => {
  try {
    await saveBook(req, res);
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    await login(req, res);
  } catch (err) {
    next(err);
  }
});

router.get('/me', authenticateToken, async (req, res, next) => {
  try {
    await getSingleUser(req, res);
  } catch (err) {
    next(err);
  }
});

router.delete('/books/:bookId', authenticateToken, async (req, res, next) => {
  try {
    await deleteBook(req, res);
  } catch (err) {
    next(err);
  }
});

export default router;
