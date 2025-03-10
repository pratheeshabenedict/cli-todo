# Task Manager CLI

## Overview
This is a simple **Task Manager CLI** application that allows users to add, list, search, complete, remove, and export tasks in JSON or CSV formats. It also supports **recurring tasks** (daily, weekly, monthly) and maintains **progress tracking**.

## Features
- ✅ Add new tasks with priority and due date
- 🔍 Search for tasks (exact match or keyword search)
- ✅ Mark tasks as done
- ❌ Remove tasks
- ♻ Recurring tasks support (daily, weekly, monthly)
- 📈 Track progress with task completion percentage
- 🔄 Undo the last action
- 📤 Export tasks to JSON or CSV

## Installation
Ensure you have **Node.js** installed.


npm install json2csv


## Usage
Run the script using Node.js:


node app.js <command> [arguments]


### Commands

#### 1️⃣ Add a Task

node app.js add "Task Name" "Priority" "YYYY-MM-DD" [recurring]

Example:

node app.js add "Complete project" High 2025-03-10 daily


#### 2️⃣ List All Tasks

node app.js list


#### 3️⃣ Search for a Task
- **Exact match**:

node app.js searchExact "Task Name"

- **Keyword search**:

node app.js search "keyword"


#### 4️⃣ Mark Task as Done

node app.js done <task_index>

Example:

node app.js done 2


#### 5️⃣ Remove a Task

node app.js remove <task_index>

Example:

node app.js remove 3


#### 6️⃣ View Task Progress

node app.js progress

Displays:

Completed: X
Not completed: Y
Total tasks: Z
Percentage of progress: P%


#### 7️⃣ Undo Last Action

node app.js undo


#### 8️⃣ Export Tasks (JSON or CSV)

node app.js export json
node app.js export csv


## Recurring Tasks
Recurring tasks are automatically updated when the `list` command is executed. The new due date is set as follows:
- **Daily:** +1 day
- **Weekly:** +7 days
- **Monthly:** +1 month

## File Structure
- `tasks.json` → Stores the task list.
- `backup.json` → Stores a backup for undo.
- `tasks_export.json` → Exported JSON file.
- `tasks_export.csv` → Exported CSV file.

## Dependencies
- `fs` → File system operations.
- `path` → File path management.
- `json2csv` → Converts JSON to CSV.

## Notes
- Tasks are stored in `tasks.json`.
- Task completion updates are reflected in `tasks.json`.
- The progress command calculates task completion percentage.
- Ensure `tasks.json` exists before running commands like `list`, `done`, and `progress`.

## License
MIT License

