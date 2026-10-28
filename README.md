Chef's Menu Manager

Overview

Chef's Menu Manager is a React Native application built with Expo and TypeScript. It helps users manage a restaurant menu by adding, viewing, editing, searching, filtering and deleting menu items.

Features

- Add menu items: Enter a dish's name, description, cost, selling price and course.
- Input validation: Validate required fields and numeric price and cost values.
- Edit menu items: Update existing menu item details.
- Delete menu items: Remove dishes from the menu.
- Search: Find menu items by name.
- Filter by course: Filter items by Starter, Main Course or Dessert.
- Menu statistics: Display the total number of items, average selling price and number of items in each course.
- User feedback: Provide feedback when input is invalid and when menu actions are performed.

Technologies Used

- React Native
- Expo
- TypeScript
- Expo Router

Changes Since Part 2

The original Part 2 application supported adding and removing menu items. The application has since been enhanced with the following improvements:

- Added functionality to edit and update existing menu items.
- Added search functionality to find dishes by name.
- Added course filters for Starter, Main Course and Dessert.
- Added menu statistics, including total item count, average selling price and counts per course.
- Improved form validation and user feedback.
- Enhanced the interface to make menu management easier to use.

Getting Started

Prerequisites

- Node.js and npm
- Expo Go compatible with the project's Expo SDK, or a suitable development environment
- Git (optional, for cloning the repository)

Installation

1. Clone the repository:
   
   git clone https://github.com/Epic-Sean1/ChefsMenuManager.git

2. Navigate into the project folder:
   
   cd ChefsMenuManager

3. Install the dependencies:
   
   npm install

4. Start the application:
   
   npx expo start

5. Open the application using a compatible Expo Go version or a configured emulator.

Data Handling

Menu items are managed in application state. Unless persistent storage is implemented separately, menu data may not remain available after the application is restarted.

Project Repository

"Chef's Menu Manager on GitHub" (https://github.com/Epic-Sean1/ChefsMenuManager)

Changelog

Final Part — Enhancements

- Implemented menu item editing and updating.
- Implemented search by dish name.
- Implemented filtering by course.
- Added menu statistics.
- Improved validation and user feedback.
- Refined the user interface.

Part 2 — Initial Application

- Implemented the initial menu management interface.
- Added the ability to create and display menu items.
- Added the ability to remove menu items.
- Implemented basic input validation.s