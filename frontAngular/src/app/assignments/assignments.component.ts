import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubmittedDirective } from '../shared/submitted.directive';
import { NotSubmittedDirective } from '../shared/not-submitted.directive';
import { provideNativeDateAdapter } from '@angular/material/core';
import { AssignmentDetailComponent } from './assignment-detail/assignment-detail.component';
import { AddAssignmentComponent } from './add-assignment/add-assignment.component';
import { MatList, MatListItem } from '@angular/material/list';
import { MatDivider } from '@angular/material/divider';
import { Assignment } from './assignment.model';
import { AssignmentsService } from '../shared/assignments.service';
import { RouterLink, RouterOutlet } from '@angular/router';
import { data } from '../../data';


@Component({
  selector: 'app-assignments',
  imports: [CommonModule, SubmittedDirective, NotSubmittedDirective, AssignmentDetailComponent, MatList, MatListItem, MatDivider, AddAssignmentComponent, RouterLink, RouterOutlet],
  templateUrl: './assignments.component.html',
  styleUrl: './assignments.component.css',
  providers: [provideNativeDateAdapter()]
})


export class AssignmentsComponent implements OnInit {
  title = "Assignments listing"

  //Pagination
  page:number = 1;
  limit:number = 10;
  totalDocs!:number;
  totalPages!:number;
  nextPage!:number;
  prevPage!:number;
  hasPrevPage!:boolean;
  hasNextPage!:boolean;

  // ajoutActive=false;
  assignments: Assignment[] | undefined;

  constructor(private assignmentsService: AssignmentsService) { }

  ngOnInit() {
    // setTimeout(() => {
    //   this.ajoutActive = true;
    // }, 2000);

    // this.assignments = this.assignmentsService.getAssignments(); // Avant observables
    this.assignmentsService.getAssignmentsPaginated(this.page, this.limit)
    .subscribe(data => {
      this.assignments = data.docs;
      this.totalDocs = data.totalDocs;
      this.totalPages = data.totalPages;
      this.nextPage = data.nextPage;
      this.prevPage = data.prevPage;
      this.hasPrevPage = data.hasPrevPage;
      this.hasNextPage = data.hasNextPage;
    });
  }

  peuplerBD() {
    this.assignmentsService.peuplerBDavecForkJoin()
      .subscribe(() => {
        console.log("LA BD A ETE PEUPLEE, TOUS LES ASSIGNMENTS AJOUTES, ON RE-AFFICHE LA LISTE");
        //  replaceUrl = true = force le refresh, même si
        // on est déjà sur la page d’accueil
        // Marche plus avec la dernière version d’angular
        //this.router.navigate(["/home"], {replaceUrl:true});
        // ceci marche :
        window.location.reload();
      })
  }

  clearDB() {
    this.assignmentsService.deleteBDavecForkJoin()
      .subscribe(() => {
        console.log("LA BD A ETE VIDEE, TOUS LES ASSIGNMENTS SUPPRIMES, ON RE-AFFICHE LA LISTE");
        //this.router.navigate(["/home"], {replaceUrl:true});
        window.location.reload();
      })
  }

  getAssignments() {
    this.assignmentsService.getAssignments().subscribe(assignments =>
      this.assignments = assignments);
  }

  getColor(a: any) {
    return a.submitted ? 'lightgreen' : 'lightcoral';
  }

  // formVisible = false;
  // onAddAssignmentBtnClick() {
  //   this.formVisible = true;
  // }

  // onNewAssignment(event: any) {
  //   // if (this.assignments) {
  //   //   this.assignments.push(event);
  //   // }
  //   this.assignmentsService.addAssignment(event).subscribe(message => {
  //     console.log(message);
  //   });
  //   this.formVisible = false;
  // }

  // assignmentSelected!: any;
  // onSelect(a: any) {
  //   this.assignmentSelected = a;
  // }

  onDeleteAssignment(assignmentToDelete: any) {
    if (this.assignments) {
      this.assignments = this.assignments.filter(assignment => assignment !== assignmentToDelete);
    }
    // console.log('Assignment supprimé:', assignmentToDelete);
    // this.assignmentSelected = null;
  }
}
