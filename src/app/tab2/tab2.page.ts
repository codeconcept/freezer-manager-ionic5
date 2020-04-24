import { Component, OnInit, OnDestroy } from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { DocumentChangeAction } from '@angular/fire/firestore';
import { ModalController, AlertController } from '@ionic/angular';

import { FoodService } from './../services/food.service';
import { Food } from './../interfaces/food.interface';
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

  constructor(private foodService: FoodService, private modalCtrl: ModalController, private alertCtrl: AlertController) {}

  ionViewWillEnter() {
    console.log('ionViewWillEnter', this.allFoodInFreezer);
  }

  ngOnInit() {
    console.log('ngOnInit', this.allFoodInFreezer);
    this.sub = this.foodService.allFood().subscribe(data => {
      this.allFoodInFreezer = data.map(e => {
        return {
          id: e.payload.doc.id,
          foodName: e.payload.doc.get('foodName'),
          // tslint:disable-next-line: max-line-length
          datePlacedInFreezer: (typeof e.payload.doc.get('datePlacedInFreezer') === 'object') ? e.payload.doc.get('datePlacedInFreezer').toDate() : e.payload.doc.get('datePlacedInFreezer')
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

  async delete(id) {
      const alert = await this.alertCtrl.create({
      header: 'Delete this food?',
      subHeader: 'deletion is irreversible',
      buttons: [
        {
          text: 'Cancel',
          cssClass: 'primary',
          role: 'cancel',
          handler: () => {
            this.isLoading = false;
          }
        },
        {
          text: 'delete',
          cssClass: 'danger',
          handler: () => {
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
        }
      ]
    })
    
    await alert.present(); 
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
