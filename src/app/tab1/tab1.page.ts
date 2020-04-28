import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { FoodService } from './../services/food.service';
import categories from '../shared/food-categories';
import { Category } from './../interfaces/category.interface';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  form: FormGroup;
  isLoading = false;
  allCategories: Category[] = [];

  constructor(private foodService: FoodService) {}

  ngOnInit() {
    this.allCategories = categories;
    this.form = new FormGroup({
      foodName: new FormControl(null, {
        validators: [Validators.required]
      }),
      category: new FormControl({
        validators: [Validators.required]        
      }),
      datePlacedInFreezer: new FormControl(null, {
        validators: [Validators.required]
      })
    });
  }

  add() {
    this.isLoading = true;

    const category = this.allCategories.find(c => c.id === this.form.value.category);
    const maxDateInFreezer = this.foodService.computeMaxDateToKeepFood(category, this.form.value.datePlacedInFreezer);
    
    const foodItem = { 
      foodName: this.form.value.foodName, 
      category:this.form.value.category, 
      datePlacedInFreezer: new Date(this.form.value.datePlacedInFreezer), 
      betterToEatBefore: maxDateInFreezer 
    };
    
    this.foodService.addFood(foodItem).then(data => {
      this.isLoading = false;
      console.log(data);
      this.form.reset();
    }).catch(err => {
      this.isLoading = false;
      console.error(err);
    });
  }

}
