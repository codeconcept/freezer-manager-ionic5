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

  computeMaxDateToKeepFood(category, datePlacedInFreeze) {
    const securityMArginInDays = 7;
    // convert maxStayInFreezerInMonth from months to days: maxStayInFreezerInMonth => maxStayInFreezerInDays
    const maxStayInFreezerInDays = category.maxStayInFreezerInMonth * 30;
    // compute security margin
    const maxStayInFreezerInDaysWithMargin = maxStayInFreezerInDays - securityMArginInDays;
    // compute finale date and return
    const currentDate = new Date(datePlacedInFreeze);
    const finaleDate = currentDate.setDate(currentDate.getDate() + maxStayInFreezerInDaysWithMargin);
    console.log('finaleDate', finaleDate);    
    // to go from epoch to Date Object
    return new Date(finaleDate)
  }

  getFoodToEatBeforeDaysAgo(nbOfDaysInFreezer: number): Observable<Food[]> {
    const daysInMilliseconds = nbOfDaysInFreezer * 24 * 3600 * 1000;
    const dateInFuture = new Date(Date.now() + daysInMilliseconds);
    return this.afs
      .collection('freezer', ref => ref.where('betterToEatBefore', '<', dateInFuture))
      .valueChanges() as Observable<Food[]>;
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
