const fs =require('fs');

const command = process.argv[2];
const taskname = process.argv[3];
//first we parse the data
if(command==='add'){
    let tasks =[];
    if(fs.existsSync('tasks.json')){
        const data = fs.readFileSync('tasks.json');
        tasks = JSON.parse(data);
    }
//add new task=>schema of json
    tasks.push({task:taskname,done:false});

//in normal we write the task along with this , now stringify 
    fs.writeFileSync('tasks.json',JSON.stringify(tasks,null,2));
    console.log(`Task "${taskname}" added successfully`)
}

if(command==='list'){
    if(!fs.existsSync('tasks.json')){
        console.log("No tasks found");
        return;
    }

    const tasks = JSON.parse(fs.readFileSync('tasks.json'));

    console.log("Your tasks");
    tasks.forEach((task,index) => {
        console.log(`${index+1}.${task.task} [${task.done ? 'Yes':'No'}]`);
    });
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