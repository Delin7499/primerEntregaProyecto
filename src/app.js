import express from "express";
import productRouter from "./routes/router.productos.js";
import cartsRouter from "./routes/router.carts.js";

const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(`/api/products`, productRouter);

app.use(`/api/carts`, cartsRouter);

app.listen(8080, () => console.log(`funca`));
