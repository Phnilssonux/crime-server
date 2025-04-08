import express from 'express';
import axios from 'axios';
const app = express();
const PORT = 3000;

app.get("/crimes", async (req, res) => {
    try {
        const response = await axios.get("https://brottsplatskartan.se/api/events/location=karlstad");
        res.json(response.data);
    } catch (err) {
        console.error(err);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});