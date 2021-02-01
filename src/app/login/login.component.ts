import { Component, OnInit } from '@angular/core';
import { AbstractControl,FormGroup, FormControl,FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router'

export function forbiddenUsername(users = []) {
  return (c: AbstractControl) => {
    return (!users.includes(c.value)) ? {
      invalidusername: true
    } : null;
  };
}
// export function getStatus() {
//   return (c: AbstractControl) => {
//     return c.status
//   }
// }
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  rfContact: FormGroup;
  constructor(private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.rfContact = this.fb.group({
      contactName: ['', [Validators.required,
        forbiddenUsername(['ncsc'])]],
      pw: ['', [Validators.required, forbiddenUsername(['ncsc@covid'])]]
    })
  }
  onSubmit() {
    // Do something awesome\
    
    (this.rfContact.status) == "INVALID" ? alert(this.rfContact.status) : this.gotoProductDetails('/app')
    
    //this.gotoProductDetails('/app')
  }
  public gotoProductDetails(url) {
    this.router.navigate([url]).then( (e) => {
      if (e) {
        console.log("Navigation is successful!");
      } else {
        console.log("Navigation has failed!");
      }
    });
  }
}


