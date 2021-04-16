import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RabbitMQModule } from './services/rabbitmq-module';

@Module({
	imports: [
		TypeOrmModule.forRoot(),
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, '..', 'client'),
			exclude: ['/api*'],
		}),
		RabbitMQModule
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule { }
