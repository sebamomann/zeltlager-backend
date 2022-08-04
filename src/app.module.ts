import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Element } from './elements/elements.entity';
import { ElementsModule } from './elements/elements.module';
import { RootsModule } from './elements/roots/roots.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [Element],
      synchronize: true,
    }),
    RootsModule,
    ElementsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
