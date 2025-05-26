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
    
    // Ajout des nouveaux champs
    assignment.author = req.body.author;
    assignment.subject = req.body.subject;
    assignment.grade = req.body.grade;
    assignment.remarks = req.body.remarks;

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

// Mise à jour d'un assignment (PUT)
function updateAssignment(req, res) {
    console.log("UPDATE recu assignment : ");
    console.log(req.body);
    
    // Vérification de l'ID de l'assignment dans plusieurs emplacements possibles
    const assignmentId = req.body._id || req.params.id || req.body.id;
    
    if (!assignmentId) {
        console.log("Missing assignment ID in request");
        return res.status(400).json({ message: "Missing assignment ID in request" });
    }
    
    // Création d'un objet de mise à jour avec uniquement les champs que nous voulons mettre à jour
    const updateData = {};
    if (req.body.name !== undefined) updateData.name = req.body.name;
    if (req.body.dueDate !== undefined) updateData.dueDate = req.body.dueDate;
    if (req.body.submitted !== undefined) updateData.submitted = req.body.submitted;
    if (req.body.author !== undefined) updateData.author = req.body.author;
    if (req.body.subject !== undefined) updateData.subject = req.body.subject;
    if (req.body.grade !== undefined) updateData.grade = req.body.grade;
    if (req.body.remarks !== undefined) updateData.remarks = req.body.remarks;

    console.log("Updating assignment with ID:", assignmentId);
    console.log("Update data being applied:", updateData);
    
    Assignment.findByIdAndUpdate(
        assignmentId,
        updateData,
        {new: true}, // Remove runValidators if it's causing issues
        (err, assignment) => {
            if (err) {
                console.log("Error updating assignment:", err);
                return res.status(500).json({ message: "Error updating assignment", error: err.message });
            } 
            
            if (!assignment) {
                console.log("No assignment found with id:", assignmentId);
                return res.status(404).json({ message: "Assignment not found" });
            }
            
            console.log("Assignment updated successfully:", assignment);
            return res.json({message: 'updated', assignment: assignment});
        }
    );
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
