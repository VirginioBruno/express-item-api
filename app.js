const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

mongoose.connect('mongodb://localhost/itemsDatabase')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

const itemSchema = new mongoose.Schema({
    name: String
});

const Item = mongoose.model('Item', itemSchema);

app.post('/items', async (req, res) => {
    const item = new Item({ name: req.body.name });
    await item.save();
    res.status(201).send(item);
});

app.get('/items', async (req, res) => {
    const items = await Item.find();
    res.status(200).send(items);
});

app.get('/items/:id', async (req, res) => {
    const item = await Item.findById(req.params.id);
    if (!item) res.status(404).send('Item not found');
    else res.status(200).send(item);
});

app.put('/items/:id', async (req, res) => {
    const item = await Item.findByIdAndUpdate(req.params.id, { name: req.body.name });
    if (!item) {
        res.status(404).send('Item not found');
        return;
    }
    res.status(200).send(item);
});

app.delete('/items/:id', async (req, res) => {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) {
        res.status(404).send('Item not found');
        return;
    }
    res.status(204).send();
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});