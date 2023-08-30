import { Router } from "express";
import { Product, ProductManager } from "../ProductManager.mjs";

const pm = new ProductManager();

const productRouter = Router();

productRouter.get("/", (req, res) => {
  const productos = pm.getProducts();
  if (req.query.limit) {
    return res.send(productos.slice(0, req.query.limit));
  }
  return res.status(200).send(productos);
});

productRouter.get("/:pid", (req, res) => {
  const pid = parseInt(req.params.pid, 10);
  const p = pm.getProductById(pid);
  if (p) {
    res.status(200).send(p);
  } else {
    res.status(404).send();
  }
});

productRouter.post(`/`, async (req, res) => {
  if (
    req.body.title &&
    req.body.description &&
    req.body.code &&
    req.body.price &&
    req.body.status &&
    req.body.stock &&
    req.body.category
  ) {
    const thumbnail = req.body.thumbnail ?? "";
    try {
      await pm.addProduct(
        req.body.title,
        req.body.description,
        req.body.code,
        req.body.price,
        req.body.status,
        req.body.stock,
        req.body.category,
        thumbnail
      );
      res.status(200).send();
    } catch (error) {
      if (error.message === "CODIGO repetido") {
        res.status(409).send("CODIGO repetido");
      } else {
        res.status(400).send();
      }
    }
  } else {
    res.status(400).send();
  }
});

productRouter.delete("/:pid", async (req, res) => {
  const pid = parseInt(req.params.pid, 10);

  try {
    await pm.deleteProduct(pid);
    res.status(204).send();
  } catch (error) {
    res.status(500).send("Error");
  }
});

productRouter.put("/:pid", async (req, res) => {
  const pid = parseInt(req.params.pid, 10);
  const updatedData = req.body;

  try {
    await pm.updateProduct(pid, updatedData);
    res.status(204).send();
  } catch (error) {
    res.status(500).send(error);
  }
});

export default productRouter;
