import { Component, OnInit, OnDestroy } from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { DocumentChangeAction } from '@angular/fire/firestore';
import { ModalController } from '@ionic/angular';

import { FoodService } from './../services/food.service';
import { Food } from './../interfaces/food.model';
import { EditModal } from './edit-modal';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit, OnDestroy {
  allFoodInFreezer = [];
  sub: Subscription;
  isLoading = false;

  constructor(private foodService: FoodService, private modalCtrl: ModalController) {}

  ionViewWillEnter() {
    console.log('ionViewWillEnter', this.allFoodInFreezer);
  }

  ngOnInit() {
    console.log('ngOnInit', this.allFoodInFreezer);
    this.sub = this.foodService.allFood().subscribe(data => {
      this.allFoodInFreezer = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        } as Food;
      });
    });
  }

  async edit(id) {
    console.log('id', id);
    const modal = await this.modalCtrl.create({
      component: EditModal,
      componentProps: { 'foodId' : id }
    });
    return await modal.present();
  }

  delete(id) {
    console.log('id', id);
    this.isLoading = true;
    this.foodService
      .deleteFood(id)
      .pipe(
        take(1)
      )
      .subscribe(() => {
        this.isLoading = false;
      }, err => {
        console.error(err);
      });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
