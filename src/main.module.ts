import { Global, Module } from '@nestjs/common';
import { AppModule } from './app/app.module';
import { DatabaseModule } from './platform/database/database.module';
import { I18nModule } from 'nestjs-i18n';
import { join } from 'path';

@Global()
@Module({
  imports: [
    AppModule,
    DatabaseModule,
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: join(__dirname, '/i18n/'),
        watch: true,
      },
    }),
  ],
  controllers: [],
  providers: [],
  exports: [DatabaseModule],
})
export class MainModule {}
