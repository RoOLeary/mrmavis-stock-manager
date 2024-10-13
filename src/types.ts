// Base Product type
export type Product = {
    map(arg0: ({ product }: any) => import("react/jsx-runtime").JSX.Element): import("react").ReactNode;
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
  type TShirt = Product & {
    type: 'tshirt';  // ProductType can be a union type here
    // Additional fields specific to t-shirts, if needed
  };
  
  type Trouser = Product & {
    type: 'trouser';  // ProductType can be a union type here
    // Additional fields specific to trousers, if needed
  };
  
  // Stock Update type
  type StockUpdate = {
    productId: string;
    quantityAdded: number;
    productionFacilityAge: number;  // tracks how old the production facility is
  };
  
  // Order type for processing purchases
  type Order = {
    productId: string;
    quantityOrdered: number;
    orderStatus: 'pending' | 'fulfilled' | 'partial' | 'failed';
    productsDelivered: Partial<Product>[];  // if partially fulfilled
  };
  
  // Choose either union type or enum, not both
  // Using union type here:
  type ProductType = 'tshirt' | 'trouser';  // This is simple and flexible
  