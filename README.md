# Task Manager

![image](https://github.com/DalvinderSingh2022/projectManager/assets/110463060/c597f640-3cdb-47d1-87dd-c3ca0d2a36d7)

this is a full-stack web application for managing tasks, built using the MERN stack (MongoDB, Express.js, React, Node.js) with authentication implemented via JSON Web Tokens (JWT) and real-time communication via Socket.io

## Features

- Create, edit, and delete tasks
- Set due dates for tasks
- Organize tasks into categories(status)
- Change status by drag and drop
- Search and filter tasks
- User-friendly and intuitive interface
- Assign tasks to followers
- follow/unfollow other user
- Get real-time notifications by socket events

## Usage

1. Create an account or log in if you already have one.
2. Add tasks by using the "Create Task" button on the tasks page.
3. Edit or delete a task by clicking the task's edit button.
4. The user can also change the status of tasks by just drag and drop.
5. Use the search functionality to find specific tasks.
6. Mark tasks as completed when you finish them.
7. follow others and ask them the same to assign tasks.
8. Your all data is saved using [MongoDB](https://www.mongodb.com/).
9. You will get rel-time notification by [Socket.io](https://socket.io/).

## Getting Started

These instructions will help you get a copy of the project up and running on your local machine for development and testing purposes.

### Dashboard

- Users will be able to create new tasks with a title, description, and due date and then can assign it to another user.
- Users will be able to update and delete tasks.
- List view for all authuser tasks is available on the tasks page.
- Users can also have an eye on its tasks in numbers.
  ![image](https://github.com/DalvinderSingh2022/projectManager/assets/110463060/ddfbb5fd-a9d9-4a8c-b42f-ba1536f32860)

### Tasks page

- The tasks page will give users the power to view the tasks of the user.
- The task card displays the title, description and status of tasks.
- The user can filter tasks based on their status.
- Users can also use search functionality by name or description.
- The user can delete (if it's assigned by the user) or edit tasks.
  ![image](https://github.com/DalvinderSingh2022/projectManager/assets/110463060/5e299c69-02da-4ab6-b0b7-a7956e42ca5c)

### Users page

- Users can view the profiles of all other users on the platform.
- It gives us the ability to find a perfect user to assign the task
- users can filter the users based on followers, and following.
- users can also follow other users with just one click
  ![image](https://github.com/DalvinderSingh2022/projectManager/assets/110463060/e73cf85b-800a-4c0d-b355-edc9eb5eb61c)

## Edit task

- this page shows different UI according to the involvement of the user in that particular task
- if the task is assigned to the user then the user can change the status of the task.
- if the task is assigned by the user then the user can also delete the task.

-- Assigned by user
![image](https://github.com/DalvinderSingh2022/projectManager/assets/110463060/b47a51b2-0d18-4294-a493-1df07957c3d1)

-- Assigned to user
![image](https://github.com/DalvinderSingh2022/projectManager/assets/110463060/daa8d5fa-bf33-46b4-998e-a05376a41286)

### login/register

- register using email, and password give yourself a name.
- Users can log in easily using email and password
- Users can log out at any time by clicking the button at the sidebar.

- Register
  ![image](https://github.com/DalvinderSingh2022/projectManager/assets/110463060/0d43bc01-bc6f-483a-b648-6d763905bd24)

- Login
  ![image](https://github.com/DalvinderSingh2022/projectManager/assets/110463060/c96d8ee9-59b4-4e4d-97fd-df5e1307044c)

## Installation

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm (Node package manager)
- MongoDB

### Backend Setup

1. Clone the repository:

   ```sh
   git clone https://github.com/DalvinderSingh2022/Task-Manager.git
   cd Task-Manager
   ```

2. Install backend dependencies:

   ```sh
   npm install
   ```

3. Create a `.env` file and add the following:

   ```env
   PORT : 4000 if not provided
   CONNECTION_STRING=your_mongoDB_connection_string
   SECRET_KEY=your_jwt_secret
   ```

4. Start the backend server:

   ```sh
   npm start
   ```

### Frontend Setup

1. Navigate to the `frontend` directory:

   ```sh
   cd ./frontend
   ```

2. Install frontend dependencies:

   ```sh
   npm install
   ```

3. Start the frontend development server:

   ```sh
   npm start
   ```

The application should now be running at `http://localhost:3000`.

## Technologies Used

- **MongoDB**: Database
- **Express.js**: Backend framework
- **React**: Frontend library
- **Socket.io**: Real-time communication
- **Node.js**: Backend runtime
- **JWT (JSON Web Tokens)**: Authentication
