import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssignmentsService } from '../shared/assignments.service';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';

interface StatisticsData {
  totalAssignments: number;
  submittedCount: number;
  notSubmittedCount: number;
  submissionPercentage: number;
  averageGrade: number;
  gradedAssignments: number;
  topSubjects: {name: string, count: number}[];
  submissionTimeline: {month: string, count: number}[];
  gradeDistribution: {range: string, count: number}[];  // Added for the histogram
}

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatDividerModule, MatProgressBarModule, MatIconModule],
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
  title = "Statistics"

  statistics: StatisticsData = {
    totalAssignments: 0,
    submittedCount: 0,
    notSubmittedCount: 0,
    submissionPercentage: 0,
    averageGrade: 0,
    gradedAssignments: 0,
    topSubjects: [],
    submissionTimeline: [],
    gradeDistribution: []  
  };
  
  isLoading = true;

  constructor(private assignmentsService: AssignmentsService) { }

  ngOnInit(): void {
    this.loadStatistics();
  }

  loadStatistics(): void {
    this.isLoading = true;
    this.assignmentsService.getStatistics().subscribe(
      (data) => {
        this.statistics = data;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading statistics:', error);
        this.isLoading = false;
      }
    );
  }
}
