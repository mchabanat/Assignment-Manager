import { CommonModule } from '@angular/common';
import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AssignmentsService } from '../../shared/assignments.service';
import { ActivatedRoute } from '@angular/router';
import { Assignment } from '../assignment.model';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../shared/auth.service';


@Component({
  selector: 'app-assignment-detail',
  imports: [CommonModule, MatCardModule, MatCheckboxModule, RouterLink],
  templateUrl: './assignment-detail.component.html',
  styleUrl: './assignment-detail.component.css'
})
export class AssignmentDetailComponent implements OnInit {
  /*@Input()*/ assignmentTransmis: Assignment | undefined;
  @Output() assignmentToDelete = new EventEmitter<any>();

  constructor(private assignmentsService: AssignmentsService, private route: ActivatedRoute, private router: Router, private authService: AuthService) { }

  isUserAdmin: boolean = false;

  ngOnInit() {
    this.getAssignment();
    this.checkIfAdmin();
  }

  async checkIfAdmin() {
    this.isUserAdmin = await this.authService.isAdmin();
    // console.log('Is user admin?', this.isUserAdmin);  
  }

  isAdmin() {
    return this.isUserAdmin;
  }

  getAssignment() {
    const id = +this.route.snapshot.params['id'];

    this.assignmentsService.getAssignment(id).subscribe(assignment => {
      this.assignmentTransmis = assignment;
    });
  }

  onAssignmentSubmitted() {
    if (this.assignmentTransmis) {
      this.assignmentTransmis.submitted = true;
    }

    if (this.assignmentTransmis) {
      this.assignmentsService.updateAssignment(this.assignmentTransmis).subscribe(message => {
        console.log(message);
      });
    }
  }

  onClickEdit() {
    this.router.navigate(['/assignment', this.assignmentTransmis?.id, 'edit'], {queryParams: {nom: this.assignmentTransmis?.name}, fragment: 'edition'});
  }

  onDelete() {
    // this.assignmentToDelete.emit(this.assignmentTransmis);

    if (this.assignmentTransmis) {
      this.assignmentsService.deleteAssignment(this.assignmentTransmis).subscribe(message => {
        console.log(message);
        this.router.navigate(['/home']);
      });
    }

    // this.assignmentTransmis = undefined;
  }
}
