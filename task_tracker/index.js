console.log("Hello World");

const fs = require('node:fs');
const path = require("path");

const db_path = path.join(__dirname, "db.json");

// creates database (db) file if doesn't exist
if (!fs.existsSync(db_path)) {
    fs.writeFileSync(`${__dirname}/db.json`, '{}');
}


const readline = require("node:readline");
const { stdin: input, stdout: output } = require("node:process");

const rl = readline.createInterface({ input, output });

// change default prompt
rl.setPrompt("\x1b[35m\ntask-cli> \x1b[0m");
rl.prompt();



rl.on("line", (input) => {
    interpretInput(input)
    rl.prompt();
})



/*
------------------------------------------------
utility functions
------------------------------------------------
*/

// interpret user input by breaking strings into sections
function interpretInput(input) {
    // check to see if input is empty
    if (!input.trim()) {
        console.log("\x1b[31m%s\x1b[0m", `ERROR: invalid input --> "${input}"\n`);
        return
    }

    // removes white space from end and splits string into an array (based off of spaces)
    const inputFormated = input.trimEnd().split(" ");
    const actionFormated = inputFormated[0].replaceAll("_", "x").replaceAll("-", "_")

    // if action is valid (checks for user "_" input error)
    if (taskActions[actionFormated] == undefined) {
        console.log("\x1b[31m%s\x1b[0m", `ERROR: invalid action --> ${actionFormated}\n`);
        return
    }

    // call action function based on input
    taskActions[actionFormated](inputFormated);
}

// object of valid actions
const taskActions = {
    add: addTask,
    update: updateTask,
    delete: deleteTask,
    mark_in_progress: markInProgress,
    mark_done: markDone,
    list: showList,
}

// return parsed list
function getList() {
    if (fs.existsSync(db_path)) {
        const data = fs.readFileSync(db_path, 'utf-8');
        const data_parsed = JSON.parse(data);
        return data_parsed;
    }

    console.log("\x1b[31m%s\x1b[0m", "ERROR: unable to find db.json file within directory");
    console.log("DATABASE CREATED: any old task may have been deleted");

    // create new db.json if unable to find file
    fs.writeFileSync(`${__dirname}/db.json`, '{}');
    return {};
}


function generateUID() {
    // get task's IDs
    const listIDs = Object.keys(getList()).map((id) => parseInt(id));


    if (listIDs.length === 0) {
        return 0;
    }

    // sort IDs from smallest to larget (return largest +1)
    listIDs.sort((a, b) => { a - b });
    return listIDs[listIDs.length - 1] + 1;
}

// function to update DB
function mutateList(task = {}) {
    let list = getList();

    // task provided must have a valid ID with correct type
    if (task.id == undefined || typeof task.id != 'number') {
        console.log("\x1b[31m%s\x1b[0m", `ERROR: unable to mutatle list. Invalid ID --> ${task}`);
        return false;
    }

    // update list by adding task
    list = { ...list, [task.id]: { ...task } };


    fs.writeFileSync(`${__dirname}/db.json`, JSON.stringify(list, null, 2));
    return true; // if task is successfully written, return true (should be a promise)
}

function findTask(id) {
    const list = getList();
    return list[id]; // return unidentify if task ID doesn't exist
}

function idValidator(id) {
    // valid ID formate
    if (isNaN(Number(id))) {
        console.log("\x1b[31m%s\x1b[0m", `ERROR: invalid task ID --> ${id}`);
        return false;
    }

    // checking if task exists
    const taskInformation = findTask(id);
    if (taskInformation === undefined) {
        console.log("\x1b[31m%s\x1b[0m", `ERROR: task with ID number doesn't exists --> ${id}`);
        return false;
    }

    return taskInformation; // probably shouldn't return task info to reduce "complexity"
}

// call Mutate List (checks if action failed (should use async))
function callMutateList(taskInformation, action = "", errorMessage = "") {
    if (mutateList(taskInformation)) {
        console.log("\x1b[32m%s\x1b[0m", `COMPLETE: ${action}`);
        return;
    } else {
        console.log("\x1b[31m%s\x1b[0m", `ERROR: failed to perfom task ${errorMessage}`);
        return;
    }
}

