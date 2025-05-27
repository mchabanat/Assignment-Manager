import { CommonModule } from '@angular/common';
import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { AssignmentsService } from '../../shared/assignments.service';
import { ActivatedRoute } from '@angular/router';
import { Assignment } from '../assignment.model';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../shared/auth.service';


@Component({
  selector: 'app-assignment-detail',
  imports: [CommonModule, MatCardModule, MatCheckboxModule, RouterLink, MatIconModule],
  templateUrl: './assignment-detail.component.html',
  styleUrl: './assignment-detail.component.css'
})
export class AssignmentDetailComponent implements OnInit {
  /*@Input()*/ assignmentTransmis: Assignment | undefined;
  @Output() assignmentToDelete = new EventEmitter<any>();
  
  // Stockage des informations du professeur
  professorInfo: { name: string; photo: string } | null = null;
  
  // Liste des matières avec professeurs (identique à celle des autres composants)
  subjects = [
    {name: 'Web Development', image: 'assets/images/subjects/web.png', professor: {name: 'Emily Chen', photo: 'assets/images/professors/chen.jpg'}},
    {name: 'Database Systems', image: 'assets/images/subjects/database.png', professor: {name: 'Michael Rodriguez', photo: 'assets/images/professors/rodriguez.jpg'}},
    {name: 'Algorithms & Data Structures', image: 'assets/images/subjects/algorithms.png', professor: {name: 'David Kim', photo: 'assets/images/professors/kim.jpg'}},
    {name: 'Computer Networks', image: 'assets/images/subjects/networks.png', professor: {name: 'Sarah Johnson', photo: 'assets/images/professors/johnson.jpg'}},
    {name: 'Cybersecurity', image: 'assets/images/subjects/security.png', professor: {name: 'James Wilson', photo: 'assets/images/professors/wilson.jpg'}},
    {name: 'Software Engineering', image: 'assets/images/subjects/software.png', professor: {name: 'Lisa Brown', photo: 'assets/images/professors/brown.jpg'}},
    {name: 'Mobile Development', image: 'assets/images/subjects/mobile.png', professor: {name: 'Robert Taylor', photo: 'assets/images/professors/taylor.jpg'}},
    {name: 'Cloud Computing', image: 'assets/images/subjects/cloud.png', professor: {name: 'Anna Martinez', photo: 'assets/images/professors/martinez.jpg'}},
    {name: 'Artificial Intelligence', image: 'assets/images/subjects/ai.png', professor: {name: 'Thomas Lee', photo: 'assets/images/professors/lee.jpg'}},
    {name: 'Operating Systems', image: 'assets/images/subjects/os.png', professor: {name: 'Julia White', photo: 'assets/images/professors/white.jpg'}}
  ];

  constructor(private assignmentsService: AssignmentsService, private route: ActivatedRoute, private router: Router, private authService: AuthService) { }

  isUserAdmin: boolean = false;

  ngOnInit() {
    this.getAssignment();
    this.checkIfAdmin();
  }

  async checkIfAdmin() {
    this.isUserAdmin = await this.authService.isAdmin();
  }

  isAdmin() {
    return this.isUserAdmin;
  }

  getAssignment() {
    const id = this.route.snapshot.params['id'];
    console.log("ID de l'assignement : ", id);

    this.assignmentsService.getAssignment(id).subscribe(assignment => {
      this.assignmentTransmis = assignment;
      console.log("Assignment transmis : ", this.assignmentTransmis);
      
      // Trouver le professeur associé à l'assignement
      if (assignment && assignment.subject) {
        const subject = this.subjects.find(s => s.name === assignment.subject?.name);
        if (subject) {
          this.professorInfo = subject.professor;
        }
      }
    });
  }

  onAssignmentSubmitted() {
    if (!this.assignmentTransmis) return;

    // Vérifier que le devoir a une note avant de permettre la soumission
    if (!this.assignmentTransmis.submitted && this.assignmentTransmis.grade === null) {
      alert("Error: Assignment cannot be marked as submitted until it has been graded.");
      return;
    }
    
    this.assignmentTransmis.submitted = !this.assignmentTransmis.submitted;

    this.assignmentsService.updateAssignment(this.assignmentTransmis).subscribe(message => {
      console.log(message);
      this.router.navigate(['/home']);
    });
  }

  onClickEdit() {
    this.router.navigate(['/assignment', this.assignmentTransmis?._id, 'edit'], 
      {queryParams: {nom: this.assignmentTransmis?.name}, fragment: 'edition'});
  }

  onDelete() {
    if (this.assignmentTransmis) {
      // Afficher une confirmation modale avant de supprimer
      const confirmation = window.confirm(`Êtes-vous sûr de vouloir supprimer le devoir "${this.assignmentTransmis.name}" ?`);
      
      if (confirmation) {
        this.assignmentsService.deleteAssignment(this.assignmentTransmis).subscribe(message => {
          console.log(message);
          this.router.navigate(['/home']);
        });
      }
    }
  }

  // Obtenir une URL d'image sécurisée ou un placeholder si aucune n'existe
  getSafeImageUrl(assignment: Assignment | undefined): string {
    const placeholderUrl = 'assets/images/Placeholder.png';
    
    if (!assignment || !assignment.subject || !assignment.subject.image) {
      return placeholderUrl;
    }
    
    return assignment.subject.image;
  }

  // Gérer les erreurs de chargement d'image
  handleImageError(event: any) {
    event.target.src = 'assets/images/Placeholder.png';
  }

  // Gérer les erreurs de chargement d'image du professeur
  handleProfessorImageError(event: any) {
    event.target.src = 'assets/images/professors/default.jpg';
  }
}
