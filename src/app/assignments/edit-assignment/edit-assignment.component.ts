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

@Component({
  selector: 'app-edit-assignment',
  providers: [provideNativeDateAdapter()],
  imports: [FormsModule, MatInputModule, MatFormFieldModule, MatDatepickerModule, MatButtonModule ],
  templateUrl: './edit-assignment.component.html',
  styleUrl: './edit-assignment.component.css',
})
export class EditAssignmentComponent {
  assignment: Assignment | undefined;
  // Pour les champs de formulaire
  assignmentName = '';
  assignmentDueDate?: Date = undefined;
 
  constructor(private assignmentsService: AssignmentsService,private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    // Récupération de l'ID depuis l'URL
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.assignmentsService.getAssignment(+id).subscribe((assignment) => {
        if (assignment) {
          this.assignment = assignment;
          this.assignmentName = assignment.name;
          this.assignmentDueDate = new Date(assignment.dueDate);
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
 
  onSaveAssignment() {
    if (!this.assignment) return;
    if (this.assignmentName == '' || this.assignmentDueDate === undefined) return;
 
    // on récupère les valeurs dans le formulaire
    this.assignment.name = this.assignmentName;
    this.assignment.dueDate = this.assignmentDueDate.toLocaleDateString('fr-CA');
    this.assignmentsService
      .updateAssignment(this.assignment)
      .subscribe((message) => {
        console.log(message);
 
        // navigation vers la home page
        this.router.navigate(['/home']);
      });
  }
 }
 