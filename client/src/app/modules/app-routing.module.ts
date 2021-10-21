import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClassicModeComponent } from '@app/pages/classic-mode/classic-mode.component';
import { GamePageComponent } from '@app/pages/game-page/game-page.component';
import { MainPageComponent } from '@app/pages/main-page/main-page.component';
import { MaterialPageComponent } from '@app/pages/material-page/material-page.component';
import { StartingPageComponent } from '@app/pages/starting-page/starting-page.component';

const routes: Routes = [
    { path: '', redirectTo: '/start', pathMatch: 'full' },
    { path: 'home', component: MainPageComponent },
    { path: 'start', component: StartingPageComponent },
    { path: 'classic', component: ClassicModeComponent },
    { path: 'game', component: GamePageComponent },
    { path: 'material', component: MaterialPageComponent },
    { path: '**', redirectTo: '/start' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
