import { extname } from "path";
import { Body, Controller, Delete, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AppService } from './app.service';
import { Content } from './entities/content.entity';
import { RabbitMQService } from "./services/rabbitmq-service";
import { DeviceStats } from './entities/device-stats.entity';
import { Device } from './entities/device.entity';

const customFileName = (req, file, callback) => {
	const name = file.originalname.split('.')[0];
	const fileExtName = extname(file.originalname);
	const randomName = Array(4)
		.fill(null)
		.map(() => Math.round(Math.random() * 16).toString(16))
		.join('');
	callback(null, `${name}-${randomName}${fileExtName}`);
};

enum RequestType {
	ADD = "ADD",
	DELETE = "DELETE"
}

@Controller()
export class AppController {
	constructor(
		private readonly appService: AppService,
		private readonly rabbitMQService: RabbitMQService,
	) { }

	@Get(":deviceId/assets")
	getAll(@Param() { deviceId }: { deviceId: string }): Promise<Content[]> {
		return this.appService.getAll(deviceId);
	}

	@Get(":deviceId")
	async getDeviceStats(@Param() { deviceId }: { deviceId: string }): Promise<Device> {
		return this.appService.getDevice(deviceId);
	}

	@Post(':deviceId/upload')
	@UseInterceptors(FileInterceptor('file', {
		dest: './client/content/', storage: diskStorage({
			destination: "./client/content",
			filename: customFileName
		})
	}))
	async uploadContent(@UploadedFile() file: any, @Param() { deviceId }: { deviceId: string }) {
		await this.appService.addContent(deviceId, file.filename, file.originalname, file.mimetype);
		this.rabbitMQService.send('', {
			data: file.filename,
			type: RequestType.ADD
		});
	}

	@Post(':deviceId/content/:contentId/delete-request')
	async deleteContentRequest(@Param() { deviceId, contentId }: { deviceId: string, contentId: string }) {
		const content = await this.appService.deleteRequestContent(deviceId, contentId);
		this.rabbitMQService.send('', {
			data: content.fileName,
			type: RequestType.DELETE
		});
	}

	@Delete(':deviceId/content/:fileName')
	async deleteContent(@Param() { deviceId, fileName }: { deviceId: string, fileName: string }) {
		await this.appService.deleteContent(deviceId, fileName);
	}

	@Post(':deviceId/stats')
	async setDeviceStats(@Param() { deviceId }: { deviceId: string }, @Body() body: DeviceStats) {
		await this.appService.setDeviceStats(deviceId, body);
	}
}
