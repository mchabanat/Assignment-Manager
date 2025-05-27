import { Injectable } from '@angular/core';
import { Assignment } from '../assignments/assignment.model';
import { map, Observable, of, tap, forkJoin, switchMap } from 'rxjs';
import { LoggingService } from './logging.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { data } from '../../assets/data/data';
import { datashort } from '../../assets/data/datashort'; 

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

  addAssignment(name:string, dueDate:string, submitted:boolean, author:string = '', 
                subject:any = null, grade:number|null = null, remarks:string = ''): Observable<any> {
    // this.assignments.push(assignment);
    // this.loggingService.log(assignment.name, "added");

    // return of("Assignment added successfully");


    return this.http.post<Assignment>(this.backendURL, {
      name: name,
      dueDate: dueDate,
      submitted: submitted,
      author: author,
      subject: subject,
      grade: grade,
      remarks: remarks
    }, this.httpOptions);
  }

  updateAssignment(assignment: Assignment): Observable<any> {
    // S'assurer que nous gérons tous les champs lors de la mise à jour
    const updatedAssignment = {
      id: assignment._id,
      name: assignment.name,
      dueDate: assignment.dueDate,
      submitted: assignment.submitted,
      author: assignment.author,
      subject: assignment.subject,
      grade: assignment.grade,
      remarks: assignment.remarks
    };
    
    // envoyer requête PUT en base de données mais rien a faire ici si on travaille avec un tableau 
    // this.loggingService.log(assignment.name, "updated");

    // return of("Assignment updated successfully");

    return this.http.put<Assignment>(this.backendURL, updatedAssignment, this.httpOptions);
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
  //     console.error(error); // afficher dans la console
  //     console.log(operation + " failed: " + error.message); 
  //     return of(result as T);
  //   };

  //   // Ligne à ajouter dans les pipe : 
  //   // catchError(this.handleError<any>('### catchError: getAssignments by id avec id=' + id))
  // }

  peuplerBDavecForkJoin():Observable<any> {
    let appelsVersAddAssignment:Observable<any>[] = [];
  
    datashort.forEach(a => {
      appelsVersAddAssignment.push(
        this.addAssignment(
          a.name, 
          a.dueDate, 
          a.submitted, 
          a.author, 
          a.subject, 
          a.grade, 
          a.remarks
        )
      )
    });
  
    return forkJoin(appelsVersAddAssignment);
  }

  deleteBDavecForkJoin(): Observable<any> {
    // D'abord récupérer tous les assignments avec une limite élevée
    return this.http.get<any>(this.backendURL + "?page=1&limit=1000").pipe(
      switchMap(response => {
        const assignments = response.docs;
        
        // Si aucun assignment, retourner un observable avec message
        if (assignments.length === 0) {
          console.log("Aucun assignment à supprimer");
          return of({ message: "Aucun assignment à supprimer" });
        }
        
        // Créer un tableau d'observables de suppression
        const deleteObservables = assignments.map((assignment: Assignment) => 
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

  getStatistics(): Observable<any> {
    // Get all assignments (using a large limit to ensure we get most/all data)
    return this.http.get<any>(this.backendURL + "?page=1&limit=1000").pipe(
      map(response => {
        const assignments = response.docs;
        const totalAssignments = assignments.length;
        
        // Submitted vs Not Submitted Stats
        const submittedAssignments = assignments.filter((a: Assignment) => a.submitted);
        const submittedCount = submittedAssignments.length;
        const notSubmittedCount = totalAssignments - submittedCount;
        const submissionPercentage = totalAssignments > 0 ? 
          (submittedCount / totalAssignments) * 100 : 0;
        
        // Grade Statistics
        const gradedAssignments = assignments.filter((a: Assignment) => 
          a.grade !== null && a.grade !== undefined).length;
        
        let totalGrades = 0;
        assignments.forEach((a: Assignment) => {
          if (a.grade !== null && a.grade !== undefined) {
            totalGrades += a.grade;
          }
        });
        
        const averageGrade = gradedAssignments > 0 ? 
          totalGrades / gradedAssignments : 0;
        
        // Calculate grade distribution for histogram
        const gradeDistribution = [
          { range: '0-5', count: 0 },
          { range: '6-10', count: 0 },
          { range: '11-15', count: 0 },
          { range: '16-20', count: 0 }
        ];

        assignments.forEach((a: Assignment) => {
          if (a.grade !== null && a.grade !== undefined) {
            if (a.grade >= 0 && a.grade <= 5) gradeDistribution[0].count++;
            else if (a.grade > 5 && a.grade <= 10) gradeDistribution[1].count++;
            else if (a.grade > 10 && a.grade <= 15) gradeDistribution[2].count++;
            else if (a.grade > 15 && a.grade <= 20) gradeDistribution[3].count++;
          }
        });
        
        // Get Top Subjects
        const subjectCounts: {[key: string]: number} = {};
        assignments.forEach((a: Assignment) => {
          const subjectName = a.subject?.name || 'Not specified';
          if (subjectCounts[subjectName]) {
            subjectCounts[subjectName]++;
          } else {
            subjectCounts[subjectName] = 1;
          }
        });
        
        const topSubjects = Object.entries(subjectCounts)
          .map(([name, count]) => ({name, count}))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5); // Top 5 subjects
        
        // Create a submission timeline (by month)
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        const timelineCounts: {[key: string]: number} = {};
        
        // Initialize all months to ensure they appear in the timeline
        monthNames.forEach(month => {
          timelineCounts[month] = 0;
        });
        
        assignments.forEach((a: Assignment) => {
          if (a.submitted) {
            const dueDate = new Date(a.dueDate);
            const month = monthNames[dueDate.getMonth()];
            timelineCounts[month]++;
          }
        });
        
        const submissionTimeline = Object.entries(timelineCounts)
          .map(([month, count]) => ({month, count}));
        
        // Return the calculated statistics
        return {
          totalAssignments,
          submittedCount,
          notSubmittedCount,
          submissionPercentage,
          averageGrade,
          gradedAssignments,
          topSubjects,
          submissionTimeline,
          gradeDistribution  // Add the new property
        };
      })
    );
  }
}