/*
------------------------------------------------
task functions
------------------------------------------------
*/
function addTask(input) {
    // validate arguments for add action
    if (input.length <= 1) {
        console.log("\x1b[31m%s\x1b[0m", "ERROR: invalid arguments to add task");
        return;
    }

    // formats user's input
    const taskWordList = input.filter((word, index) => { if (index !== 0) return word });
    const task = taskWordList.join(" ");

    // validate user input for task's description
    if (!task.startsWith('"') || !task.endsWith('"')) {
        console.log("\x1b[31m%s\x1b[0m", `ERROR: invalid task being added (check if double quotation is added "") --> ${task}`);
        return
    }

    const uid = generateUID();
    callMutateList({ id: uid, description: task, status: 'todo', createdAt: new Date().toString(), updatedAt: new Date().toString() }, "ADDED (1) NEW TASK")
}

function updateTask(input) {
    // validate arguments
    if (input.length < 3) {
        console.log("\x1b[31m%s\x1b[0m", `ERROR: invalid arguments for updating a task --> ${input}`);
        return
    }

    // validate id
    const taskInformation = (idValidator(input[1]));
    if (!taskInformation) {
        return;
    }

    // formate user's input
    const taskWordList = input.filter((word, index) => { if (index !== 0 && index !== 1) return word });
    const task = taskWordList.join(" ");

    // validate task input
    if (!task.startsWith('"') || !task.endsWith('"')) {
        console.log("\x1b[31m%s\x1b[0m", `ERROR: invalid task being added (check if double quotation is added "") --> ${task}`);
        return
    }


    callMutateList({ ...taskInformation, description: task, updatedAt: new Date().toString() }, "UPDATED (1) TASK");
}

function deleteTask(input) {
    // validate arguments
    if (input.length != 2) {
        console.log("\x1b[31m%s\x1b[0m", `ERROR: invalid arguments for deleting a task --> ${input}`);
        return
    }

    // validate id
    if (!idValidator(input[1])) {
        return;
    }

    const list = getList()
    delete list[input[1]]
    fs.writeFileSync(`${__dirname}/db.json`, JSON.stringify(list, null, 2));
    console.log("\x1b[32m%s\x1b[0m", "COMEPLETE (1) TASK DELTED")

}

function markInProgress(input) {
    // validate arguments 
    if (input.length != 2) {
        console.log("\x1b[31m%s\x1b[0m", `ERROR: invalid arguments for mark in progress --> ${input}`);
        return;
    }

    const taskInformation = (idValidator(input[1]));
    if (!taskInformation) {
        return;
    }

    callMutateList({ ...taskInformation, status: "in-progress", updatedAt: new Date().toString() }, "MARKED (1) TASK 'in-progress'");
}

function markDone(input) {
    // validates arguments
    if (input.length != 2) {
        console.log("\x1b[31m%s\x1b[0m", `ERROR: invalid arguments for mark done --> ${input}`);
        return;
    }

    // validates task id and checks if task exists (returns task)
    const taskInformation = (idValidator(input[1]));
    if (!taskInformation) {
        return;
    }

    callMutateList({ ...taskInformation, status: "done", updatedAt: new Date().toString() }, "MARKED (1) TASK 'done'");

}

function showList(input) {
    // validates arguments
    if (input.length != 1 && input.length != 2) {
        console.log("\x1b[31m%s\x1b[0m", `ERROR: invalid arguments for list --> ${input}`);
        return;
    }

    const list = getList();
    const listID = Object.keys(list);
    const listFilter = input[1];

    // show list depending on user's input (filter based on task's "status")
    if (input.length === 1) {
        console.log(list);
        return

    } else if (listFilter === "done" || listFilter === "todo" || listFilter === "in-progress") {
        const filteredList = listID.filter((id) => list[id].status === listFilter).map((id) => list[id]);
        console.log(filteredList)
        return

    } else {
        console.log("\x1b[31m%s\x1b[0m", `ERROR: invalid list filter --> ${listFilter}`);
        return;
    }
}
