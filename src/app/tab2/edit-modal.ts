import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';


import { Food } from 'src/app/interfaces/food.model';
import { FoodService } from 'src/app/services/food.service';


@Component({
  selector: 'edit-modal',
  templateUrl: './edit-modal.html'
})
export class EditModal {

  @Input() foodId: string;
  foodItem: any;
  sub: Subscription;
  form: FormGroup;
  isLoading = false;
  constructor(private foodService: FoodService, private modalCtrl: ModalController, private fb: FormBuilder) { }

  ngOnInit() {
    this.sub = this.foodService.getFood(this.foodId).subscribe(data => {
      this.foodItem = {
          id: data.payload.id,
          ...data.payload.data()
        } as Food;

         this.createForm();
      });
  }

  createForm() {
    this.form = this.fb.group({
      foodName: new FormControl(this.foodItem.foodName, Validators.required),
      datePlacedInFreezer: new FormControl(this.foodItem.datePlacedInFreezer, Validators.required),
    });
  }

  update() {
    console.log(this.form.value);
    this.isLoading = true;
    const updatedFood = {...this.form.value, id: this.foodItem.id};
    this.foodService.updateFood(updatedFood).subscribe(() => {
      this.isLoading = false;
    });
  }

  goBack() {
    this.modalCtrl.dismiss();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}