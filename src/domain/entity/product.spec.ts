import { Product } from "./product";

describe("Product unit tests", () => {
  it("should throw error when id is empty", () => {
    expect(() => {
      new Product("", "Product 1", 100);
    }).toThrowError("Id is required");
  });

  it("should throw error when name is empty", () => {
    expect(() => {
      new Product("p1", "", 100);
    }).toThrowError("Name is required");
  });

  it("should throw error when the price is less than zero", () => {
    expect(() => {
      new Product("p1", "Product 1", -1);
    }).toThrowError("Price must be greater then zero");
  });

  it("should change name", () => {
    const product = new Product("p1", "Product 1", 100);
    product.changeName("Product 2");
    expect(product.name).toBe("Product 2");
  });

  it("should change price", () => {
    const product = new Product("p1", "Product 1", 100);
    product.changePrice(200);
    expect(product.price).toBe(200);
  });
});
