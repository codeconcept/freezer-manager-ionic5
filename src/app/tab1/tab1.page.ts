import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';

import { FoodService } from './../services/food.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  form: FormGroup;

  constructor(private foodService: FoodService) {}

  ngOnInit() {
    this.form = new FormGroup({
      foodName: new FormControl(null, {
        validators: [Validators.required]
      }),
      datePlacedInFreezer: new FormControl(null, {
        validators: [Validators.required]
      })
    });
  }

  add() {
    console.log(this.form);
    this.foodService.addFood(this.form.value);
  }

}
