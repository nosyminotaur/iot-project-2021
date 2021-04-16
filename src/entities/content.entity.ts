import { Device } from './device.entity';
import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Content {
	@PrimaryGeneratedColumn()
	id!: string;

	@Column({ nullable: true })
	name!: string;

	@Column()
	fileName!: string;

	@CreateDateColumn()
	addedOn!: Date;

	@Column()
	originalFileName!: string;

	@Column({ default: "video/mp4" })
	mimeType!: string;

	@Column({ default: false })
	deleteRequested!: boolean;

	@Column({ default: false })
	isDeleted!: boolean;

	@ManyToOne(() => Device, device => device.contents)
	device!: Device;
}
