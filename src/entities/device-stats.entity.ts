import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Device } from './device.entity';

@Entity()
export class DeviceStats {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column({ nullable: true })
  temperature!: string;

  @Column({ nullable: true })
  ramLeft!: string;

  @Column({ nullable: true })
  hddLeft!: string;

  @Column({ nullable: true })
  cpu!: string;

  @OneToOne(() => Device, (device) => device.stats)
  device!: Device;
}
