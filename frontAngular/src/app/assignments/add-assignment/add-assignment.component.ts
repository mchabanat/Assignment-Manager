import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { AssignmentsService } from '../../shared/assignments.service';
import { Router } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-assignment',
  providers: [provideNativeDateAdapter()],
  imports: [
    FormsModule, 
    MatInputModule, 
    MatFormFieldModule, 
    MatDatepickerModule, 
    MatButtonModule,
    MatCheckboxModule,
    MatSelectModule,
    CommonModule
  ],
  templateUrl: './add-assignment.component.html',
  styleUrl: './add-assignment.component.css'
})
export class AddAssignmentComponent {
  title = "Add new assignment"

  // Champs du formulaire
  assignmentName = '';
  assignmentDueDate?: Date = undefined;
  assignmentAuthor = '';
  assignmentSubmitted = false;
  assignmentSubjectName = '';
  assignmentSubjectImage = '';
  assignmentGrade: number | null = null;
  assignmentRemarks = '';
  // Ajout des propriétés pour les informations du professeur
  assignmentProfessorName = '';
  assignmentProfessorPhoto = '';

  // Options de matières avec professeurs associés
  subjects = [
    {name: 'Web Development', image: 'assets/images/subjects/web.png', professor: {name: 'Dr. Emily Chen', photo: 'assets/images/professors/chen.jpg'}},
    {name: 'Database Systems', image: 'assets/images/subjects/database.png', professor: {name: 'Prof. Michael Rodriguez', photo: 'assets/images/professors/rodriguez.jpg'}},
    {name: 'Algorithms & Data Structures', image: 'assets/images/subjects/algorithms.png', professor: {name: 'Dr. David Kim', photo: 'assets/images/professors/kim.jpg'}},
    {name: 'Computer Networks', image: 'assets/images/subjects/networks.png', professor: {name: 'Prof. Sarah Johnson', photo: 'assets/images/professors/johnson.jpg'}},
    {name: 'Cybersecurity', image: 'assets/images/subjects/security.png', professor: {name: 'Dr. James Wilson', photo: 'assets/images/professors/wilson.jpg'}},
    {name: 'Software Engineering', image: 'assets/images/subjects/software.png', professor: {name: 'Prof. Lisa Brown', photo: 'assets/images/professors/brown.jpg'}},
    {name: 'Mobile Development', image: 'assets/images/subjects/mobile.png', professor: {name: 'Dr. Robert Taylor', photo: 'assets/images/professors/taylor.jpg'}},
    {name: 'Cloud Computing', image: 'assets/images/subjects/cloud.png', professor: {name: 'Prof. Anna Martinez', photo: 'assets/images/professors/martinez.jpg'}},
    {name: 'Artificial Intelligence', image: 'assets/images/subjects/ai.png', professor: {name: 'Dr. Thomas Lee', photo: 'assets/images/professors/lee.jpg'}},
    {name: 'Operating Systems', image: 'assets/images/subjects/os.png', professor: {name: 'Prof. Julia White', photo: 'assets/images/professors/white.jpg'}}
  ];

  constructor(
    private assignmentsService: AssignmentsService, 
    private router: Router
  ) { }

  // Gère la sélection de matière pour mettre à jour le chemin de l'image et les infos du professeur
  onSubjectChange() {
    const selectedSubject = this.subjects.find(subject => subject.name === this.assignmentSubjectName);
    if (selectedSubject) {
      this.assignmentSubjectImage = selectedSubject.image;
      this.assignmentProfessorName = selectedSubject.professor.name;
      this.assignmentProfessorPhoto = selectedSubject.professor.photo;
    }
  }

  addAssignment() {
    if (!this.assignmentName || !this.assignmentDueDate) return;

    // Règle: les devoirs ne peuvent pas être marqués comme rendus s'ils n'ont pas de note
    if (this.assignmentSubmitted && this.assignmentGrade === null) {
      alert("Cannot mark assignment as submitted when it doesn't have a grade");
      return;
    }

    // Création de l'objet matière avec les informations du professeur
    const subject = this.assignmentSubjectName ? {
      name: this.assignmentSubjectName,
      image: this.assignmentSubjectImage,
      professor: {
        name: this.assignmentProfessorName,
        photo: this.assignmentProfessorPhoto
      }
    } : null;

    // Formatage de la date pour la base de données
    const formattedDate = this.formatDate(this.assignmentDueDate);

    this.assignmentsService.addAssignment(
      this.assignmentName,
      formattedDate,
      this.assignmentSubmitted,
      this.assignmentAuthor,
      subject,
      this.assignmentGrade,
      this.assignmentRemarks
    )
    .subscribe(message => {
      console.log(message);
      this.router.navigate(['/home']);
    });
  }

  // Méthode auxiliaire pour formater la date pour la base de données
  private formatDate(date: Date): string {
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  }
}
