import { Injectable } from '@angular/core';
import { Assignment } from '../assignments/assignment.model';
import { Observable, of } from 'rxjs';
import { LoggingService } from './logging.service';


@Injectable({
  providedIn: 'root'
})
export class AssignmentsService {

  assignments: Assignment[] = [
    {
      id: 1,
      name: "Assignment 1",
      dueDate: "2021-01-01",
      submitted: true
    },
    {
      id: 2,
      name: "Assignment 2",
      dueDate: "2021-02-01",
      submitted: true
    },
    {
      id: 3,
      name: "Assignment 3",
      dueDate: "2021-03-01",
      submitted: false
    }
  ];

  constructor(private loggingService: LoggingService) { }

  getAssignments(): Observable<Assignment[]> {
    return of(this.assignments);
  }

  getAssignment(id:number): Observable<Assignment|undefined> {
    // return of(this.assignments);
    const a:Assignment|undefined = this.assignments.find(
      a => a.id === id
    );

    return of(a);
  }

  addAssignment(assignment: Assignment): Observable<string> {
    this.assignments.push(assignment);
    this.loggingService.log(assignment.name, "added");

    return of("Assignment added successfully");
  }

  updateAssignment(assignment: Assignment): Observable<string> {
    // envoyer requete PUT en base de données mais rien a faire ici si on travaille avec un tableau 
    this.loggingService.log(assignment.name, "updated");

    return of("Assignment updated successfully");
  }

  deleteAssignment(assignment: Assignment): Observable<string> {
    let pos = this.assignments.indexOf(assignment);
    this.assignments.splice(pos, 1);

    this.loggingService.log(assignment.name, "deleted");
    return of("Assignment deleted successfully");
  }
}
