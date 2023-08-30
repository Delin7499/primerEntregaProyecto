import fs from "fs";
import path from "path";

class Product {
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
  idCount;
  myPath;

  constructor() {
    this.myPath = path.normalize(`./src/productos.json`);
    this.idCount = 0;
  }

  getHighestId(products) {
    let highestId = 0;
    for (const product of products) {
      if (product.id > highestId) {
        highestId = product.id;
      }
    }
    return highestId;
  }

  async addProduct(
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumnail
  ) {
    try {
      const productosObj = this.getProducts();

      const p = productosObj.find((pro) => pro.code === code);
      if (p) {
        throw new Error("CODIGO repetido");
      }
      const newId = this.getHighestId(productosObj) + 1;
      const nuevo = new Product(
        newId,
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumnail
      );
      this.idCount++;
      productosObj.push(nuevo);

      await fs.promises.writeFile(
        this.myPath,
        JSON.stringify(productosObj, null, `\t`)
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  getProducts() {
    let productosObj = [];
    if (fs.existsSync(this.myPath)) {
      const productos = fs.readFileSync(this.myPath, `utf-8`);
      productosObj = JSON.parse(productos);
    }
    return productosObj;
  }

  getProductById(id) {
    const productosObj = this.getProducts();
    const p = productosObj.find((p) => p.id === id);
    return p;
  }

  async updateProduct(id, newData) {
    try {
      const productosObj = await this.getProducts();
      const index = productosObj.findIndex((p) => p.id === id);
      if (index !== -1) {
        productosObj[index] = {
          ...productosObj[index],
          ...newData,
          id,
        };
        await fs.promises.writeFile(
          this.myPath,
          JSON.stringify(productosObj, null, `\t`)
        );
        console.log(`Not Found`);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async deleteProduct(id) {
    try {
      const productosObj = await this.getProducts();
      const productosFiltered = productosObj.filter((p) => p.id !== id);
      await fs.promises.writeFile(
        this.myPath,
        JSON.stringify(productosFiltered, null, `\t`)
      );
    } catch (error) {
      console.log(error);
    }
  }
}

export { Product, ProductManager };
