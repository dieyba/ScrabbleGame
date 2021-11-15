import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PlayAreaComponent } from '@app/components/play-area/play-area.component';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { AppRoutingModule } from '@app/modules/app-routing.module';
import { AppMaterialModule } from '@app/modules/material.module';
import { AppComponent } from '@app/pages/app/app.component';
import { ClassicModeComponent } from '@app/pages/classic-mode/classic-mode.component';
import { GamePageComponent } from '@app/pages/game-page/game-page.component';
import { MainPageComponent } from '@app/pages/main-page/main-page.component';
import { MaterialPageComponent } from '@app/pages/material-page/material-page.component';
import { StartingPageComponent } from '@app/pages/starting-page/starting-page.component';
import { ChatDisplayComponent } from './components/chat-display/chat-display.component';
import { FormComponent } from './components/form/form.component';
import { RackComponent } from './components/rack/rack.component';
import { TextEntryComponent } from './components/text-entry/text-entry.component';
import { WaitingAreaComponent } from './components/waiting-area/waiting-area.component';
import { AutofocusDirective } from './directives/autofocus.directive';
import { EndGamePopupComponent } from './components/end-game-popup/end-game-popup.component';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';

/**
 * Main module that is used in main.ts.
 * All automatically generated components will appear in this module.
 * Please do not move this module in the module folder.
 * Otherwise Angular Cli will not know in which module to put new component
 */
@NgModule({
    declarations: [
        AppComponent,
        GamePageComponent,
        MainPageComponent,
        MaterialPageComponent,
        RackComponent,
        PlayAreaComponent,
        SidebarComponent,
        ChatDisplayComponent,
        TextEntryComponent,
        AutofocusDirective,
        StartingPageComponent,
        ClassicModeComponent,
        StartingPageComponent,
        ClassicModeComponent,
        FormComponent,
        WaitingAreaComponent,
        RackComponent,
        EndGamePopupComponent,
        AdminPageComponent,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    imports: [
        MatRadioModule,
        MatCardModule,
        MatCheckboxModule,
        MatSelectModule,
        MatInputModule,
        MatFormFieldModule,
        AppMaterialModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        BrowserModule,
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
