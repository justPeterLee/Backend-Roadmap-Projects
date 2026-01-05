# Task Tracker

A simple CLI application to track and manage task.
This project is a solution to [task-tracker](https://roadmap.sh/projects/task-tracker) from [roadmap.sh](https://roadmap.sh/backend).

**project url: https://roadmap.sh/projects/task-tracker**

## Prerequisites

- Node.js installed on your system

## Installation

**Clone the Repository**

To run application, clone repositiory and run index in terminal. After that, the application will run via readline through node, allowing you to interact directly through the terminal.

```bash
git clone https://github.com/justPeterLee/Backend-Roadmap-Projects.git
cd task_tracker
node index
```

## Usage

- **List all Tasks**

```bash
# Lists all task
task-cli> list

# Lists tasks with the status: todo
task-cli> list to-do

# Lists tasks with the status: in-progress
task-cli> list in-progress

# Lists task with the status: done
task-cli> list done
```

- **Add a Task**

```bash
task-cli> add "Task description"
```

- **Update a Task**

```bash
# update description of task with the ID 1
task-cli> update 1 "Buy groceries and Gas up Car"
```

- **Delete a Task**

```bash
# Delete the task with the ID 1
task-cli> delete 1
```

- **Mark Task Status**

```bash
# Mark `in-progress` of task with ID of 1
node index.js mark-in-progress 1

# Mark `done` of task with ID of 1
node index.js mark-done 1
```

### Sample JSON structure

```json
{
  "0": {
    "id": 0,
    "description": "\"Buy a Dog\"",
    "status": "todo",
    "createdAt": "Sun Jan 04 2026 18:42:24 GMT-0600 (Central Standard Time)",
    "updatedAt": "Sun Jan 04 2026 18:42:24 GMT-0600 (Central Standard Time)"
  }
}
```
