import { Router } from "express";
import fs from "fs";

const carritosPath = "./src/carritos.json";

const cartRouter = Router();

const getHighestId = (products) => {
  let highestId = 0;
  for (const product of products) {
    if (product.id > highestId) {
      highestId = product.id;
    }
  }
  return highestId;
};

async function getCartsFromFile() {
  try {
    const data = await fs.promises.readFile(carritosPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function saveCartsToFile(carts) {
  await fs.promises.writeFile(carritosPath, JSON.stringify(carts, null, "\t"));
}

cartRouter.post("/", async (req, res) => {
  try {
    const carts = await getCartsFromFile();
    const newId = getHighestId(carts) + 1;
    const newCart = {
      id: newId,
      products: [],
    };

    carts.push(newCart);
    await saveCartsToFile(carts);

    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).send("Error");
  }
});

cartRouter.get("/:cid", async (req, res) => {
  const cartId = parseInt(req.params.cid, 10);

  try {
    const carts = await getCartsFromFile();
    const cart = carts.find((cart) => cart.id === cartId);
    if (cart) {
      res.status(200).json(cart.products);
    } else {
      res.status(404).send("Not found");
    }
  } catch (error) {
    res.status(500).send("Error");
  }
});

cartRouter.post("/:cid/product/:pid", async (req, res) => {
  const cartId = parseInt(req.params.cid, 10);
  const productId = parseInt(req.params.pid, 10);

  try {
    const carts = await getCartsFromFile();
    const cart = carts.find((cart) => cart.id === cartId);

    if (!cart) {
      res.status(404).send("Not found");
      return;
    }

    const p = cart.products.find((product) => product.product === productId);

    if (p) {
      p.quantity++;
    } else {
      cart.products.push({
        product: productId,
        quantity: 1,
      });
    }

    await saveCartsToFile(carts);
    res.status(200).send("Product added to cart");
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

export default cartRouter;
