import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BestScoresComponent } from '@app/components/best-scores/best-scores.component';
import { WaitingAreaComponent } from '@app/components/waiting-area/waiting-area.component';
import { AdminPageComponent } from '@app/pages/admin-page/admin-page.component';
import { GameModesComponent } from '@app/pages/game-modes-page/game-modes-page.component';
import { GamePageComponent } from '@app/pages/game-page/game-page.component';
import { MainPageComponent } from '@app/pages/main-page/main-page.component';
import { MaterialPageComponent } from '@app/pages/material-page/material-page.component';
import { StartingPageComponent } from '@app/pages/starting-page/starting-page.component';
import { ActivateGuard } from '@app/services/activate-guard.service';

const routes: Routes = [
    { path: '', redirectTo: '/start', pathMatch: 'full' },
    { path: 'home', component: MainPageComponent },
    { path: 'start', component: StartingPageComponent },
    { path: 'game-mode', component: GameModesComponent },
    { path: 'game', component: GamePageComponent, canActivate: [ActivateGuard] },
    { path: 'wait', component: WaitingAreaComponent },
    { path: 'material', component: MaterialPageComponent },
    { path: 'admin', component: AdminPageComponent },
    { path: 'bestScores', component: BestScoresComponent },
    { path: '**', redirectTo: '/start' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule],
})
export class AppRoutingModule {}
