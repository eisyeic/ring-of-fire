import { Routes } from '@angular/router';
import { StartscreenComponent } from './src/app/startscreen/startscreen.component';
import { GameComponent } from './src/app/game/game.component';

export const routes: Routes = [
  {
    path: '',
    component: StartscreenComponent,
  },
  {
    path: 'game',
    component: GameComponent,
  },
];
