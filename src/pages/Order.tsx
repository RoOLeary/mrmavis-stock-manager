import { useState, useEffect } from "react";
import PurchaseProduct from "../components/PurchaseProduct";

const Order = () => {
  const [orderNumber, setOrderNumber] = useState("");

  // Generate a random order number when the component mounts
  useEffect(() => {
    const randomOrderNumber = Math.floor(Math.random() * 1000000); // Generate random order number
    // @ts-ignore
    setOrderNumber(randomOrderNumber);
  }, []);

  return (
    <div className="container mx-auto py-8">
      
        <div className="information w-1/2 mx-auto p-8 text-gray text-normal">
            <p>Place your order</p>
        </div>
        <PurchaseProduct />
      
    </div>
  );
};

export default Order;
