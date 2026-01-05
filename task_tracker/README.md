# Task Tracker

A simple CLI application to track and manage task
This project is a solution to [task-tracker](https://roadmap.sh/projects/task-tracker) from [roadmap.sh](roadmap.sh)

## Prerequisites

- Node.js installed on your system

## Installation

`git clone https://github.com/justPeterLee/Backend-Roadmap-Projects.git<br> 
cd task_tracker<br>
node index`

## Usage

- List all Tasks

```

# Lists all task

task-cli> list

# Lists tasks with the status: todo

task-cli> list to-do

# Lists tasks with the status: in-progress

task-cli> list in-progress

# Lists task with the status: done

task-cli> list done
```

- Add a Task
  `task-cli> add "Task description"`

- Update a Task

```

# update description of task with the ID 1

task-cli> update 1 "Buy groceries and Gas up Car"
```

- Delete a Task

```

# Delete the task with the ID 1

task-cli> delete 1
```

- Mark Task Status

```

# Mark `in-progress` of task with ID of 1

node index.js mark-in-progress 1

# Mark `done` of task with ID of 1

node index.js mark-done 1
```

### Sample JSON structure

```
{
    "0" : {
            "id":0,
            "description": "Buy groceries",
            "status": "todo",
            "createdAt": "Sun Jan 04 2026 18:42:24 GMT-0600 (Central Standard Time)",
            "updatedAt": "Sun Jan 04 2026 18:42:24 GMT-0600 (Central Standard Time)"
        }
}
```
