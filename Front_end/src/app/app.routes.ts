import { Routes } from '@angular/router';
import { SampageComponent } from './sampage/sampage.component';
import { LoginComponent } from './login/login.component';
import { ChatComponent } from './chat/chat.component';

export const routes: Routes = [
    { path:'', component:LoginComponent},
    { path:"home", component:SampageComponent},
    { path:"chart", component:ChatComponent},
    { path:"login", component:LoginComponent}

];
