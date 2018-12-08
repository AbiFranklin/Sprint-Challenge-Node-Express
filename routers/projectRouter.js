const express = require('express');
const projectDB = require('../data/helpers/projectModel');

const router = express.Router();

router.get('/', (req, res) => {
    projectDB.get()
    .then(projects => {
        res.status(200).json(projects);
    })
    .catch(err => {
        res.status(500).json({ error: "Unable to retrieve projects." })
    })
});

router.get('/:id', (req, res) => {
    const { id } = req.params;
    projectDB.getProjectActions(id)
    .then(actions => {
        res.status(200).json(actions);
    })
    .catch(err => {
        res.status(500).json({ error: "Unable to retrieve project actions." })
    })
});

router.post('/', (req, res) => {
    const project = req.body;
    if (project.name.length < 129 && project.description){
    projectDB.insert(project)
    .then(
        projectDB.get()
        .then(projects => {
            res.status(200).json(projects)
        })
    )
    .catch(err => {
        res.status(500).json({ error: "Failed to add project."})
    })
    } else {
        res.status(400).json({ error: "Please provide a project name between 1-128 characters and a project decription."})
    }
});

router.delete('/:id', (req,res) => {
    const {id} = req.params;
    projectDB.remove(id)
    .then(resolution => {
        res.json({ message: "Project Successfully Deleted" })
    })
    .catch(err => {
        res.status(500).json({ error: "The project could not be removed" })
    })
}); 

router.put('/:id', (req, res) => {
    const {id} = req.params;
    const project = req.body;
    if (project.name.length < 129 && project.description) {
    projectDB.update(id, project)
    .then (success => {
        res.status(200).json({ message: "Update Successful" })
    })
    .catch(err => {
        res.status(500).json({ error: "Project could not be modified." });
    })
    } else {
        res.status(400).json({ errorMessage: "Please provide a project name between 1-128 characters and a project decription."})
    }
});

module.exports = router;
