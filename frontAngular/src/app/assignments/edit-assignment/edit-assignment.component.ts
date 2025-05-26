import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Assignment } from '../assignment.model';
import { AssignmentsService } from '../../shared/assignments.service';
import { Router } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-assignment',
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
  templateUrl: './edit-assignment.component.html',
  styleUrl: './edit-assignment.component.css',
})
export class EditAssignmentComponent {
  title = "Edit assignment"

  assignment: Assignment | undefined;
  
  // Champs du formulaire
  assignmentName = '';
  assignmentDueDate?: Date = undefined;
  assignmentAuthor = '';
  assignmentSubmitted = false;
  assignmentSubjectName = '';
  assignmentSubjectImage = '';
  assignmentGrade: number | null = null;
  assignmentRemarks = '';
  // Propriétés pour les informations du professeur
  assignmentProfessorName = '';
  assignmentProfessorPhoto = '';

  // Options de matières avec professeurs (pourrait être récupéré depuis un service dans une application réelle)
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
 
  constructor(private assignmentsService: AssignmentsService,
             private router: Router, 
             private route: ActivatedRoute) {}

  ngOnInit() {
    // Récupération de l'ID depuis l'URL
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.assignmentsService.getAssignment(id).subscribe((assignment) => {
        if (assignment) {
          this.assignment = assignment;
          this.assignmentName = assignment.name;
          this.assignmentDueDate = new Date(assignment.dueDate);
          this.assignmentAuthor = assignment.author;
          this.assignmentSubmitted = assignment.submitted;
          
          if (assignment.subject) {
            this.assignmentSubjectName = assignment.subject.name;
            this.assignmentSubjectImage = assignment.subject.image;
          }
          
          this.assignmentGrade = assignment.grade || null;
          this.assignmentRemarks = assignment.remarks || '';
        }
      });
    }

    // console.log("Query Params : ", this.route.snapshot.queryParams);
    // console.log("Fragment : ", this.route.snapshot.fragment);

    this.route.queryParams.subscribe(params => {
      console.log("Query Params : ", params);
    });

    this.route.fragment.subscribe(fragment => {
      console.log("Fragment : ", fragment);
    });
  }

  // Gère la sélection de matière pour mettre à jour le chemin de l'image et les infos du professeur
  onSubjectChange() {
    const selectedSubject = this.subjects.find(subject => subject.name === this.assignmentSubjectName);
    if (selectedSubject) {
      this.assignmentSubjectImage = selectedSubject.image;
      this.assignmentProfessorName = selectedSubject.professor.name;
      this.assignmentProfessorPhoto = selectedSubject.professor.photo;
    }
  }
 
  onSaveAssignment() {
    if (!this.assignment) return;
    if (this.assignmentName === '' || this.assignmentDueDate === undefined) return;
 
    // Mise à jour de tous les champs du devoir
    this.assignment.name = this.assignmentName;
    this.assignment.dueDate = this.formatDate(this.assignmentDueDate);
    this.assignment.author = this.assignmentAuthor;
    
    // Règle: les devoirs ne peuvent pas être marqués comme rendus s'ils n'ont pas de note
    if (this.assignmentSubmitted && this.assignmentGrade === null) {
      alert("Cannot mark assignment as submitted when it doesn't have a grade");
      return;
    }
    this.assignment.submitted = this.assignmentSubmitted;

    // Mise à jour de la matière
    if (!this.assignment.subject) {
      this.assignment.subject = {
        name: this.assignmentSubjectName,
        image: this.assignmentSubjectImage,
        professor: {
          name: this.assignmentProfessorName,
          photo: this.assignmentProfessorPhoto
        }
      };
    } else {
      this.assignment.subject.name = this.assignmentSubjectName;
      this.assignment.subject.image = this.assignmentSubjectImage;
      // Add or update professor information
      if (!this.assignment.subject.professor) {
        this.assignment.subject.professor = {
          name: this.assignmentProfessorName,
          photo: this.assignmentProfessorPhoto
        };
      } else {
        this.assignment.subject.professor.name = this.assignmentProfessorName;
        this.assignment.subject.professor.photo = this.assignmentProfessorPhoto;
      }
    }
    
    this.assignment.grade = this.assignmentGrade;
    this.assignment.remarks = this.assignmentRemarks;
 
    this.assignmentsService.updateAssignment(this.assignment).subscribe((message) => {
      console.log(message);
      // navigation vers la home page
      this.router.navigate(['/home']);
    });
  }

  // Méthode auxiliaire pour formater la date pour la base de données
  private formatDate(date: Date): string {
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  }
}
