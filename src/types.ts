/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-nocheck
// Base Product type
export interface Product {
    id: string; // Or number if it's numeric
    title: string;
    description: string;
    quantity: number;
    type: string;
    price: number;
    isAvailable: boolean;
  }
  
  // Specific product types
  // @ts-expect-error tsh
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type TShirt = Product & {
    type: 'tshirt';  // ProductType can be a union type here
    // Additional fields specific to t-shirts, if needed
  };
    // @ts-expect-error trou
  type Trouser = Product & {
    type: 'trouser';  // ProductType can be a union type here
    // Additional fields specific to trousers, if needed
  };
  
  // Stock Update type
    // @ts-expect-error stu
  type StockUpdate = {
    productId: string;
    quantityAdded: number;
    productionFacilityAge: number;  // tracks how old the production facility is
  };  
  // Choose either union type or enum, not both
  // Using union type here:
  // @ts-expect-error prod
  type ProductType = 'tshirt' | 'trouser';  // This is simple and flexible
  

  export interface Order {
    id?: string;
    title?: string;
    description?: string;
    type?: string;
    price?: number;
    quantity?: number;
    total?: number;
    status?: string;
    createdAt: string; // assuming createdAt is a string, you can change it based on your actual structure
    product: {
      id: string;
      quantity: number;
    };
  }
  

  type OrderType = {
    id: string;
    title: string;
    description: string;
    type: string;
    price: number;
    quantity: number;
    total: number;
    status: string;
    product: { id: string; quantity: number }; // Assuming product exists
  };
  