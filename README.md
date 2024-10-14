# Product/Orders Management App
### Technical Assignment for [MrMarvis](https://www.mrmarvis.com/nl)

This project is a front-end application designed to manage product orders. Users can view, filter, and update orders, including modifying their status and handling inventory stock. The application features a clean and responsive interface, integrating with mock APIs to simulate real-world scenarios such as updating product quantities and calculating total revenue based on order statuses.

While this project includes a range of functionalities, it dives into a level of complexity that may go beyond typical coding assignmentss. The solution was implemented with close attention to detail and quality, reflecting a real-world approach to inventory and order management.

### [Live Demo](https://mm-stock-manager-rol.vercel.app/)

---

## Installation

1. **Clone the repository**:
   ```bash
   git clone git@github.com:RoOLeary/mrmavis-stock-manager.git
   ```
2. **Navigate to the project directory**:
   ```bash
   cd mrmavis-stock-manager
   ```

### There are two options to install and get started:

#### Option 1: Use the `setup.sh` script

3. **Run the `setup.sh` bash script**:

    If the script encounters permission issues, make it executable:
  
    ```bash
    chmod +x setup.sh
    ```

    Then start it:
  
    ```bash
    ./setup.sh
    ```

#### Option 2: Manual installation

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

#### Alternate Bash Command

4. **Run dev server via custom bash script**:
   If preferred, you can use the following script:
  
   ```bash
   chmod +x run.sh
   ./run.sh
   ```

   The app will be available at [http://localhost:5173](http://localhost:5173).

---

## Usage Notes

1. **Accessing the Store**:  
   When the page initially loads, users are presented with the store's product catalog, displaying a list of available items and their current stock quantities.

2. **Product Navigation and Filtering**:  
   Users can navigate through the product catalog, filtering products by type (e.g., T-shirts, Trousers). The product list is paginated, allowing users to browse a large inventory in manageable sections. Filters are applied instantly, and the products displayed are updated in real-time based on stock changes.

3. **Purchasing Products**:  
   When a user clicks the "Buy" button on a product, they are taken to the product detail page. Here, they can select the quantity they wish to purchase, depending on available stock.

4. **Placing an Order**:  
   After selecting the desired quantity and proceeding to checkout, the user is directed to the Order page. On this page, a unique order number is generated and recorded for each purchase. The payment process is simulated, and the order is then reflected in the backend.

   **Note**: Error states and edge cases (such as insufficient stock or payment failures) would typically be accounted for in a production scenario but were simplified for this assignment.

5. **Backend Functionality**:  
   - **Product List**: There is an admin view for managing the product list, displaying a real-time list of products fetched from the API. Users can filter products and see real-time stock updates.
   - **Order Management**: Orders are also displayed in the backend, where users can view, edit, and manage their status. Orders can be marked as paid, pending, or cancelled.
   
   Both the product and order views (and the frontend) use **polling** and **refetching** from Redux to keep the pages updated without requiring manual reloads. Polling is set to run every 10 seconds, which mimics real-time functionality effectively.

6. **Editing Products and Orders**:  
   - **Order Management**: Orders can be edited (e.g., status can be updated) or cancelled. When an order is cancelled, the stock is automatically replenished, reflecting the cancelled quantity.
   - **Product Management**: Admins can edit product details such as title, description, quantity, and price. These updates are also applied in real time, ensuring the frontend and backend stay in sync.


---

## Technologies Used:

- **React**: A JavaScript library for building user interfaces.
- **TypeScript**: A statically typed superset of JavaScript.
- **Vite**: A fast front-end build tool.
- **TailwindCSS**: A utility-first CSS framework for rapid UI development.
- **Redux**: A predictable state container for JavaScript apps, used here for managing state, CRUD operations, and real-time updates.
- **mockapi.io**: A mock API service used to simulate backend interactions and data persistence.

---

## User Stories:

### MRM-1: Initial Stock Load
- The app loads stock data from a mock API on the initial load.
- This can also be simulated with seed data for production builds.
  
### MRM-2: Query Stock
- Users can view a product list that shows all relevant real-time data, including stock quantities.
- The API allows querying products with parameters, such as `?type=` for filtering by product type.

### MRM-3: Order from Stock
- Users can place orders from the product stock using the provided form.
- The stock is updated in real-time, and orders are recorded on the backend admin panel.

### MRM-4: Single Page Application (SPA)
- The app is a fully functional SPA, with no page reloads required.
- It leverages Redux to manage CRUD operations and features real-time polling and refetching of data.
- SPA featured Home, Orders, Thank You pages.

### MRM-5: Real-Time Stock Updates
- Product stock is updated dynamically based on user interaction and order placement.
- The admin panel displays the latest quantities for all products.

### MRM-6: Developer Ingenuity
- The application includes thoughtful features to demonstrate problem-solving and user-centric design, such as filtering products by type and replenishing stock in the "Manage Store" area.
- Replenishment buttons allow quick updates to stock, ensuring smooth inventory management.

---

## Additional Features:
- **Real-Time Polling**: The app polls the API at regular intervals to ensure data is always up-to-date.
- **Order Management**: In the "Orders" section, users can edit and delete orders, and change the status of orders (e.g., mark as "paid" or "cancelled").
- **Revenue Calculation**: The app calculates total revenue based on completed orders.
- **Responsive Design**: The app is fully responsive and works across devices, with a mobile-friendly layout.

---

## Notes

This project allowed me to demonstrate a variety of front-end skills, including state management (Redux), API integration, and responsive design using TailwindCSS. The assignment introduced some nuanced challenges—particularly concerning the business requirements—which I navigated while balancing development efforts with real-time data handling.

### MOCKAPI.IO

Implemented basic data service with MockAPI.io

```
Endpoints:
    - https://mockapi.io/projects/670b7631ac6860a6c2cc1861/products
    - https://mockapi.io/projects/670b7631ac6860a6c2cc1861/orders
```

#### Syncing Items: 
In a real-world implementation, syncing stock replenishment at the end of each day would require integrating a data source to manage restocking, likely based on a location's output or sales performance. This would involve establishing a backend service to track daily inventory updates and replenishing accordingly.

#### Frontend Appearance: 
Given the scope and complexity of the task, I made a judgment call to focus on the functionality and core business logic rather than investing excessive time on advanced styling. The frontend design is kept basic to strike a balance between feature implementation and visual presentation within the time constraints.

While the timeline was tight, this solution reflects real-world practices and includes a robust set of features for managing product stock and order flows. Further enhancements could be made with additional time for polish and further backend integration.