import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../models/user';
import { Subscription } from 'rxjs/Subscription';
import { GlobalService } from '../services/global.service';
import { Router } from '@angular/router';
import { EmployeeService } from '../services/employee.service';
import { Employee } from '../models/employee';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

//import { RatingService } from '../services/rating.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [EmployeeService]
})
export class HomeComponent implements OnInit {
  account: User = new User();
  userSub: Subscription;
  employees;
  selectedEmployee: Employee;
  employeeInput: FormGroup;
  isAddEditMode: boolean;
  isEdit: boolean;




  constructor(private global: GlobalService, private router: Router,
    private employeeService: EmployeeService, private fb: FormBuilder,
    public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.userSub = this.global.user.subscribe(
      me => this.account = me
    );
    if ( localStorage.getItem('token') && localStorage.getItem('account')) {
      this.global.me = JSON.parse(localStorage.getItem('account'));
      this.getEmployees();
    } else {
      this.router.navigate(['/login']);
    }
    this.isAddEditMode = false;
    this.isEdit = false;
    this.employeeInput = this.fb.group({
      name: ['', Validators.required],
      position: ['', Validators.required],
      mobileNo: ['', Validators.required]
    });
    //this.my_rating = 3;
  }

  getEmployees() {
    this.employeeService.getEmployees().subscribe(
      response => {
        this.employees = response;
      },
      error => {
        this.snackBar.open('Error getting Employees', '', { duration: 3000 });
      }
    );
  }
  editEmployeeClicked() {
    this.isEdit = true;
    this.isAddEditMode = true;
    this.employeeInput = this.fb.group({
      name: [this.selectedEmployee.name, Validators.required],
      position: [this.selectedEmployee.position, Validators.required],
      mobileNo : [this.selectedEmployee.mobileNo, Validators.required]
    });
  }
  addEmployeeClicked() {
    this.isEdit = false;
    this.isAddEditMode = true;
    this.selectedEmployee = null;
    this.employeeInput.reset();
  }
  submitEmployee() {
    if (this.isEdit) {
      this.employeeService.editEmployee(this.employeeInput.value, this.selectedEmployee.id).subscribe(
        response => {
          const movIndx = this.employees.map(function(e) {return e.id; }).indexOf(this.selectedEmployee.id);
          if (movIndx >= 0) {
            this.employees[movIndx] = response;
            this.selectedEmployee = response;
          }
          this.employeeInput.reset();
          this.isAddEditMode = false;
        },
        error => {
          this.snackBar.open('Error edit Employee', '', { duration: 3000 });
        }
      );
    } else {
      this.employeeService.addEmployee(this.employeeInput.value).subscribe(
        response => {
          this.employees.push(response);
          this.employeeInput.reset();
          this.isAddEditMode = false;
        },
        error => {
          this.snackBar.open('Error adding Employee', '', { duration: 3000 });
        }
      );
    }
  }
  deleteEmployeeClicked() {
    this.employeeService.deleteEmployee(this.selectedEmployee.id).subscribe(
      response => {
        const movIndx = this.employees.map(function(e) {return e.id; }).indexOf(this.selectedEmployee.id);
        if (movIndx >= 0) {
          this.employees.splice(movIndx, 1);
          this.selectedEmployee = null;
        }
        this.isAddEditMode = false;
      },
      error => {
        this.snackBar.open('Error deleting Employee', '', { duration: 3000 });
      }
    );
  }
  employeeClicked(employee: Employee) {
    this.selectedEmployee = employee;
    this.isAddEditMode = false;
  }
  editaddemp(id) {
    
    console.log('id>>', id);
    if (id > 0) {
      this.router.navigate(['home/editemp/' + id]);
      this.isAddEditMode = true;
      this.isEdit = true;
    }

    else {
      
      this.router.navigate(['home/addemp']);
    }
  }

  logoutClicked() {
    this.global.me = new User();
    localStorage.removeItem('token');
    localStorage.removeItem('account');
    this.router.navigate(['/login']);
  }
}
