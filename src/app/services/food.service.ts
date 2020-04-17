import { Injectable } from '@angular/core';

import { AngularFirestore, DocumentReference, Action, DocumentSnapshot } from '@angular/fire/firestore';
import { DocumentChangeAction } from '@angular/fire/firestore';

import { Observable, from } from 'rxjs';

import { Food } from '../interfaces/food.interface';

@Injectable({
  providedIn: 'root'
})
export class FoodService {

  constructor(private afs: AngularFirestore) { }

  allFood(): Observable<DocumentChangeAction<{}>[]> {
    const freezerCollectionRef = this.afs.collection<Food>('freezer', ref => ref.orderBy('foodName', 'asc'));
    return freezerCollectionRef.snapshotChanges();
  }

  getFood(id: string): Observable<Action<DocumentSnapshot<{}>>> {
    return this.afs.collection('freezer').doc(id).snapshotChanges();
  }

  addFood(foodItem: Food): Promise<DocumentReference> {
    return this.afs.collection('freezer').add(foodItem);
  }

  updateFood(food: Food): Observable<any> {
    return from(this.afs.doc(`freezer/${food.id}`).update(food));
  }

   deleteFood(id: string): Observable<any> {
    return from(this.afs.doc(`freezer/${id}`).delete());
  }
}
