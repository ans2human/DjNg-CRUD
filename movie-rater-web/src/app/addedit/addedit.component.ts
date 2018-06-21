import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { Subscription } from 'rxjs/Subscription';
import { GlobalService } from '../services/global.service';
import { Router, ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../services/employee.service';
import { Employee } from '../models/employee';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-addedit',
  templateUrl: './addedit.component.html',
  styleUrls: ['./addedit.component.css'],
  providers: [EmployeeService]
})
export class AddeditComponent implements OnInit {
  account: User = new User();
  userSub: Subscription;
  employees;
  name: string;
  position: string;
  mobileNo: number;
  selectedEmployee: Employee;
  employeeInput: FormGroup;
  isAddEditMode: boolean;
  isEdit: boolean;
  id: number;
  constructor(private global: GlobalService, private router: Router, private route: ActivatedRoute,
    private employeeService: EmployeeService, private fb: FormBuilder,
    public snackBar: MatSnackBar) { 

  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = +params['id']; // (+) converts string 'id' to a number         
      console.log('ttt>>>' + this.id);
    });
    this.userSub = this.global.user.subscribe(
      me => this.account = me
    );
    if ( localStorage.getItem('token') && localStorage.getItem('account')) {
      this.global.me = JSON.parse(localStorage.getItem('account'));
      this.getEmployeeById();
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
    
  }
  // editEmployeeClicked(id) {
  //   this.isEdit = true;
  //   this.isAddEditMode = true;
    
  //   console.log("editpage >>" + id);
  //   console.log("if edit >>>" + this.isEdit);

  // }

  getEmployeeById() {
    this.employeeService.getEmployeebyid(this.id).subscribe(
      response => {
        
        console.log("databyid>>>" + response);
        this.name = response['name'];
        this.position = response['position'];
        this.mobileNo = response['mobileNo'];
          // position: data['position'],
          // mobileNo: data['mobileNo'],
          
        
        console.log(response['name']);
        console.log(response['position']);
        console.log(response['mobileNo']);
      },
 
    );
  }

  sendMeHome() {
  this.router.navigate(['/home']);
  
  }

  Formdata() {

  }


  submitEmployee() {
    if (this.id > 0 ) {
      this.employeeService.addEmployeebyid(this.employeeInput.value, this.id).subscribe(
        response => {
          this.employees.push(response);
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
       },
        error => {
          this.snackBar.open('Error adding Employee', '', { duration: 3000 });
        }
      );
    }
  }

  addEmployeeClicked() {
    this.isEdit = false;
    this.isAddEditMode = true;
    this.selectedEmployee = null;
    this.employeeInput.reset();
  }
  employeeClicked(employee: Employee) {
    this.selectedEmployee = employee;
    this.isAddEditMode = false;
  }
  logoutClicked() {
    this.global.me = new User();
    localStorage.removeItem('token');
    localStorage.removeItem('account');
    this.router.navigate(['/login']);
  }


}
