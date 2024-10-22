import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Group } from "./groups.entity";
import { User } from "../users/users.entity";

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  // Create a new group
  async createGroup(name: string, userIds: string[]): Promise<Group> {
    const users = await Promise.all(
      userIds.map((id) => this.userRepository.findOne({ where: { id } }))
    );
    const group = this.groupRepository.create({ name, users });
    return this.groupRepository.save(group);
  }

  // Add users to an existing group
  async addUsersToGroup(groupId: string, userIds: string[]): Promise<Group> {
    const group = await this.groupRepository.findOne({
      where: { id: groupId },
      relations: ["users"],
    });
    const newUsers = await Promise.all(
      userIds.map((id) => this.userRepository.findOne({ where: { id } }))
    );
    group.users.push(...newUsers);
    return this.groupRepository.save(group);
  }

  async findGroupByName(name: string): Promise<Group> {
    return this.groupRepository.findOne({
      where: { name },
      relations: ["users"],
    });
  }

  async getGroupsForUser(userId: string): Promise<Group[]> {
    return this.groupRepository
      .createQueryBuilder("group")
      .leftJoinAndSelect("group.users", "user")
      .where("user.id = :userId", { userId })
      .getMany();
  }

  // Get group by ID (with users and messages)
  async getGroupById(groupId: string): Promise<Group> {
    return this.groupRepository.findOne({
      where: { id: groupId },
      relations: ["users", "messages"],
    });
  }

  // Get all groups
  async getAllGroups(): Promise<Group[]> {
    return this.groupRepository.find({ relations: ["users"] });
  }
}
