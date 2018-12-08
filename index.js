const express = require('express');
const actionRouter = require('./routers/actionRouter');
const projectRouter = require('./routers/projectRouter');


const server = express();
const parser = express.json();
server.use(parser);

server.use('/api/projects', projectRouter);
server.use('/api/actions', actionRouter);

server.get('/', (req, res) => {
    res.send('RUNNING');
})


const PORT = process.env.PORT || 5507;
server.listen(PORT, () => {
    console.log(`Server is super running on port ${PORT}.`);
})