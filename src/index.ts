import 'reflect-metadata';

import { app } from './app';

(async () => {
  try {
    await app();
  } catch (error) {
    console.log(error);
    return;
  }
})();
