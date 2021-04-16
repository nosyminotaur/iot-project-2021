import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RabbitMQService } from './rabbitmq-service';
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'rabbit-mq-module',
        transport: Transport.RMQ,
        options: {
          urls: [
            'amqps://srobbrac:HJaSLQlqVt4cB0HiG97X5SjdzS18-I0d@puffin.rmq2.cloudamqp.com/srobbrac',
          ],
          queue: 'iot-device-1',
        },
      },
    ]),
  ],
  controllers: [],
  providers: [RabbitMQService],
  exports: [RabbitMQService],
})
export class RabbitMQModule {}