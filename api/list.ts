import express from 'express';

export const router: express.Router = express.Router();

const createList = (req: express.Request, resp: express.Response): void | express.Response => {
  return;
}

const readList = (req: express.Request, resp: express.Response): void | express.Response => {
  return;
}

const readAllLists = (req: express.Request, resp: express.Response): void | express.Response => {
  return;
}

const updateList = (req: express.Request, resp: express.Response): void | express.Response => {
  return;
}

const deleteList = (req: express.Request, resp: express.Response): void | express.Response => {
  return;
}

const fourHundredNotSpecified = (req: express.Request, resp: express.Response): express.Response => resp.status(400).send('Request /api/lists/list_id, not /api/lists');

router.route('/').get(readAllLists)
                 .post(createList)
                 .put(fourHundredNotSpecified)
                 .delete(fourHundredNotSpecified);
router.route('/:listId').get(readList)
                        .put(updateList)
                        .delete(deleteList);
