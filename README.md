# Ecommerce Monorepo

This project uses **npm** to manage multiple services, including a dashboard, inventory, and store.

## Packages

This monorepo contains the following packages:

1. **dashboard**: A web-based dashboard for managing product data (dummy).
2. **inventory**: A service for tracking and managing inventory items.
3. **store**: A service for managing sales and customer data (dummy).

## Getting Started

### Prerequisites

Ensure you have **Node.js** and **npm** installed on your machine.

### Installation

1. Clone the repository:  
   `git clone https://github.com/monstermario/ecommerce-monorepo`  
   `cd ecommerce-monorepo`
2. Install all dependencies:  
   `npm install`

### Running the Packages

You can run each package's development server using the following commands:

- To run the **dashboard**:  
  `npm run dev:dashboard`
- To run the **inventory**:  
  **Important**: Before running the inventory service for the first time, you must run the migration command:  
  `npm run migrate:inventory`  
  After running the migration once, you can start the inventory service with:  
  `npm run dev:inventory`
- To run the **store**:  
  `npm run dev:store`

### Notes

- The migration for the inventory service only needs to be run once. After that, you can run the inventory service without running the migration again.
- Ensure that any necessary databases or services are set up and running before starting the services.

## Contributing

Feel free to contribute by creating pull requests or opening issues.

## License

This project is licensed under the MIT License.
