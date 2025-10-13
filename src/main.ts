import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { LucideAngularModule } from 'lucide-angular';
import { lucideIcons } from './app/shared/lucide-icons';

const lucideProviders = LucideAngularModule.pick(lucideIcons).providers ?? [];

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...(appConfig.providers ?? []),
    ...lucideProviders
  ]
}).catch(err => console.error(err));