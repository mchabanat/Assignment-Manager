let Assignment = require('../model/assignment');

// Récupérer tous les assignments (GET)
function getAssignments(req, res){
    var aggregateQuery = Assignment.aggregate();

    Assignment.aggregatePaginate(
        aggregateQuery, 
        { 
            page: parseInt(req.query.page) || 1, 
            limit: parseInt(req.query.limit) || 10 
        }, 
        (err, assignments) => {
            if(err){
                res.send(err);
            }
            res.send(assignments);
        }
    );
}

// Récupérer un assignment par son id (GET)
function getAssignment(req, res){
    let assignmentId = req.params.id;

    Assignment.findById(assignmentId, (err, assignment) => {
        if(err){res.send(err)}
        res.json(assignment);
    })
}

// Ajout d'un assignment (POST)
function postAssignment(req, res){
    let assignment = new Assignment();
    // assignment.id = req.body.id;
    assignment.name = req.body.name;
    assignment.dueDate = req.body.dueDate;
    assignment.submitted = req.body.submitted;

    console.log("POST assignment reçu :");
    console.log(assignment)

    assignment.save( (err) => {
        if(err){
            console.log("when creating error", err);
            res.send('cant post assignment ', err);
        }
        console.log("assignment saved");
        res.json({ message: `${assignment.name} saved!`})
    })
}

// Update d'un assignment (PUT)
function updateAssignment(req, res) {
    console.log("UPDATE recu assignment : ");
    console.log(req.body);
    Assignment.findByIdAndUpdate(req.body._id, req.body, {new: true}, (err, assignment) => {
        if (err) {
            console.log(err);
            res.send(err)
        } else {
          res.json({message: 'updated'})
        }

      // console.log('updated ', assignment)
    });

}

// suppression d'un assignment (DELETE)
function deleteAssignment(req, res) {
    let assignmentId = req.params.id; // Utilisez 'id' au lieu de '_id'
    
    Assignment.findByIdAndDelete(assignmentId, (err, assignment) => {
        if (err) {
            return res.status(400).send(err); // Ajout du return pour empêcher l'exécution de la suite
        }
        if (!assignment) {
            return res.status(404).json({ message: "Assignment non trouvé" });
        }
        return res.status(200).json({ message: "Assignment supprimé" });
    });
}



module.exports = { getAssignments, postAssignment, getAssignment, updateAssignment, deleteAssignment };
