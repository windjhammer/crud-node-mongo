// public/tasks.js

document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');

    // Fetch and display tasks
    const fetchTasks = async () => {
        const response = await fetch('/api/tasks');
        const tasks = await response.json();
        taskList.innerHTML = '';
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.innerHTML = `
                <input type="checkbox" ${task.completed ? 'checked' : ''} data-id="${task._id}">
                <span>${task.description}</span>
                <button data-id="${task._id}">Delete</button>
            `;
            taskList.appendChild(li);
        });
    };

    fetchTasks();

    // Add task
    taskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const description = taskInput.value;
        if (description) {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ description })
            });
            const newTask = await response.json();
            taskInput.value = '';
            fetchTasks();
        }
    });

    // Update and delete tasks
    taskList.addEventListener('click', async (e) => {
        const target = e.target;
        if (target.tagName === 'INPUT' && target.type === 'checkbox') {
            const id = target.getAttribute('data-id');
            const completed = target.checked;
            await fetch(`/api/tasks/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ completed })
            });
            fetchTasks();
        }
        if (target.tagName === 'BUTTON') {
            const id = target.getAttribute('data-id');
            await fetch(`/api/tasks/${id}`, {
                method: 'DELETE'
            });
            fetchTasks();
        }
    });
});

