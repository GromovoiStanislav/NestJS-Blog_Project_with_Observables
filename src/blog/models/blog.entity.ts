import { BeforeUpdate, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "src/user/models/user.entity";

@Entity("blogs")
export class BlogEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  slug: string;

  @Column({ default: "" })
  description: string;

  @Column({ default: "" })
  body: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @Column({ default: 0 })
  likes: number;

  @Column({ nullable: true })
  headerImage: string;

  @Column({ nullable: true })
  publishedDate: Date;

  @Column({ default: false })
  isPublished: boolean;

  @ManyToOne(type => UserEntity, user => user.blogs)
  author: UserEntity;

  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = new Date;
  }

}