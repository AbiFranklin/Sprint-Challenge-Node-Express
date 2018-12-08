// - `id`: number, no need to provide it when creating posts, the database will automatically generate it.
// - `project_id`: number, required, must be the id of an existing project.
// - `description`: string, up to 128 characters long, required.
// - `notes`: string, no size limit, required. Used to record additional notes or requirements to complete the action.
// - `completed`: boolean to indicate if the action has been completed, not required

// The `/data/helpers` folder includes helper files that you can use to manage the persistence of _project_ and _action_ data. These files are `projectModel.js` and `actionModel.js`. Both files publish the following api, which you can use to store, modify and retrieve each resource:

// - `get()`: calling get returns an array of all the resources contained in the database. If you pass an `id` to this method it will return the resource with that id if one is found.
// - `insert()`: calling insert passing it a resource object will add it to the database and return the newly created resource.
// - `update()`: accepts two arguments, the first is the `id` of the resource to update, and the second is an object with the `changes` to apply. It returns the updated resource. If a resource with the provided `id` is not found, the method returns `null`.
// - `remove()`: the remove method accepts an `id` as it's first parameter and, upon successfully deleting the resource from the database, returns the number of records deleted.

// The `projectModel.js` helper includes an extra method called `getProjectActions()` that takes a _project id_ as it's only argument and returns a list of all the _actions_ for the _project_.

const express = require('express');
const actionDB = require('../data/helpers/actionModel');

const router = express.Router();

router.get('/', (req, res) => {
    actionDB.get()
    .then(actions => {
        res.status(200).json(actions);
    })
    .catch(err => {
        res.status(500).json({ error: "Unable to retrieve actions." })
    })
});


router.post('/', (req, res) => {
    const action = req.body;
    if (action.description.length < 129 && action.project_id && action.notes){
    actionDB.insert(action)
    .then(
        actionDB.get()
        .then(actions => {
            res.status(200).json(actions)
        })
    )
    .catch(err => {
        res.status(500).json({ error: "Failed to add action."})
    })
    } else {
        res.status(400).json({ error: "Please provide a action description between 1-128 characters, action project id, and action notes."})
    }
});

router.delete('/:id', (req,res) => {
    const {id} = req.params;
    actionDB.remove(id)
    .then(resolution => {
        res.json({ message: "Action Successfully Deleted" })
    })
    .catch(err => {
        res.status(500).json({ error: "The action could not be removed" })
    })
}); 

router.put('/:id', (req, res) => {
    const {id} = req.params;
    const action = req.body;
    if (action.description.length < 129 && action.project_id && action.notes) {
    actionDB.update(id, action)
    .then (success => {
        res.status(200).json({ message: "Update Successful" })
    })
    .catch(err => {
        res.status(500).json({ error: "Action could not be modified." });
    })
    } else {
        res.status(400).json({ errorMessage: "Please provide a action description between 1-128 characters, action project id, and action notes."})
    }
});

module.exports = router;