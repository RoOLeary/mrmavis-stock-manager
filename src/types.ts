/* eslint-disable @typescript-eslint/no-unused-vars */
// Base Product type
export type Product = {
    map(arg0: ({ product }: never) => import("react/jsx-runtime").JSX.Element): import("react").ReactNode;
    id: string;
    title: string;
    description: string;
    price: number;
    quantity: number;
    createdAt: Date;  // when the product was added to the shop
    updatedAt: Date;  // when stock was last updated
    isAvailable: boolean;
    type: string;
  };
  
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
  

  export type Order = {
    map(arg0: ({ order }: never) => import("react/jsx-runtime").JSX.Element): import("react").ReactNode;
    id: string;
    title: string;
    description: string;
    price: number;
    quantity: number;
    createdAt: Date;  // when the product was added to the shop
    updatedAt: Date;  // when stock was last updated
    status: string;
    type: string;
  };