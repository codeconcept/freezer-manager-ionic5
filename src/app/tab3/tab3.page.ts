import { Component } from '@angular/core';
import { Food } from '../interfaces/food.interface';
import { FoodService } from '../services/food.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit, OnDestroy {

  allFoodToEatSoon: Food[];
  sub: Subscription;
  nbOfDaysAgo = 10;

  constructor(private foodService: FoodService) {
  }

  ngOnInit() {
    this.sub = this.foodService.getFoodToEatBeforeDaysAgo(this.nbOfDaysAgo).subscribe(data => {
      this.allFoodToEatSoon = data.map(foodItem => {
        return {
          betterToEatBefore: (foodItem.betterToEatBefore as any).toDate(),
          foodName: foodItem.foodName,
          datePlacedInFreezer: (foodItem.datePlacedInFreezer as any).toDate(),
          category: foodItem.category
        };
      });
    });

  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
