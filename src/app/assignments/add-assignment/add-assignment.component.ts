import { Component, /*EventEmitter, Output*/ } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core'; 
import { AssignmentsService } from '../../shared/assignments.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-add-assignment',
  imports: [FormsModule, MatInputModule, MatButtonModule, MatFormFieldModule, MatDatepickerModule, MatNativeDateModule],
  templateUrl: './add-assignment.component.html',
  styleUrl: './add-assignment.component.css'
})
export class AddAssignmentComponent {
  // @Output() newAssignment = new EventEmitter<any>();
  // FOR THE FORM INPUT FIELDS
  assignmentName = "";
  assignmentDueDate!:Date;

  constructor(private assignmentsService: AssignmentsService, private router: Router) { }

  addAssignment() {
    // this.assignments.push({
    //   name: this.assignmentName,
    //   dueDate: this.assignmentDueDate.toLocaleDateString('fr-CA'),
    //   submitted: false
    // });

    // this.newAssignment.emit({
    //   name: this.assignmentName,
    //   dueDate: this.assignmentDueDate.toLocaleDateString('fr-CA'),
    //   submitted: false
    // });

    this.assignmentsService.addAssignment({
      id: 0,
      name: this.assignmentName,
      dueDate: this.assignmentDueDate.toLocaleDateString('fr-CA'),
      submitted: false
    }).subscribe(message => {
      console.log(message);
      this.router.navigate(['/home']);
    });

    this.assignmentName = "";
    this.assignmentDueDate = null as any;
  }
}
