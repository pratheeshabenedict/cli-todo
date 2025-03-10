const fs =require('fs');
const path = require('path');
const {parse} = require('json2csv');
const command = process.argv[2];
const taskname = process.argv[3];
const priorityset = process.argv[4];
const dateset = process.argv[5];
const backupFile = 'backup.json';
const tasksfile = 'tasks.json';
//first we parse the data
if(command==='add'){
    let tasks =[];
    backupTasks();
    updateRecurringTasks();
    if(fs.existsSync('tasks.json')){
        const data = fs.readFileSync('tasks.json');
        tasks = JSON.parse(data);
    }
//add new task=>schema of json
    tasks.push({task:taskname,done:false,priority:priorityset,date:dateset,recurring:process.argv[6]||null});

//in normal we write the task along with this , now stringify 
    fs.writeFileSync('tasks.json',JSON.stringify(tasks,null,2));
    console.log(`Task "${taskname}" added successfully`)
}

if(command==='list'){
    if(!fs.existsSync('tasks.json')){
        console.log("No tasks found");
        return;
    }
    updateRecurringTasks()
    //if ascending - negative value comes 
    //descending order - positive value comes 
    //here the value is 
    const tasks = JSON.parse(fs.readFileSync('tasks.json'));
    const priorityOrder = {High:3,Medium:2,Low:1};
    tasks.sort((a,b)=> priorityOrder[b.priority]-priorityOrder[a.priority]);
    tasks.sort((a,b)=>new Date(a.date)-new Date(b.date));
    const today = new Date();
    console.log("Your tasks");
    tasks.forEach((task,index) => {
        console.log(`${index+1}.${task.task} [${task.done ? 'Yes':'No'}] ${task.priority} ${task.date}`);
    });
}

if(command==='searchExact'){
    const searchTask = process.argv[3];
    const tasks = JSON.parse(fs.readFileSync('tasks.json'));
    const task = tasks.find(task => task.task===searchTask);
    console.log(task);
}
//here search can be done with the two ways one is searching exact keyword , next is search for keyword not exact match
//if exact we can go with the find , keyword then we can go with the filter option.
if (command === 'search') {
    const searchTask = process.argv[3].toLowerCase(); // Convert to lowercase for case-insensitive search
    const tasks = JSON.parse(fs.readFileSync('tasks.json'));

    // Check if any task contains the keyword (case-insensitive match)
    const matchingTasks = tasks.filter(task => task.task.toLowerCase().includes(searchTask));

    if (matchingTasks.length > 0) {
        console.log("Matching Tasks:");
        matchingTasks.forEach((task, index) => {
            console.log(`${index + 1}. ${task.task} [${task.done ? 'Yes' : 'No'}] ${task.priority}`);
        });
    } else {
        console.log("No matching tasks found.");
    }
}

if(command==='done'){
    const taskIndex = Number(process.argv[3])-1;

    if(!fs.existsSync('tasks.json')){
        console.log("NO tasks found");
        return;
    }

    const tasks = JSON.parse(fs.readFileSync('tasks.json'));

    if(taskIndex>=0 && taskIndex<tasks.length){
        tasks[taskIndex].done=true;
        fs.writeFileSync('tasks.json',JSON.stringify(tasks,null,2));
        console.log(`Task ${taskIndex+1} marked as done`);
    }
    else{
        console.log("Invalid task index");
    }
}

if(command==='remove'){
    const taskIndex = Number(process.argv[3])-1;
    backupTasks();
    if(!fs.existsSync('tasks.json')){
        console.log("No tasks found");
        return;
    }

    let tasks = JSON.parse(fs.readFileSync('tasks.json'));

    if(taskIndex>=0 && taskIndex<tasks.length){
        console.log(`Removing tasks: ${tasks[taskIndex].task}`);
        tasks.splice(taskIndex,1);//start index , deletecount
        fs.writeFileSync('tasks.json',JSON.stringify(tasks,null,2));
        console.log("Tasks removed successfully");
    }
    else{
        console.log("Invalid");
    }
}


function backupTasks(){
    if(fs.existsSync(tasksfile)){
        fs.copyFileSync(tasksfile,backupFile);
    }
}

if(command==='undo'){
    if(fs.existsSync(backupFile)){
        fs.copyFileSync(backupFile,tasksfile);
        console.log("Last action undone successfully");
    }
    else{
        console.log("No action to undo");
    }
}

function updateRecurringTasks(){
    if(!fs.existsSync(tasksfile)) return;

    let tasks=JSON.parse(fs.readFileSync(tasksfile));
    const today = new Date();

    tasks.forEach(task=>{
        if(task.recurring && new Date(task.date)<today){
            let newDate = new Date(task.date);

            if(task.recurring==='daily') newDate.setDate(newDate.getDate()+1);
            if(task.recurring==='weekly') newDate.setDate(newDate.getDate()+7);
            if(task.recurring==='monthly') newDate.setDate(newDate.getDate()+1);

            task.date=newDate.toISOString().split('T')[0];
            task.done=false;
        }
    });
    fs.writeFileSync(tasksfile,JSON.stringify(tasks,null,2));
}

if(command==='progress'){
    if(!fs.existsSync('tasks.json')) return;

    let tasks=JSON.parse(fs.readFileSync('tasks.json'));
    let tasktotal=0;
    let tasknotdone=0;
    let taskdone=0;
    tasks.forEach(task=>{
        if(!task.done){
            tasknotdone=tasknotdone+1;
        }
        else{
            taskdone=taskdone+1;
        }
        tasktotal=tasktotal+1;
    });
    console.log("Completed:",taskdone);
    console.log("Not completed:",tasknotdone);
    console.log("Total task:",tasktotal);
    let percentage =tasktotal>0? ((taskdone/tasktotal)*100).toFixed(2):0;
    console.log("percentage of progress:",percentage);
}

if(command==='export'){
    exportTasks(taskname);
}

function exportTasks(taskname){
    if(!fs.existsSync(tasksfile)) return;

    const tasks=JSON.parse(fs.readFileSync(tasksfile,'utf-8'));

    if(taskname==='json'){
        fs.writeFileSync('task_export.json',JSON.stringify(tasks,null,2));
        console.log("Task exported as json");
    }
    else if(taskname==='csv'){
        try{
            const csv=parse(tasks);
            fs.writeFileSync('tasks_export.csv',csv);
            console.log("Tasks exported as csv");
        }
        catch(err){
            console.error("Error",err);
        }
    }
    else{
        console.log("Invalid format");
    }
}