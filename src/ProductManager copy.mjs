import fs from "fs";
import path from "path";

// ... rest of the code ...

class Product {
  id;
  title;
  description;
  code;
  price;
  status;
  stock;
  category;
  thumbnail;

  constructor(
    id,
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnail
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.code = code;
    this.price = price;
    this.status = status;
    this.stock = stock;
    this.category = category;
    this.thumbnail = thumbnail;
  }
}

class ProductManager {
  myPath;
  static idCount;

  constructor() {
    this.myPath = path.normalize(`./src/productos.json`);
    if (!ProductManager.idCount) ProductManager.idCount = 0;
  }

  async addProduct(
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnail
  ) {
    if (!fs.existsSync(this.myPath)) {
      let nuevo = new Product(
        ProductManager.idCount,
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnail
      );
      let listaVacia = [];
      listaVacia.push(nuevo);
      try {
        await fs.promises.writeFile(
          this.myPath,
          JSON.stringify(listaVacia, null, `\t`)
        );
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const productos = await fs.promises.readFile(this.myPath, `utf-8`);
        const productosObj = JSON.parse(productos);

        const p = productosObj.find((pro) => pro.code === code);

        if (p) {
          throw new Error("CODIGO repetido");
        } else {
          const nuevo = new Product(
            ProductManager.idCount,
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnail
          );
          productosObj.push(nuevo);

          await fs.promises.writeFile(
            this.myPath,
            JSON.stringify(productosObj, null, `\t`)
          );
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
  /**
   * Devuelve todos los productos en formato de arreglo.
   */
  getProducts() {
    let productosObj = [];
    if (fs.existsSync(this.myPath)) {
      const productos = fs.readFileSync(this.myPath, `utf-8`);
      productosObj = JSON.parse(productos);
    }
    return productosObj;
  }

  getProductById(id) {
    const productos = fs.readFileSync(this.myPath, `utf-8`);
    const productosObj = JSON.parse(productos);
    let p = productosObj.find((p) => p.id === id);

    if (p) {
      return p;
    } else {
      return `Not Found`;
    }
  }

  async updateProduct(id, campo, value) {
    const productos = await fs.promises.readFile(this.myPath, `utf-8`);
    const productosObj = JSON.parse(productos);
    let p = productosObj.find((p) => p.id === id);

    if (p) {
      p[campo] = value;
      await fs.promises.writeFile(
        this.myPath,
        JSON.stringify(productosObj, null, `\t`)
      );
      return;
    } else {
      console.log(`Not Found`);
      return;
    }
  }

  /**
   * Elimina producto con id deseado
   * @param id el numero de Id del producto que se desea eliminar
   */
  async deleteProduct(id) {
    const productos = await fs.promises.readFile(this.myPath, `utf-8`);
    const productosObj = JSON.parse(productos);
    const productosFiltered = productosObj.filter((p) => p.id !== id);
    await fs.promises.writeFile(
      this.myPath,
      JSON.stringify(productosFiltered, null, `\t`)
    );
  }
}
export { Product, ProductManager };
