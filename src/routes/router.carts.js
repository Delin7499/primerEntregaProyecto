import { Router } from "express";
import fs from "fs";

const myPath = `./src/carritos.json`;

const cartsRouter = Router();

cartsRouter.get(`/`, (req, res) => {
  console.log(`router carts`);
});

export default cartsRouter;
