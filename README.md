# Product/Orders Management App
### Technical Assignment for [MrMarvis](https://www.mrmarvis.com/nl)

This project is a front-end application designed to manage product orders. Users can view, filter, and update orders, including modifying their status and handling inventory stock. The application features a clean and responsive interface, integrating with mock APIs to simulate real-world scenarios such as updating product quantities and calculating total revenue based on order statuses.

While this project includes a range of functionalities, it dives into a level of complexity that may go beyond typical coding tests. The solution was implemented with close attention to detail and quality, reflecting a real-world approach to inventory and order management.

### [Live Demo](https://mrmavis-stock-manager.vercel.app/)

---

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-repo/orders-management-app.git
   ```
2. **Navigate to the project directory**:
   ```bash
   cd orders-management-app
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

While the timeline was tight, this solution reflects real-world practices and includes a robust set of features for managing product stock and order flows. Further enhancements could be made with additional time for polish and further backend integration.
