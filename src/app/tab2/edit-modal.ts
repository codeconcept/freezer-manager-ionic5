import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Food } from 'src/app/interfaces/food.model';
import { FoodService } from 'src/app/services/food.service';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';


@Component({
  selector: 'edit-modal',
  templateUrl: './edit-modal.html'
})
export class EditModal {

  @Input() foodId: string;
  foodItem: any;
  sub: Subscription;

  constructor(private foodService: FoodService, private modalCtrl: ModalController) { }

  ngOnInit() {
    this.sub = this.foodService.getFood(this.foodId).subscribe(data => {
      this.foodItem = {
          id: data.payload.id,
          ...data.payload.data()
        } as Food;
      });
  }

  goBack() {
    this.modalCtrl.dismiss();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}