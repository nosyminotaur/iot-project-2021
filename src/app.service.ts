import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Device } from './entities/device.entity';
import { Content } from './entities/content.entity';
import { DeviceStats } from './entities/device-stats.entity';

@Injectable()
export class AppService {
	constructor(
		@InjectEntityManager()
		private readonly manager: EntityManager,
	) {
	}

	async getDevice(deviceId: string): Promise<Device> {
		const device = await this.manager.getRepository(Device).findOne(deviceId);
		return device;
	}

	async getAll(deviceId: string): Promise<Content[]> {
		const contents = await this.manager.getRepository(Content).createQueryBuilder("content")
			.leftJoin("content.device", "device")
			.where("device.id = :id", { id: deviceId })
			.orderBy("content.addedOn", "ASC")
			.getMany();
		return contents;
	}

	async addContent(deviceId: string, fileName: string, originalFileName: string, mimeType: string) {
		const device = await this.manager.getRepository(Device).findOne(deviceId);
		if (device) {
			const content = new Content();
			content.device = device;
			content.fileName = fileName;
			content.originalFileName = originalFileName;
			content.mimeType = mimeType;
			content.name = originalFileName;
			await this.manager.save(content);
		}
	}

	async deleteRequestContent(deviceId: string, contentId: string) {
		const content = await this.manager.getRepository(Content).findOne(contentId);
		content.deleteRequested = true;
		await this.manager.save(content);
		return content;
	}

	async deleteContent(deviceId: string, fileName: string) {
		const content = await this.manager.getRepository(Content).findOne({fileName});
		await this.manager.remove(content);
		return content;
	}

	async setDeviceStats(deviceId: string, body: DeviceStats) {
		const device = await this.manager.getRepository(Device).createQueryBuilder("device").where("device.id = :deviceId", {deviceId}).getOne();
		if (device) {
			const stats = new DeviceStats();
			stats.cpu = body.cpu;
			stats.hddLeft = body.hddLeft;
			stats.ramLeft = body.ramLeft;
			stats.temperature = body.temperature;
			await this.manager.save(stats);

			device.lastOnlineStatus = "ONLINE";
			device.lastOnlineTime = new Date();

			device.stats = stats;
			await this.manager.save(device);
		}
	}
}
