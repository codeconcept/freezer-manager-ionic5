import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import { DocumentChangeAction } from '@angular/fire/firestore';

import { Observable } from 'rxjs';

import { Food } from '../interfaces/food.model';

@Injectable({
  providedIn: 'root'
})
export class FoodService {

  constructor(private afs: AngularFirestore) { }

  allFood(): Observable<DocumentChangeAction<{}>[]> {
    return this.afs.collection('freezer').snapshotChanges();
  }

  addFood(foodItem: Food) {
    // TODO
  }
}
