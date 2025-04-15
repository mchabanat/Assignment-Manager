import { Injectable } from '@angular/core';
import { Assignment } from '../assignments/assignment.model';
import { map, Observable, of, tap, forkJoin, switchMap } from 'rxjs';
import { LoggingService } from './logging.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { data } from '../../data';
import { datashort } from '../../datashort'; 

@Injectable({
  providedIn: 'root'
})
export class AssignmentsService {
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-type': 'application/json'
    })
  };

  backendURL = "http://localhost:8010/api/assignments";

  assignments: Assignment[] = [];

  constructor(private loggingService: LoggingService,private http: HttpClient ) { }

  getAssignments(): Observable<Assignment[]> {
    // return of(this.assignments); // Ancienne méthode
    return this.http.get<Assignment[]>(this.backendURL)
    .pipe(
      tap(assignments => console.log("Assignments fetched from backend:", assignments))
    );
  }

  getAssignmentsPaginated(page: number, limit: number): Observable<any> {
    return this.http.get<any>(this.backendURL + "?page=" + page + "&limit=" + limit)
  }

  getAssignment(id:string): Observable<Assignment|undefined> {
    // return of(this.assignments);
    /*const a:Assignment|undefined = this.assignments.find(
      a => a.id === id
    );

    return of(a);*/ // Ancienne méthode

    return this.http.get<Assignment>(this.backendURL + "/" + id);
  }

  addAssignment(name:string, dueDate:string, submitted:boolean): Observable<any> {
    // this.assignments.push(assignment);
    // this.loggingService.log(assignment.name, "added");

    // return of("Assignment added successfully");


    return this.http.post<Assignment>(this.backendURL, {
      name: name,
      dueDate: dueDate,
      submitted: submitted
    }, this.httpOptions);
  }

  updateAssignment(assignment: Assignment): Observable<any> {
    // envoyer requete PUT en base de données mais rien a faire ici si on travaille avec un tableau 
    // this.loggingService.log(assignment.name, "updated");

    // return of("Assignment updated successfully");

    return this.http.put<Assignment>(this.backendURL, assignment, this.httpOptions);
  }

  deleteAssignment(assignment: Assignment): Observable<any> {
    // let pos = this.assignments.indexOf(assignment);
    // this.assignments.splice(pos, 1);

    // this.loggingService.log(assignment.name, "deleted");
    // return of("Assignment deleted successfully");

    return this.http.delete<Assignment>(this.backendURL + "/" + assignment._id);
  }

  // private handleError<T>(operation, result?: T) {
  //   return (error: any): Observable<T> => {
  //     console.error(error); // log to console instead
  //     console.log(operation + " failed: " + error.message); 
  //     return of(result as T);
  //   };

  //   // LIgne a ajouter dans les pipe : 
  //   // catchError(this.handleError<any>('### catchError: getAssignments by id avec id=' + id))
  // }

  peuplerBDavecForkJoin():Observable<any> {
    let appelsVersAddAssignment:Observable<any>[] = [];
  
    datashort.forEach(a => {
      appelsVersAddAssignment.push(this.addAssignment(a.name, a.dueDate, a.submitted))
    });
  
    return forkJoin(appelsVersAddAssignment);
  }

  deleteBDavecForkJoin(): Observable<any> {
    // D'abord récupérer tous les assignments
    return this.getAssignments().pipe(
      switchMap(assignments => {
        // Si aucun assignment, retourner un observable avec message
        if (assignments.length === 0) {
          console.log("Aucun assignment à supprimer");
          return of({ message: "Aucun assignment à supprimer" });
        }
        
        // Créer un tableau d'observables de suppression
        const deleteObservables = assignments.map(assignment => 
          this.deleteAssignment(assignment).pipe(
            tap(() => console.log(`Assignment ${assignment.name} supprimé`))
          )
        );
        
        // Exécuter toutes les suppressions en parallèle
        return forkJoin(deleteObservables).pipe(
          tap(() => console.log(`${assignments.length} assignments supprimés`)),
          map(() => ({ message: `${assignments.length} assignments supprimés avec succès` }))
        );
      })
    );
  }
}
