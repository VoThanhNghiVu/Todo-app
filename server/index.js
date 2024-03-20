// Task 2: Creating backend
// Task 5: Create delete method, that receives id as query parameter (e.g., http://localhost:3001/delete/1).
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
const port = 3001;

const pool = new Pool ({
    user: 'postgres',
    host: 'localhost',
    database: 'todo',
    password: 'abcd',
    port: 5432
});

// Get all tasks
app.get("/", async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM task');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error retrieving tasks:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Add a new task
app.post("/new", async (req, res) => {
    try {
        const result = await pool.query('INSERT INTO task (description) VALUES ($1) RETURNING *', [req.body.description]);
        res.status(200).json({ id: result.rows[0].id });
    } catch (error) {
        console.error("Error adding task:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Delete a task by ID
app.delete("/delete/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const result = await pool.query('DELETE FROM task WHERE id = $1', [id]);
        if (result.rowCount === 0) {
            res.status(404).json({ error: 'Task not found' });
        } else {
            res.status(200).json({ id: id });
        }
    } catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});