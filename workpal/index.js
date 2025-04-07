const app = require('express')();
const PORT = 8080;

app.listen(
    PORT,
    () => console.log(`hello http://localhost:${PORT}`)
)

app.get('', (req, res) => {
    
});