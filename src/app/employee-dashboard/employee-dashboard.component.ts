import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../share/api.service';

@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.scss']
})
export class EmployeeDashboardComponent implements OnInit {
  arr!: FormArray;
  formValue: any = FormGroup
  formArray: any = FormGroup
  employeeData!: any;
  isAdd!: boolean;
  isUpdate!: boolean;
  submitted = false;
  private imageSrc: string = '';
  imageById!: any;
  photoUrl = ''
  employeeObj!: number

  constructor(private fb: FormBuilder, private api: ApiService) { }

  ngOnInit(): void {
    this.getAllEmployee();
    this.formValue = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      mobile: ['', Validators.required],
      salary: ['', Validators.required],
      photo: [''],
      arr: this.fb.array([
        this.createItem()
      ])
    });

  }
  createItem(tech?: any, rat?: any) {
    return this.formArray = this.fb.group({
      technology: [tech ? tech : '', [Validators.required]],
      rating: [rat ? rat : '', [Validators.required]]
    })
  }

  addItem() {
    this.arr = this.formValue.get('arr') as FormArray;
    this.arr.push(this.createItem());
  }

  get f() {
    return this.formValue.controls;
  }

  get formArrayValidation() {
    return this.formArray.controls;
  }

  postEmployeeDetails() {
    this.submitted = true;
    if (this.formValue.invalid) {
      return
    }
    const payLoad = {
      firstName: this.formValue.value.firstName,
      lastName: this.formValue.value.lastName,
      email: this.formValue.value.email,
      mobile: this.formValue.value.mobile,
      salary: this.formValue.value.salary,
      photo: this.imageSrc,
      arr: this.formValue.value.arr
    }
    this.api.postEmployee(payLoad)
      .subscribe((res: any) => {
        console.log(res);
        let ref = document.getElementById('cancel')
        ref?.click()
        this.formValue.reset();
        this.getAllEmployee();
      })

    // alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.formValue.value, null, 4));
  }

  getAllEmployee() {
    this.api.getEmployee()
      .subscribe(res => {
        this.employeeData = res;
      })
  }

  deleteEmployee(emp: any) {
    if (confirm("Are you sure to delete " + emp.firstName)) {
      this.api.deleteEmployee(emp.id)
        .subscribe(res => {
          console.log(res);
          this.getAllEmployee();
        })
    }
  }
  onEdit(emp: any) {
    this.isUpdate = true;
    this.isAdd = false;
    this.employeeObj = emp.id;
    this.formValue.controls['firstName'].setValue(emp.firstName),
      this.formValue.controls['lastName'].setValue(emp.lastName),
      this.formValue.controls['email'].setValue(emp.email),
      this.formValue.controls['mobile'].setValue(emp.mobile),
      this.formValue.controls['salary'].setValue(emp.salary),
      emp.arr.forEach((e: any, index: any) => {
        this.formArray.controls['technology'].setValue(emp.arr[index].technology),
          this.formArray.controls['rating'].setValue(emp.arr[index].rating)
      });
  }

  updateEmployee() {
    const payLoad = {
      firstName: this.formValue.value.firstName,
      lastName: this.formValue.value.lastName,
      email: this.formValue.value.email,
      mobile: this.formValue.value.mobile,
      salary: this.formValue.value.salary,
      photo: this.imageSrc,
      arr: this.formValue.value.arr
    }
    this.api.updateEmplolyee(payLoad, this.employeeObj)
      .subscribe(res => {
        alert("Updated successfully")
        let ref = document.getElementById('cancel')
        ref?.click()
        this.getAllEmployee();
      })
  }

  addEmployee() {
    this.formValue.reset()
    this.isAdd = true;
    this.isUpdate = false;
  }

  handleInputChange(e: any) {
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    var pattern = /image-*/;
    var reader = new FileReader();
    if (!file.type.match(pattern)) {
      alert('invalid format');
      return;
    }
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }
  _handleReaderLoaded(e: any) {
    let reader = e.target;
    this.imageSrc = reader.result;
  }
  viewImage(imgId: any) {
    this.api.getEmployeeImagebyId(imgId.id)
      .subscribe(res => {
        this.imageById = res
        this.photoUrl = this.imageById.photo;
      })
  }

  dropDownList: any = [
    { rating: 1 },
    { rating: 2 },
    { rating: 3 },
    { rating: 4 },
    { rating: 5 },
  ]
}
