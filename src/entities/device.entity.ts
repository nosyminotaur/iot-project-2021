import { Content } from './content.entity';
import { DeviceStats } from './device-stats.entity';
import {
	Column,
	Entity,
	JoinColumn,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Device {
	@PrimaryGeneratedColumn()
	id!: string;

	@Column({ nullable: true })
	name!: string;

	@Column({ default: 'OFFLINE' })
	lastOnlineStatus!: 'ONLINE' | 'OFFLINE';

	@Column({ nullable: true })
	lastOnlineTime!: Date;

	@OneToMany(() => Content, content => content.device)
	contents!: Content[]

	@OneToOne(() => DeviceStats, stats => stats.device, {
		eager: true
	})
	@JoinColumn()
	stats!: DeviceStats;
}
